import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import PixelButton from '../components/ui/PixelButton';
import PixelCard from '../components/ui/PixelCard';
import SupabaseAuthModal from '../components/ui/SupabaseAuthModal';
import SuggestionModal from '../components/ui/SuggestionModal';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { useToast } from '../context/ToastContext';
import { supabase } from '../services/supabase';
import {
  Download,
  Upload,
  Volume2,
  VolumeX,
  Music,
  User,
  Shield,
  Info,
  HelpCircle,
  Cloud,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  KeyRound,
  LogOut,
  LogIn,
  UserPlus,
  ExternalLink,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const {
    profile,
    setProfile,
    exportAllData,
    importAllData,
    user,
    isCloudConnected,
    replayTutorial,
    signOutUser,
  } = useJournal();
  const { showToast } = useToast();

  const [userName, setUserName] = useState(
    profile.name && profile.name !== 'Guest' && profile.name !== 'Explorer'
      ? profile.name
      : user?.user_metadata?.display_name || user?.user_metadata?.name || profile.name || 'Explorer'
  );
  const [soundEnabled, setSoundEnabled] = useState(soundFx.soundEnabled);
  const [volume, setVolume] = useState(soundFx.volume);
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  useEffect(() => {
    const currentName =
      (profile.name && profile.name !== 'Guest' && profile.name !== 'Explorer' ? profile.name : null) ||
      user?.user_metadata?.display_name ||
      user?.user_metadata?.name;
    if (currentName) {
      setUserName(currentName);
    }
  }, [profile.name, user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const trimmed = userName.trim() || 'Explorer';
    setProfile((p) => ({ ...p, name: trimmed }));

    if (user && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          name: trimmed,
          updated_at: new Date().toISOString(),
        });
        await supabase.auth.updateUser({
          data: { display_name: trimmed, name: trimmed },
        });
      } catch (err) {
        console.warn('Could not persist profile name to Supabase:', err);
      }
    }

    soundFx.setSoundEnabled(soundEnabled);
    soundFx.setVolume(volume);
    soundFx.play('save');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    showToast('Settings saved successfully.', 'success');
  };

  const handleSignOut = async () => {
    soundFx.play('click');
    await signOutUser();
    navigate('/login');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importAllData(content);
        if (ok) {
          e.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
              SYSTEM CONFIGURATION
            </span>
            <Shield size={14} className="text-[#f3df23]" />
          </div>
          <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
            Settings & Account Controls
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-sans mt-0.5">
            Configure player profile, sound synthesis, audio volume, cloud sync, and account security.
          </p>
        </div>

        {/* Account Controls Section */}
        <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/30 mb-3">
            <div className="flex items-center gap-2">
              <User size={18} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs text-white">Player Account & Cloud Identity</h3>
            </div>
            <span
              className={`font-sans text-xs px-2.5 py-0.5 border text-black font-semibold rounded-xs ${
                user
                  ? 'bg-[#50fa7b] border-[#50fa7b]'
                  : isCloudConnected
                  ? 'bg-[#f3df23] border-[#f3df23]'
                  : 'bg-stone-300 border-stone-400'
              }`}
            >
              {user ? 'Authenticated' : isCloudConnected ? 'Cloud Ready' : 'Offline Guest'}
            </span>
          </div>

          {user ? (
            <div className="flex flex-col gap-3 font-sans text-xs text-white/80">
              <div className="bg-[#131135] border border-black p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-white/50 uppercase font-pixel">Signed In As:</div>
                  <div className="text-sm font-bold text-white">{user.email}</div>
                  <div className="text-xs text-[#50fa7b] flex items-center gap-1 mt-0.5 font-medium">
                    <CheckCircle2 size={13} /> Row Level Security Active (Private Journal Database)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to="/forgot-password" onClick={() => soundFx.play('blip')}>
                    <PixelButton variant="purple" size="sm" icon={<KeyRound size={13} />}>
                      Reset Password
                    </PixelButton>
                  </Link>
                  <PixelButton variant="red" size="sm" icon={<LogOut size={13} />} onClick={handleSignOut}>
                    Sign Out
                  </PixelButton>
                </div>
              </div>

              <p className="leading-relaxed text-[11px] text-white/60">
                <strong className="text-white">Account Deletion Policy:</strong> To guarantee that diary entries and personal progress are not accidentally deleted by client requests, permanent account removal is managed via verified server-side requests. Submit a request via the Suggestion Box if you need your account data permanently wiped.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 font-sans text-xs text-white/80">
              <p className="leading-relaxed">
                You are currently journaling in guest mode. Create your own account to access your private diary across multiple devices and protect your entries with PostgreSQL Row Level Security.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <Link to="/login" onClick={() => soundFx.play('click')}>
                  <PixelButton variant="yellow" size="sm" icon={<LogIn size={14} />}>
                    Log In
                  </PixelButton>
                </Link>
                <Link to="/signup" onClick={() => soundFx.play('click')}>
                  <PixelButton variant="purple" size="sm" icon={<UserPlus size={14} />}>
                    Sign Up (New Account)
                  </PixelButton>
                </Link>
                <PixelButton
                  variant="dark"
                  size="sm"
                  icon={<RotateCcw size={14} />}
                  onClick={() => {
                    soundFx.play('blip');
                    replayTutorial();
                  }}
                >
                  Replay Tutorial
                </PixelButton>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Box Section */}
        <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/30 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#8be9fd]" />
              <h3 className="font-pixel text-xs text-white">Creator Suggestion Box</h3>
            </div>
            <span className="font-pixel text-[9px] bg-[#8be9fd] text-black px-2 py-0.5 border border-cyan-400 uppercase">
              Community Ideas
            </span>
          </div>

          <p className="text-xs font-sans text-white/80 leading-relaxed mb-4">
            Have an idea for a new feature, a retro stationery theme, or feedback on your journaling experience? Send your suggestions directly to the creator. Your thoughts help shape future updates!
          </p>

          <div className="flex flex-wrap gap-2.5">
            <PixelButton
              variant="yellow"
              size="sm"
              icon={<MessageSquare size={14} />}
              onClick={() => {
                soundFx.play('click');
                setIsSuggestionOpen(true);
              }}
            >
              Open Suggestion Box
            </PixelButton>

            <Link to="/suggestions" onClick={() => soundFx.play('blip')}>
              <PixelButton variant="dark" size="sm" icon={<ExternalLink size={14} />}>
                Dedicated Feedback Desk
              </PixelButton>
            </Link>
          </div>
        </div>

        {/* Player Profile & Sound Preferences Form */}
        <form onSubmit={handleProfileSave}>
          <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-black/30">
              <User size={16} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs text-white">Player Profile & Sound</h3>
            </div>

            {/* Name */}
            <div>
              <label className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                Player Name:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-black/40 border border-black/60 px-3 py-2 text-sm font-sans text-white focus:outline-none max-w-sm w-full rounded-xs"
                />
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-black/30">
              <div>
                <div className="font-sans text-sm font-medium text-white">Retro Sound FX</div>
                <div className="font-sans text-xs text-white/60">
                  Synthesized 8-bit sound effects on clicks, quests, and page turns.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  soundFx.setSoundEnabled(next);
                  soundFx.play('click');
                }}
                className={`px-3 py-1.5 font-sans text-xs border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] font-semibold ${
                  soundEnabled ? 'bg-[#50fa7b] text-black' : 'bg-red-400 text-black'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 font-sans text-xs">
                <span className="text-[#f3df23] font-medium">Audio Volume:</span>
                <span className="font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  soundFx.setVolume(val);
                  soundFx.play('blip');
                }}
                className="w-full cursor-pointer accent-[#f3df23]"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-sans text-xs text-[#50fa7b] font-medium">
                {isSaved ? 'Settings saved successfully.' : ''}
              </span>
              <PixelButton type="submit" variant="yellow" size="sm">
                Save Preferences
              </PixelButton>
            </div>
          </div>
        </form>

        {/* Data Persistence, Backup Export & Import */}
        <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-black/30 mb-3">
            <Download size={16} className="text-[#f3df23]" />
            <h3 className="font-pixel text-xs text-white">Data Backup & Restore</h3>
          </div>

          <div className="flex flex-col gap-4 font-sans text-xs">
            <p className="text-white/80 leading-relaxed">
              Export your journal reflections, completed quests, and time-capsule letters to a portable JSON backup file. You can restore this backup on any browser or device anytime.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <PixelButton
                variant="green"
                size="sm"
                icon={<Download size={14} />}
                onClick={exportAllData}
              >
                Export JSON Backup
              </PixelButton>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="bg-[#7b5ea7] hover:bg-[#8e6fc0] text-white border-2 border-black shadow-[3px_3px_0px_#000] font-sans font-medium text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 inline-block rounded-xs">
                  <Upload size={14} className="inline" /> Import JSON Backup
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-[#141238] border border-black/60 bg-[#131135] p-4 font-sans text-xs text-white/70 flex items-start gap-3 rounded-xs">
          <Info size={18} className="text-[#f3df23] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">Database Security Note:</span> DigiJournal’s Supabase integration enforces Row Level Security (RLS) directly at the PostgreSQL layer. A user cannot query, read, or modify another user’s reflections even with direct API requests.
          </div>
        </div>
      </main>

      {/* Unobtrusive Footer Link */}
      <footer className="w-full py-4 text-center border-t border-black/40 bg-[#16133b] text-white/60 font-sans text-xs z-10 mt-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>DigiJournal &copy; {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setIsSuggestionOpen(true);
              }}
              className="text-[#f3df23] hover:underline flex items-center gap-1 font-pixel text-[10px] cursor-pointer"
            >
              <MessageSquare size={12} /> Suggestion Box
            </button>
            <Link
              to="/suggestions"
              onClick={() => soundFx.play('blip')}
              className="text-white/60 hover:text-white hover:underline text-[11px]"
            >
              Feedback Desk
            </Link>
          </div>
        </div>
      </footer>

      <SupabaseAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SuggestionModal isOpen={isSuggestionOpen} onClose={() => setIsSuggestionOpen(false)} />
    </div>
  );
}
