import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import { Mail, ArrowLeft, Sparkles, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useJournal();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter the email associated with your DigiJournal account.');
      return;
    }

    setLoading(true);
    soundFx.play('click');

    try {
      await resetPassword(email.trim());
      soundFx.play('complete');
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err.message || 'Unable to process password reset request. Please try again.'
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
              DIGIJOURNAL // RECOVERY
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col gap-5">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 bg-[#50fa7b] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <CheckCircle2 size={30} className="text-black" />
              </div>

              <h2 className="font-pixel text-base text-white mb-2">
                Recovery Link Dispatched!
              </h2>

              <p className="font-sans text-xs text-white/80 leading-relaxed mb-4">
                We sent password reset instructions to <strong className="text-[#f3df23]">{email}</strong>.
              </p>

              <div className="bg-[#131135] border border-black p-3.5 mb-5 text-left font-sans text-xs text-white/80 leading-relaxed">
                Click the recovery link in your email to safely establish your new password. The link will remain active for 24 hours.
              </div>

              <Link
                to="/login"
                onClick={() => soundFx.play('click')}
                className="w-full"
              >
                <PixelButton variant="yellow" size="md" className="w-full justify-center">
                  Return to Log In
                </PixelButton>
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="font-pixel text-lg text-white mb-1 tracking-wide">
                  Password Recovery
                </h1>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Enter your account email. We will send you a secure password reset link.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-red-950/80 border-2 border-red-500/80 p-3 flex items-start gap-2.5 text-xs font-sans text-red-200">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs">
                <div>
                  <label htmlFor="recovery-email" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                    Your Registered Email:
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="player@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border-2 border-black pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#f3df23] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <PixelButton
                    type="submit"
                    variant="yellow"
                    size="md"
                    disabled={loading}
                    icon={<KeyRound size={15} />}
                    className="w-full justify-center"
                  >
                    {loading ? 'Sending Link...' : 'Send Recovery Email'}
                  </PixelButton>
                </div>
              </form>

              <div className="pt-3 border-t border-black/40 text-center">
                <span className="font-sans text-xs text-white/60">
                  Remembered your password?{' '}
                  <Link
                    to="/login"
                    onClick={() => soundFx.play('blip')}
                    className="font-pixel text-[11px] text-[#f3df23] hover:underline ml-1"
                  >
                    Log In Here
                  </Link>
                </span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
