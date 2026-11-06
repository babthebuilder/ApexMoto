import React, { useState } from 'react';
import { X, Send, Phone, PhoneCall, Mic, MicOff, MessageSquare, Bot } from 'lucide-react';

interface ConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConciergeDrawer: React.FC<ConciergeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'concierge',
      name: 'Elena (Apex Concierge)',
      text: 'Good afternoon, Marcus! Bay 04 is currently finishing the precision caliper torque checks on your 911 GT3. How can I assist you?',
      time: '14:22',
    },
    {
      id: 2,
      sender: 'user',
      name: 'Marcus',
      text: 'Will the dyno pull test run before 16:30?',
      time: '14:24',
    },
    {
      id: 3,
      sender: 'concierge',
      name: 'Alex Vance (Lead Tech)',
      text: 'Hey Marcus! Yes, we have scheduled the dyno pull for 16:15. You will receive an automated push alert with the dyno curve graph right when it completes.',
      time: '14:26',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: 'Marcus',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'concierge',
        name: 'Alex Vance (Lead Tech)',
        text: "Understood! I've noted that on your digital docket. We're keeping everything within factory race-spec tolerances.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#191f2f] border-l border-white/10 shadow-2xl flex flex-col backdrop-blur-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141b2b]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Apex Concierge & Bay 04</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-[11px] text-slate-400">Direct hotline to Bay Specialist</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Channel Banner */}
      <div className="px-4 py-2.5 bg-orange-500/10 border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-orange-300">
          <PhoneCall className="w-3.5 h-3.5 animate-pulse text-orange-400" />
          <span>{isCalling ? 'Voice Channel Connected (Bay 04)' : 'Dedicated Audio Hotline'}</span>
        </div>
        {isCalling ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMicMuted(!micMuted)}
              className="p-1 rounded bg-black/40 text-slate-300 hover:text-white cursor-pointer"
              title={micMuted ? 'Unmute' : 'Mute'}
            >
              {micMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setIsCalling(false)}
              className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-semibold cursor-pointer"
            >
              End
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCalling(true)}
            className="px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-semibold transition-colors cursor-pointer"
          >
            Connect Voice
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
              <span>{m.name}</span>
              <span>•</span>
              <span>{m.time}</span>
            </div>
            <div
              className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                  : 'bg-[#0c1322] border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#141b2b] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Alex Vance or Concierge..."
          className="flex-1 h-9 px-3 rounded-lg bg-[#070e1d] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-[0_2px_10px_rgba(249,115,22,0.3)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
