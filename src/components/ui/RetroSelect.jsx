import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

/**
 * RetroSelect: A fully accessible, keyboard-navigable custom dropdown
 * matching DigiJournal's retro Y2K pixel aesthetic.
 * Replaces unstyled native <select> elements across the app.
 */
export default function RetroSelect({
  id,
  label,
  value,
  onChange,
  options = [], // [{ value: 'x', label: 'X', icon?: ... }] or array of strings
  className = '',
  buttonClassName = '',
  menuClassName = '',
  placeholder = 'Select option...',
  disabled = false,
  size = 'md', // 'sm' | 'md'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Normalize options to { value, label, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return {
      value: opt.value,
      label: opt.label || String(opt.value),
      icon: opt.icon,
      color: opt.color,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundFx.play('blip');
        setIsOpen(true);
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          selectOption(normalizedOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectOption = (opt) => {
    soundFx.play('blip');
    onChange?.(opt.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-1 text-xs'
      : 'px-3 py-2 text-xs sm:text-sm';

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full sm:w-auto text-left select-none ${className}`}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          htmlFor={id}
          className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1"
        >
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            soundFx.play('blip');
            setIsOpen(!isOpen);
            const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
            setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
          }
        }}
        className={`w-full bg-[#1b1847] hover:bg-[#272363] text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2.5 font-sans font-medium transition-all active:translate-y-0.5 focus:outline-none focus:border-[#f3df23] ${sizeClasses} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption?.color && (
            <span
              className="w-2.5 h-2.5 rounded-full border border-black inline-block shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={`text-[#f3df23] shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Retro Options Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute left-0 top-full mt-1.5 w-full min-w-[160px] max-h-60 overflow-y-auto bg-[#131135] border-2 border-black shadow-[4px_4px_0px_#000] z-50 flex flex-col py-1 font-sans text-xs focus:outline-none ${menuClassName}`}
        >
          {normalizedOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(opt)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#f3df23] text-black font-semibold'
                    : isHighlighted
                    ? 'bg-[#2b276b] text-white'
                    : 'text-white/85 hover:bg-[#2b276b] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span>{opt.icon}</span>}
                  {opt.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black inline-block shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-black shrink-0 ml-1" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
