export interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  matchScore: number;
  category: 'Video Editors' | 'AI Artists' | 'Tech Reviewers' | 'Lifestyle & UGC' | 'Gaming';
  platforms: ('youtube' | 'tiktok' | 'instagram' | 'twitter' | 'twitch')[];
  subscribers: string;
  avgViews: string;
  startingPrice: string;
  bio: string;
  tags: string[];
  recentWork: { title: string; views: string; thumbnail: string }[];
}

export const CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Arjun Mehta',
    role: 'Senior Video Editor & Motion Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 142,
    matchScore: 98,
    category: 'Video Editors',
    platforms: ['youtube', 'instagram', 'tiktok'],
    subscribers: '850K',
    avgViews: '240K',
    startingPrice: '$1,200 / project',
    bio: 'Specializing in high-retention cinematic edits, fast-paced YouTube storytelling, and dynamic motion graphics for tech & SaaS brands.',
    tags: ['Premiere Pro', 'After Effects', 'Cinematic', 'SaaS', 'High Retention'],
    recentWork: [
      { title: 'Apple M4 Max Cinematic Review', views: '1.4M', thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' },
      { title: 'The Future of AI Hardware', views: '890K', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: '2',
    name: 'Elena Rostova',
    role: 'AI Generative Artist & Creative Director',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
    rating: 5.0,
    reviewsCount: 98,
    matchScore: 96,
    category: 'AI Artists',
    platforms: ['instagram', 'twitter'],
    subscribers: '620K',
    avgViews: '180K',
    startingPrice: '$2,500 / campaign',
    bio: 'Pioneering surreal AI art generation, Midjourney v6 workflows, and generative commercial video campaigns for luxury fashion & tech brands.',
    tags: ['Midjourney', 'Stable Diffusion', 'ComfyUI', 'Luxury Brand', '3D Gen'],
    recentWork: [
      { title: 'Cyberpunk Haute Couture Runway', views: '2.1M', thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
      { title: 'Genesis of Silicon Worlds', views: '950K', thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: '3',
    name: 'Marcus Vance',
    role: 'Tech Reviewer & AI Product Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 215,
    matchScore: 94,
    category: 'Tech Reviewers',
    platforms: ['youtube', 'twitter'],
    subscribers: '1.8M',
    avgViews: '450K',
    startingPrice: '$3,000 / video',
    bio: 'Deep-dive hardware & software reviews with a focus on AI productivity tools, developer platforms, and consumer electronics.',
    tags: ['Tech', 'AI Software', 'Unboxing', 'Deep Dives', 'High Conversion'],
    recentWork: [
      { title: 'Testing 10 Autonomous AI Agents', views: '1.9M', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop' },
      { title: 'The Ultimate Productivity Setup 2026', views: '1.2M', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: '4',
    name: 'Chloe Lin',
    role: 'Lifestyle & Gen-Z UGC Creator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 180,
    matchScore: 92,
    category: 'Lifestyle & UGC',
    platforms: ['tiktok', 'instagram'],
    subscribers: '940K',
    avgViews: '320K',
    startingPrice: '$800 / video',
    bio: 'Authentic user-generated content (UGC) that converts. Expert in viral TikTok formats, aesthetic storytelling, and DTC brand growth.',
    tags: ['UGC', 'TikTok', 'Viral Hooks', 'DTC Brands', 'Aesthetic'],
    recentWork: [
      { title: 'Why This Skincare Routine Went Viral', views: '3.4M', thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop' },
      { title: 'A Day in the Life of a Remote Founder', views: '1.1M', thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: '5',
    name: 'Liam Sterling',
    role: 'Esports & Gaming Motion Editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 110,
    matchScore: 90,
    category: 'Gaming',
    platforms: ['youtube', 'twitch'],
    subscribers: '1.2M',
    avgViews: '380K',
    startingPrice: '$1,500 / project',
    bio: 'Crafting high-energy gaming montages, documentary-style esports features, and interactive stream overlays with custom VFX.',
    tags: ['Gaming', 'VFX', 'Esports', 'Twitch', 'Montage'],
    recentWork: [
      { title: 'The Rise and Fall of Gaming Legends', views: '2.8M', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop' }
    ]
  },
  {
    id: '6',
    name: 'Zoe Kincaid',
    role: 'AI Cinematic Trailer Producer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 76,
    matchScore: 97,
    category: 'AI Artists',
    platforms: ['youtube', 'instagram'],
    subscribers: '450K',
    avgViews: '150K',
    startingPrice: '$2,000 / video',
    bio: 'Merging Hollywood sound design with cutting-edge AI video synthesis for game trailers, music videos, and cinematic promos.',
    tags: ['Cinematic', 'AI Video', 'Sound Design', 'Promos', 'Trailers'],
    recentWork: [
      { title: 'Sci-Fi Universe Cinematic Trailer', views: '1.6M', thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400&auto=format&fit=crop' }
    ]
  }
];

export const TESTIMONIALS = [
  {
    quote: "Fewsion's AI matching connected us with Arjun in under 10 minutes. Our Q3 YouTube campaign achieved 340% ROI and our retention rate doubled.",
    author: "Sarah Jenkins",
    role: "VP of Growth, Nexus AI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    metric: "+340% ROAS"
  },
  {
    quote: "As a video editor, finding high-budget brand deals used to take weeks of cold emailing. With Fewsion, elite tech brands come straight to my inbox with pre-approved briefs.",
    author: "Arjun Mehta",
    role: "Senior Video Editor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    metric: "$45k+ Earned Q2"
  },
  {
    quote: "The escrow payment system and AI contract generator eliminated all the friction and payment delays we used to experience with traditional agencies.",
    author: "David K.",
    role: "Head of Marketing, Luminance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    metric: "100% Secure"
  }
];

export const FAQ_ITEMS = [
  {
    question: "How does Fewsion's AI Matching algorithm work?",
    answer: "Fewsion analyzes over 50 data points including brand tone, target demographic overlap, creator past portfolio success, audience sentiment, and delivery speed to pair brands with the absolute highest-converting creators and editors with up to 99% accuracy."
  },
  {
    question: "Are the creators and video editors verified?",
    answer: "Yes! Every creator and editor on Fewsion goes through our rigorous AI and manual verification process, confirming identity, past campaign metrics, portfolio authenticity, and professional reliability."
  },
  {
    question: "How do secure escrow payments work?",
    answer: "When a brand initiates a project, funds are deposited into a secure escrow smart contract. Funds are released automatically or upon brand approval of milestone deliverables, protecting both parties."
  },
  {
    question: "Can agencies use Fewsion to manage multiple brands?",
    answer: "Absolutely. Our Growth and Enterprise plans include multi-brand workspace management, team collaboration roles, and dedicated AI talent managers."
  }
];
