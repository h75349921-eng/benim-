import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'dealer' | 'admin';
  avatar: string;
  phone?: string;
  isPremiumBuyer?: boolean;
  isVerified?: boolean;
  viewedPhoneNumbers?: string[]; // Array of car IDs
  startedChats?: string[]; // Array of seller IDs
  premiumExpiry?: string;
  verifiedExpiry?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (role?: 'buyer' | 'seller' | 'dealer' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  trackPhoneNumberView: (carId: string) => Promise<boolean>;
  trackChatStart: (sellerId: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Module level variable to track intended role during login process
let intendedRole: 'buyer' | 'seller' | 'dealer' | 'admin' | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync with Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        let currentUser: User;
        const isAdminEmail = firebaseUser.email === 'adilnida778@gmail.com';
        const roleToAssign = isAdminEmail ? 'admin' : (intendedRole || 'buyer');

        try {
          if (userDoc.exists()) {
            const existingData = userDoc.data() as User;
            if (isAdminEmail && existingData.role !== 'admin') {
              const updatedData = { ...existingData, role: 'admin' as const };
              await updateDoc(userRef, { role: 'admin' });
              currentUser = updatedData;
            } else if (intendedRole && existingData.role !== intendedRole && !isAdminEmail) {
              const updatedData = { ...existingData, role: intendedRole };
              await updateDoc(userRef, { role: intendedRole });
              currentUser = updatedData;
            } else {
              currentUser = existingData;
            }
          } else {
            // Create user profile if doesn't exist
            currentUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Member',
              email: firebaseUser.email || '',
              role: roleToAssign,
              avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
            };
            await setDoc(userRef, currentUser);
          }
          setUser(currentUser);
        } catch (error) {
          console.error("User Sync Error:", error);
          setUser(null);
        }
        intendedRole = null; // Clear after use
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (role: 'buyer' | 'seller' | 'dealer' | 'admin' = 'buyer'): Promise<boolean> => {
    setIsLoading(true);
    intendedRole = role;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      intendedRole = null;
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Update Profile Error:', error);
    }
  };

  const trackPhoneNumberView = async (carId: string): Promise<boolean> => {
    if (!user) return false;
    
    const viewed = user.viewedPhoneNumbers || [];
    if (viewed.includes(carId)) return true;

    if (!user.isPremiumBuyer && viewed.length >= 10) {
      return false;
    }

    const newViewed = [...viewed, carId];
    await updateProfile({ viewedPhoneNumbers: newViewed });
    return true;
  };

  const trackChatStart = async (sellerId: string): Promise<boolean> => {
    if (!user) return false;

    const started = user.startedChats || [];
    if (started.includes(sellerId)) return true;

    if (!user.isPremiumBuyer && started.length >= 10) {
      return false;
    }

    const newStarted = [...started, sellerId];
    await updateProfile({ startedChats: newStarted });
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      logout, 
      updateProfile, 
      trackPhoneNumberView,
      trackChatStart,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
