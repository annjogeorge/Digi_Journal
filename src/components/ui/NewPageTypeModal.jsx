import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, BookMarked, X, Sparkles } from 'lucide-react';
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

          <p className="font-sans text-xs text-white/80 mb-4">
            Choose what type of page you want to add to your digital book:
          </p>

          {/* Two Page Choices */}
          <div className="grid grid-cols-1 gap-3.5">
            {/* Option A: Blank Journal Page */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('page');
                onSelectType('entry');
                onClose();
              }}
              className="p-4 bg-[#25225c] hover:bg-[#343075] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-start gap-3.5 text-left group"
            >
              <div className="p-2.5 bg-[#f3df23] text-black border-2 border-black rounded-xs shrink-0 shadow-[1px_1px_0px_#000]">
                <PenTool size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-pixel text-xs text-white group-hover:text-[#f3df23] tracking-wide">
                    Blank Journal Page
                  </h4>
                  <span className="font-pixel text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 border border-emerald-500/40">
                    DAILY
                  </span>
                </div>
                <p className="font-sans text-xs text-white/70 mt-1 leading-relaxed">
                  Daily reflection page. Write freely with your chosen handwriting font without being forced to enter a title.
                </p>
              </div>
            </button>

            {/* Option B: Title Page / Section Divider */}
            <button
              type="button"
              onClick={() => {
                soundFx.play('page');
                onSelectType('title_page');
                onClose();
              }}
              className="p-4 bg-[#25225c] hover:bg-[#343075] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-y-[1px] transition-all cursor-pointer flex items-start gap-3.5 text-left group"
            >
              <div className="p-2.5 bg-[#ff79c6] text-black border-2 border-black rounded-xs shrink-0 shadow-[1px_1px_0px_#000]">
                <BookMarked size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-pixel text-xs text-white group-hover:text-[#ff79c6] tracking-wide">
                    Decorative Title Page
                  </h4>
                  <span className="font-pixel text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 border border-pink-500/40">
                    COVER
                  </span>
                </div>
                <p className="font-sans text-xs text-white/70 mt-1 leading-relaxed">
                  Decorative divider or diary cover with a bold title, optional subtitle, date, and stickers to organize sections.
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
