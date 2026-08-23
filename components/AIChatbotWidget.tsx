'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function AIChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const DEFAULT_MESSAGE = {
    role: 'bot' as const,
    text: "👋 Hi! I'm Fewsion's AI assistant.\n\nLet's find the perfect creators for your brand. How can I help you today?",
  };

  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; text: string; suggestions?: string[] }>>([DEFAULT_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [threads, setThreads] = useState<any[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      loadThreads();
    } else {
      setThreads([]);
      setCurrentThreadId(null);
      setMessages([DEFAULT_MESSAGE]);
      setView('chat');
    }
  }, [userId]);

  const loadThreads = async () => {
    const { data } = await supabase
      .from('ai_chat_threads')
      .select('id, title, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (data) {
      setThreads(data);
    }
  };

  const loadThread = async (id: string) => {
    const { data } = await supabase.from('ai_chat_threads').select('messages').eq('id', id).single();
    if (data) {
      setMessages(data.messages);
      setCurrentThreadId(id);
      setView('chat');
    }
  };

  const startNewChat = () => {
    setMessages([DEFAULT_MESSAGE]);
    setCurrentThreadId(null);
    setView('chat');
  };

  const saveHistory = async (newMessages: any[]) => {
    if (userId && newMessages.length > 1) {
      if (currentThreadId) {
        await supabase.from('ai_chat_threads').update({
          messages: newMessages,
          updated_at: new Date().toISOString()
        }).eq('id', currentThreadId);
      } else {
        const title = newMessages[1]?.text?.substring(0, 30) + '...' || 'New Chat';
        const { data } = await supabase.from('ai_chat_threads').insert({
          user_id: userId,
          title,
          messages: newMessages
        }).select().single();
        
        if (data) {
          setCurrentThreadId(data.id);
          setThreads(prev => [data, ...prev]);
        }
      }
    }
  };


  const handleFabClick = () => {
    if (!isLoggedIn) {
      setShowAuthPopup(true);
    } else {
      setOpen(!open);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages); // Save history instantly when user sends
    setInputVal('');
    setIsLoading(true);

    try {
      // Only send role and content to the API
      const apiMessages = newMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: apiMessages, userId })
      });

      if (res.ok) {
        const data = await res.json();
        let botText = data.choices?.[0]?.message?.content || 'Sorry, I am unable to process that right now.';
        
        // Parse suggestions
        const suggestionRegex = /\[SUGGESTION:\s*"?([^"\]]+)"?\]/g;
        const suggestions: string[] = [];
        let match;
        while ((match = suggestionRegex.exec(botText)) !== null) {
          suggestions.push(match[1].trim());
        }
        
        // Clean text by removing suggestion tags
        botText = botText.replace(/\[SUGGESTION:\s*"?([^"\]]+)"?\]/g, '').trim();

        const updatedMessages = [...newMessages, { role: 'bot' as const, text: botText, suggestions }];
        setMessages(updatedMessages);
        saveHistory(updatedMessages); // Save history after bot responds
      } else {
        console.error('Chat API Error:', res.statusText);
        const errMessages = [...newMessages, { role: 'bot' as const, text: 'Sorry, something went wrong. Please try again.' }];
        setMessages(errMessages);
        saveHistory(errMessages);
      }
    } catch (error) {
      console.error('Network Error:', error);
      const errMessages = [...newMessages, { role: 'bot' as const, text: 'Network error. Please try again later.' }];
      setMessages(errMessages);
      saveHistory(errMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        id="chat-fab" 
        onClick={handleFabClick} 
        aria-label="Open AI assistant"
        className={open ? 'open' : ''}
      >
        <span className="fab-icon flex items-center justify-center">
          {open ? '✕' : <img src="/logo.png" alt="Chat" className="w-6 h-6 object-contain filter invert opacity-90" style={{ filter: 'brightness(0) invert(1)' }} />}
        </span>
      </button>

      <div id="chat-window" className={open ? 'open' : ''} role="dialog">
        <div className="chat-header flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="chat-avatar p-0 overflow-hidden bg-white mr-3">
              <img src="/logo.png" alt="Fewsion AI" className="w-full h-full object-cover" />
            </div>
            <div className="chat-header-info">
              <h4>Fewsion AI</h4>
              <p>Creator Matcher</p>
            </div>
          </div>
          {isLoggedIn && (
            <div className="flex gap-2">
              <button onClick={startNewChat} title="New Chat" className="text-white hover:text-white/80 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
              <button onClick={() => setView(view === 'history' ? 'chat' : 'history')} title="History" className="text-white hover:text-white/80 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          )}
        </div>

        {view === 'history' ? (
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--background)] h-[400px]">
            <h3 className="text-[var(--text)] font-semibold mb-4">Chat History</h3>
            {threads.length === 0 ? (
              <p className="text-[var(--muted)] text-sm">No past chats found.</p>
            ) : (
              <div className="space-y-2">
                {threads.map(thread => (
                  <button 
                    key={thread.id} 
                    onClick={() => loadThread(thread.id)}
                    className="w-full text-left p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--amber)] transition-colors"
                  >
                    <p className="text-[var(--text)] text-sm font-medium truncate">{thread.title}</p>
                    <p className="text-[var(--muted)] text-xs mt-1">{new Date(thread.updated_at).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
        <div id="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`msg ${m.role}`}>
              <div className="msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-1">
                  {m.suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(suggestion)}
                      className="px-3 py-1.5 text-xs font-medium text-[var(--amber)] bg-[var(--amber-glow)] border border-[var(--amber)]/20 rounded-full hover:bg-[var(--amber)] hover:text-black transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="msg bot">
              <div className="msg-bubble" style={{ fontStyle: 'italic', color: '#888' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input 
            id="chat-input" 
            type="text" 
            placeholder="Type your message..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend(inputVal);
              }
            }}
            disabled={isLoading}
          />
          <button 
            id="chat-send" 
            onClick={() => handleSend(inputVal)}
            disabled={isLoading}
          >
            ➤
          </button>
        </div>
      </>
        )}
      </div>

      {/* Auth Popup Modal */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-200 bg-[var(--card)] border border-[var(--border)] shadow-2xl">
            <button 
              onClick={() => setShowAuthPopup(false)}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              ✕
            </button>
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--amber)]/10 text-[var(--amber)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text)] mb-2">Login Required</h3>
            <p className="text-[var(--muted)] text-sm mb-6">
              Please login or sign up to use the Fewsion AI assistant.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn-primary w-full justify-center">
                Login
              </Link>
              <Link href="/signup" className="w-full justify-center text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors py-2">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
