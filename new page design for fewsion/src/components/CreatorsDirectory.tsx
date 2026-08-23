import React, { useState } from 'react';
import { Search, Star, CheckCircle2, Video, Globe, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { CREATORS, Creator } from '../data/mockData';

interface CreatorsDirectoryProps {
  onSelectCreator: (creator: Creator) => void;
}

export const CreatorsDirectory: React.FC<CreatorsDirectoryProps> = ({ onSelectCreator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Video Editors', 'AI Artists', 'Tech Reviewers', 'Lifestyle & UGC', 'Gaming'];

  const filteredCreators = CREATORS.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Video className="w-3.5 h-3.5 text-red-400" />;
      case 'instagram': return <ImageIcon className="w-3.5 h-3.5 text-pink-400" />;
      case 'twitter': return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
      case 'twitch': return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Globe className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <section id="creators" className="py-24 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Talent Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Top Creators & <span className="gold-gradient-text">Video Editors</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search creators, skills, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-lg shadow-amber-500/25'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-amber-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator) => (
            <div 
              key={creator.id}
              onClick={() => onSelectCreator(creator)}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between group"
            >
              {/* Cover & Avatar Header */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={creator.coverImage} 
                  alt={creator.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent"></div>
                
                {/* Match Score Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-amber-300">{creator.matchScore}% Match</span>
                </div>

                {/* Avatar Overlay */}
                <div className="absolute -bottom-6 left-6 flex items-end gap-3">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-8 p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      {creator.name}
                      <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-extrabold text-amber-300">{creator.rating}</span>
                      <span className="text-[10px] text-zinc-400">({creator.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-amber-300/80 mb-3">{creator.role}</p>
                  
                  <p className="text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
                    {creator.bio}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 mb-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Subscribers / Reach</span>
                      <span className="font-bold text-white">{creator.subscribers}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Avg Views / Impact</span>
                      <span className="font-bold text-white">{creator.avgViews}</span>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase">Platforms:</span>
                    <div className="flex items-center gap-1.5">
                      {creator.platforms.map(p => (
                        <div key={p} className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          {getPlatformIcon(p)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {creator.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-zinc-900/95 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Starting at</span>
                    <span className="text-sm font-extrabold text-white">{creator.startingPrice}</span>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 group-hover:bg-amber-500 group-hover:text-black font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm">
                    <span>Collaborate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
