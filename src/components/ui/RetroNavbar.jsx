import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { soundFx } from '../../utils/soundEffects';
import { useJournal } from '../../context/JournalContext';
import SupabaseAuthModal from './SupabaseAuthModal';
import SuggestionModal from './SuggestionModal';
import {
  Volume2,
  VolumeX,
  Music,
  BookOpen,
  CheckSquare,
  Mail,
  BarChart3,
  Settings as SettingsIcon,
  Home,
  Cloud,
  CloudOff,
  User,
  MessageSquare,
} from 'lucide-react';

export default function RetroNavbar() {
  const navigate = useNavigate();
  const { currentLevel, xpInCurrentLevel, profile, setProfile, user, isCloudConnected } = useJournal();
  const [soundOn, setSoundOn] = useState(soundFx.soundEnabled);
  const [bgmActive, setBgmActive] = useState(soundFx.musicPlaying);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundFx.setSoundEnabled(next);
    setProfile((p) => ({ ...p, soundEnabled: next }));
  };

  const toggleBgm = () => {
    const active = soundFx.toggleBgm();
    setBgmActive(active);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={14} /> },
    { to: '/journal', label: 'Journal', icon: <BookOpen size={14} /> },
    { to: '/todo', label: 'Tasks', icon: <CheckSquare size={14} /> },
    { to: '/future-me', label: 'Letters', icon: <Mail size={14} /> },
    { to: '/stats', label: 'Stats', icon: <BarChart3 size={14} /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon size={14} /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#1b1847]/95 backdrop-blur border-b-3 border-black px-4 py-2 shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => {
              soundFx.play('click');
              navigate('/');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 bg-[#f3df23] border-2 border-black flex items-center justify-center font-pixel text-xs text-black shadow-[2px_2px_0px_#000] group-hover:translate-y-0.5 transition-transform">
              DJ
            </div>
            <div className="flex items-center">
              <span className="font-pixel text-xs sm:text-sm tracking-normal text-white">
                DigiJournal
              </span>
            </div>
          </div>

          {/* Navigation links for Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 font-sans font-medium text-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => soundFx.play('blip')}
                className={({ isActive }) =>
                  `px-3 py-1.5 flex items-center gap-1.5 rounded-sm border transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#f3df23] text-black font-semibold border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                      : 'text-white/80 hover:text-white border-transparent hover:border-black/50 hover:bg-white/10'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Level Pill */}
            <div
              onClick={() => {
                soundFx.play('blip');
                navigate('/stats');
              }}
              className="hidden sm:flex items-center gap-2 border border-black/60 bg-[#131135] px-2.5 py-1 text-[11px] font-pixel cursor-pointer hover:bg-white/5 transition-colors"
              title={`Level ${currentLevel} • ${xpInCurrentLevel}/100 XP`}
            >
              <span className="text-[#f3df23]">LV.{currentLevel}</span>
              <div className="w-12 bg-black/60 h-2 border border-black/50 overflow-hidden rounded-xs">
                <div
                  className="bg-[#50fa7b] h-full transition-all duration-300"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
            </div>

            {/* Supabase Cloud Status / Auth Trigger */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setIsAuthOpen(true);
              }}
              title={
                user
                  ? `Signed in as ${user.email} (Cloud Sync Active)`
                  : isCloudConnected
                  ? 'Sign in to enable Supabase Cloud Sync'
                  : 'Supabase configuration pending (Offline mode)'
              }
              className={`p-1.5 border-2 border-black flex items-center gap-1 text-[11px] font-sans font-medium cursor-pointer transition-transform active:translate-y-0.5 shadow-[2px_2px_0px_#000] ${
                user
                  ? 'bg-[#50fa7b] text-black'
                  : 'bg-[#1e1b4b] text-white/90 hover:bg-[#2b276b]'
              }`}
            >
              {user ? (
                <>
                  <Cloud size={14} />
                  <span className="hidden lg:inline text-[10px]">Cloud Active</span>
                </>
              ) : (
                <>
                  <User size={14} />
                  <span className="hidden lg:inline text-[10px]">Cloud Sync</span>
                </>
              )}
            </button>

            {/* Suggestion Box Quick Trigger */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setIsSuggestionOpen(true);
              }}
              title="Suggestion Box (Send feedback or feature ideas to the creator)"
              className="p-1.5 border-2 border-black bg-[#1e1b4b] text-[#8be9fd] hover:text-white hover:bg-[#2b276b] shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <MessageSquare size={14} />
              <span className="hidden xl:inline text-[10px]">Ideas</span>
            </button>

            {/* Retro Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundOn ? 'Sound FX Enabled (Click to mute)' : 'Sound FX Muted'}
              className={`p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer ${
                soundOn ? 'bg-[#f3df23] text-black' : 'bg-red-400 text-black'
              }`}
            >
              {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Retro BGM Toggle */}
            <button
              type="button"
              onClick={toggleBgm}
              title={bgmActive ? 'Stop 8-Bit BGM Music' : 'Play 8-Bit BGM Music'}
              className={`p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer ${
                bgmActive ? 'bg-[#50fa7b] text-black animate-pulse' : 'bg-[#3b3378] text-white hover:bg-[#4d4496]'
              }`}
            >
              <Music size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="flex md:hidden justify-around items-center pt-2 mt-2 border-t border-black/40 font-sans text-xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => soundFx.play('blip')}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded ${
                  isActive ? 'text-[#f3df23] font-semibold' : 'text-white/70'
                }`
              }
            >
              {link.icon}
              <span className="mt-0.5 text-[10px]">{link.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => {
              soundFx.play('blip');
              setIsSuggestionOpen(true);
            }}
            className="flex flex-col items-center py-1 px-2 rounded text-[#8be9fd]"
          >
            <MessageSquare size={14} />
            <span className="mt-0.5 text-[10px]">Ideas</span>
          </button>
        </nav>
      </header>

      <SupabaseAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SuggestionModal isOpen={isSuggestionOpen} onClose={() => setIsSuggestionOpen(false)} />
    </>
  );
}
