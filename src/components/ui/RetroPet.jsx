import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/soundEffects';
import { useJournal } from '../../context/JournalContext';
import { Heart, Sparkles, Droplets, BookOpen, Smile } from 'lucide-react';

export default function RetroPet() {
  const { todos, entries } = useJournal();
  const [petClicks, setPetClicks] = useState(0);
  const [speech, setSpeech] = useState("Let's journal today!");

  const completedToday = todos.filter((t) => t.completed).length;
  const hasJournalToday = entries.some((e) => e.date === new Date().toISOString().split('T')[0]);

  const petExpressions = [
    { face: '(^_^)', state: 'Happy' },
    { face: '(*_*)', state: 'Loving' },
    { face: '(^o^)', state: 'Excited' },
    { face: '(^-^)', state: 'Proud' },
  ];

  const currentPet = petExpressions[petClicks % petExpressions.length];

  const interactPet = () => {
    soundFx.play('complete');
    setPetClicks((prev) => prev + 1);
    const phrases = [
      'You are making great progress!',
      'Remember to hydrate today.',
      'Reflect on one positive moment!',
      'Consistency unlocks peace of mind.',
      'Cozy reflections make the best memories.',
    ];
    setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
  };

  return (
    <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-3.5 text-center flex flex-col items-center select-none rounded-sm">
      <div className="flex items-center justify-between w-full mb-1 font-pixel text-[9px]">
        <span className="text-[#f3df23] uppercase flex items-center gap-1">
          <Sparkles size={11} /> Pocket Pet
        </span>
        <span className="text-white/60">
          Lv. {Math.max(1, Math.floor(completedToday + (hasJournalToday ? 2 : 0)))}
        </span>
      </div>

      {/* Speech bubble */}
      <div className="bg-white text-black font-sans text-xs px-2.5 py-1.5 rounded-xs border-2 border-black relative mb-2 shadow-[2px_2px_0px_#000] font-medium max-w-xs">
        {speech}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black" />
      </div>

      {/* Pet character */}
      <motion.button
        type="button"
        onClick={interactPet}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-16 h-16 bg-[#2c286e] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-pixel text-xs cursor-pointer hover:bg-[#3d3794] transition-colors rounded-xs"
        aria-label="Interact with pocket pet"
      >
        <span className="text-[#f4c2c2] font-bold">{currentPet.face}</span>
      </motion.button>

      <div className="mt-2 text-xs text-white/70 font-sans">
        Status: <span className="text-[#50fa7b] font-medium">{hasJournalToday ? 'Cozy & Reflected' : 'Awaiting Daily Journal'}</span>
      </div>
    </div>
  );
}
