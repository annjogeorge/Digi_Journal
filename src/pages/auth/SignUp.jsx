import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUpWithPassword, user } = useJournal();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect directly to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Live Password policy validations
  const isLengthValid = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;
  const isPolicySatisfied = isLengthValid && hasLetter && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!displayName.trim()) {
      setErrorMessage('Please provide a display name for your journal profile.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isLengthValid) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!hasLetter || !hasNumber) {
      setErrorMessage('Password must include both letters and numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and try again.');
      return;
    }

    setLoading(true);
    soundFx.play('click');

    try {
      const res = await signUpWithPassword(email.trim(), password, displayName.trim());
      soundFx.play('complete');
      if (res?.emailConfirmationPending) {
        navigate('/check-email', {
          state: {
            email: email.trim(),
            displayName: displayName.trim(),
          },
        });
      } else {
        const dest = location.state?.redirectTo || '/dashboard';
        navigate(dest);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        setErrorMessage('This email is already registered. Please log in instead.');
      } else {
        setErrorMessage(msg || 'Failed to create account. Please try again.');
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
              DIGIJOURNAL // AUTH_SIGNUP
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <h1 className="font-pixel text-lg text-white mb-1 tracking-wide">
              Create Your Journal
            </h1>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Start your own personal digital book. All entries and data are private and secured by Row Level Security.
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
                {/* Display Name */}
                <div>
                  <label htmlFor="signup-name" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="e.g. Annjo"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black/50 border-2 border-black pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#f3df23] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="signup-email" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="signup-email"
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
                  <label htmlFor="signup-password" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="signup-confirm-password" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter password"
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

                {/* Password Policy Requirements Checklist */}
                <div className="bg-[#131135] border border-black/80 p-2.5 text-[11px] font-sans flex flex-col gap-1.5 text-white/70">
                  <span className="font-pixel text-[9px] text-white/90 uppercase mb-0.5">
                    Password Requirements:
                  </span>
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
                    disabled={loading || !isPolicySatisfied || !isMatch}
                    icon={<UserPlus size={15} />}
                    className="w-full justify-center"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up for DigiJournal'}
                  </PixelButton>
                </div>
              </form>

              {/* Footer Navigation */}
              <div className="pt-3 border-t border-black/40 text-center">
                <span className="font-sans text-xs text-white/60">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    onClick={() => soundFx.play('blip')}
                    className="font-pixel text-[11px] text-[#f3df23] hover:underline ml-1"
                  >
                    Log In Here
                  </Link>
                </span>
              </div>
        </div>
      </main>
    </div>
  );
}
