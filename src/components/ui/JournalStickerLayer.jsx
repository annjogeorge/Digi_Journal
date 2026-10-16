import React, { useState, useRef, useEffect } from 'react';
import { RETRO_STICKERS } from '../../data/stickers';
import { Trash2, RotateCw, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function JournalStickerLayer({
  stickers = [],
  onChange,
  isDecorateMode = false,
  containerRef,
}) {
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const draggingIdRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0, startXPercent: 0, startYPercent: 0 });

  // Deselect sticker on outside click
  useEffect(() => {
    const handleWindowClick = (e) => {
      if (!e.target.closest('.sticker-interactive-item') && !e.target.closest('.sticker-toolbar')) {
        setSelectedStickerId(null);
      }
    };
    window.addEventListener('pointerdown', handleWindowClick);
    return () => window.removeEventListener('pointerdown', handleWindowClick);
  }, []);

  // Update a sticker property
  const updateSticker = (id, updates) => {
    const updated = stickers.map((s) => (s.id === id ? { ...s, ...updates } : s));
    onChange(updated);
  };

  // Remove a sticker
  const removeSticker = (id) => {
    soundFx.play('click');
    onChange(stickers.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  // Pointer drag handling with normalized percentages
  const handlePointerDown = (e, sticker) => {
    e.stopPropagation();
    setSelectedStickerId(sticker.id);
    draggingIdRef.current = sticker.id;
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      startXPercent: sticker.x,
      startYPercent: sticker.y,
    };

    const handlePointerMove = (moveEvent) => {
      if (!draggingIdRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = moveEvent.clientX - dragStartPosRef.current.x;
      const dy = moveEvent.clientY - dragStartPosRef.current.y;

      const dxPercent = (dx / rect.width) * 100;
      const dyPercent = (dy / rect.height) * 100;

      const newX = Math.max(2, Math.min(88, dragStartPosRef.current.startXPercent + dxPercent));
      const newY = Math.max(2, Math.min(88, dragStartPosRef.current.startYPercent + dyPercent));

      updateSticker(draggingIdRef.current, { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
    };

    const handlePointerUp = () => {
      draggingIdRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {stickers.map((s) => {
        const stickerDef = RETRO_STICKERS.find((item) => item.id === s.stickerId);
        if (!stickerDef) return null;
        const isSelected = selectedStickerId === s.id;
        const scale = s.scale || 1;
        const rotation = s.rotation || 0;

        return (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: 'center center',
              width: '56px',
              height: '56px',
            }}
            className={`sticker-interactive-item select-none cursor-grab active:cursor-grabbing transition-shadow ${
              isDecorateMode ? 'pointer-events-auto' : isSelected ? 'pointer-events-auto' : 'pointer-events-auto'
            } ${isSelected ? 'ring-2 ring-[#f3df23] ring-offset-2 ring-offset-[#242262]' : ''}`}
            onPointerDown={(e) => handlePointerDown(e, s)}
            title={stickerDef.name}
          >
            {/* Sticker SVG Render */}
            <div className="w-full h-full">{stickerDef.render()}</div>

            {/* Quick action handles when selected */}
            {isSelected && (
              <div
                className="sticker-toolbar absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#181646] border-2 border-black p-1 shadow-[2px_2px_0px_#000] z-30"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => updateSticker(s.id, { scale: Math.min(2.0, (s.scale || 1) + 0.15) })}
                  title="Make Bigger"
                  className="p-1 bg-[#292562] hover:bg-[#38337d] text-white border border-black cursor-pointer"
                >
                  <ZoomIn size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => updateSticker(s.id, { scale: Math.max(0.6, (s.scale || 1) - 0.15) })}
                  title="Make Smaller"
                  className="p-1 bg-[#292562] hover:bg-[#38337d] text-white border border-black cursor-pointer"
                >
                  <ZoomOut size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => updateSticker(s.id, { rotation: ((s.rotation || 0) + 15) % 360 })}
                  title="Rotate"
                  className="p-1 bg-[#292562] hover:bg-[#38337d] text-[#f3df23] border border-black cursor-pointer"
                >
                  <RotateCw size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => removeSticker(s.id)}
                  title="Remove Sticker"
                  className="p-1 bg-rose-600 hover:bg-rose-700 text-white border border-black cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
