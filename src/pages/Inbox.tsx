import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, User, ChevronLeft, MoreVertical, Paperclip, Smile, ShieldAlert, X, Car, Filter } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useChat, Chat, Message } from '../context/ChatContext';
import { useSearchParams } from 'react-router-dom';

export default function Inbox() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { chats, messages, activeChatId, setActiveChatId, sendMessage, isLoading } = useChat();
  const [messageText, setMessageText] = useState('');
  const [category, setCategory] = useState<'All' | 'Buyer' | 'Seller'>('All');
  const [carFilter, setCarFilter] = useState<string | null>(searchParams.get('carId'));
  const [showSafetyTips, setShowSafetyTips] = useState(false);

  useEffect(() => {
    const carId = searchParams.get('carId');
    if (carId) setCarFilter(carId);
  }, [searchParams]);

  const selectedChat = chats.find(c => c.id === activeChatId) || null;
  const isStartingNewChat = activeChatId && !selectedChat;

  // Real-time listener for current chat if it doesn't exist yet in the 'chats' list
  // This helps when we navigate to /inbox immediately after startChat()
  const [newChatInfo, setNewChatInfo] = useState<{name: string, avatar: string, role: string} | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  useEffect(() => {
    if (isStartingNewChat && activeChatId) {
       // Peek into firestore to get basic info while we wait for the big list to sync
       const getChatInfo = async () => {
         try {
           const chatSnap = await getDoc(doc(db, 'chats', activeChatId));
           if (chatSnap.exists()) {
             const data = chatSnap.data();
             const recipientId = data.participants.find((id: string) => id !== user?.id);
             const info = data.metadata?.[recipientId];
             if (info) setNewChatInfo({ name: info.name, avatar: info.avatar, role: info.role });
           }
         } catch (e) { console.error(e); }
       };
       getChatInfo();
    } else {
      setNewChatInfo(null);
    }
  }, [isStartingNewChat, activeChatId, user?.id]);

  useEffect(() => {
    if (activeChatId && !localStorage.getItem('seen_safety_tips')) {
      setShowSafetyTips(true);
    }
  }, [activeChatId]);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const closeSafetyTips = () => {
    setShowSafetyTips(false);
    localStorage.setItem('seen_safety_tips', 'true');
  };

  const filteredChats = chats.filter(chat => {
    if (category !== 'All') {
      const role = chat.recipient?.role?.toLowerCase() || '';
      if (category === 'Buyer' && !role.includes('buyer')) return false;
      if (category === 'Seller' && (!role.includes('seller') && !role.includes('dealer'))) return false;
    }
    
    if (carFilter && chat.carId !== carFilter) return false;
    
    return true;
  });

  // Unique cars from chats for the filter dropdown
  const uniqueCars = Array.from(new Set(chats.filter(c => c.carId && c.carInfo).map(c => JSON.stringify({ id: c.carId, title: c.carInfo?.title })) ))
    .map((s: string) => JSON.parse(s) as { id: string, title: string });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatId) return;
    
    await sendMessage(messageText);
    setMessageText('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading chats...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-140px)]">
      {/* Safety Tips Modal */}
      <AnimatePresence>
        {showSafetyTips && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <button onClick={closeSafetyTips} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mb-2">Tips for a Safe Deal</h2>
                <p className="text-slate-500 font-medium mb-8">Follow these guidelines to ensure a safe and successful transaction.</p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Don't enter UPI PIN/OTP, scan unknown QR codes, or click unsafe links.",
                    "Never give money or product in advance.",
                    "Report suspicious users to support team.",
                    "Don't share personal details like photos or IDs.",
                    "Be cautious during buyer-seller meetings."
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                      <p className="text-sm font-bold text-slate-700 leading-tight">{tip}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={closeSafetyTips}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                  I Understand, Let's Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex h-full overflow-hidden">
        
        {/* Sidebar: Chat List */}
        <div className={`w-full lg:w-96 border-r border-slate-100 flex flex-col ${selectedChat || isStartingNewChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-2xl font-black text-slate-900 mb-6">Messages</h1>
            
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-2xl">
              {['All', 'Buyer', 'Seller'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`flex-1 py-1.5 text-[10px] font-black rounded-xl transition-all ${category === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {uniqueCars.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Filter className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by Car</span>
                </div>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-1 focus:ring-primary-500"
                  value={carFilter || ''}
                  onChange={(e) => setCarFilter(e.target.value || null)}
                >
                  <option value="">All Vehicles</option>
                  {uniqueCars.map(car => (
                    <option key={car.id} value={car.id}>{car.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full p-6 flex flex-col gap-4 transition-all hover:bg-slate-50 border-l-4 ${activeChatId === chat.id ? 'bg-primary-50/30 border-primary-500' : 'border-transparent'}`}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="relative text-left">
                    <img src={chat.recipient?.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-900 truncate">{chat.recipient?.name}</p>
                      {(chat.unreadCount?.[user?.id || ''] || 0) > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-white">
                          {chat.unreadCount?.[user?.id || '']}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate mb-1">{chat.recipient?.role}</p>
                  </div>
                </div>

                {chat.carInfo && (
                  <div className="flex items-center gap-2 p-2 bg-slate-100/50 rounded-xl">
                    <img src={chat.carInfo.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">{chat.carInfo.title}</p>
                      <p className="text-[9px] font-bold text-primary-500">₹{chat.carInfo.price}</p>
                    </div>
                  </div>
                )}

                <p className={`text-sm truncate w-full text-left ${(chat.unreadCount?.[user?.id || ''] || 0) > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                  {chat.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedChat && !isStartingNewChat ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
          {selectedChat || isStartingNewChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-100">
                <div className="p-4 lg:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setActiveChatId(null)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    {isStartingNewChat ? (
                      newChatInfo ? (
                        <img src={newChatInfo.avatar} className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl object-cover" alt="" />
                      ) : (
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-2xl animate-pulse" />
                      )
                    ) : (
                      <img src={selectedChat?.recipient?.avatar} className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl object-cover" alt="" />
                    )}
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight">
                        {isStartingNewChat ? (newChatInfo?.name || 'Connecting...') : selectedChat?.recipient?.name}
                      </h3>
                      <p className="text-[10px] lg:text-xs font-bold text-primary-500 uppercase tracking-widest">
                        {isStartingNewChat ? (newChatInfo?.role || 'Starting conversation') : selectedChat?.recipient?.role}
                      </p>
                    </div>
                  </div>
                  <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {selectedChat?.carInfo && (
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-xl border border-slate-200 p-0.5">
                        <img src={selectedChat.carInfo.image} className="w-full h-full object-cover rounded-lg" alt="" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Inquiring About</p>
                        <p className="text-xs lg:text-sm font-bold text-slate-900">{selectedChat.carInfo.title}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Price</p>
                        <p className="text-xs lg:text-sm font-black text-primary-500">₹{selectedChat.carInfo.price}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isStartingNewChat ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-black uppercase text-xs tracking-widest">Initiating Chat...</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${isMe ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                            {msg.text}
                            <div className={`text-[10px] mt-2 opacity-60 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                              {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button type="button" className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      placeholder="Type a message..."
                      className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={isStartingNewChat}
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button 
                    type="submit"
                    className="p-4 bg-primary-500 text-white rounded-[2rem] shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center justify-center"
                    disabled={!messageText.trim() || isStartingNewChat}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center p-12">
              <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Conversation</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">Click on a chat to start messaging with buyers or sellers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
