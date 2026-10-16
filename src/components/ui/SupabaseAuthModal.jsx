import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import RetroWindow from './RetroWindow';
import PixelButton from './PixelButton';
import { LogIn, UserPlus, LogOut, ShieldCheck, Mail, Lock, User, Cloud } from 'lucide-react';

export default function SupabaseAuthModal({ isOpen, onClose }) {
  const { user, signInWithPassword, signUpWithPassword, signOutUser, isCloudConnected } = useJournal();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    soundFx.play('click');

    try {
      if (isSignUp) {
        await signUpWithPassword(email, password, name || 'Adventurer');
      } else {
        await signInWithPassword(email, password);
      }
      onClose();
    } catch {
      // Error is handled via showToast in JournalContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetroWindow
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Player Cloud Account' : isSignUp ? 'Sign Up for Cloud Sync' : 'Sign In to DigiJournal'}
      maxWidth="max-w-md"
    >
      {user ? (
        <div className="flex flex-col gap-4 text-center py-2">
          <div className="w-14 h-14 mx-auto bg-[#131135] border-2 border-black flex items-center justify-center">
            <ShieldCheck size={28} className="text-[#50fa7b]" />
          </div>

          <div>
            <h3 className="font-pixel text-sm text-white mb-1">Authenticated Account</h3>
            <p className="font-sans text-xs text-white/70">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 font-pixel text-[10px] text-[#50fa7b] bg-emerald-950/60 px-2.5 py-1 border border-emerald-500/40">
              <Cloud size={12} /> Supabase RLS Active
            </div>
          </div>

          <p className="font-sans text-xs text-white/60 leading-relaxed">
            Your journal entries, quests, and future letters are synchronized to your private cloud storage.
          </p>

          <div className="pt-2 flex justify-center">
            <PixelButton
              variant="red"
              size="sm"
              icon={<LogOut size={14} />}
              onClick={() => {
                signOutUser();
                onClose();
              }}
            >
              Sign Out
            </PixelButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-xs font-sans text-white/80 leading-relaxed mb-1">
            {isSignUp
              ? 'Create a private cloud account. Each user has their own private database space protected by Row Level Security.'
              : 'Sign in to access your saved journal entries, streaks, and future letters across all your devices.'}
          </div>

          {isSignUp && (
            <div>
              <label className="block font-pixel text-[10px] text-white/80 uppercase mb-1">
                Display Name:
              </label>
              <div className="relative">
                <User size={14} className="absolute left-2.5 top-2.5 text-white/40" />
                <input
                  type="text"
                  placeholder="e.g. Annjo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border-2 border-black pl-8 pr-3 py-1.5 text-xs text-white font-sans focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-2.5 top-2.5 text-white/40" />
              <input
                type="email"
                required
                placeholder="player@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border-2 border-black pl-8 pr-3 py-1.5 text-xs text-white font-sans focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-2.5 top-2.5 text-white/40" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border-2 border-black pl-8 pr-3 py-1.5 text-xs text-white font-sans focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <PixelButton
              type="submit"
              variant="yellow"
              size="sm"
              disabled={loading}
              icon={isSignUp ? <UserPlus size={14} /> : <LogIn size={14} />}
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </PixelButton>

            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setIsSignUp(!isSignUp);
              }}
              className="font-pixel text-[10px] text-white/70 hover:text-[#f3df23] underline text-center mt-2 cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>

            <div className="flex justify-between items-center text-[10px] text-white/60 pt-2 border-t border-black/30 mt-1">
              <Link
                to={isSignUp ? '/signup' : '/login'}
                onClick={() => {
                  onClose();
                  soundFx.play('blip');
                }}
                className="hover:text-[#f3df23] underline"
              >
                Open Full Auth Page
              </Link>
              {!isSignUp && (
                <Link
                  to="/forgot-password"
                  onClick={() => {
                    onClose();
                    soundFx.play('blip');
                  }}
                  className="hover:text-[#8be9fd] underline"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
          </div>
        </form>
      )}
    </RetroWindow>
  );
}
