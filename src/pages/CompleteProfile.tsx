import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        setError('Both name and phone are required.');
        return;
    }
    if (!phone.startsWith('91') || phone.length !== 12) { // 91 + 10 digits
        setError('Phone number must start with 91 and have 10 digits.');
        return;
    }
    
    try {
        await updateProfile({ name, phone });
        navigate('/profile');
    } catch (err) {
        setError('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-4 bg-slate-50 border rounded-2xl"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input 
          className="w-full p-4 bg-slate-50 border rounded-2xl"
          placeholder="Phone (e.g. 91xxxxxxxxxx)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold">Save</button>
      </form>
    </div>
  );
}
