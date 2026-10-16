import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/soundEffects';
import { Smile, Sun, Zap, Meh, Heart, Coffee, ShieldAlert, Frown } from 'lucide-react';

export const MOODS = [
  { id: 'happy', label: 'Happy', icon: Smile, color: '#50fa7b', tagBg: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'calm', label: 'Calm', icon: Sun, color: '#8be9fd', tagBg: 'bg-cyan-500/20 text-cyan-300' },
  { id: 'excited', label: 'Excited', icon: Zap, color: '#f1fa8c', tagBg: 'bg-yellow-500/20 text-yellow-300' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#bd93f9', tagBg: 'bg-purple-500/20 text-purple-300' },
  { id: 'grateful', label: 'Grateful', icon: Heart, color: '#ff79c6', tagBg: 'bg-pink-500/20 text-pink-300' },
  { id: 'tired', label: 'Tired', icon: Coffee, color: '#6272a4', tagBg: 'bg-slate-500/20 text-slate-300' },
  { id: 'anxious', label: 'Anxious', icon: ShieldAlert, color: '#ffb86c', tagBg: 'bg-amber-500/20 text-amber-300' },
  { id: 'sad', label: 'Sad', icon: Frown, color: '#ff5555', tagBg: 'bg-rose-500/20 text-rose-300' },
];

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="w-full">
      <label className="block font-pixel text-[11px] uppercase tracking-wider text-white/80 mb-2">
        Today's Mood:
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.id;
          const IconComponent = m.icon;

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFx.play('blip');
                onSelect(m.id);
              }}
              className={`flex flex-col items-center justify-center p-2.5 rounded-sm border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#f3df23] text-black border-black shadow-[3px_3px_0px_#000] font-bold'
                  : 'bg-[#1e1c50] text-white/90 border-black/60 hover:border-black hover:bg-[#2e2b70] shadow-[2px_2px_0px_#000]'
              }`}
            >
              <IconComponent size={20} className="mb-1.5" />
              <span className="font-sans text-[11px] font-medium leading-tight text-center">{m.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
