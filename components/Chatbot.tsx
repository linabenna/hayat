
import React, { useState, useRef, useEffect } from 'react';
import { Message, AgentAlert, FamilyMember } from '../types';
import { chatWithGuardian } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AgentAlert[];
  family: FamilyMember[];
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, alerts, family }) => {
  const { t, isRTL, lang } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: lang === 'AR' ? 'حارس عائلة حياة جاهز. كيف يمكنني مساعدتك في التزاماتك الحكومية؟' : 'HAYAT Family Guardian ready. How can I help with your government obligations?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithGuardian([...messages, userMsg], alerts, family);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || (isRTL ? "خطأ في النظام." : "System error."),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[80] flex flex-col bg-white max-w-md mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
      <header className={`p-6 border-b flex items-center bg-white text-black sticky top-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <button onClick={onClose} className="flex items-center gap-2 text-[10px] font-black mr-4 uppercase border-2 border-black px-4 py-2 rounded-2xl">
           {t('back')}
        </button>
        <div className="flex-1">
          <h2 className="font-black text-sm uppercase tracking-tight">{t('hayat_chat')}</h2>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[10px] font-black uppercase ${msg.role === 'user' ? 'text-blue-600' : 'text-slate-900'}`}>
                {msg.role === 'user' ? (isRTL ? 'أنت' : 'You') : (isRTL ? 'حياة' : 'HAYAT Agent')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={`text-[13px] leading-relaxed font-medium p-4 rounded-3xl ${msg.role === 'user' ? 'bg-blue-50 text-blue-900 self-end' : 'bg-slate-50 text-slate-900 self-start'} max-w-[85%]`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`text-[10px] font-black text-slate-400 uppercase animate-pulse ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('processing')}
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-white sticky bottom-0">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRTL ? "اكتب هنا..." : "TYPE MESSAGE HERE..."}
            className={`w-full p-4 bg-slate-50 border-2 border-transparent focus:border-black rounded-3xl text-sm transition-all outline-none ${isRTL ? 'text-right' : 'text-left'}`}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-3xl disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {isRTL ? 'إرسال' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
};
