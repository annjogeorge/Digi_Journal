import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import PixelButton from './PixelButton';
import { soundFx } from '../../utils/soundEffects';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="w-full max-w-md bg-[#1d1a4e] border-3 border-black shadow-[6px_6px_0px_#000] p-5 relative"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/30">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#f3df23]">
              <AlertTriangle size={16} className="text-[#f3df23]" />
              <span>{title}</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('click');
                onCancel();
              }}
              className="p-1 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <p className="font-sans text-sm text-white/90 leading-relaxed mb-6">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5">
            <PixelButton
              variant="dark"
              size="sm"
              onClick={() => {
                soundFx.play('click');
                onCancel();
              }}
            >
              {cancelLabel}
            </PixelButton>
            <PixelButton
              variant={isDestructive ? 'red' : 'yellow'}
              size="sm"
              icon={isDestructive ? <Trash2 size={13} /> : null}
              onClick={() => {
                soundFx.play(isDestructive ? 'delete' : 'complete');
                onConfirm();
              }}
            >
              {confirmLabel}
            </PixelButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
