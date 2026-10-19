import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import PixelStars from '../../components/ui/PixelStars';
import PixelButton from '../../components/ui/PixelButton';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  RotateCw,
} from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useJournal();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedUser, setConfirmedUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      if (!supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Supabase is not configured. Please check your environment configuration.');
        }
        return;
      }

      // 1. Check for errors in URL hash or search parameters
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
      const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

      const errorDescription =
        hashParams.get('error_description') ||
        params.get('error_description') ||
        hashParams.get('error') ||
        params.get('error');

      if (errorDescription) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(
            decodeURIComponent(errorDescription.replace(/\+/g, ' ')) ||
              'Your email confirmation link has expired or is invalid.'
          );
        }
        return;
      }

      // 2. Handle PKCE code exchange if present in query parameters
      const code = params.get('code');
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('PKCE exchange warning:', exchangeError);
          }
        } catch (err) {
          console.warn('Code exchange error:', err);
        }
      }

      // 3. Retrieve session (Supabase automatically parses hash tokens)
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(sessionError.message || 'Failed to establish verified session.');
          }
          return;
        }

        if (session && session.user) {
          const activeUser = session.user;
          const displayName =
            activeUser.user_metadata?.display_name ||
            activeUser.user_metadata?.name ||
            activeUser.email?.split('@')[0] ||
            'Adventurer';

          // 4. Ensure public.profiles record is created/synced for the verified user
          try {
            await supabase.from('profiles').upsert({
              id: activeUser.id,
              name: displayName,
              sound_enabled: true,
              volume: 0.5,
              updated_at: new Date().toISOString(),
            });
          } catch (profileErr) {
            console.warn('Could not sync verified profile:', profileErr);
          }

          if (isMounted) {
            setConfirmedUser(activeUser);
            setStatus('success');
            soundFx.play('complete');

            // Brief pause so user sees the success state before redirecting
            setTimeout(() => {
              if (isMounted) {
                navigate('/dashboard', { replace: true });
              }
            }, 1800);
          }
          return;
        }

        // If no session immediately, listen for onAuthStateChange event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (currentSession && currentSession.user && isMounted) {
              const activeUser = currentSession.user;
              const displayName =
                activeUser.user_metadata?.display_name ||
                activeUser.user_metadata?.name ||
                activeUser.email?.split('@')[0] ||
                'Adventurer';

              try {
                await supabase.from('profiles').upsert({
                  id: activeUser.id,
                  name: displayName,
                  sound_enabled: true,
                  volume: 0.5,
                  updated_at: new Date().toISOString(),
                });
              } catch (profileErr) {
                console.warn('Profile sync:', profileErr);
              }

              setConfirmedUser(activeUser);
              setStatus('success');
              soundFx.play('complete');
              setTimeout(() => {
                if (isMounted) {
                  navigate('/dashboard', { replace: true });
                }
              }, 1800);
            }
          }
        );

        // Timeout fallback if session isn't established within 6 seconds
        const timeout = setTimeout(() => {
          if (isMounted && status === 'verifying') {
            setStatus('error');
            setErrorMessage(
              'Verification took too long or session was not detected. Please try logging in.'
            );
          }
        }, 6000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'An unexpected error occurred during email verification.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col items-center justify-center p-4 relative select-none">
      <PixelStars />

      <main className="max-w-md w-full bg-[#1e1b4b] border-2 border-black shadow-[4px_4px_0px_#000] z-10 flex flex-col overflow-hidden my-auto">
        {/* Retro Header Bar */}
        <div className="bg-[#131135] px-4 py-2.5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff5555] border border-black" />
            <div className="w-3 h-3 bg-[#f1fa8c] border border-black" />
            <div className="w-3 h-3 bg-[#50fa7b] border border-black" />
            <span className="font-pixel text-[11px] text-[#f3df23] tracking-wide ml-1">
              DIGIJOURNAL // AUTH_VERIFY
            </span>
          </div>
          <Sparkles size={14} className="text-[#f3df23]" />
        </div>

        {/* Content Box */}
        <div className="p-6 flex flex-col items-center text-center gap-5">
          {status === 'verifying' && (
            <>
              <div className="w-14 h-14 bg-[#131135] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <RotateCw size={26} className="text-[#f3df23] animate-spin" />
              </div>
              <div>
                <h1 className="font-pixel text-base text-white mb-1.5 tracking-wide">
                  Verifying Account...
                </h1>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  Validating your confirmation token and establishing your private journal database.
                </p>
              </div>
              <div className="font-pixel text-[10px] text-[#50fa7b] tracking-widest uppercase animate-pulse">
                INITIALIZING SECURE SESSION...
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-14 h-14 bg-[#50fa7b] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <CheckCircle2 size={32} className="text-black" />
              </div>
              <div>
                <h1 className="font-pixel text-base text-white mb-1.5 tracking-wide">
                  Account Verified!
                </h1>
                <p className="font-sans text-xs text-white/80 leading-relaxed">
                  Welcome to DigiJournal
                  {confirmedUser?.user_metadata?.display_name
                    ? `, ${confirmedUser.user_metadata.display_name}`
                    : ''}!
                  Your email has been confirmed and cloud storage is activated.
                </p>
              </div>
              <div className="bg-[#131135] border border-black px-4 py-2 font-pixel text-[10px] text-[#f3df23] uppercase">
                REDIRECTING TO DASHBOARD...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-14 h-14 bg-red-950 border-2 border-red-500 flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <AlertCircle size={30} className="text-red-400" />
              </div>
              <div>
                <h1 className="font-pixel text-base text-white mb-1.5 tracking-wide">
                  Verification Issue
                </h1>
                <p className="font-sans text-xs text-red-200 leading-relaxed bg-red-950/70 p-3 border border-red-500/50 text-left">
                  {errorMessage || 'The confirmation link may have expired or was already used.'}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-full pt-1">
                <PixelButton
                  variant="yellow"
                  size="md"
                  onClick={() => {
                    soundFx.play('click');
                    navigate('/login');
                  }}
                  icon={<LogIn size={14} />}
                  className="w-full justify-center"
                >
                  Go to Log In
                </PixelButton>

                <PixelButton
                  variant="purple"
                  size="sm"
                  onClick={() => {
                    soundFx.play('blip');
                    navigate('/check-email');
                  }}
                  className="w-full justify-center"
                >
                  Resend Confirmation Link
                </PixelButton>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
