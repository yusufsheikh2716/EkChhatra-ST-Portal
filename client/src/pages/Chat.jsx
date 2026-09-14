import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'jago',
      message: 'Johar! 🙏 I am JAGO, your dedicated Ministry of Tribal Affairs scholarship assistant. Ask me about your eligibility, application tracking, documents required, or central schemes.'
    }
  ]);
  const [actions, setActions] = useState([
    { label: 'Check My Eligibility', query: 'Am I eligible for any scheme?' },
    { label: 'Track Application Status', query: 'What is my application status?' },
    { label: 'Pre-Matric Details', query: 'Tell me about Pre-Matric scholarship' },
    { label: 'Post-Matric Details', query: 'Tell me about Post-Matric scholarship' },
    { label: 'Top Class Education', query: 'Tell me about Top Class Education' },
    { label: 'Documents Required', query: 'What documents are required for ST scholarship?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      axiosClient.get('/api/chat/history')
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setMessages(res.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSend = async (customQuery) => {
    const text = customQuery || input;
    if (!text.trim() || loading) return;

    const userMessage = { sender: 'user', message: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/api/chat/send', { message: text });
      const jagoReply = { sender: 'jago', message: res.data.reply };
      setMessages((prev) => [...prev, jagoReply]);
      if (res.data.actions) {
        setActions(res.data.actions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'jago', message: 'Unable to reach the server. Please check your connection and retry.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Phase 2 Voice Feature (SpeechRecognition)
  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported by your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening for voice input...');
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear conversation history?')) return;
    try {
      await axiosClient.delete('/api/chat/history');
      setMessages([
        {
          sender: 'jago',
          message: 'Conversation cleared. How can I assist you with your ST scholarship questions?'
        }
      ]);
      toast.success('History cleared');
    } catch {
      toast.error('Failed to clear');
    }
  };

  const handleActionClick = (act) => {
    if (act.url) {
      if (act.url.startsWith('http')) {
        window.open(act.url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(act.url);
      }
    } else if (act.query) {
      handleSend(act.query);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Container with ParticleText */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="JAGO Assistant"
            color="#f5a623"
            highlightColor="#e94560"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          Intelligent AI guide for Ministry of Tribal Affairs schemes, eligibility, and tracking.
        </p>
      </div>

      {/* Main Chat Window */}
      <div className="glass-card rounded-3xl border border-brand-border h-[620px] flex flex-col overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-purple to-brand-teal border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-crimson/30 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>JAGO AI Assistant</span>
                <span className="text-[10px] bg-brand-emerald/20 text-brand-emerald px-2 py-0.5 rounded-full border border-brand-emerald/30">
                  Online
                </span>
              </div>
              <div className="text-[11px] text-slate-300">MoTA Rule Engine • Real-Time Database Tracking</div>
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-slate-400 font-semibold mb-1 px-1">
                {m.sender === 'user' ? (user?.name || 'You') : 'JAGO Assistant'}
              </div>
              <div
                className={`max-w-[85%] p-4 rounded-3xl whitespace-pre-line leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-crimson to-rose-600 text-white rounded-br-none shadow-md'
                    : 'bg-brand-surface/90 border border-brand-border text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 p-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-1">JAGO is querying scholarship guidelines...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggestion Chips */}
        {actions && actions.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-900/60 border-t border-brand-border/60 flex items-center gap-2 overflow-x-auto">
            {actions.map((act, i) => (
              <button
                key={i}
                onClick={() => handleActionClick(act)}
                className="flex-shrink-0 text-xs bg-brand-card hover:bg-brand-gold hover:text-brand-dark text-slate-200 font-medium px-3 py-1.5 rounded-full border border-brand-border transition-all flex items-center gap-1.5"
              >
                <span>{act.label}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-4 bg-brand-surface border-t border-brand-border">
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
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-brand-card border-brand-border text-slate-400 hover:text-brand-gold'
              }`}
              title="Voice Input (Speech Recognition)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening for speech...' : 'Type your scholarship question...'}
              className="flex-1 bg-brand-card border border-brand-border rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-bold disabled:opacity-40 hover:brightness-110 transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
