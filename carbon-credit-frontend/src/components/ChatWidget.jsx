import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';
import { askChatbot } from '../api';

export default function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('chat.greeting', 'Hello! I am Bhoomi Carbon AI. Ask me about carbon pricing, greenwashing, or ICVCM rules.') }]);
    }
  }, [isOpen, messages.length, t]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await askChatbot(text);
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error', 'Sorry, I encountered an error connecting to the knowledge base.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-white shadow-xl shadow-forest-950/30 ring-4 ring-white transition-all hover:bg-forest-950"
          >
            <MessageCircle size={24} />
            <span className="absolute right-0 top-0 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-40 flex w-full sm:w-[380px] flex-col overflow-hidden sm:rounded-3xl bg-white shadow-2xl border-0 sm:border sm:border-sand-300"
            style={{ height: '100%', maxHeight: '100vh', ...(window.innerWidth >= 640 ? { height: '520px', maxHeight: 'calc(100vh - 48px)' } : {}) }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-forest-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot size={18} />
                </div>
                <span className="font-serif font-bold tracking-wide">
                  {t('chat.title', 'Ask Bhoomi Carbon')}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#FAF7F2] p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-forest-800 text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-sand-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-sm bg-white border border-sand-200 px-4 py-3 text-sm text-slate-500 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-forest-600" />
                    <span>{t('chat.typing', 'Thinking...')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-sand-200 bg-white p-3">
              <div className="flex items-center gap-2 rounded-xl border border-sand-300 bg-sand-50/50 p-1 pl-3 focus-within:border-forest-500 focus-within:ring-1 focus-within:ring-forest-500">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.placeholder', 'Ask a question...')}
                  className="flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-800 text-white disabled:opacity-50 transition-transform active:scale-95"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
