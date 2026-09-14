import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Mic, MicOff, Volume2, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FloatingJagoWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'jago',
      message: 'Johar! 🙏 I am JAGO, your ST scholarship advisor. Ask me about eligibility, schemes, application status, or documents.'
    }
  ]);
  const [actions, setActions] = useState([
    { label: 'Check Eligibility', query: 'Am I eligible for any scheme?' },
    { label: 'Track My Status', query: 'What is my application status?' },
    { label: 'Document Checklist', query: 'What documents are required?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load chat history if authenticated
  useEffect(() => {
    if (user && isOpen) {
      axiosClient.get('/api/chat/history')
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setMessages(res.data);
          }
        })
        .catch(() => {});
    }
  }, [user, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', message: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/api/chat/send', { message: query });
      const jagoMsg = { sender: 'jago', message: res.data.reply };
      setMessages((prev) => [...prev, jagoMsg]);
      if (res.data.actions) {
        setActions(res.data.actions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'jago', message: 'I encountered an issue connecting to the central server. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Phase 2 Voice Speech Recognition (Web Speech API with graceful fallback)
  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Default to Indian English / Hindi mix
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.url) {
      setIsOpen(false);
      if (action.url.startsWith('http')) {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(action.url);
      }
    } else if (action.query) {
      handleSend(action.query);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-crimson via-brand-purple to-brand-teal text-white shadow-2xl shadow-rose-950/60 border border-brand-gold/40 hover:scale-105 transition-all duration-300"
          aria-label="Open JAGO Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-black tracking-wide text-white flex items-center gap-1">
              <span>JAGO Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-brand-gold font-medium">Ask Scheme Queries</div>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 h-[530px] bg-brand-surface border border-brand-border rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-fade-in backdrop-blur-xl">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-brand-purple to-brand-teal border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-crimson/30 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>JAGO Assistant</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-brand-emerald/20 text-brand-emerald rounded border border-brand-emerald/30">
                    MoTA AI
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300">ST Student Scholarship Advisor</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-crimson to-rose-600 text-white rounded-br-none shadow-md'
                      : 'bg-brand-card border border-brand-border text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1 text-slate-400 p-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">JAGO is evaluating...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          {actions && actions.length > 0 && (
            <div className="px-3 py-2 bg-slate-900/60 border-t border-brand-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {actions.map((act, i) => (
                <button
                  key={i}
                  onClick={() => handleActionClick(act)}
                  className="flex-shrink-0 text-[11px] bg-brand-card hover:bg-brand-gold hover:text-brand-dark text-slate-200 font-medium px-2.5 py-1 rounded-full border border-brand-border transition-all flex items-center gap-1"
                >
                  <span>{act.label}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-brand-surface border-t border-brand-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-brand-card border-brand-border text-slate-400 hover:text-brand-gold'
                }`}
                title="Voice Input (Hindi/English Speech)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask JAGO (e.g. Am I eligible?)...'}
                className="flex-1 bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-brand-crimson text-white disabled:opacity-40 hover:bg-rose-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingJagoWidget;
