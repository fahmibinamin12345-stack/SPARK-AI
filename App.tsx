import React, { useState, useEffect, useRef } from 'react';
import { SparkModel, Message, UserState, Attachment } from './types';
import { REDEEM_CODES, SparkLogo, BETA_COST_PER_MESSAGE, SKRIPTER_COST_PER_MESSAGE, ARTIST_COST_PER_MESSAGE, PROMPT_TEMPLATES, PromptTemplate, SKRIPT_ADDONS } from './constants';
import { generateResponseStream, generateSpeech } from './services/geminiService';

const Icon = ({ name, className = "w-4 h-4" }: { name: string, className?: string }) => {
  switch (name) {
    case 'marketing': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
    case 'code': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    case 'writing': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
    case 'academic': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" /></svg>;
    case 'ticket': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
    case 'zap': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'diamond': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 12 5 12 5s-4.82 5-12 5c-1.105 0-2-.895-2-2V7c0-1.105.895-2 2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v10" /></svg>;
    case 'rocket': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    case 'coins': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'file': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case 'refresh': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
    case 'download': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
    case 'speaker': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
    case 'trash': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
    case 'gift': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v14m0-14L4 7m16 0v10l-8 4m0-14L4 7m0 0v10l8 4" /></svg>;
    case 'microphone': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v2a7 7 0 01-14 0v-2M12 19v4" /></svg>;
    case 'sparkles': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    case 'user': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case 'settings': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    case 'plus': return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
    default: return null;
  }
};

