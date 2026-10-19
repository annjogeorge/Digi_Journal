import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithPassword, user } = useJournal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, offer quick jump to journal/dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-[#242262] bg-grid flex items-center justify-center p-4 relative select-none">
        <PixelStars />
        <div className="max-w-md w-full bg-[#1e1b4b] border-2 border-black shadow-[4px_4px_0px_#000] p-6 text-center z-10 text-white">
          <div className="w-12 h-12 bg-[#50fa7b] border-2 border-black mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
            <LogIn size={24} className="text-black" />
          </div>
          <h2 className="font-pixel text-base text-white mb-2">Already Logged In</h2>
          <p className="font-sans text-xs text-white/80 mb-6">
            You are currently signed in as <strong className="text-[#f3df23]">{user.email}</strong>.
          </p>
          <div className="flex flex-col gap-2.5">
            <PixelButton
              variant="yellow"
              size="md"
              onClick={() => {
                soundFx.play('click');
                navigate('/dashboard');
              }}
            >
              Go to Dashboard
            </PixelButton>
            <PixelButton
              variant="purple"
              size="sm"
              onClick={() => {
                soundFx.play('blip');
                navigate('/journal');
              }}
            >
              Open Digital Journal
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    soundFx.play('click');

    try {
      await signInWithPassword(email, password);
      soundFx.play('complete');
      navigate('/dashboard');
    } catch (err) {
      // Format friendly error messages
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Incorrect email or password. Please verify your details.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMessage('Please check your inbox and verify your email before logging in.');
      } else {
        setErrorMessage(msg || 'An error occurred during log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col items-center justify-start p-4 py-8 relative select-none overflow-y-auto">
      <PixelStars />

      {/* Top Navigation Back Link */}
      <div className="w-full max-w-md flex justify-start mb-3 z-20 sm:absolute sm:top-4 sm:left-4 sm:mb-0 sm:w-auto">
        <Link
          to="/"
          onClick={() => soundFx.play('blip')}
          className="inline-flex items-center gap-1.5 font-pixel text-xs text-white/80 hover:text-[#f3df23] bg-[#1a1744] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
        >
          <ArrowLeft size={14} /> Back Home
        </Link>
      </div>

      <main className="max-w-md w-full bg-[#1e1b4b] border-2 border-black shadow-[4px_4px_0px_#000] z-10 flex flex-col overflow-hidden my-auto">
        {/* Retro Header Bar */}
        <div className="bg-[#131135] px-4 py-2.5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff5555] border border-black" />
            <div className="w-3 h-3 bg-[#f1fa8c] border border-black" />
            <div className="w-3 h-3 bg-[#50fa7b] border border-black" />
            <span className="font-pixel text-[11px] text-[#f3df23] tracking-wide ml-1">
              DIGIJOURNAL // AUTH_LOGIN
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <h1 className="font-pixel text-lg text-white mb-1 tracking-wide">
              Welcome Back
            </h1>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Sign in to unlock your private digital diary, complete daily quests, and revisit memory pages.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-950/80 border-2 border-red-500/80 p-3 flex items-start gap-2.5 text-xs font-sans text-red-200">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-white/40" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border-2 border-black pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#f3df23] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="font-pixel text-[10px] text-[#f3df23] uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  onClick={() => soundFx.play('blip')}
                  className="font-pixel text-[9px] text-[#8be9fd] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-white/40" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border-2 border-black pl-9 pr-10 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#f3df23] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-white/50 hover:text-white p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PixelButton
                type="submit"
                variant="yellow"
                size="md"
                disabled={loading}
                icon={<LogIn size={15} />}
                className="w-full justify-center"
              >
                {loading ? 'Authenticating...' : 'Log In to DigiJournal'}
              </PixelButton>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="pt-3 border-t border-black/40 flex flex-col items-center gap-2 text-center">
            <span className="font-sans text-xs text-white/60">
              New to DigiJournal?{' '}
              <Link
                to="/signup"
                onClick={() => soundFx.play('blip')}
                className="font-pixel text-[11px] text-[#50fa7b] hover:underline ml-1"
              >
                Create Account
              </Link>
            </span>
            <Link
              to="/dashboard"
              onClick={() => soundFx.play('blip')}
              className="text-[11px] text-white/40 hover:text-white/70 underline mt-1 font-sans"
            >
              Continue in Guest Mode (Offline)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
