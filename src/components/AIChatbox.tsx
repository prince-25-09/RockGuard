import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Activity,
  AlertTriangle,
  RefreshCw,
  Shield,
  CornerDownLeft
} from 'lucide-react';
import { ChatMessage, SensorReadings, RiskSector, ImageScanResult } from '../types';

interface AIChatboxProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: {
    riskScore: number;
    riskLevel: string;
    sector: string;
    hazardType: string;
    rainfall: number;
    soilMoisture: number;
    seismic: string;
    displacement: number;
    activeAlertsCount: number;
    personnelEmergency: number;
    personnelCaution: number;
    latestScanResult?: ImageScanResult | null;
  };
}

export const AIChatbox: React.FC<AIChatboxProps> = ({
  isOpen,
  onClose,
  contextData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am RockGuard AI, your mine & slope safety copilot.

I am analyzing Sector B-12 in real-time. Currently, the site risk index is 82/100 (HIGH) due to 12.4mm rainfall and 4.2mm/day slope displacement.

How can I assist your safety team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextUsed: true
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    'Why is this site risky?',
    "What's causing the risk?",
    'Show recent alerts',
    'What should we do now?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          context: contextData
        })
      });

      const data = await response.json();

      const aiReplyText = data.reply || "RockGuard AI service completed analysis.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextUsed: true
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Safety Advisory (Sector B-12): Risk index is elevated at 82/100. Restrict access along Bench 4 haul ramp and issue immediate evacuation for excavators in the rockfall zone.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900">
      {/* Top Copilot Header - Bento Dark Navy Accent */}
      <div className="p-4 border-b border-slate-200 bg-[#0B192E] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F27D26] flex items-center justify-center text-white font-bold shadow-sm">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>RockGuard AI</span>
              <span className="px-2 py-0.5 rounded bg-[#F27D26]/20 text-[#F27D26] text-[10px] font-extrabold uppercase border border-[#F27D26]/30">
                Copilot
              </span>
            </h3>
            <p className="text-[10px] text-slate-300 font-medium">
              Gemini 2.5 Flash • Live Mine Sector B-12 Context
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Badge Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-mono">
        <div className="flex items-center gap-1.5 text-red-600 font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Sector B-12 ({contextData.riskScore}/100)</span>
        </div>
        <div className="text-slate-500">
          Rainfall: <span className="text-[#F27D26] font-bold">{contextData.rainfall}mm</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 text-[#F27D26] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isAI
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-[#F27D26] text-white font-medium shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    isAI ? 'text-slate-400' : 'text-orange-100 font-bold'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 text-[#F27D26] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
              <Activity className="w-4 h-4 text-[#F27D26] animate-spin" />
              <span>RockGuard AI analyzing geotechnical telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="p-3 border-t border-slate-200 bg-white space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          Quick Safety Prompts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#F27D26] text-[11px] font-semibold border border-slate-200 transition cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field Form */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask RockGuard AI about slope risks, sensors, or safety..."
            className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 focus:border-[#F27D26] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold flex items-center justify-center transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
