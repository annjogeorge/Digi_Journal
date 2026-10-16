import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '../../utils/soundEffects';
import RetroMoodDropdown from './RetroMoodDropdown';
import PixelButton from './PixelButton';
import ConfirmDialog from './ConfirmDialog';
import StickerPickerModal from './StickerPickerModal';
import JournalStickerLayer from './JournalStickerLayer';
import NewPageTypeModal from './NewPageTypeModal';
import {
  Star,
  Trash2,
  Save,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
  BookMarked,
  PenTool,
  Menu,
} from 'lucide-react';

const HANDWRITING_STYLES = [
  { id: 'cozy', label: 'Cozy Script', fontClass: 'font-handwriting-cozy', preview: 'Aa Cozy' },
  { id: 'classic', label: 'Classic Journal', fontClass: 'font-handwriting-classic', preview: 'Aa Classic' },
  { id: 'playful', label: 'Playful Notes', fontClass: 'font-handwriting-playful', preview: 'Aa Playful' },
];

export default function FlipNotebook({
  entry,
  onSave,
  onDelete,
  onToggleFavorite,
  onNewEntry,
  allEntries = [],
  onSelectEntry,
  onToggleSideIndex,
}) {
  // Entry field states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [handwritingStyle, setHandwritingStyle] = useState('cozy');
  const [stickers, setStickers] = useState([]);
  const [pageType, setPageType] = useState('entry'); // 'entry' or 'title_page'

  // UI states
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [isFlipping, setIsFlipping] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [isDecorateMode, setIsDecorateMode] = useState(false);
  const [showCornerHint, setShowCornerHint] = useState(true);

  // References
  const paperRef = useRef(null);
  const autosaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Sync state whenever active entry changes
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setSubtitle(entry.subtitle || '');
      setContent(entry.content || '');
      setMood(entry.mood || 'happy');
      setTagsInput(entry.tags ? entry.tags.join(', ') : '');
      setIsFavorite(Boolean(entry.isFavorite));
      setEntryDate(entry.date || new Date().toISOString().split('T')[0]);
      setHandwritingStyle(entry.handwritingStyle || 'cozy');
      setStickers(Array.isArray(entry.stickers) ? entry.stickers : []);
      setPageType(entry.pageType || 'entry');
      setSaveStatus('Saved');
      lastSavedDataRef.current = {
        title: entry.title || '',
        subtitle: entry.subtitle || '',
        content: entry.content || '',
        mood: entry.mood || 'happy',
        pageType: entry.pageType || 'entry',
        tags: entry.tags ? entry.tags.join(', ') : '',
        handwritingStyle: entry.handwritingStyle || 'cozy',
        stickers: entry.stickers || [],
      };
    } else {
      setTitle('');
      setSubtitle('');
      setContent('');
      setMood('happy');
      setTagsInput('');
      setIsFavorite(false);
      setEntryDate(new Date().toISOString().split('T')[0]);
      setHandwritingStyle('cozy');
      setStickers([]);
      setPageType('entry');
      setSaveStatus('New Page');
      lastSavedDataRef.current = null;
    }
  }, [entry?.id, entry?.date]);

  // Word count & read time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  // Save handler
  const performSave = useCallback(
    (customData = {}) => {
      const currentTitle = customData.title !== undefined ? customData.title : title;
      const currentSubtitle = customData.subtitle !== undefined ? customData.subtitle : subtitle;
      const currentContent = customData.content !== undefined ? customData.content : content;
      const currentPageType = customData.pageType !== undefined ? customData.pageType : pageType;

      if (!currentTitle.trim() && !currentContent.trim() && !currentSubtitle.trim()) {
        return;
      }

      setSaveStatus('Saving...');
      const tags = (customData.tagsInput !== undefined ? customData.tagsInput : tagsInput)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const dataToSave = {
        id: entry ? entry.id : undefined,
        title: currentTitle.trim(),
        subtitle: currentSubtitle.trim(),
        content: currentContent,
        mood: customData.mood || mood,
        tags,
        isFavorite: customData.isFavorite !== undefined ? customData.isFavorite : isFavorite,
        date: customData.entryDate || entryDate,
        handwritingStyle: customData.handwritingStyle || handwritingStyle,
        stickers: customData.stickers !== undefined ? customData.stickers : stickers,
        pageType: currentPageType,
        wordCount,
      };

      const success = onSave(dataToSave);
      if (success !== false) {
        lastSavedDataRef.current = {
          title: currentTitle,
          subtitle: currentSubtitle,
          content: currentContent,
          mood: dataToSave.mood,
          tags: tagsInput,
          handwritingStyle: dataToSave.handwritingStyle,
          stickers: dataToSave.stickers,
          pageType: currentPageType,
        };
        setTimeout(() => setSaveStatus('Saved'), 300);
      } else {
        setSaveStatus('Error saving');
      }
    },
    [entry, title, subtitle, content, mood, tagsInput, isFavorite, entryDate, handwritingStyle, stickers, pageType, wordCount, onSave]
  );

  const handleManualSave = () => {
    soundFx.play('page');
    performSave();
  };

  // Debounced Autosave (800ms)
  const triggerDebouncedAutosave = useCallback(
    (updates = {}) => {
      setSaveStatus('Unsaved changes');
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      autosaveTimeoutRef.current = setTimeout(() => {
        performSave(updates);
      }, 800);
    },
    [performSave]
  );

  // Sticker actions
  const handleAddSticker = (stickerId) => {
    const newSticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stickerId,
      x: 55 + (Math.random() * 10 - 5),
      y: 45 + (Math.random() * 10 - 5),
      scale: 1,
      rotation: Math.round((Math.random() * 20 - 10) / 5) * 5,
    };
    const nextStickers = [...stickers, newSticker];
    setStickers(nextStickers);
    setIsStickerPickerOpen(false);
    setIsDecorateMode(true);
    triggerDebouncedAutosave({ stickers: nextStickers });
  };

  const handleUpdateStickers = (updatedStickers) => {
    setStickers(updatedStickers);
    triggerDebouncedAutosave({ stickers: updatedStickers });
  };

  const handleClearAllStickers = () => {
    setStickers([]);
    setIsStickerPickerOpen(false);
    triggerDebouncedAutosave({ stickers: [] });
  };

  // Pagination calculation
  const currentIndex = allEntries.findIndex((e) => e.id === entry?.id);
  const totalEntries = allEntries.length;
  const isNewPage = !entry || currentIndex === -1;
  const displayPageNumber = isNewPage ? totalEntries + 1 : currentIndex + 1;

  const isFirstPage = currentIndex === totalEntries - 1;
  const isLastPage = currentIndex === 0 && !isNewPage;

  // Turn to Next Page (forward: towards newer entries or create new)
  const handleNextPage = useCallback(() => {
    if (isFlipping) return;
    if (currentIndex > 0) {
      soundFx.play('page');
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        onSelectEntry(allEntries[currentIndex - 1]);
        setIsFlipping(false);
      }, 260);
    } else if (currentIndex === 0 && !isNewPage) {
      soundFx.play('page');
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setIsNewPageModalOpen(true);
        setIsFlipping(false);
      }, 260);
    }
  }, [currentIndex, isNewPage, isFlipping, allEntries, onSelectEntry]);

  // Turn to Previous Page (backward: towards older entries)
  const handlePrevPage = useCallback(() => {
    if (isFlipping) return;
    if (isNewPage) {
      if (totalEntries > 0) {
        soundFx.play('page');
        setFlipDirection('prev');
        setIsFlipping(true);
        setTimeout(() => {
          onSelectEntry(allEntries[0]);
          setIsFlipping(false);
        }, 260);
      }
    } else if (currentIndex < totalEntries - 1) {
      soundFx.play('page');
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        onSelectEntry(allEntries[currentIndex + 1]);
        setIsFlipping(false);
      }, 260);
    }
  }, [currentIndex, isNewPage, totalEntries, isFlipping, allEntries, onSelectEntry]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevPage, handleNextPage]);

  // Active handwriting style class
  const activeStyleDef =
    HANDWRITING_STYLES.find((s) => s.id === handwritingStyle) || HANDWRITING_STYLES[0];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* =========================================================================
          TOP ACTION & FORMATTING CONTROLS TOOLBAR
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1a1744] border-2 border-black p-3 shadow-[3px_3px_0px_#000]">
        {/* Left: New Page (Modal trigger), Mobile Index button, Favorite, Delete */}
        <div className="flex items-center gap-2">
          {onToggleSideIndex && (
            <button
              type="button"
              onClick={onToggleSideIndex}
              className="lg:hidden px-2.5 py-1.5 bg-[#25225c] hover:bg-[#343075] text-white border-2 border-black font-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Open Table of Contents"
            >
              <Menu size={14} className="text-[#f3df23]" />
              <span>Index</span>
            </button>
          )}

          <PixelButton
            size="sm"
            variant="yellow"
            icon={<BookOpen size={14} />}
            onClick={() => {
              soundFx.play('click');
              setIsNewPageModalOpen(true);
            }}
          >
            New Page
          </PixelButton>

          {/* Favorite Toggle */}
          {entry && (
            <button
              type="button"
              onClick={() => {
                const nextFav = !isFavorite;
                setIsFavorite(nextFav);
                onToggleFavorite?.(entry.id);
              }}
              title={isFavorite ? 'Unmark Favorite' : 'Mark as Favorite'}
              className={`p-2 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors ${
                isFavorite ? 'bg-[#f3df23] text-black' : 'bg-[#25225c] text-white hover:bg-[#343075]'
              }`}
            >
              <Star size={15} className={isFavorite ? 'fill-black' : ''} />
            </button>
          )}

          {/* Delete Page */}
          {entry && (
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              title="Delete Page"
              className="p-2 bg-rose-600 hover:bg-rose-700 text-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* Right: Page Navigation, Autosave Status, Save Button */}
        <div className="flex items-center gap-3">
          {/* Previous / Next Page Controls */}
          <div className="flex items-center gap-1 font-sans">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={isFirstPage || (isNewPage && totalEntries === 0)}
              className="p-1.5 bg-[#25225c] disabled:opacity-35 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#343075] active:translate-y-0.5"
              title="Previous Page (or press Left Arrow)"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs text-white/90 px-2 font-medium tracking-tight whitespace-nowrap">
              Page {displayPageNumber} of {Math.max(1, totalEntries)}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={isNewPage}
              className="p-1.5 bg-[#25225c] disabled:opacity-35 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#343075] active:translate-y-0.5"
              title="Next Page (or press Right Arrow)"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Save Status Indicator */}
          <div
            className={`font-pixel text-[10px] hidden sm:block ${
              saveStatus === 'Saved'
                ? 'text-[#50fa7b]'
                : saveStatus === 'Saving...'
                ? 'text-[#f3df23] animate-pulse'
                : 'text-amber-400'
            }`}
          >
            {saveStatus}
          </div>

          {/* Save Button */}
          <PixelButton
            size="sm"
            variant="green"
            icon={<Save size={14} />}
            onClick={handleManualSave}
          >
            Save Page
          </PixelButton>
        </div>
      </div>

      {/* =========================================================================
          FORMATTING TOOLBAR: HANDWRITING STYLES & STICKERS
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1b4b] border-2 border-black px-4 py-2.5 shadow-[2px_2px_0px_#000] font-sans text-xs">
        {/* Handwriting Style Selector */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-[#f3df23] uppercase tracking-wider flex items-center gap-1">
            <PenTool size={12} /> Style:
          </span>
          <div className="flex items-center gap-1.5">
            {HANDWRITING_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setHandwritingStyle(style.id);
                  triggerDebouncedAutosave({ handwritingStyle: style.id });
                }}
                className={`px-2.5 py-1 border-2 border-black cursor-pointer transition-all ${
                  handwritingStyle === style.id
                    ? 'bg-[#f3df23] text-black font-bold shadow-[2px_2px_0px_#000]'
                    : 'bg-[#292562] text-white/80 hover:bg-[#38337d]'
                }`}
                title={style.label}
              >
                <span className={style.fontClass}>{style.preview}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stickers & Decorate Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.play('click');
              setIsStickerPickerOpen(true);
            }}
            className="px-3 py-1 bg-[#f3df23] text-black font-sans text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] hover:bg-[#ffe838] flex items-center gap-1.5 active:translate-y-0.5"
          >
            <Sparkles size={13} className="text-black" />
            <span>Stickers {stickers.length > 0 && `(${stickers.length})`}</span>
          </button>

          {stickers.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setIsDecorateMode(!isDecorateMode);
              }}
              className={`px-2.5 py-1 border-2 border-black font-sans text-xs cursor-pointer transition-all ${
                isDecorateMode
                  ? 'bg-[#50fa7b] text-black font-bold shadow-[2px_2px_0px_#000]'
                  : 'bg-[#292562] text-white/80 hover:bg-[#38337d]'
              }`}
              title="Toggle Decorate Mode to drag and arrange stickers easily"
            >
              {isDecorateMode ? 'Done Decorating' : 'Arrange Stickers'}
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          DIGITAL NOTEBOOK WITH MATHEMATICALLY PRECISE WRITING ALIGNMENT
          ========================================================================= */}
      <div className="relative w-full [perspective:1400px]">
        {/* Outer Hardcover Bound Casing & Book Spine Details */}
        <div className="relative bg-[#342718] border-4 border-black p-2 sm:p-3.5 shadow-[8px_8px_0px_#000000] rounded-sm book-edge-stack">
          {/* Realistic Center Spine Crease Effect */}
          <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none z-30 book-spine-crease border-r border-black/40" />

          {/* Page Flip Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={entry?.id || `new-page-${displayPageNumber}-${pageType}`}
              ref={paperRef}
              initial={{
                opacity: 0,
                rotateY: flipDirection === 'next' ? -22 : 22,
                transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                rotateY: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotateY: flipDirection === 'next' ? 22 : -22,
                transformOrigin: flipDirection === 'next' ? 'right center' : 'left center',
                scale: 0.985,
              }}
              transition={{
                duration: 0.28,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative bg-[#fbf9f2] border-2 border-[#524436] text-[#2b251f] flex min-h-[640px] rounded-xs select-text overflow-hidden"
            >
              {/* =====================================================================
                  1. LEFT GUTTER: Binder Spiral Holes + Crisp Red Margin Line
                  ===================================================================== */}
              <div className="w-12 sm:w-16 shrink-0 bg-[#f7f4ea] border-r-2 border-rose-400/80 flex flex-col justify-between py-5 items-center select-none relative z-10">
                {/* Spiral Ring Holes */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-2.5 bg-[#6d5b45] border border-black/60 rounded-full shadow-inner my-0.5"
                  />
                ))}
              </div>

              {/* Interactive Sticker Layer (constrained over the writing paper) */}
              <JournalStickerLayer
                stickers={stickers}
                onChange={handleUpdateStickers}
                isDecorateMode={isDecorateMode}
                containerRef={paperRef}
              />

              {/* =====================================================================
                  2. MAIN WRITING AREA: Starts STRICTLY to the right of red margin!
                  ===================================================================== */}
              <div className="flex-1 notebook-ruled-lines flex flex-col justify-between pl-5 pr-5 sm:pl-7 sm:pr-8 py-5 relative z-10">
                {pageType === 'title_page' ? (
                  /* ===================================================================
                     OPTION B: DECORATIVE TITLE PAGE / SECTION DIVIDER
                     =================================================================== */
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
                    <div className="inline-flex items-center gap-1.5 font-pixel text-[10px] bg-[#f3df23] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-6">
                      <BookMarked size={13} />
                      <span>★ SECTION DIVIDER / TITLE PAGE ★</span>
                    </div>

                    <div className="w-full max-w-lg space-y-4">
                      {/* Title */}
                      <input
                        type="text"
                        placeholder="ENTER TITLE (e.g. October Memories)..."
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          triggerDebouncedAutosave({ title: e.target.value });
                        }}
                        className="w-full font-pixel text-xl sm:text-2xl text-center text-black bg-transparent border-b-2 border-black pb-2 focus:outline-none placeholder:text-black/35 tracking-tight uppercase"
                      />

                      {/* Subtitle / Dedication */}
                      <input
                        type="text"
                        placeholder="Optional subtitle, dedication or description..."
                        value={subtitle}
                        onChange={(e) => {
                          setSubtitle(e.target.value);
                          triggerDebouncedAutosave({ subtitle: e.target.value });
                        }}
                        className={`w-full ${activeStyleDef.fontClass} text-2xl sm:text-3xl text-center text-black/85 bg-transparent border-b border-black/20 pb-2 focus:outline-none placeholder:text-stone-400`}
                      />

                      {/* Notes / Intro Reflection */}
                      <textarea
                        placeholder="Add introductory notes, goals, or reflections for this section..."
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                          triggerDebouncedAutosave({ content: e.target.value });
                        }}
                        rows={6}
                        style={{ lineHeight: '30px' }}
                        className={`w-full ${activeStyleDef.fontClass} text-xl sm:text-2xl text-center text-[#1c1917] bg-transparent resize-none focus:outline-none placeholder:text-stone-400 select-text mt-4`}
                      />
                    </div>
                  </div>
                ) : (
                  /* ===================================================================
                     OPTION A: BLANK JOURNAL PAGE (TITLE IS OPTIONAL)
                     =================================================================== */
                  <div className="flex-1 flex flex-col">
                    {/* Header Row: Date Picker & Retro Mood Dropdown */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 mb-3 border-b-2 border-rose-300">
                      {/* Date Selector */}
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-rose-600" />
                        <input
                          type="date"
                          value={entryDate}
                          onChange={(e) => {
                            setEntryDate(e.target.value);
                            triggerDebouncedAutosave({ entryDate: e.target.value });
                          }}
                          className="font-sans text-xs bg-white/90 border border-black/30 px-2.5 py-1 text-black shadow-xs focus:outline-none focus:border-black font-semibold"
                        />
                      </div>

                      {/* Custom Retro Mood Dropdown */}
                      <div className="flex items-center gap-2">
                        <RetroMoodDropdown
                          value={mood}
                          onChange={(nextMood) => {
                            setMood(nextMood);
                            triggerDebouncedAutosave({ mood: nextMood });
                          }}
                        />
                      </div>
                    </div>

                    {/* Entry Title: Completely optional for daily journal entries! */}
                    <input
                      type="text"
                      placeholder="Entry Title (optional)..."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        triggerDebouncedAutosave({ title: e.target.value });
                      }}
                      className="w-full font-pixel text-base sm:text-lg text-black bg-transparent border-b border-black/20 pb-1.5 mb-3 focus:outline-none placeholder:text-black/30 tracking-tight"
                    />

                    {/* Main Long-Form Handwritten Writing Area */}
                    <textarea
                      placeholder="Write your thoughts, memories, dreams, or reflections here..."
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        triggerDebouncedAutosave({ content: e.target.value });
                      }}
                      rows={14}
                      style={{ lineHeight: '30px' }}
                      className={`w-full flex-1 ${activeStyleDef.fontClass} text-xl sm:text-2xl text-[#1c1917] bg-transparent resize-none focus:outline-none placeholder:text-stone-400 select-text`}
                    />
                  </div>
                )}

                {/* =====================================================================
                    DEDICATED FOOTER AREA: Tags, Words, Reading Time, Page Number
                    ===================================================================== */}
                <div className="pt-3 mt-3 border-t-2 border-rose-300/80 flex flex-wrap items-center justify-between gap-3 text-stone-700 font-sans text-xs relative z-10">
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <Tag size={13} className="text-stone-600" />
                    <input
                      type="text"
                      placeholder="Tags (comma separated: memories, ideas)"
                      value={tagsInput}
                      onChange={(e) => {
                        setTagsInput(e.target.value);
                        triggerDebouncedAutosave({ tagsInput: e.target.value });
                      }}
                      className="text-xs bg-white/80 border border-stone-300 px-2 py-1 w-full text-black focus:outline-none focus:border-stone-500 rounded-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-stone-600">
                    <div className="hidden sm:flex items-center gap-1">
                      <Clock size={12} />
                      <span>{readTimeMinutes} min</span>
                    </div>

                    <div className="font-semibold text-black">
                      Words: <span className="font-bold">{wordCount}</span>
                    </div>

                    <div className="font-pixel text-[10px] text-[#3d2f1f] bg-[#3d2f1f]/10 px-2 py-0.5 border border-[#3d2f1f]/20">
                      Pg. {displayPageNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* =====================================================================
                  PAGE-CORNER TURNING INTERACTIONS (LOWER-LEFT & LOWER-RIGHT)
                  ===================================================================== */}
              {/* Lower-Left Corner: Turn to Previous Page */}
              <div
                onClick={handlePrevPage}
                title={isFirstPage ? 'First Page' : 'Turn to Previous Page [←]'}
                className={`corner-curl-bl ${
                  isFirstPage ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
                }`}
              />

              {/* Lower-Right Corner: Turn to Next Page */}
              <div
                onClick={handleNextPage}
                title={isLastPage ? 'Last Page' : 'Turn to Next Page [→]'}
                className={`corner-curl-br ${
                  isLastPage ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
                }`}
              />

              {/* First-Time Page Corner Turn Hint */}
              {showCornerHint && totalEntries > 1 && (
                <div
                  onClick={() => setShowCornerHint(false)}
                  className="absolute bottom-2 right-14 bg-[#1a1744] text-[#f3df23] font-pixel text-[8px] px-2 py-1 border border-black shadow-[2px_2px_0px_#000] z-30 cursor-pointer animate-bounce hidden sm:flex items-center gap-1"
                >
                  <span>Tap corner to turn page ➔</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================================================
          MODALS: NEW PAGE TYPE SELECTION, STICKERS, DELETE CONFIRMATION
          ========================================================================= */}
      <NewPageTypeModal
        isOpen={isNewPageModalOpen}
        onClose={() => setIsNewPageModalOpen(false)}
        onSelectType={(type) => {
          onNewEntry(type);
        }}
      />

      <StickerPickerModal
        isOpen={isStickerPickerOpen}
        onClose={() => setIsStickerPickerOpen(false)}
        onAddSticker={handleAddSticker}
        onClearAll={handleClearAllStickers}
        stickerCount={stickers.length}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Journal Page"
        message="Are you sure you want to delete this journal page? This reflection will be permanently removed from your digital book."
        confirmLabel="Delete Page"
        onConfirm={() => {
          setIsDeleteConfirmOpen(false);
          onDelete?.(entry.id);
        }}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
}
