import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, CheckSquare, Mail, BarChart3, Settings, Sparkles, ChevronRight, ChevronLeft, X, BookMarked, PenTool } from 'lucide-react';
import PixelButton from './PixelButton';
import { soundFx } from '../../utils/soundEffects';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to DigiJournal! ★',
    desc: 'DigiJournal is an interactive retro digital diary inspired by nostalgic personal diaries and handheld game consoles.',
    icon: <Sparkles size={28} className="text-[#f3df23]" />,
    section: 'Intro',
  },
  {
    title: 'Your Digital Book & Page Turns 📖',
    desc: 'Browse your diary like a real book. Turn pages using the on-screen buttons, click or tap the left/right page edges, or press your Left & Right arrow keys.',
    icon: <BookOpen size={28} className="text-[#8be9fd]" />,
    section: 'Digital Book',
  },
  {
    title: 'Searchable Book Index 📑',
    desc: 'Open the Book Index at any time to view your complete table of contents. Search by title or thoughts, filter by mood or favorites, and jump to any page in one click.',
    icon: <BookMarked size={28} className="text-[#f3df23]" />,
    section: 'Book Index',
  },
  {
    title: 'Handwriting Styles ✍️',
    desc: 'Choose between 3 distinct handwriting fonts: Cozy Script (soft & casual), Classic Journal (neat cursive), or Playful Notes. Switch styles anytime without altering your text.',
    icon: <PenTool size={28} className="text-[#50fa7b]" />,
    section: 'Handwriting',
  },
  {
    title: 'Retro Stickers & Decorate ✨',
    desc: 'Decorate your entries with curated retro stickers: gameboys, computers, CDs, stars, flowers, and washi tape. Drag to position, scale, rotate, or remove them easily.',
    icon: <Sparkles size={28} className="text-[#ff79c6]" />,
    section: 'Stickers',
  },
  {
    title: 'Mood Calendar & Quests 📅',
    desc: 'Record your mood with Lucide indicators and see your days color-coded on the Mood Calendar. Complete daily to-do quests and seal time-capsules for Future Me.',
    icon: <Calendar size={28} className="text-[#f4c2c2]" />,
    section: 'Calendar & Quests',
  },
  {
    title: 'Cloud Saving & Account Privacy 🔒',
    desc: 'Your entries autosave reliably. Link your Supabase account to sync across devices with strict Row Level Security—only you can read and manage your private entries.',
    icon: <Settings size={28} className="text-[#bd93f9]" />,
    section: 'Cloud & Privacy',
  },
];

export default function OnboardingTutorial({ isOpen, onClose, onFinish }) {
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    soundFx.play('blip');
    if (isLast) {
      onFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundFx.play('blip');
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    soundFx.play('click');
    onFinish();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          className="w-full max-w-lg bg-[#1e1b4b] border-4 border-black shadow-[8px_8px_0px_#000] p-6 relative overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Title Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/40">
            <span className="font-pixel text-[10px] text-[#f3df23] uppercase tracking-wider">
              GUIDED TUTORIAL • STEP {currentStep + 1} OF {TUTORIAL_STEPS.length}
            </span>
            <button
              onClick={handleSkip}
              className="font-pixel text-[10px] text-white/60 hover:text-white cursor-pointer px-1 py-0.5"
            >
              Skip
            </button>
          </div>

          {/* Step Presentation */}
          <div className="flex flex-col items-center text-center my-4">
            <div className="w-16 h-16 bg-[#131135] border-2 border-black/80 flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
              {step.icon}
            </div>

            <h2 className="font-pixel text-base sm:text-lg text-white mb-2">
              {step.title}
            </h2>

            <p className="font-sans text-sm text-white/80 max-w-md leading-relaxed">
              {step.desc}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 my-5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 border border-black ${
                  idx === currentStep ? 'bg-[#f3df23] scale-125' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-black/30">
            <PixelButton
              variant="dark"
              size="sm"
              disabled={isFirst}
              onClick={handlePrev}
              icon={<ChevronLeft size={14} />}
            >
              Back
            </PixelButton>

            <PixelButton
              variant={isLast ? 'green' : 'yellow'}
              size="sm"
              onClick={handleNext}
            >
              {isLast ? 'Start Journey!' : 'Next Step'}
            </PixelButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