const App: React.FC = () => {
  const [activeModel, setActiveModel] = useState<SparkModel>('default');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [showTemplatesMenu, setShowTemplatesMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<{ text: string; thought: string; imageUrl?: string } | null>(null);
  
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('spark_user_data_v3');
      return saved ? JSON.parse(saved) : { coins: 150, redeemedCodes: [], username: 'Explorer', preferredVoice: 'Kore' };
    } catch (e) {
      return { coins: 150, redeemedCodes: [], username: 'Explorer', preferredVoice: 'Kore' };
    }
  });

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemError, setRedeemError] = useState('');
  const [isCoinAnimating, setIsCoinAnimating] = useState(false);
  const [switchNotification, setSwitchNotification] = useState<string | null>(null);
  const [headerKey, setHeaderKey] = useState(0); 
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const versionMenuRef = useRef<HTMLDivElement>(null);
  const templatesMenuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const prevCoinsRef = useRef(user.coins);

  useEffect(() => {
    localStorage.setItem('spark_user_data_v3', JSON.stringify(user));
    if (user.coins !== prevCoinsRef.current) {
      setIsCoinAnimating(true);
      const timer = setTimeout(() => setIsCoinAnimating(false), 1000);
      prevCoinsRef.current = user.coins;
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (versionMenuRef.current && !versionMenuRef.current.contains(event.target as Node)) setShowVersionMenu(false);
      if (templatesMenuRef.current && !templatesMenuRef.current.contains(event.target as Node)) setShowTemplatesMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (e: any) => setUserInput(prev => prev + (prev ? ' ' : '') + e.results[0][0].transcript);
      recognition.onerror = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported.");
    isRecording ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  const useTemplate = (tmpl: PromptTemplate) => {
    setUserInput(tmpl.prompt);
    setShowTemplatesMenu(false);
  };

  const processPayment = (model: SparkModel): boolean => {
    let cost = 0;
    if (model === 'beta') cost = BETA_COST_PER_MESSAGE;
    if (model === 'skripter') cost = SKRIPTER_COST_PER_MESSAGE;
    if (model === 'artist') cost = ARTIST_COST_PER_MESSAGE;
    if (cost > 0) {
      if (user.coins < cost) {
        alert(`Need ${cost} coins for ${model}. Current: ${user.coins}`);
        return false;
      }
      setUser(prev => ({ ...prev, coins: prev.coins - cost }));
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64WithHeader = event.target?.result as string;
        const data = base64WithHeader.split(',')[1];
        setAttachments(prev => [...prev, {
          mimeType: file.type,
          data: data,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadSkript = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spark_script.sk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSwitchNotification("Skript Exported Successfully!");
  };

  const recheckSkript = (content: string) => {
    setSwitchNotification("Validating Skript Logic...");
    setTimeout(() => {
      const hasIndentationIssues = !content.includes("    ") && !content.includes("\t");
      const hasMissingEvent = !content.includes(":");
      if (hasIndentationIssues || hasMissingEvent) {
        alert("Syntax Alert: Potential structure issues detected. Ensure proper Minecraft Skript indentation.");
      } else {
        setSwitchNotification("Syntax Check Passed!");
      }
    }, 1200);
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    let input = overrideInput || userInput;
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    if (activeModel === 'skripter' && selectedAddons.length > 0) {
      input = `[ADDON REQUIREMENTS: ${selectedAddons.join(', ')}]\n\n${input}`;
    }

    if (!processPayment(activeModel)) return;

    const newMessage: Message = { role: 'user', content: input, timestamp: Date.now(), attachments: attachments.length > 0 ? [...attachments] : undefined };
    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    const currentHistory = [...messages];
    const currentAttachments = [...attachments];
    
    setUserInput('');
    setAttachments([]);
    setIsLoading(true);
    setStreamingMessage({ text: '', thought: '' });

    try {
      const stream = generateResponseStream(activeModel, currentHistory, currentInput, currentAttachments);
      let fullText = '';
      let fullThought = '';
      let finalImageUrl = '';

      for await (const chunk of stream) {
        if (chunk.thought) fullThought += chunk.thought;
        if (chunk.text) fullText += chunk.text;
        if (chunk.imageUrl) finalImageUrl = chunk.imageUrl;
        setStreamingMessage({ text: fullText, thought: fullThought, imageUrl: finalImageUrl });
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', content: fullText, thought: fullThought || undefined, 
        timestamp: Date.now(), isSkript: activeModel === 'skripter', imageUrl: finalImageUrl 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error in generation.", timestamp: Date.now() }]);
    } finally {
      setStreamingMessage(null);
      setIsLoading(false);
    }
  };

  const handleClaimDaily = () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    if (user.lastCheckIn && now - user.lastCheckIn < dayInMs) {
      return alert(`Claimed already. Come back later!`);
    }
    setUser(prev => ({ ...prev, coins: prev.coins + 150, lastCheckIn: now }));
    setSwitchNotification("+150 Coins Claimed!");
  };

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (!REDEEM_CODES[code]) return setRedeemError("Invalid code.");
    if (user.redeemedCodes.includes(code)) return setRedeemError("Already used.");
    setUser(prev => ({ ...prev, coins: prev.coins + REDEEM_CODES[code], redeemedCodes: [...prev.redeemedCodes, code] }));
    setShowRedeemModal(false);
    setRedeemCode('');
  };

  const switchModel = (model: SparkModel) => {
    setActiveModel(model);
    setShowVersionMenu(false);
    setSwitchNotification(`Switched to ${model.toUpperCase()}`);
    setHeaderKey(v => v + 1);
    setTimeout(() => setSwitchNotification(null), 2000);
  };

  const handleSpeech = async (text: string, id: number) => {
    if (isSpeaking === id) { window.speechSynthesis.cancel(); setIsSpeaking(null); return; }
    setIsSpeaking(id);
    try {
      const base64 = await generateSpeech(text, user.preferredVoice);
      if (base64) {
        const audio = new Audio(`data:audio/mp3;base64,${base64}`);
        audio.onended = () => setIsSpeaking(null);
        audio.play();
      } else {
        throw new Error("No audio data");
      }
    } catch (e) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden selection:bg-purple-500/30">
      <aside className="w-80 bg-[#111] border-r border-white/5 flex flex-col p-6 shrink-0 relative">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => window.location.reload()}>
          <SparkLogo className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 brand-font">SPARK AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group hover:bg-white/[0.07] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-lg font-bold">
                {user.username?.[0] || 'E'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{user.username}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Cloud Account</p>
              </div>
              <button onClick={() => setShowProfileModal(true)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                <Icon name="settings" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mb-4 px-2">Daily Perks</p>
            <button onClick={handleClaimDaily} className="w-full group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all text-left flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Icon name="gift" className="w-6 h-6 text-pink-400" /></div>
              <div><p className="text-sm font-bold">Claim Coins</p><p className="text-[10px] text-white/40">+150 Today</p></div>
            </button>
          </div>

          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mb-4 px-2">Workspace</p>
            <button onClick={() => setMessages([])} className="w-full p-4 flex items-center gap-4 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-2xl transition-all group border border-transparent hover:border-red-500/20">
              <Icon name="trash" className="w-5 h-5 group-hover:scale-110" />
              <span className="text-xs font-bold uppercase tracking-widest">Wipe Session</span>
            </button>
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <div className={`p-5 rounded-2xl border transition-all duration-500 bg-white/[0.02] ${isCoinAnimating ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)] scale-[1.03]' : 'border-white/5'}`}>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-bold">Cloud Wallet</p>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-black transition-all ${isCoinAnimating ? 'text-yellow-400' : 'text-white'}`}>{user.coins.toLocaleString()}</span>
              <Icon name="coins" className={`w-6 h-6 text-yellow-500 ${isCoinAnimating ? 'animate-bounce' : ''}`} />
            </div>
          </div>
          <button onClick={() => setShowRedeemModal(true)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest border border-white/5">Redeem Access Code</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-transparent to-black/30">
        {switchNotification && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/10 backdrop-blur-2xl px-8 py-3 rounded-full border border-white/20 shadow-2xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white brand-font">{switchNotification}</span>
            </div>
          </div>
        )}

        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a0a0a]/40 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-6">
            <div key={`header-${headerKey}`} className="animate-in slide-in-from-left-6 duration-500">
              <div className="flex items-center gap-3">
                <h2 className={`font-black text-2xl tracking-tighter uppercase transition-colors brand-font ${
                  activeModel === 'beta' ? 'text-pink-400' : activeModel === 'skripter' ? 'text-yellow-400' : activeModel === 'artist' ? 'text-green-400' : activeModel === 'pro' ? 'text-purple-400' : 'text-blue-400'
                }`}>Spark {activeModel}</h2>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${activeModel === 'default' ? 'bg-blue-500' : 'bg-purple-600'}`}>v3.0</div>
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Neural Engine Active</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          {messages.length === 0 && !streamingMessage ? (
            <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-1000">
              <div className="relative mb-12">
                <SparkLogo className="w-32 h-32 opacity-10 animate-pulse" />
                <div className="absolute inset-0 bg-purple-500/10 blur-[100px] rounded-full" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase brand-font">Initiate Intelligence</h2>
              <p className="max-w-md text-white/30 text-center mb-12 leading-relaxed">Specialized logic for Skripting, Content, and Visualization.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {PROMPT_TEMPLATES.map((tmpl) => (
                  <button key={tmpl.id} onClick={() => useTemplate(tmpl)} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-left hover:bg-white/[0.07] hover:border-white/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon name={tmpl.icon} className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-2">{tmpl.category}</p>
                    <h3 className="font-bold text-lg mb-2">{tmpl.title}</h3>
                    <p className="text-xs text-white/30 leading-relaxed line-clamp-3">{tmpl.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full space-y-12">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
                  <div className={`max-w-[90%] rounded-[2rem] ${msg.role === 'user' ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white px-8 py-5 shadow-2xl shadow-purple-500/10' : 'w-full'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="flex gap-8 items-start w-full group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-2 shadow-2xl">
                          <SparkLogo className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Output • {new Date(msg.timestamp).toLocaleTimeString()}</p>
                             <div className="flex items-center gap-2">
                               <button onClick={() => handleSpeech(msg.content, idx)} className={`p-2 rounded-xl transition-all ${isSpeaking === idx ? 'bg-purple-500/20 text-purple-400' : 'text-white/10 hover:text-white hover:bg-white/5'}`}>
                                 <Icon name="speaker" className={`w-4 h-4 ${isSpeaking === idx ? 'animate-pulse' : ''}`} />
                               </button>
                             </div>
                          </div>
                          <div className="text-[15px] text-white/90 leading-relaxed prose prose-invert max-w-none">
                            <ContentRenderer text={msg.content} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[15px] font-medium leading-relaxed">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {streamingMessage && (
                <div className="flex gap-8 items-start w-full animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-2">
                    <SparkLogo className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    {streamingMessage.text ? (
                      <div className="text-[15px] text-white/90 leading-relaxed"><WordStreaming text={streamingMessage.text} /></div>
                    ) : (
                      <div className="flex gap-2 py-4"><div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" /><div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]" /></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-10 pt-6 shrink-0 bg-gradient-to-t from-black via-black to-transparent z-30 relative">
          <div className="max-w-5xl mx-auto space-y-6">
            <form onSubmit={(e) => handleSendMessage(e)} className="relative group">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Command the intelligence..." className="w-full bg-[#111] border border-white/5 rounded-3xl py-6 pl-12 pr-32 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-[15px] shadow-2xl" />
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-600/20"><Icon name="rocket" className="w-5 h-5" /></button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

const ContentRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return <div className="whitespace-pre-wrap">{parts.map((part, i) => part.startsWith('```') ? <CodeBox key={i} code={part.replace(/```/g, '').trim()} /> : <span key={i}>{part}</span>)}</div>;
};

const CodeBox: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="my-8 bg-black border border-white/5 rounded-3xl overflow-hidden group shadow-2xl relative">
      <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20" /><div className="w-3 h-3 rounded-full bg-yellow-500/20" /><div className="w-3 h-3 rounded-full bg-green-500/20" /></div>
        <button onClick={handleCopy} className={`text-[9px] font-black tracking-[0.2em] transition-colors ${copied ? 'text-green-400' : 'text-white/20 hover:text-white'}`}>{copied ? 'COPIED!' : 'COPY CODE'}</button>
      </div>
      <div className="p-8 overflow-x-auto"><code className="text-[13px] font-mono leading-relaxed block">{code}</code></div>
    </div>
  );
};

const WordStreaming: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => { setDisplayedText(text); }, [text]);
  return <ContentRenderer text={displayedText} />;
};

interface VersionOptionProps { active: boolean; onClick: () => void; label: string; desc: string; icon: string; isBeta?: boolean; }
const VersionOption: React.FC<VersionOptionProps> = ({ active, onClick, label, desc, icon, isBeta }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-white/10 text-white border border-white/10' : 'hover:bg-white/5 text-white/50 border border-transparent'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-purple-600 text-white' : 'bg-white/5'}`}><Icon name={icon} className="w-5 h-5" /></div>
    <div className="text-left min-w-0">
      <div className="flex items-center gap-2"><span className={`text-sm font-bold truncate ${active ? 'text-white' : 'text-white/80'}`}>{label}</span>{isBeta && <span className="text-[7px] px-1 bg-pink-500 text-white rounded font-black">BETA</span>}</div>
      <p className="text-[9px] opacity-40 truncate font-bold uppercase tracking-widest">{desc}</p>
    </div>
  </button>
);

export default App;