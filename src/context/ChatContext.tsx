import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  setDoc,
  where,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: any;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastTimestamp: any;
  lastSenderId: string;
  unreadCount?: { [uid: string]: number };
  carId?: string;
  carInfo?: {
    title: string;
    image: string;
    price: string;
  };
  recipient?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error (Chat): ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ChatContextType {
  chats: Chat[];
  messages: Message[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  startChat: (
    recipientId: string, 
    recipientName: string, 
    recipientAvatar: string, 
    recipientRole: string, 
    initialMessage?: string,
    carId?: string,
    carInfo?: { title: string; image: string; price: string }
  ) => Promise<string>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Welcome Chat Seeding (Run once on login)
  useEffect(() => {
    const seedWelcomeChat = async () => {
      if (!user) return;
      
      try {
        const dummyId = 'dealer_dummy';
        if (user.id === dummyId) return; // Don't seed for dummy account itself
        
        const chatId = [user.id, dummyId].sort().join('_');
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
          const timestamp = serverTimestamp();
          await setDoc(chatRef, {
            participants: [user.id, dummyId],
            lastMessage: 'Hello! I am the manager at Premium Autos. How can I help you today?',
            lastTimestamp: timestamp,
            lastSenderId: dummyId,
            unreadCount: { [user.id]: 1, [dummyId]: 0 },
            metadata: {
              [user.id]: { name: user.name, avatar: user.avatar, role: user.role },
              [dummyId]: { name: 'Premium Autos (Test Account)', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150', role: 'Dealer' }
            }
          });
          
          await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: 'Hello! I am the manager at Premium Autos. How can I help you today?',
            senderId: dummyId,
            timestamp: timestamp
          });
        }
      } catch (err) {
        console.warn("Welcome chat seeding skipped:", err);
      }
    };

    seedWelcomeChat();
  }, [user]);

  // Sync Chats list
  useEffect(() => {
    if (!user) {
      setChats([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      try {
        const chatsData = await Promise.all(snapshot.docs.map(async (chatDoc) => {
          const data = chatDoc.data();
          const recipientId = data.participants.find((id: string) => id !== user.id);
          
          let recipientInfo = data.metadata?.[recipientId] || { name: 'User', avatar: '', role: 'Seller' };
          
          return {
            id: chatDoc.id,
            ...data,
            recipient: {
              id: recipientId,
              name: recipientInfo.name,
              avatar: recipientInfo.avatar,
              role: recipientInfo.role
            }
          } as Chat;
        }));

        const sortedChats = chatsData.sort((a, b) => 
          ((b.lastTimestamp?.seconds || 0) + (b.lastTimestamp?.nanoseconds || 0) / 1e9) - 
          ((a.lastTimestamp?.seconds || 0) + (a.lastTimestamp?.nanoseconds || 0) / 1e9)
        );

        setChats(sortedChats);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'chats');
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync active chat messages
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, 'chats', activeChatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(messagesData);

      // Reset unread count
      if (user) {
        updateDoc(doc(db, 'chats', activeChatId), {
          [`unreadCount.${user.id}`]: 0
        }).catch(err => console.warn("Failed to reset unread count:", err));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${activeChatId}/messages`);
    });

    return () => unsubscribe();
  }, [activeChatId, user]);

  const sendMessage = async (text: string) => {
    if (!user || !activeChatId) return;

    try {
      const chatRef = doc(db, 'chats', activeChatId);
      const chatSnap = await getDoc(chatRef);
      const participants = chatSnap.data()?.participants || [];
      const recipientId = participants.find((id: string) => id !== user.id);

      await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
        text,
        senderId: user.id,
        timestamp: serverTimestamp()
      });

      await updateDoc(chatRef, {
        lastMessage: text,
        lastTimestamp: serverTimestamp(),
        lastSenderId: user.id,
        [`unreadCount.${recipientId}`]: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chats/${activeChatId}`);
    }
  };

  const startChat = async (
    recipientId: string, 
    recipientName: string, 
    recipientAvatar: string, 
    recipientRole: string, 
    initialMessage?: string,
    carId?: string,
    carInfo?: { title: string; image: string; price: string }
  ) => {
    if (!user) throw new Error('Must be logged in to chat');
    if (user.id === recipientId) throw new Error('Cannot chat with yourself');

    console.log('Initiating chat with:', recipientId, 'for car:', carId);

    try {
      // Deterministic chatId including carId if available
      const chatId = carId 
        ? `${[user.id, recipientId].sort().join('_')}_${carId}`
        : [user.id, recipientId].sort().join('_');
        
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      const timestamp = serverTimestamp();
      const initialTxt = initialMessage || (carId ? `Hi, I am interested in your ${carInfo?.title || 'vehicle'}!` : 'Hi, I am interested in this vehicle!');

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [user.id, recipientId],
          lastMessage: initialTxt,
          lastTimestamp: timestamp,
          lastSenderId: user.id,
          unreadCount: { [user.id]: 0, [recipientId]: 1 },
          carId: carId || null,
          carInfo: carInfo || null,
          metadata: {
            [user.id]: { 
              name: user.name || user.email?.split('@')[0] || 'User', 
              avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`, 
              role: user.role || 'Buyer' 
            },
            [recipientId]: { 
              name: recipientName || 'Seller', 
              avatar: recipientAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150', 
              role: recipientRole || 'Seller' 
            }
          }
        });

        // Add the actual first message document
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: initialTxt,
          senderId: user.id,
          timestamp: timestamp
        });
      }

      setActiveChatId(chatId);
      console.log('Chat active, ID:', chatId);
      return chatId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'chats/startChat');
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{ chats, messages, activeChatId, setActiveChatId, sendMessage, startChat, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
