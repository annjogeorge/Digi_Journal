import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import {
  Mail,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendConfirmationEmail, user } = useJournal();

  // If already logged in with active session, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Retrieve email and displayName from navigation state or search params
  const searchParams = new URLSearchParams(location.search);
  const emailFromState = location.state?.email || searchParams.get('email') || '';
  const displayName = location.state?.displayName || searchParams.get('name') || '';

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Privacy-conscious email display (e.g., a***o@example.com)
  const getMaskedEmail = (raw) => {
    if (!raw || !raw.includes('@')) return raw || 'your email address';
    const [name, domain] = raw.split('@');
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-1);
    return `${visibleStart}${'*'.repeat(Math.max(2, name.length - 3))}${visibleEnd}@${domain}`;
  };

  const handleResend = async () => {
    if (!emailFromState) {
      setStatusMessage('Please enter your email on the login page to resend confirmation.');
      setResendStatus('error');
      return;
    }

    if (cooldown > 0 || resending) return;

    setResending(true);
    setStatusMessage('');
    soundFx.play('click');

    try {
      await resendConfirmationEmail(emailFromState);
      soundFx.play('complete');
      setResendStatus('success');
      setStatusMessage('A fresh confirmation link has been sent to your email.');
      setCooldown(60); // 60 second rate-limit cooldown
    } catch (err) {
      setResendStatus('error');
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('security purposes')) {
        setStatusMessage('Please wait a moment before requesting another confirmation email.');
        setCooldown(60);
      } else {
        setStatusMessage(msg || 'Failed to resend confirmation email. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col items-center justify-start p-4 py-8 relative select-none overflow-y-auto">
      <PixelStars />

      {/* Top Navigation Back Link */}
      <div className="w-full max-w-md flex justify-start mb-3 z-20 sm:absolute sm:top-4 sm:left-4 sm:mb-0 sm:w-auto">
        <Link
          to="/login"
          onClick={() => soundFx.play('blip')}
          className="inline-flex items-center gap-1.5 font-pixel text-xs text-white/80 hover:text-[#f3df23] bg-[#1a1744] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Log In
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
              DIGIJOURNAL // EMAIL_CONFIRMATION
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-5 text-center">
          {/* Animated Mail Icon */}
          <div className="relative mx-auto my-1">
            <div className="w-16 h-16 bg-[#131135] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <Mail size={32} className="text-[#f3df23] animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#50fa7b] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <CheckCircle2 size={14} className="text-black" />
            </div>
          </div>

          <div>
            <h1 className="font-pixel text-lg text-white mb-1.5 tracking-wide">
              Check Your Email!
            </h1>
            <p className="font-sans text-xs text-white/80 leading-relaxed">
              {displayName ? (
                <>Welcome, <strong className="text-[#f3df23]">{displayName}</strong>! </>
              ) : null}
              We have dispatched a verification link to confirm your new DigiJournal account.
            </p>
          </div>

          {/* Destination Email Box */}
          {emailFromState && (
            <div className="bg-[#131135] border-2 border-black p-3 flex flex-col items-center gap-1 shadow-[2px_2px_0px_#000]">
              <span className="font-pixel text-[9px] text-white/50 uppercase">
                Confirmation Sent To:
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#f3df23] font-bold tracking-wide break-all">
                {emailFromState}
              </span>
              <span className="font-sans text-[10px] text-white/60">
                (Masked: {getMaskedEmail(emailFromState)})
              </span>
            </div>
          )}

          {/* Status Alert if Resend attempted */}
          {statusMessage && (
            <div
              className={`p-3 border-2 flex items-start gap-2.5 text-xs font-sans text-left ${
                resendStatus === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                  : 'bg-red-950/80 border-red-500/80 text-red-200'
              }`}
            >
              {resendStatus === 'success' ? (
                <CheckCircle2 size={16} className="text-[#50fa7b] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Helpful Instructions */}
          <div className="bg-[#151238] border border-black/80 p-3.5 text-left font-sans text-xs text-white/80 flex flex-col gap-2">
            <div className="font-pixel text-[10px] text-[#8be9fd] flex items-center gap-1.5 uppercase">
              <HelpCircle size={13} />
              What to do next:
            </div>
            <ul className="text-[11px] text-white/70 space-y-1.5 pl-4 list-disc leading-relaxed">
              <li>Open your email inbox and look for a message from <strong>DigiJournal / Supabase</strong>.</li>
              <li>Click the <strong>Confirm your email</strong> link inside the message.</li>
              <li>You will automatically be redirected back and your journal session will activate.</li>
              <li>If you don&apos;t see the message, check your <strong>Spam or Junk folder</strong>.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <PixelButton
              variant="yellow"
              size="md"
              onClick={() => {
                soundFx.play('click');
                navigate('/login', { state: { email: emailFromState } });
              }}
              className="w-full justify-center"
            >
              Proceed to Log In
            </PixelButton>

            {emailFromState && (
              <PixelButton
                variant="purple"
                size="sm"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                icon={<RefreshCw size={13} className={resending ? 'animate-spin' : ''} />}
                className="w-full justify-center"
              >
                {resending
                  ? 'Sending Link...'
                  : cooldown > 0
                  ? `Resend Available in ${cooldown}s`
                  : 'Resend Confirmation Email'}
              </PixelButton>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-black/40 text-center">
            <span className="font-sans text-[11px] text-white/50">
              Need to change your email?{' '}
              <Link
                to="/signup"
                onClick={() => soundFx.play('blip')}
                className="text-[#f3df23] hover:underline ml-1 font-pixel text-[10px]"
              >
                Register with a different address
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
