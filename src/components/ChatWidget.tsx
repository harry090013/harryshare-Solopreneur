'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  if (pathname?.startsWith('/quan-tri-harry')) {
    return null;
  }
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Xin chào! Mình là Trợ lý AI của Harry (Quang Hiếu). Mình có thể chia sẻ với bạn về tư duy sản phẩm, cách xây dựng thương hiệu cá nhân, làn sóng AI & Vibe Coding hoặc hành trình làm Solopreneur của mình. Bạn muốn trò chuyện về chủ đề gì thế? 😊',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      
      setIsTyping(false);
      
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.reply || 'Cảm ơn bạn đã nhắn tin. Có lỗi xảy ra trong suy nghĩ của mình một chút, bạn thử lại nhé!',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setIsTyping(false);
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'Xin lỗi bạn, đường truyền kết nối của mình bị gián đoạn một chút. Hãy thử hỏi lại nhé!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  const suggestions = [
    'Tư duy sản phẩm là gì?',
    'Thương hiệu cá nhân từ 0?',
    'Vibe coding là gì?',
    'Hành trình làm nghề của anh?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] rounded-2xl border border-olive/10 bg-cream/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-slide-up">
          {/* Header */}
          <div className="bg-olive text-cream px-4 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cream/20 bg-cream/10">
                <Image src="/harry_Portrait.png" alt="Trợ lý AI Harry" fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-sm font-bold tracking-wide">Trợ lý AI Harry</span>
                  <Sparkles className="w-3.5 h-3.5 text-sage animate-pulse" />
                </div>
                <span className="text-[10px] text-cream/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Đang trực tuyến • Sẵn sàng chia sẻ
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-cream/10 text-cream/80 hover:text-cream transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-dot-pattern bg-[size:16px_16px]">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  {isAi && (
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-olive/10 shrink-0 bg-sand">
                      <Image src="/harry_Portrait.png" alt="Harry" fill sizes="28px" className="object-cover" />
                    </div>
                  )}
                  <div 
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-sand/60 text-stone-850 rounded-tl-none border border-olive/5 shadow-xs' 
                        : 'bg-olive text-cream rounded-tr-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 self-start max-w-[85%]">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-olive/10 shrink-0 bg-sand">
                  <Image src="/harry_Portrait.png" alt="Harry" fill sizes="28px" className="object-cover" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-sand/60 border border-olive/5 flex items-center gap-1 h-9">
                  <span className="w-1.5 h-1.5 bg-olive/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-olive/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 bg-olive/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 border-t border-olive/5 bg-sand/20 flex flex-wrap gap-1.5">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  className="text-xs text-olive hover:text-cream bg-olive/5 hover:bg-olive border border-olive/10 px-2.5 py-1.5 rounded-full transition-all cursor-pointer font-medium active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 border-t border-olive/15 bg-cream flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi Harry bất cứ điều gì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-4 py-2 text-sm rounded-full border border-olive/10 focus:outline-none focus:border-olive/30 focus:ring-1 focus:ring-olive/30 bg-cream/50 transition-all placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-full bg-olive hover:bg-olive-dark text-cream transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              title="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-olive text-cream shadow-2xl flex items-center justify-center hover:bg-olive-dark cursor-pointer active:scale-95 transition-all group duration-300 relative border border-cream/20"
        title="Trò chuyện với trợ lý AI Harry"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-cream animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
