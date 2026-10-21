import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, BookMarked, BookOpen, X, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function NewPageTypeModal({ isOpen, onClose, onSelectType }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          className="w-full max-w-md bg-[#1a1744] border-3 border-black shadow-[6px_6px_0px_#000] p-5 sm:p-6 relative text-white"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/40">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs sm:text-sm tracking-wide text-white">
                Create New Page
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                onClose();
              }}
              className="p-1 bg-[#282463] hover:bg-rose-600 text-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          <p className="font-sans text-xs text-white/80 mb-3">
            Choose what type of page you want to add to your digital book:
          </p>

          {/* Three Page Choices */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* Option A: Standard Journal Page (with title) */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('page');
                onSelectType('entry');
                onClose();
              }}
              className="p-3 bg-[#25225c] hover:bg-[#343075] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-start gap-3 text-left group"
            >
              <div className="p-2 bg-[#f3df23] text-black border-2 border-black rounded-xs shrink-0 shadow-[1px_1px_0px_#000]">
                <PenTool size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-pixel text-xs text-white group-hover:text-[#f3df23] tracking-wide">
                    Standard Journal Page
                  </h4>
                  <span className="font-pixel text-[8px] bg-yellow-500/20 text-[#f3df23] px-1 py-0.5 border border-yellow-500/40">
                    WITH TITLE
                  </span>
                </div>
                <p className="font-sans text-[11px] text-white/70 mt-0.5 leading-relaxed">
                  Classic diary page with a headline title field, date, mood, and lined paper.
                </p>
              </div>
            </button>

            {/* Option B: Pure Writing Page (NO title at all) */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('page');
                onSelectType('freewrite');
                onClose();
              }}
              className="p-3 bg-[#25225c] hover:bg-[#343075] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-start gap-3 text-left group"
            >
              <div className="p-2 bg-[#8be9fd] text-black border-2 border-black rounded-xs shrink-0 shadow-[1px_1px_0px_#000]">
                <BookOpen size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-pixel text-xs text-white group-hover:text-[#8be9fd] tracking-wide">
                    Pure Writing Page
                  </h4>
                  <span className="font-pixel text-[8px] bg-cyan-500/20 text-cyan-300 px-1 py-0.5 border border-cyan-500/40">
                    NO TITLE
                  </span>
                </div>
                <p className="font-sans text-[11px] text-white/70 mt-0.5 leading-relaxed">
                  Direct full-page writing canvas without any title box. Perfect for free-writing and stream of thought.
                </p>
              </div>
            </button>

            {/* Option C: Section Divider / Title Page */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('page');
                onSelectType('title_page');
                onClose();
              }}
              className="p-3 bg-[#25225c] hover:bg-[#343075] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-start gap-3 text-left group"
            >
              <div className="p-2 bg-[#ff79c6] text-black border-2 border-black rounded-xs shrink-0 shadow-[1px_1px_0px_#000]">
                <BookMarked size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-pixel text-xs text-white group-hover:text-[#ff79c6] tracking-wide">
                    Section / Title Page
                  </h4>
                  <span className="font-pixel text-[8px] bg-pink-500/20 text-pink-300 px-1 py-0.5 border border-pink-500/40">
                    HIGHLIGHTED
                  </span>
                </div>
                <p className="font-sans text-[11px] text-white/70 mt-0.5 leading-relaxed">
                  Bold chapter cover or divider. Highlighted prominently in the Table of Contents.
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
