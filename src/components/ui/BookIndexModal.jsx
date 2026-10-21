import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Calendar,
  Star,
  Tag,
  ArrowUpDown,
  X,
  Sparkles,
  ChevronRight,
  Smile,
  Sun,
  Zap,
  Meh,
  Heart,
  Coffee,
  ShieldAlert,
  Frown,
  BookMarked,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import RetroSelect from './RetroSelect';

const MOOD_ICONS = {
  happy: Smile,
  calm: Sun,
  excited: Zap,
  neutral: Meh,
  grateful: Heart,
  tired: Coffee,
  anxious: ShieldAlert,
  sad: Frown,
};

export default function BookIndexModal({
  isOpen,
  onClose,
  entries = [],
  currentEntryId = null,
  onSelectEntry,
  onNewEntry,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest) or 'asc' (oldest)

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          (e.title && e.title.toLowerCase().includes(query)) ||
          (e.content && e.content.toLowerCase().includes(query)) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(query)));

        const matchesMood = selectedMood === 'all' || e.mood === selectedMood;
        const matchesFavorite = !onlyFavorites || Boolean(e.isFavorite);

        return matchesQuery && matchesMood && matchesFavorite;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [entries, searchQuery, selectedMood, onlyFavorites, sortOrder]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl bg-[#efe5cf] border-4 border-[#3d2f1f] shadow-[8px_8px_0px_#000] text-[#2b251f] flex flex-col max-h-[88vh] rounded-sm relative overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Retro Book Top Header Bar */}
          <div className="bg-[#3d2f1f] text-[#efe5cf] px-4 sm:px-6 py-3 flex items-center justify-between border-b-2 border-black/60 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#f3df23]" />
              <h2 className="font-pixel text-xs sm:text-sm tracking-wider uppercase">
                Table of Contents & Index
              </h2>
              <span className="font-pixel text-[10px] text-[#f3df23] ml-2">
                [{entries.length} Pages Recorded]
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                onClose();
              }}
              className="px-2.5 py-1 bg-[#efe5cf] text-[#3d2f1f] hover:bg-[#f3df23] font-pixel text-[10px] border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-colors"
            >
              <X size={13} /> Back to Book
            </button>
          </div>

          {/* Search & Filter Controls Toolbar */}
          <div className="bg-[#e4d8be] border-b-2 border-[#3d2f1f]/30 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d2f1f]/60"
              />
              <input
                type="text"
                placeholder="Search index by title, thoughts, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#fcfbf7] border-2 border-[#3d2f1f]/60 text-xs font-sans text-[#2b251f] focus:outline-none focus:border-[#3d2f1f] placeholder:text-[#3d2f1f]/40 shadow-xs"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
              {/* Mood Filter */}
              <div className="w-36">
                <RetroSelect
                  value={selectedMood}
                  onChange={(val) => {
                    soundFx.play('blip');
                    setSelectedMood(val);
                  }}
                  options={[
                    { value: 'all', label: 'All Moods' },
                    { value: 'happy', label: 'Happy' },
                    { value: 'calm', label: 'Calm' },
                    { value: 'excited', label: 'Excited' },
                    { value: 'neutral', label: 'Neutral' },
                    { value: 'grateful', label: 'Grateful' },
                    { value: 'tired', label: 'Tired' },
                    { value: 'anxious', label: 'Anxious' },
                    { value: 'sad', label: 'Sad' },
                  ]}
                  size="sm"
                  buttonClassName="bg-[#fcfbf7] border-2 border-[#3d2f1f]/60 text-xs py-1 px-2 text-[#2b251f] hover:bg-[#f2ecdc]"
                  menuClassName="bg-[#fcfbf7] border-2 border-[#3d2f1f] text-[#2b251f]"
                />
              </div>

              {/* Favorites toggle */}
              <button
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setOnlyFavorites(!onlyFavorites);
                }}
                className={`px-2.5 py-1.5 border-2 border-[#3d2f1f]/70 flex items-center gap-1 cursor-pointer font-medium transition-colors ${
                  onlyFavorites
                    ? 'bg-[#f3df23] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                    : 'bg-[#fcfbf7] text-[#2b251f] hover:bg-white'
                }`}
              >
                <Star size={13} className={onlyFavorites ? 'fill-black' : ''} />
                <span>Favorites</span>
              </button>

              {/* Sort Order */}
              <button
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                }}
                className="px-2.5 py-1.5 bg-[#fcfbf7] hover:bg-white border-2 border-[#3d2f1f]/70 flex items-center gap-1 cursor-pointer font-medium"
                title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
              >
                <ArrowUpDown size={13} />
                <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>
          </div>

          {/* Index Entry List (Styled like ruled notebook table of contents) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 notebook-ruled">
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-[#3d2f1f]/10 rounded-full flex items-center justify-center text-[#3d2f1f] mb-3">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-pixel text-xs text-[#3d2f1f] uppercase mb-1">
                  {entries.length === 0 ? 'Your Book is Empty' : 'No Entries Matched'}
                </h3>
                <p className="font-sans text-xs text-[#3d2f1f]/70 max-w-sm mb-4">
                  {entries.length === 0
                    ? 'Every great memory begins with a single reflection. Start page 1 of your diary today!'
                    : 'Try clearing your search query or filters to browse all written entries.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    onNewEntry();
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#f3df23] text-black font-pixel text-[11px] border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer hover:bg-[#ffe838]"
                >
                  + Write New Entry
                </button>
              </div>
            ) : (
              <div className="divide-y-2 divide-[#3d2f1f]/15">
                {filteredEntries.map((entry, idx) => {
                  const isCurrent = entry.id === currentEntryId;
                  const MoodIcon = MOOD_ICONS[entry.mood] || Smile;
                  const displayPageNum = idx + 1;

                  const isTitlePage = entry.pageType === 'title_page';
                  const isFreewrite = entry.pageType === 'freewrite';

                  return (
                    <div
                      key={entry.id}
                      onClick={() => {
                        soundFx.play('page');
                        onSelectEntry(entry);
                        onClose();
                      }}
                      className={`py-3 px-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors group rounded-xs ${
                        isTitlePage
                          ? isCurrent
                            ? 'bg-[#f3df23]/40 border-l-4 border-l-[#3d2f1f] shadow-xs'
                            : 'bg-[#f8e878]/30 border-l-4 border-l-[#d4a017] hover:bg-[#f8e878]/50'
                          : isCurrent
                          ? 'bg-[#f3df23]/30 border-l-4 border-l-[#3d2f1f]'
                          : 'hover:bg-[#3d2f1f]/5'
                      }`}
                    >
                      {/* Left: Page Number, Title & Snippet */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="font-pixel text-[10px] sm:text-xs text-[#3d2f1f]/60 font-bold tracking-wider shrink-0 mt-0.5">
                          #{String(displayPageNum).padStart(2, '0')}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {isTitlePage && (
                              <span className="font-pixel text-[8px] bg-[#3d2f1f] text-[#f3df23] px-1.5 py-0.5 font-bold uppercase shrink-0 flex items-center gap-1">
                                <BookMarked size={10} /> TITLE PAGE
                              </span>
                            )}
                            {isFreewrite && (
                              <span className="font-pixel text-[8px] bg-[#3d2f1f]/10 text-[#3d2f1f] px-1.5 py-0.5 uppercase shrink-0">
                                FREE WRITE
                              </span>
                            )}
                            <h4 className={`font-sans text-sm font-bold truncate ${isTitlePage ? 'text-black uppercase font-pixel text-xs tracking-wide' : 'text-[#2b251f] group-hover:text-black'}`}>
                              {entry.title || (isFreewrite ? 'Pure Writing (Untitled)' : 'Untitled Reflection')}
                            </h4>
                            {entry.isFavorite && (
                              <Star size={13} className="fill-[#f3df23] text-[#3d2f1f] shrink-0" />
                            )}
                          </div>

                          {entry.content && (
                            <p className="font-sans text-xs text-[#2b251f]/75 line-clamp-1 italic">
                              "{entry.content}"
                            </p>
                          )}

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              {entry.tags.map((t, i) => (
                                <span
                                  key={i}
                                  className="font-sans text-[10px] bg-[#3d2f1f]/10 text-[#3d2f1f] px-1.5 py-0.2 rounded-xs"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Date, Mood Icon & Words */}
                      <div className="flex items-center gap-3 shrink-0 font-sans text-xs text-[#2b251f]/80">
                        <div className="text-right hidden sm:block">
                          <div className="font-medium text-[#2b251f]">{entry.date}</div>
                          <div className="text-[10px] text-[#2b251f]/60">
                            {entry.wordCount || 0} words
                          </div>
                        </div>

                        {/* Mood Indicator Icon (No emojis) */}
                        <div
                          className="w-7 h-7 rounded-full bg-[#3d2f1f]/10 border border-[#3d2f1f]/30 flex items-center justify-center text-[#3d2f1f]"
                          title={`Mood: ${entry.mood || 'happy'}`}
                        >
                          <MoodIcon size={14} />
                        </div>

                        <ChevronRight
                          size={16}
                          className="text-[#3d2f1f]/50 group-hover:text-[#3d2f1f] group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Footer Bar */}
          <div className="bg-[#e4d8be] border-t-2 border-[#3d2f1f]/30 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-sans text-[#2b251f]/75 shrink-0">
            <span>
              Showing <strong className="text-[#2b251f]">{filteredEntries.length}</strong> of{' '}
              <strong className="text-[#2b251f]">{entries.length}</strong> entries
            </span>

            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                onNewEntry();
                onClose();
              }}
              className="px-3 py-1 bg-[#3d2f1f] text-[#efe5cf] hover:bg-[#281f14] font-pixel text-[10px] border border-black cursor-pointer flex items-center gap-1 shadow-xs"
            >
              + Write New Page
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
