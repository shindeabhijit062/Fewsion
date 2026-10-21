import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // Use the OpenRouter API Key provided
    const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;

    let redis = getRedisClient();
    let globalContext = '';
    const CACHE_KEY = 'fewsion_global_ai_context_v3';

    try {
      // 1. Rate Limiting
      if (redis) {
        const ratelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(5, '10 s'),
        });

        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success } = await ratelimit.limit(`ratelimit_chat_${ip}`);

        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests. Please wait a few seconds before sending another message.' },
            { status: 429 }
          );
        }
      }

      // 2. Fetch Cached Context
      if (redis) {
        const cachedContext = await redis.get<string>(CACHE_KEY);
        if (cachedContext) {
          globalContext = cachedContext;
        }
      }
    } catch (e) {
      console.error('Redis Error (Ratelimit/Cache):', e);
      redis = null; // Disable redis for this request to gracefully fallback
    }

    // If not in cache, fetch all required data from Supabase
    if (!globalContext) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        try {
          // Concurrently fetch top active data across the platform
          const [
            { data: aiRules },
            { data: creators, error: creatorsErr },
            { data: editors, error: editorsErr },
            { data: brands, error: brandsErr },
            { data: campaigns, error: campaignsErr },
          ] = await Promise.all([
            supabase.from('ai_knowledge').select('topic, content').limit(30),
            supabase.from('creator_profiles').select('*').order('ai_total_score', { ascending: false }).limit(40),
            supabase.from('editor_profiles').select('*').order('ai_total_score', { ascending: false }).limit(25),
            supabase.from('brand_profiles').select('*').limit(25),
            supabase.from('campaign_briefs').select('*').eq('status_state', 'Live').order('created_at', { ascending: false }).limit(25),
          ]);
          if (creatorsErr) console.error('Chat context: creators', creatorsErr.message);
          if (editorsErr) console.error('Chat context: editors', editorsErr.message);
          if (brandsErr) console.error('Chat context: brands', brandsErr.message);
          if (campaignsErr) console.error('Chat context: campaigns', campaignsErr.message);

          // Only public, non-sensitive fields go to the AI (no emails, phones, KYC or payment details)
          const pick = (row: Record<string, any>, fields: string[]) => {
            const out: Record<string, any> = {};
            for (const f of fields) {
              const v = row[f];
              if (v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) out[f] = v;
            }
            return out;
          };

          const brandNameById: Record<string, string> = {};
          (brands ?? []).forEach((b: any) => {
            if (b.user_id && b.brand_name) brandNameById[b.user_id] = b.brand_name;
          });

          const creatorList = (creators ?? []).map((c: any) => pick(c, [
            'creator_name', 'primary_niche', 'primary_platform', 'follower_count', 'engagement_rate',
            'avg_views_per_post', 'ai_total_score', 'ai_grade', 'rate_per_integration', 'content_style_desc',
          ]));
          const editorList = (editors ?? []).map((e: any) => pick(e, [
            'editor_name', 'city_state', 'one_line_bio', 'experience_duration', 'specialised_formats',
            'primary_software', 'special_skills', 'rate_short_form', 'ai_total_score', 'turnaround_time', 'availability_status',
          ]));
          const brandList = (brands ?? []).map((b: any) => pick(b, [
            'brand_name', 'industry', 'primary_market', 'brand_description',
          ]));
          const campaignList = (campaigns ?? []).map((c: any) => ({
            brand: brandNameById[c.brand_id] || 'A Fewsion brand',
            ...pick(c, ['campaign_title', 'target_platform', 'budget_allocated', 'niche', 'created_at']),
          }));

          const section = (title: string, list: any[]) =>
            `\n--- ${title} (${list.length}) ---\n` +
            (list.length ? JSON.stringify(list) : 'None listed on Fewsion right now.') + '\n';

          let compiledContext = `\n\n### FEWSION PLATFORM DATA (the ONLY source you may use) ###\n`;

          if (aiRules && aiRules.length > 0) {
            compiledContext += `\n--- PLATFORM RULES & KNOWLEDGE BASE ---\n`;
            aiRules.forEach((rule: any) => {
              compiledContext += `Topic: ${rule.topic}\nRule: ${rule.content}\n`;
            });
          }

          compiledContext += section('CREATORS ON FEWSION, highest Creator Score (ai_total_score) first', creatorList);
          compiledContext += section('VIDEO EDITORS ON FEWSION, highest score first', editorList);
          compiledContext += section('BRANDS ON FEWSION', brandList);
          compiledContext += section('LIVE CAMPAIGNS / ACTIVE PROMOTIONS ON FEWSION, newest first', campaignList);

          globalContext = compiledContext;
          
          // Save to Redis cache for 5 minutes (300 seconds) for real-time feel
          if (redis) {
            try {
              await redis.set(CACHE_KEY, globalContext, { ex: 300 });
            } catch (e) {
              console.error('Redis Set Error:', e);
            }
          }
        } catch (error) {
          console.error('Supabase fetch error for global context:', error);
        }
      }
    }
    // 3. User Specific Context
    let userContextString = '';
    if (userId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        try {
          const { data: userProfile } = await supabase
            .from('users')
            .select('first_name, role')
            .eq('id', userId)
            .maybeSingle();

          if (userProfile) {
            userContextString = `\n\n### USER CONTEXT ###\nYou are speaking with ${userProfile.first_name || 'a user'}, who is registered on Fewsion as a ${userProfile.role || 'user'}. Tailor suggestions to their role.\n`;
          }
        } catch (error) {
          console.error('Error fetching user context:', error);
        }
      }
    }

    const baseUrl = process.env.AI_BASE_URL || 'https://api.tokenrouter.com/v1';
    // AI_MODEL can list several models separated by commas, e.g. "model-a,model-b".
    // If one is busy or unavailable, the next one is tried automatically.
    const models = (process.env.AI_MODEL || 'deepseek/deepseek-v4.1-flash')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const systemPrompt = `You are Fewsion AI, the assistant on the Fewsion website. Fewsion is a performance-first marketplace in India that connects D2C brands with UGC creators and video editors, with AI matching and escrow payments.

STRICT RULES:
1. Only help with Fewsion: its creators, editors, brands, live campaigns, and how the platform works (signing up, applying to campaigns, escrow payments, pricing).
2. When you list or recommend creators, editors, brands or campaigns, use ONLY the entries in the FEWSION PLATFORM DATA below. Never invent names, numbers or accounts, and never mention any person, influencer, brand or company that is not in that data, even famous ones.
3. "Best performer" or "top creator" means the highest ai_total_score (Creator Score) in the data. "Active promotions" or "live campaigns" means the LIVE CAMPAIGNS list.
4. If nothing in the data matches the request, say so plainly (for example "There's no fitness creator on Fewsion yet") and offer the closest match from the data, or suggest browsing the Creators, Editors or Brands pages.
5. If a question is not about Fewsion (general knowledge, news, other websites, coding and so on), politely say you can only help with Fewsion and steer back.
6. Never share emails, phone numbers, KYC or payment details.
Keep replies short and clear.${userContextString}${globalContext}\n\nAt the end of your response, you MUST provide 2-3 quick reply suggestions about Fewsion for the user to tap on, based on their role and the conversation. Format each suggestion exactly like this:\n[SUGGESTION: "suggestion text 1"]\n[SUGGESTION: "suggestion text 2"]`;

    let lastStatus = 500;
    let lastError = '';
    for (const model of models) {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }

      lastStatus = response.status;
      lastError = await response.text();
      console.error('Chat API Error:', model, response.status, lastError.slice(0, 300));

      // Only try the next model for "busy" / "not available" errors
      if (![404, 429, 500, 502, 503, 504].includes(response.status)) break;
    }

    return NextResponse.json(
      { error: 'Failed to communicate with AI API', details: lastError.slice(0, 500) },
      { status: lastStatus }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
