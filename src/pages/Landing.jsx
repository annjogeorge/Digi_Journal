import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PixelStars from '../components/ui/PixelStars';
import FloatingSprite from '../components/ui/FloatingSprite';
import SpinningDisc from '../components/ui/SpinningDisc';
import GetStartedButton from '../components/ui/GetStartedButton';
import AnimatedTitle from '../components/ui/AnimatedTitle';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/soundEffects';
import { BookOpen, Calendar, Mail, CheckSquare, Sparkles, LogIn, UserPlus, MessageSquare } from 'lucide-react';

export default function Landing({ onGetStarted }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    soundFx.play('click');
    setIsTransitioning(true);
    setTimeout(() => {
      if (onGetStarted) {
        onGetStarted();
      } else {
        navigate('/dashboard');
      }
    }, 400);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#242262] bg-grid overflow-hidden flex flex-col justify-between items-center text-white px-4 sm:px-6 select-none">
      <PixelStars />

      {/* Top Header Controls */}
      <header className="w-full max-w-6xl mx-auto pt-4 sm:pt-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#f3df23] border border-black flex items-center justify-center font-pixel text-[10px] text-black shadow-[2px_2px_0px_#000]">
            DJ
          </div>
          <span className="font-pixel text-xs text-white">DigiJournal</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            onClick={() => soundFx.play('click')}
            className="px-2.5 py-1 font-pixel text-[10px] bg-[#1a1744] hover:bg-[#2b276b] text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
          >
            <LogIn size={12} /> Log In
          </Link>
          <Link
            to="/signup"
            onClick={() => soundFx.play('click')}
            className="px-2.5 py-1 font-pixel text-[10px] bg-[#f3df23] hover:bg-[#ffe83d] text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-transform active:translate-y-0.5"
          >
            <UserPlus size={12} /> Sign Up
          </Link>
        </div>
      </header>

      {/* Floating Decorative Objects */}
      <FloatingSprite
        src={IMAGES.computer}
        alt="Retro computer"
        className="absolute top-6 left-4 sm:top-10 sm:left-10 md:top-14 md:left-14 w-20 sm:w-28 md:w-36 lg:w-44 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer"
        onClick={() => soundFx.play('blip')}
      />

      <FloatingSprite
        src={IMAGES.phone}
        alt="Retro flip phone"
        className="absolute top-6 right-4 sm:top-10 sm:right-10 md:top-14 md:right-16 w-16 sm:w-22 md:w-28 lg:w-32 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer"
        delay={0.6}
        onClick={() => soundFx.play('blip')}
      />

      <FloatingSprite
        src={IMAGES.controller}
        alt="Game controller"
        className="absolute bottom-6 left-4 sm:bottom-10 sm:left-10 md:bottom-14 md:left-16 w-18 sm:w-24 md:w-32 lg:w-36 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer"
        delay={1.2}
        onClick={() => soundFx.play('blip')}
      />

      <SpinningDisc
        src={IMAGES.cd}
        alt="Spinning CD"
        className="absolute bottom-8 right-4 sm:bottom-12 sm:right-10 md:bottom-16 md:right-20 w-18 sm:w-24 md:w-32 lg:w-36 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer"
      />

      {/* Subtle Sparkles */}
      <img
        src={IMAGES.sparks}
        alt="Sparkles"
        className="absolute top-1/4 right-1/4 w-10 md:w-16 opacity-60 pointer-events-none animate-pulse"
      />
      <img
        src={IMAGES.sparks}
        alt="Sparkles"
        className="absolute bottom-1/4 left-1/4 w-8 md:w-14 opacity-50 pointer-events-none animate-pulse"
        style={{ animationDelay: '1.2s' }}
      />

      {/* Hero Typography & CTA */}
      <div className="flex flex-col items-center justify-center z-10 text-center max-w-4xl w-full mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-3"
        >
          <Sparkles size={14} className="text-[#f3df23]" />
          <p className="font-pixel text-[10px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-[#f3df23] drop-shadow-sm">
            INTRODUCING
          </p>
          <Sparkles size={14} className="text-[#f3df23]" />
        </motion.div>

        {/* Responsive Logo Container ensuring DigiJournal never wraps across lines */}
        <div className="w-full flex justify-center items-center overflow-visible mb-6">
          <AnimatedTitle
            text="DigiJournal"
            className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-sans text-sm sm:text-base md:text-lg max-w-xl mb-8 text-white/90 font-normal leading-relaxed"
        >
          Your nostalgic digital diary: cozy reflections, daily quests, and time-capsule letters.
        </motion.p>

        <div className="mt-1 transition-transform duration-200">
          <GetStartedButton onClick={handleStart} />
        </div>

        {/* Feature quick badges with consistent Lucide icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-wrap justify-center gap-2.5 font-sans text-xs sm:text-sm text-white/85"
        >
          <span className="border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5 flex items-center gap-2 rounded-sm">
            <BookOpen size={14} className="text-[#f3df23]" /> Flip-Book Journal
          </span>
          <span className="border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5 flex items-center gap-2 rounded-sm">
            <Calendar size={14} className="text-[#50fa7b]" /> Mood Calendar
          </span>
          <span className="border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5 flex items-center gap-2 rounded-sm">
            <Mail size={14} className="text-[#f4c2c2]" /> Future Letters
          </span>
          <span className="border-2 border-black shadow-[2px_2px_0px_#000] px-3 py-1.5 flex items-center gap-2 rounded-sm">
            <CheckSquare size={14} className="text-[#8be9fd]" /> Daily Quests
          </span>
        </motion.div>
      </div>

      {/* Unobtrusive Landing Footer */}
      <footer className="w-full max-w-4xl mx-auto pb-4 pt-6 px-4 flex flex-wrap justify-between items-center text-xs text-white/50 z-10 font-sans border-t border-black/20 mt-4">
        <span>DigiJournal &copy; {new Date().getFullYear()} • Nostalgic Digital Diary</span>
        <div className="flex items-center gap-4">
          <Link
            to="/suggestions"
            onClick={() => soundFx.play('blip')}
            className="text-[#f3df23] hover:underline flex items-center gap-1 font-pixel text-[10px]"
          >
            <MessageSquare size={12} /> Suggestion Box
          </Link>
          <Link
            to="/login"
            onClick={() => soundFx.play('blip')}
            className="hover:text-white/80 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => soundFx.play('blip')}
            className="hover:text-white/80 transition-colors"
          >
            Sign Up
          </Link>
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
            LOADING GAME...
          </div>
        </motion.div>
      )}
    </section>
  );
}