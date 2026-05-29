import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle('buyer');
    if (success) {
      navigate('/dashboard/buyer');
    }
  };

  const handleDealerLogin = async () => {
    const success = await loginWithGoogle('dealer');
    if (success) {
      navigate('/dashboard/dealer');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-8 pb-0 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to your account</p>
        </div>

        <div className="p-8">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 border-2 border-slate-100 bg-white text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <Chrome className="h-6 w-6 text-blue-500" />
            Continue with Google
          </button>
        </div>

        <div className="p-6 bg-slate-50 text-center">
          <p className="text-xs text-slate-400 font-medium">
            By continuing, you agree to Benimcars <br />
            <span className="text-primary-500 underline cursor-pointer">Terms & Conditions</span>
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleDealerLogin}
        className="text-slate-400 hover:text-primary-500 font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        Login as a dealer
      </motion.button>
    </div>
  );
}
