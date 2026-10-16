import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function RetroWindow({
  isOpen,
  onClose,
  title = 'Application Window',
  children,
  maxWidth = 'max-w-2xl',
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className={`w-full ${maxWidth} bg-[#242262] border-4 border-black shadow-[8px_8px_0px_#000000] overflow-hidden`}
        >
          {/* Windows / Mac OS Retro Title Bar */}
          <div className="bg-[#f3df23] text-black px-3 py-2 border-b-4 border-black flex items-center justify-between font-pixel text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black inline-block"></span>
              <span className="font-bold tracking-wider">{title}</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('click');
                onClose();
              }}
              className="bg-red-500 hover:bg-red-600 text-white p-1 border-2 border-black cursor-pointer leading-none"
            >
              <X size={14} />
            </button>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
