import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Star,
  ArrowUpDown,
  BookMarked,
  Plus,
  Smile,
  Sun,
  Zap,
  Meh,
  Heart,
  Coffee,
  ShieldAlert,
  Frown,
  X,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

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

const MOOD_COLORS = {
  happy: '#50fa7b',
  calm: '#8be9fd',
  excited: '#f1fa8c',
  neutral: '#bd93f9',
  grateful: '#ff79c6',
  tired: '#a29bfe',
  anxious: '#ffb86c',
  sad: '#ff7675',
};

// Format date into a warm, readable diary format e.g. "Friday, 16 Oct"
function formatDiaryDate(dateStr) {
  if (!dateStr) return 'Undated';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function JournalSideIndex({
  entries = [],
  currentEntryId = null,
  onSelectEntry,
  onNewPageClick,
  isMobileDrawer = false,
  onCloseDrawer,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          (e.title && e.title.toLowerCase().includes(query)) ||
          (e.subtitle && e.subtitle.toLowerCase().includes(query)) ||
          (e.content && e.content.toLowerCase().includes(query)) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(query)));

        const matchesMood = moodFilter === 'all' || e.mood === moodFilter;
        const matchesFavorite = !onlyFavorites || Boolean(e.isFavorite);

        return matchesQuery && matchesMood && matchesFavorite;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [entries, searchQuery, moodFilter, onlyFavorites, sortOrder]);

  return (
    <div
      className={`bg-[#1a1744] border-2 border-black shadow-[4px_4px_0px_#000] flex flex-col text-white select-none ${
        isMobileDrawer ? 'w-full h-full' : 'w-72 lg:w-80 shrink-0 h-[680px]'
      }`}
    >
      {/* Header Bar */}
      <div className="p-3.5 bg-[#141238] border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookMarked size={16} className="text-[#f3df23]" />
          <div>
            <h3 className="font-pixel text-xs text-white tracking-wide">
              Table of Contents
            </h3>
            <span className="font-sans text-[10px] text-white/60">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNewPageClick}
            className="px-2 py-1 bg-[#f3df23] hover:bg-[#ffe838] text-black font-pixel text-[9px] border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-center gap-1 active:translate-y-0.5"
            title="Create New Page"
          >
            <Plus size={11} /> New
          </button>

          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="p-1 bg-[#25225c] hover:bg-rose-600 text-white border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Close Drawer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-2.5 bg-[#17143f] border-b-2 border-black/50 flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search entries or thoughts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e0c29] border border-black/70 text-xs text-white pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-[#f3df23] font-sans placeholder:text-white/40 rounded-xs"
          />
        </div>

        {/* Filter and Sort Toggles */}
        <div className="flex items-center justify-between gap-1.5 font-sans text-xs">
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="bg-[#0e0c29] border border-black/70 text-[11px] text-white py-1 px-1.5 focus:outline-none cursor-pointer rounded-xs"
          >
            <option value="all">All Moods</option>
            <option value="happy">Happy</option>
            <option value="calm">Calm</option>
            <option value="excited">Excited</option>
            <option value="neutral">Neutral</option>
            <option value="grateful">Grateful</option>
            <option value="tired">Tired</option>
            <option value="anxious">Anxious</option>
            <option value="sad">Sad</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`p-1 border border-black cursor-pointer rounded-xs transition-colors ${
                onlyFavorites ? 'bg-[#f3df23] text-black' : 'bg-[#0e0c29] text-white/70 hover:text-white'
              }`}
              title="Show Favorites Only"
            >
              <Star size={12} className={onlyFavorites ? 'fill-black' : ''} />
            </button>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 bg-[#0e0c29] hover:bg-white/10 text-white/70 hover:text-white border border-black cursor-pointer rounded-xs flex items-center gap-1 text-[10px]"
              title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
            >
              <ArrowUpDown size={11} />
              <span>{sortOrder === 'desc' ? 'New' : 'Old'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Entry List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredEntries.length === 0 ? (
          <div className="p-6 text-center text-white/60 font-sans text-xs flex flex-col items-center justify-center h-48">
            <BookOpen size={24} className="text-white/30 mb-2" />
            <p className="font-pixel text-[10px] text-white/70 mb-1">
              {entries.length === 0 ? 'NO ENTRIES YET' : 'NO MATCHES FOUND'}
            </p>
            <p className="text-[11px] text-white/50 max-w-[180px]">
              {entries.length === 0
                ? 'Click + New above to write your first journal entry.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          filteredEntries.map((item) => {
            const isSelected = item.id === currentEntryId;
            const MoodIcon = MOOD_ICONS[item.mood] || Smile;
            const moodColor = MOOD_COLORS[item.mood] || '#50fa7b';
            const isTitlePage = item.pageType === 'title_page';

            // Derive preview text: first line of content
            const firstLine = item.content
              ? item.content.split('\n').map((l) => l.trim()).find(Boolean) || ''
              : '';

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundFx.play('blip');
                  onSelectEntry(item);
                  if (isMobileDrawer && onCloseDrawer) onCloseDrawer();
                }}
                className={`p-2.5 border-2 transition-all cursor-pointer relative group rounded-xs ${
                  isSelected
                    ? 'bg-[#292562] border-[#f3df23] shadow-[2px_2px_0px_#f3df23]'
                    : 'bg-[#141238] hover:bg-[#201d4f] border-black/70 shadow-[2px_2px_0px_#000]'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f3df23]" />
                )}

                {/* Primary Row: Date as primary label + Mood/Favorite */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isTitlePage ? (
                      <span className="font-pixel text-[9px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-1 py-0.2 shrink-0">
                        COVER
                      </span>
                    ) : (
                      <span className="font-sans text-xs font-bold text-white group-hover:text-[#f3df23] truncate">
                        {formatDiaryDate(item.date)}
                      </span>
                    )}

                    {item.isFavorite && (
                      <Star size={11} className="fill-[#f3df23] text-[#f3df23] shrink-0" />
                    )}
                  </div>

                  {/* Mood Icon Indicator */}
                  <div
                    className="flex items-center gap-1 text-[10px] shrink-0 font-sans"
                    title={`Mood: ${item.mood || 'happy'}`}
                  >
                    <MoodIcon size={12} style={{ color: moodColor }} />
                    <span className="capitalize text-white/70 hidden sm:inline text-[10px]">
                      {item.mood}
                    </span>
                  </div>
                </div>

                {/* Secondary Row: Title if provided, or First-Line Content Preview */}
                {isTitlePage ? (
                  <div>
                    <h4 className="font-pixel text-[11px] text-[#f3df23] truncate">
                      {item.title || 'Untitled Title Page'}
                    </h4>
                    {item.subtitle && (
                      <p className="font-sans text-[11px] text-white/70 truncate italic">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    {item.title && item.title !== 'Untitled Reflection' && (
                      <div className="font-sans text-xs font-semibold text-white/90 truncate">
                        {item.title}
                      </div>
                    )}
                    <p className="font-sans text-[11px] text-white/60 line-clamp-1 italic">
                      {firstLine || '(Empty entry)'}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
