import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    
    // Use the OpenRouter API Key provided
    const apiKey = process.env.OPENROUTER_API_KEY || 'sk-bnJ1hw4HlQTpAEXnu5DQgaw30OdNdLVTNUIQa1muopKpUzXd';

    let redis = getRedisClient();
    let globalContext = '';
    const CACHE_KEY = 'fewsion_global_ai_context_v2';

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
            { data: creators },
            { data: editors },
            { data: brands },
            { data: campaigns }
          ] = await Promise.all([
            supabase.from('ai_knowledge').select('topic, content, tags').limit(30),
            supabase.from('creator_profiles').select('creator_name, primary_platform, niche, follower_count, ai_total_score').order('follower_count', { ascending: false }).limit(15),
            supabase.from('editor_profiles').select('editor_name, specialty, years_experience, hourly_rate').limit(15),
            supabase.from('brand_profiles').select('brand_name, industry, location').limit(10),
            supabase.from('campaign_briefs').select('campaign_title, platform, budget, status').eq('status', 'open').order('created_at', { ascending: false }).limit(10)
          ]);
          
          let compiledContext = `\n\n### FEWSION PLATFORM LIVE DATA OVERVIEW ###\n\nYou have real-time access to the Fewsion database. Use this data to accurately recommend creators, editors, brands, or campaigns to the user. Always mention specific names and details when providing recommendations.\n`;

          // Inject AI Knowledge rules
          if (aiRules && aiRules.length > 0) {
            compiledContext += `\n--- SYSTEM RULES & KNOWLEDGE BASE ---\n`;
            aiRules.forEach(rule => {
              compiledContext += `Topic: ${rule.topic}\nRule: ${rule.content}\n`;
            });
          }

          // Inject Creators
          if (creators && creators.length > 0) {
            compiledContext += `\n--- TOP CREATORS ---\n`;
            compiledContext += JSON.stringify(creators, null, 2);
          }

          // Inject Editors
          if (editors && editors.length > 0) {
            compiledContext += `\n--- TOP VIDEO EDITORS ---\n`;
            compiledContext += JSON.stringify(editors, null, 2);
          }

          // Inject Brands
          if (brands && brands.length > 0) {
            compiledContext += `\n--- REGISTERED BRANDS ---\n`;
            compiledContext += JSON.stringify(brands, null, 2);
          }

          // Inject Campaigns
          if (campaigns && campaigns.length > 0) {
            compiledContext += `\n--- LIVE & OPEN CAMPAIGNS ---\n`;
            compiledContext += JSON.stringify(campaigns, null, 2);
          }

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
            .select('name, email, role')
            .eq('id', userId)
            .maybeSingle();

          if (userProfile) {
            userContextString = `\n\n### USER CONTEXT ###\nYou are currently speaking with ${userProfile.name || 'a user'} (${userProfile.email}), who is registered as a [${userProfile.role || 'user'}]. Tailor your suggestions to their role.\n`;
          }
        } catch (error) {
          console.error('Error fetching user context:', error);
        }
      }
    }

    const response = await fetch('https://api.tokenrouter.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fewsion.in',
        'X-Title': 'Fewsion Chatbot',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-pro-0813-free',
        messages: [
          { 
            role: 'system', 
            content: `You are Fewsion AI, an intelligent assistant for Fewsion, a performance-first creator marketplace. You help brands find creators, creators find campaigns, and provide accurate platform recommendations. Please reply concisely, clearly, and professionally.${userContextString}${globalContext}\n\nAt the end of your response, you MUST provide 2-3 quick reply suggestions for the user to tap on based on their role and current conversation. Format each suggestion exactly like this:\n[SUGGESTION: "suggestion text 1"]\n[SUGGESTION: "suggestion text 2"]` 
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Chat API Error:', response.status, errorData);
      return NextResponse.json({ error: 'Failed to communicate with AI API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    require('fs').writeFileSync('chat_error_log.txt', String(error?.stack || error));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
