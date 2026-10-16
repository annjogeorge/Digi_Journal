import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PixelStars from '../components/ui/PixelStars';
import FloatingSprite from '../components/ui/FloatingSprite';
import SpinningDisc from '../components/ui/SpinningDisc';
import PixelButton from '../components/ui/PixelButton';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/soundEffects';
import {
  BookOpen,
  Calendar,
  Mail,
  CheckSquare,
  Sparkles,
  LogIn,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
  Eye,
} from 'lucide-react';

export default function Landing({ onGetStarted }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartExplore = () => {
    soundFx.play('click');
    setIsTransitioning(true);
    setTimeout(() => {
      if (onGetStarted) {
        onGetStarted();
      } else {
        navigate('/journal');
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#242262] bg-grid overflow-x-hidden flex flex-col justify-between text-white select-none">
      <PixelStars />

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto pt-4 sm:pt-6 px-4 sm:px-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#f3df23] border-2 border-black flex items-center justify-center font-pixel text-xs text-black shadow-[2px_2px_0px_#000]">
            DJ
          </div>
          <span className="font-pixel text-xs sm:text-sm text-white tracking-wide">
            DigiJournal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            onClick={() => soundFx.play('click')}
            className="px-3 py-1.5 font-pixel text-[10px] sm:text-xs bg-[#1a1744] hover:bg-[#2b276b] text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
          >
            <LogIn size={13} /> Log In
          </Link>
          <Link
            to="/signup"
            onClick={() => soundFx.play('click')}
            className="px-3 py-1.5 font-pixel text-[10px] sm:text-xs bg-[#f3df23] hover:bg-[#ffe83d] text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-y-0.5 font-bold"
          >
            <UserPlus size={13} /> Sign Up
          </Link>
        </div>
      </header>

      {/* Floating Decorative Objects */}
      <FloatingSprite
        src={IMAGES.computer}
        alt="Retro computer"
        className="absolute top-16 left-3 sm:left-8 md:left-14 w-16 sm:w-24 md:w-32 opacity-70 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer hidden sm:block"
        onClick={() => soundFx.play('blip')}
      />

      <FloatingSprite
        src={IMAGES.phone}
        alt="Retro flip phone"
        className="absolute top-16 right-3 sm:right-8 md:right-14 w-14 sm:w-20 md:w-28 opacity-70 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer hidden sm:block"
        delay={0.6}
        onClick={() => soundFx.play('blip')}
      />

      <FloatingSprite
        src={IMAGES.controller}
        alt="Game controller"
        className="absolute bottom-24 left-3 sm:left-8 md:left-12 w-16 sm:w-24 opacity-60 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer hidden lg:block"
        delay={1.2}
        onClick={() => soundFx.play('blip')}
      />

      <SpinningDisc
        src={IMAGES.cd}
        alt="Spinning CD"
        className="absolute bottom-24 right-3 sm:right-8 md:right-16 w-16 sm:w-24 opacity-60 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer hidden lg:block"
      />

      {/* Main Hero & Content Section */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Intro Sparkle Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-3"
        >
          <Sparkles size={14} className="text-[#f3df23]" />
          <p className="font-pixel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#f3df23] drop-shadow-sm">
            THE RETRO DIGITAL DIARY
          </p>
          <Sparkles size={14} className="text-[#f3df23]" />
        </motion.div>

        {/* Title */}
        <div className="w-full flex justify-center items-center overflow-visible mb-4">
          <AnimatedTitle
            text="DigiJournal"
            className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white tracking-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-sans text-sm sm:text-base md:text-lg max-w-xl text-center mb-6 text-white/90 font-normal leading-relaxed"
        >
          A nostalgic, cozy digital book inspired by early 2000s stationery, handheld gaming, daily quests, and secret time-capsules.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          <PixelButton
            variant="yellow"
            size="lg"
            icon={<BookOpen size={18} />}
            onClick={handleStartExplore}
          >
            Start Exploring (Free Preview)
          </PixelButton>

          <Link to="/signup" onClick={() => soundFx.play('click')}>
            <PixelButton variant="purple" size="lg" icon={<UserPlus size={16} />}>
              Create Free Account
            </PixelButton>
          </Link>
        </motion.div>

        {/* Visual Notebook / Journal Interactive Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-2xl bg-[#1a1744] border-3 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-6 mb-10 relative overflow-hidden"
        >
          {/* Header strip */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ff5555] border border-black inline-block" />
              <span className="w-2.5 h-2.5 bg-[#f1fa8c] border border-black inline-block" />
              <span className="w-2.5 h-2.5 bg-[#50fa7b] border border-black inline-block" />
              <span className="font-pixel text-[10px] text-[#f3df23] ml-1">
                NOTEBOOK_PREVIEW.DAT
              </span>
            </div>
            <span className="font-pixel text-[9px] bg-[#50fa7b] text-black px-2 py-0.5 border border-black font-bold uppercase">
              Free Live Preview
            </span>
          </div>

          {/* Realistic Notebook Page Representation */}
          <div
            onClick={handleStartExplore}
            className="cursor-pointer group bg-[#fffdf0] border-2 border-black p-4 sm:p-6 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] relative min-h-[170px] sm:min-h-[200px] flex flex-col justify-between"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e5d8 28px)',
              backgroundAttachment: 'local',
            }}
          >
            {/* Red Vertical Margin Line */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-[1.5px] bg-[#ff7979] pointer-events-none" />

            {/* Binder Holes */}
            <div className="absolute top-4 left-2.5 sm:left-4 w-2.5 h-2.5 rounded-full bg-[#1a1744] border border-black/50" />
            <div className="absolute top-1/2 -translate-y-1/2 left-2.5 sm:left-4 w-2.5 h-2.5 rounded-full bg-[#1a1744] border border-black/50" />
            <div className="absolute bottom-4 left-2.5 sm:left-4 w-2.5 h-2.5 rounded-full bg-[#1a1744] border border-black/50" />

            {/* Page Content */}
            <div className="pl-8 sm:pl-12 text-black">
              <div className="flex justify-between items-center mb-2">
                <span className="font-pixel text-[11px] text-[#242262]">
                  October 17 • Cozy Morning
                </span>
                <span className="inline-flex items-center gap-1 bg-[#242262] text-[#f3df23] font-pixel text-[9px] px-2 py-0.5 border border-black">
                  <Heart size={10} className="fill-[#f3df23]" /> Mood: Grateful
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold italic text-black/90 mb-1 leading-snug">
                The Quiet Corner of My Mind
              </h3>
              <p className="font-serif text-sm sm:text-base italic text-black/80 leading-[28px]">
                I opened my digital diary today. The pages turn like paper, the stickers stick where I want, and everything stays safe...
              </p>
            </div>

            {/* Bottom preview banner */}
            <div className="pl-8 sm:pl-12 pt-2 flex items-center justify-between text-xs text-black/70 font-sans border-t border-black/10">
              <span className="flex items-center gap-1.5 font-medium text-[#242262]">
                <Eye size={13} /> Click notebook to explore live flip-book →
              </span>
              <span className="font-pixel text-[9px] text-black/50">PAGE 1 / 1</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1b1847] border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
            <BookOpen size={20} className="text-[#f3df23] mb-2" />
            <h4 className="font-pixel text-xs text-white mb-1">Flip-Book Journal</h4>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Real book page-turn animations, authentic handwriting styles, stickers, and table of contents.
            </p>
          </div>

          <div className="bg-[#1b1847] border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
            <CheckSquare size={20} className="text-[#50fa7b] mb-2" />
            <h4 className="font-pixel text-xs text-white mb-1">Daily Tasks & Quests</h4>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Check off your daily quests, earn XP points, and level up your player profile every single day.
            </p>
          </div>

          <div className="bg-[#1b1847] border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
            <Mail size={20} className="text-[#ff79c6] mb-2" />
            <h4 className="font-pixel text-xs text-white mb-1">Future Me Letters</h4>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Write sealed digital time-capsule letters to your future self that lock until your chosen unlock date.
            </p>
          </div>

          <div className="bg-[#1b1847] border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
            <Calendar size={20} className="text-[#8be9fd] mb-2" />
            <h4 className="font-pixel text-xs text-white mb-1">Mood Calendar & Stats</h4>
            <p className="font-sans text-xs text-white/70 leading-relaxed">
              Visualize your emotional rhythm, streak counters, writing heatmaps, and unlockable badges.
            </p>
          </div>
        </div>

        {/* Security & Cloud Note Banner */}
        <div className="w-full bg-[#141238] border border-black/80 p-3.5 sm:p-4 text-xs font-sans text-white/80 flex items-start gap-3 rounded-xs mb-4">
          <ShieldCheck size={20} className="text-[#50fa7b] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Privacy Assurance:</strong> DigiJournal uses Supabase PostgreSQL Row Level Security (RLS). You can explore in preview mode anytime, but an account is needed to save, encrypt, and sync your private reflections across devices.
          </div>
        </div>
      </main>

      {/* Responsive Footer */}
      <footer className="w-full border-t border-black/40 bg-[#16133b] text-white/60 font-sans text-xs z-10 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#f3df23] border border-black flex items-center justify-center font-pixel text-[9px] text-black">
              DJ
            </div>
            <span>DigiJournal &copy; {new Date().getFullYear()} • Nostalgic Digital Diary</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleStartExplore}
              className="text-[#f3df23] hover:underline font-pixel text-[10px] cursor-pointer"
            >
              Explore Journal
            </button>
            <Link
              to="/login"
              onClick={() => soundFx.play('blip')}
              className="hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => soundFx.play('blip')}
              className="hover:text-white transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/suggestions"
              onClick={() => soundFx.play('blip')}
              className="text-[#8be9fd] hover:underline flex items-center gap-1 font-pixel text-[10px]"
            >
              <MessageSquare size={12} /> Suggestion Box
            </Link>
            <Link
              to="/settings"
              onClick={() => soundFx.play('blip')}
              className="hover:text-white transition-colors"
            >
              Settings & Privacy
            </Link>
          </div>
        </div>
      </footer>

      {/* Screen Pixel Wipe Transition */}
      {isTransitioning && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#141238] origin-bottom flex items-center justify-center"
        >
          <div className="font-pixel text-lg sm:text-xl text-[#f3df23] animate-pulse">
            LOADING PREVIEW...
          </div>
        </motion.div>
      )}
    </div>
  );
}