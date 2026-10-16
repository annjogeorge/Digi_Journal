import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJournal } from '../../context/JournalContext';
import { supabase } from '../../services/supabase';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updateUserPassword } = useJournal();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Check Supabase session on mount: when users click a password reset email link,
  // Supabase Auth stores an active recovery session in local storage or URL hash.
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      // If no session exists, the recovery link may be expired or already used
      if (!session) {
        // Also check if there is an error in URL hash
        const hash = window.location.hash;
        if (hash.includes('error=')) {
          setIsSessionActive(false);
          setErrorMessage('Password reset link is expired or invalid. Please request a new one.');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsSessionActive(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isLengthValid = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;
  const isPolicyValid = isLengthValid && hasLetter && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLengthValid) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!hasLetter || !hasNumber) {
      setErrorMessage('Password must contain both letters and numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    soundFx.play('click');

    try {
      await updateUserPassword(password);
      soundFx.play('complete');
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to update password. Your recovery link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col justify-center items-center p-4 relative select-none">
      <PixelStars />

      {/* Top Navigation Back Link */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/login"
          onClick={() => soundFx.play('blip')}
          className="inline-flex items-center gap-1.5 font-pixel text-xs text-white/80 hover:text-[#f3df23] bg-[#1a1744] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Log In
        </Link>
      </div>

      <main className="max-w-md w-full bg-[#1e1b4b] border-2 border-black shadow-[4px_4px_0px_#000] z-10 flex flex-col overflow-hidden">
        {/* Retro Header Bar */}
        <div className="bg-[#131135] px-4 py-2.5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff5555] border border-black" />
            <div className="w-3 h-3 bg-[#f1fa8c] border border-black" />
            <div className="w-3 h-3 bg-[#50fa7b] border border-black" />
            <span className="font-pixel text-[11px] text-[#f3df23] tracking-wide ml-1">
              DIGIJOURNAL // SET_PASSWORD
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-5">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 bg-[#50fa7b] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <ShieldCheck size={30} className="text-black" />
              </div>

              <h2 className="font-pixel text-base text-white mb-2">
                Password Successfully Reset!
              </h2>

              <p className="font-sans text-xs text-white/80 leading-relaxed mb-6">
                Your new security password has been saved. You can now use it to sign in on any device.
              </p>

              <PixelButton
                variant="yellow"
                size="md"
                onClick={() => {
                  soundFx.play('click');
                  navigate('/login');
                }}
                className="w-full justify-center"
              >
                Log In with New Password
              </PixelButton>
            </div>
          ) : !isSessionActive ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 bg-red-400 border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <AlertCircle size={30} className="text-black" />
              </div>

              <h2 className="font-pixel text-base text-white mb-2">
                Recovery Link Expired
              </h2>

              <p className="font-sans text-xs text-white/80 leading-relaxed mb-6">
                This password recovery link has either expired or already been utilized. Please request a fresh reset link.
              </p>

              <Link to="/forgot-password" className="w-full">
                <PixelButton variant="yellow" size="md" className="w-full justify-center">
                  Request New Reset Link
                </PixelButton>
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="font-pixel text-lg text-white mb-1 tracking-wide">
                  Set New Password
                </h1>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Enter your replacement password below to regain full access to your journal.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-red-950/80 border-2 border-red-500/80 p-3 flex items-start gap-2.5 text-xs font-sans text-red-200">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 font-sans text-xs">
                {/* New Password */}
                <div>
                  <label htmlFor="reset-new-password" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reset-confirm-password" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/50 border-2 border-black pl-9 pr-10 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#f3df23] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2 text-white/50 hover:text-white p-1"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-[#131135] border border-black/80 p-2.5 text-[11px] font-sans flex flex-col gap-1.5 text-white/70">
                  <div className="flex items-center gap-1.5">
                    {isLengthValid ? (
                      <CheckCircle2 size={13} className="text-[#50fa7b]" />
                    ) : (
                      <XCircle size={13} className="text-white/40" />
                    )}
                    <span className={isLengthValid ? 'text-[#50fa7b]' : ''}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasLetter && hasNumber ? (
                      <CheckCircle2 size={13} className="text-[#50fa7b]" />
                    ) : (
                      <XCircle size={13} className="text-white/40" />
                    )}
                    <span className={hasLetter && hasNumber ? 'text-[#50fa7b]' : ''}>
                      Contains both letters and numbers
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isMatch ? (
                      <CheckCircle2 size={13} className="text-[#50fa7b]" />
                    ) : (
                      <XCircle size={13} className="text-white/40" />
                    )}
                    <span className={isMatch ? 'text-[#50fa7b]' : ''}>
                      Passwords match
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <PixelButton
                    type="submit"
                    variant="yellow"
                    size="md"
                    disabled={loading || !isPolicyValid || !isMatch}
                    className="w-full justify-center"
                  >
                    {loading ? 'Updating...' : 'Save New Password'}
                  </PixelButton>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
