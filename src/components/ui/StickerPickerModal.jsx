import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RETRO_STICKERS, STICKER_CATEGORIES } from '../../data/stickers';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function StickerPickerModal({
  isOpen,
  onClose,
  onAddSticker,
  onClearAll,
  stickerCount = 0,
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen) return null;

  const filteredStickers =
    activeCategory === 'all'
      ? RETRO_STICKERS
      : RETRO_STICKERS.filter((s) => s.category === activeCategory);

  const handleSelect = (sticker) => {
    soundFx.play('blip');
    onAddSticker(sticker.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          className="w-full max-w-lg bg-[#1a1744] border-3 border-black shadow-[6px_6px_0px_#000] p-4 sm:p-5 relative overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/40">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs sm:text-sm text-white tracking-wide">
                Retro Sticker Collection
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                onClose();
              }}
              className="p-1 bg-[#282463] hover:bg-rose-600 text-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Close Picker"
            >
              <X size={14} />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-3 mb-3 border-b border-black/30 font-sans text-xs">
            {STICKER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setActiveCategory(cat.id);
                }}
                className={`px-2.5 py-1 border-2 border-black cursor-pointer font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#f3df23] text-black shadow-[2px_2px_0px_#000] font-bold'
                    : 'bg-[#25225c] text-white/80 hover:bg-[#343075]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sticker Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1 pr-2">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handleSelect(sticker)}
                className="group p-2.5 bg-[#25225c] hover:bg-[#39347d] border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] transition-all flex flex-col items-center justify-center gap-2 text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {sticker.render()}
                </div>
                <span className="font-sans text-[11px] text-white/90 group-hover:text-[#f3df23] font-medium leading-tight">
                  {sticker.name}
                </span>
              </button>
            ))}
          </div>

          {/* Footer with Clear All option & instruction */}
          <div className="mt-4 pt-3 border-t border-black/40 flex items-center justify-between text-xs font-sans text-white/70">
            <span>
              Tap any sticker to place it on your page. Drag to move, or resize and rotate.
            </span>

            {stickerCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  soundFx.play('click');
                  onClearAll();
                }}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium cursor-pointer ml-3 shrink-0"
              >
                <Trash2 size={13} /> Clear ({stickerCount})
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
