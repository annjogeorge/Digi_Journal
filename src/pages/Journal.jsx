import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import FlipNotebook from '../components/ui/FlipNotebook';
import JournalSideIndex from '../components/ui/JournalSideIndex';
import NewPageTypeModal from '../components/ui/NewPageTypeModal';
import RetroCalendar from '../components/ui/RetroCalendar';
import PixelButton from '../components/ui/PixelButton';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { Search, Calendar, BookOpen, Star, BookMarked, Filter } from 'lucide-react';

export default function Journal() {
  const { entries, saveEntry, deleteEntry, toggleFavoriteEntry } = useJournal();
  const [selectedEntry, setSelectedEntry] = useState(entries[0] || null);
  const [activeTab, setActiveTab] = useState('notebook'); // 'notebook', 'calendar', 'archive'
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);

  // Filter entries for archive view
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.content && e.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesMood = moodFilter === 'all' || e.mood === moodFilter;

    return matchesSearch && matchesMood;
  });

  const handleSelectDateFromCalendar = (dateStr) => {
    const existing = entries.find((e) => e.date === dateStr);
    if (existing) {
      setSelectedEntry(existing);
    } else {
      setSelectedEntry({
        date: dateStr,
        title: '',
        subtitle: '',
        content: '',
        mood: 'happy',
        tags: [],
        isFavorite: false,
        pageType: 'entry',
      });
    }
    setActiveTab('notebook');
  };

  const handleCreateNewEntry = (type = 'entry') => {
    setSelectedEntry({
      date: new Date().toISOString().split('T')[0],
      title: type === 'title_page' ? 'New Section' : '',
      subtitle: '',
      content: '',
      mood: 'happy',
      tags: [],
      isFavorite: false,
      pageType: type,
    });
    setActiveTab('notebook');
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 md:py-7 z-10 flex flex-col gap-5">
        {/* Header & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1744] border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
                DIGITAL DIARY • Y2K RETRO BOOK
              </span>
              <BookMarked size={14} className="text-[#f3df23]" />
            </div>
            <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
              Flip-Book Journal
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setActiveTab('notebook');
              }}
              className={`px-3 py-2 border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] font-medium transition-transform active:translate-y-0.5 ${
                activeTab === 'notebook'
                  ? 'bg-[#f3df23] text-black font-semibold'
                  : 'bg-[#2a2663] text-white hover:bg-[#39347d]'
              }`}
            >
              <BookOpen size={14} /> Digital Book
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setActiveTab('calendar');
              }}
              className={`px-3 py-2 border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] font-medium transition-transform active:translate-y-0.5 ${
                activeTab === 'calendar'
                  ? 'bg-[#f3df23] text-black font-semibold'
                  : 'bg-[#2a2663] text-white hover:bg-[#39347d]'
              }`}
            >
              <Calendar size={14} /> Mood Calendar
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setActiveTab('archive');
              }}
              className={`px-3 py-2 border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] font-medium transition-transform active:translate-y-0.5 ${
                activeTab === 'archive'
                  ? 'bg-[#f3df23] text-black font-semibold'
                  : 'bg-[#2a2663] text-white hover:bg-[#39347d]'
              }`}
            >
              <Star size={14} /> All Pages ({entries.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Digital Book with Persistent Side Index */}
        {activeTab === 'notebook' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start justify-center w-full">
            {/* Desktop Persistent Side Index */}
            <div className="hidden lg:block shrink-0">
              <JournalSideIndex
                entries={entries}
                currentEntryId={selectedEntry?.id}
                onSelectEntry={(entry) => setSelectedEntry(entry)}
                onNewPageClick={() => setIsNewPageModalOpen(true)}
              />
            </div>

            {/* Mobile Slide-out Drawer for Side Index */}
            <AnimatePresence>
              {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden bg-black/70 backdrop-blur-xs">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-4/5 max-w-sm h-full bg-[#1a1744] shadow-2xl"
                  >
                    <JournalSideIndex
                      entries={entries}
                      currentEntryId={selectedEntry?.id}
                      onSelectEntry={(entry) => setSelectedEntry(entry)}
                      onNewPageClick={() => {
                        setIsMobileDrawerOpen(false);
                        setIsNewPageModalOpen(true);
                      }}
                      isMobileDrawer={true}
                      onCloseDrawer={() => setIsMobileDrawerOpen(false)}
                    />
                  </motion.div>
                  <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
                </div>
              )}
            </AnimatePresence>

            {/* Main Digital Notebook Component */}
            <div className="flex-1 min-w-0 max-w-4xl w-full">
              <FlipNotebook
                entry={selectedEntry}
                onSave={(data) => {
                  saveEntry(data);
                  setSelectedEntry(data);
                }}
                onDelete={(id) => {
                  deleteEntry(id);
                  setSelectedEntry(null);
                }}
                onToggleFavorite={toggleFavoriteEntry}
                onNewEntry={(type) => handleCreateNewEntry(type)}
                allEntries={entries}
                onSelectEntry={(entry) => setSelectedEntry(entry)}
                onToggleSideIndex={() => setIsMobileDrawerOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Calendar Mode */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RetroCalendar
                entries={entries}
                selectedDate={selectedEntry?.date}
                onSelectDate={handleSelectDateFromCalendar}
              />
            </div>

            {/* Selected day preview card */}
            <div className="lg:col-span-1 bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-pixel text-xs text-[#f3df23] pb-2 border-b border-black/40 mb-3">
                  Selected Day Info
                </h3>
                {selectedEntry ? (
                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <div className="font-pixel text-[10px] text-white/60 mb-0.5">DATE:</div>
                      <div className="font-bold text-white text-sm">{selectedEntry.date}</div>
                    </div>
                    {selectedEntry.title && (
                      <div>
                        <div className="font-pixel text-[10px] text-white/60 mb-0.5">TITLE:</div>
                        <div className="text-white text-sm font-medium">{selectedEntry.title}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-pixel text-[10px] text-white/60 mb-0.5">MOOD:</div>
                      <div className="text-xs capitalize text-[#50fa7b] font-medium">
                        {selectedEntry.mood || 'None recorded'}
                      </div>
                    </div>
                    {selectedEntry.content && (
                      <div>
                        <div className="font-pixel text-[10px] text-white/60 mb-0.5">PREVIEW:</div>
                        <p className="text-xs text-white/80 line-clamp-4 italic leading-relaxed">
                          "{selectedEntry.content}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-white/60 font-sans leading-relaxed">
                    Click any day on the calendar to inspect or write a journal entry for that date.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-black/40">
                <PixelButton
                  size="sm"
                  variant="yellow"
                  className="w-full"
                  onClick={() => setActiveTab('notebook')}
                >
                  Open In Digital Book →
                </PixelButton>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Archive and Search */}
        {activeTab === 'archive' && (
          <div className="flex flex-col gap-4">
            {/* Search & Filter Toolbar */}
            <div className="bg-[#191642] border-2 border-black shadow-[3px_3px_0px_#000] p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search size={16} className="text-[#f3df23]" />
                <input
                  type="text"
                  placeholder="Search entries by title, keyword, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-black/60 px-3 py-1.5 text-xs font-sans text-white w-full focus:outline-none rounded-xs"
                />
              </div>

              <div className="flex items-center gap-2 font-sans text-xs">
                <span className="text-white/70 flex items-center gap-1 font-medium">
                  <Filter size={13} /> Filter:
                </span>
                <select
                  value={moodFilter}
                  onChange={(e) => setMoodFilter(e.target.value)}
                  className="bg-[#2a2663] border border-black/60 text-xs px-2.5 py-1.5 text-white focus:outline-none rounded-xs"
                >
                  <option value="all">All Moods</option>
                  <option value="happy">Happy</option>
                  <option value="calm">Calm</option>
                  <option value="excited">Excited</option>
                  <option value="neutral">Neutral</option>
                  <option value="grateful">Grateful</option>
                  <option value="sad">Sad</option>
                  <option value="anxious">Anxious</option>
                  <option value="tired">Tired</option>
                </select>
              </div>
            </div>

            {/* Entries Grid */}
            {filteredEntries.length === 0 ? (
              <div className="bg-[#181646] border-2 border-black shadow-[3px_3px_0px_#000] p-8 text-center">
                <div className="font-pixel text-xs text-[#f3df23] mb-2">NO ENTRIES FOUND</div>
                <p className="text-xs text-white/70 font-sans mb-4">
                  No journal entries match your filter. Start writing your reflections today!
                </p>
                <PixelButton
                  size="sm"
                  variant="yellow"
                  onClick={() => {
                    handleCreateNewEntry('entry');
                    setActiveTab('notebook');
                  }}
                >
                  + Write First Entry
                </PixelButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      soundFx.play('blip');
                      setSelectedEntry(entry);
                      setActiveTab('notebook');
                    }}
                    className="bg-[#1b1847] hover:bg-[#25225c] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer transition-all flex flex-col justify-between rounded-xs"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2 font-sans text-xs">
                        <span className="text-[#f3df23] font-medium">{entry.date}</span>
                        {entry.isFavorite && (
                          <Star size={13} className="fill-yellow-400 text-yellow-500" />
                        )}
                      </div>
                      <h3 className="font-pixel text-xs text-white line-clamp-1 mb-2">
                        {entry.title || (entry.pageType === 'title_page' ? 'Title Page' : 'Reflection')}
                      </h3>
                      {entry.subtitle && (
                        <p className="font-sans text-[11px] text-pink-300 line-clamp-1 italic mb-1">
                          {entry.subtitle}
                        </p>
                      )}
                      <p className="font-sans text-xs text-white/70 line-clamp-3 leading-relaxed">
                        {entry.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-black/30 flex justify-between items-center font-sans text-xs">
                      <span className="text-[#50fa7b] capitalize font-medium">
                        {entry.mood ? `• ${entry.mood}` : '• Reflection'}
                      </span>
                      <span className="text-white/50">{entry.wordCount || 0} words</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* New Page Selection Modal */}
      <NewPageTypeModal
        isOpen={isNewPageModalOpen}
        onClose={() => setIsNewPageModalOpen(false)}
        onSelectType={(type) => handleCreateNewEntry(type)}
      />
    </div>
  );
}
