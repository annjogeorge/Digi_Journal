import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Sun,
  Zap,
  Meh,
  Heart,
  Coffee,
  ShieldAlert,
  Frown,
  ChevronDown,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const MOOD_CONFIGS = [
  { id: 'happy', label: 'Happy', icon: Smile, color: '#50fa7b', badgeBg: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'calm', label: 'Calm', icon: Sun, color: '#8be9fd', badgeBg: 'bg-cyan-500/20 text-cyan-300' },
  { id: 'excited', label: 'Excited', icon: Zap, color: '#f1fa8c', badgeBg: 'bg-yellow-500/20 text-yellow-300' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#bd93f9', badgeBg: 'bg-purple-500/20 text-purple-300' },
  { id: 'grateful', label: 'Grateful', icon: Heart, color: '#ff79c6', badgeBg: 'bg-pink-500/20 text-pink-300' },
  { id: 'tired', label: 'Tired', icon: Coffee, color: '#a29bfe', badgeBg: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'anxious', label: 'Anxious', icon: ShieldAlert, color: '#ffb86c', badgeBg: 'bg-amber-500/20 text-amber-300' },
  { id: 'sad', label: 'Sad', icon: Frown, color: '#ff7675', badgeBg: 'bg-rose-500/20 text-rose-300' },
];

export default function RetroMoodDropdown({ value = 'happy', onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);

  const activeMood = MOOD_CONFIGS.find((m) => m.id === value) || MOOD_CONFIGS[0];
  const ActiveIcon = activeMood.icon;

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const currentIdx = MOOD_CONFIGS.findIndex((m) => m.id === value);
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % MOOD_CONFIGS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + MOOD_CONFIGS.length) % MOOD_CONFIGS.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < MOOD_CONFIGS.length) {
        handleSelect(MOOD_CONFIGS[focusedIndex].id);
      }
    }
  };

  const handleSelect = (moodId) => {
    soundFx.play('blip');
    onChange(moodId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          soundFx.play('click');
          setIsOpen(!isOpen);
          const currentIdx = MOOD_CONFIGS.findIndex((m) => m.id === value);
          setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select mood. Current mood: ${activeMood.label}`}
        className="flex items-center gap-2 bg-[#25225c] hover:bg-[#343075] text-white border-2 border-black px-2.5 py-1 text-xs font-sans font-semibold cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all focus:outline-none focus:ring-1 focus:ring-[#f3df23]"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: activeMood.color }}
        />
        <ActiveIcon size={14} className="shrink-0" style={{ color: activeMood.color }} />
        <span className="capitalize">{activeMood.label}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 text-white/70 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Retro Listbox Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            role="listbox"
            tabIndex={-1}
            className="absolute right-0 sm:left-0 sm:right-auto mt-1 w-44 bg-[#1a1744] border-2 border-black shadow-[4px_4px_0px_#000] p-1.5 z-50 rounded-xs overflow-hidden"
          >
            <div className="font-pixel text-[9px] text-[#f3df23] uppercase tracking-wider px-2 py-1 border-b border-black/40 mb-1">
              Select Mood
            </div>

            <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
              {MOOD_CONFIGS.map((m, idx) => {
                const Icon = m.icon;
                const isSelected = m.id === value;
                const isFocused = idx === focusedIndex;

                return (
                  <button
                    key={m.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(m.id)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#f3df23] text-black font-bold shadow-[1px_1px_0px_#000]'
                        : isFocused
                        ? 'bg-[#2f2b6e] text-white'
                        : 'text-white/90 hover:bg-[#25225c]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={14}
                        className="shrink-0"
                        style={{ color: isSelected ? '#000' : m.color }}
                      />
                      <span>{m.label}</span>
                    </div>

                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isSelected ? '#000' : m.color }}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
