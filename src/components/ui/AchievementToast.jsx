import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../../context/JournalContext';

export default function AchievementToast() {
  const { activeToast } = useJournal();

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#f3df23] text-black font-pixel px-4 py-3 border-4 border-black shadow-[6px_6px_0px_#000000]"
        >
          {activeToast.icon ? (
            <span className="text-2xl">{activeToast.icon}</span>
          ) : (
            <span className="text-xl">✨</span>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-black/75">
              {activeToast.type === 'achievement' ? '★ Achievement Unlocked!' : 'Notification'}
            </div>
            <div className="text-xs sm:text-sm font-pixel mt-0.5">{activeToast.message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
