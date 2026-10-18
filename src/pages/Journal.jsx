import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import FlipNotebook from '../components/ui/FlipNotebook';
import JournalSideIndex from '../components/ui/JournalSideIndex';
import NewPageTypeModal from '../components/ui/NewPageTypeModal';
import RetroCalendar from '../components/ui/RetroCalendar';
import RetroSelect from '../components/ui/RetroSelect';
import PixelButton from '../components/ui/PixelButton';
import AuthPromptModal from '../components/ui/AuthPromptModal';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { Search, Calendar, BookOpen, Star, BookMarked, Filter, Lock } from 'lucide-react';

const ARCHIVE_MOOD_OPTIONS = [
  { value: 'all', label: 'All Moods' },
  { value: 'happy', label: 'Happy' },
  { value: 'calm', label: 'Calm' },
  { value: 'excited', label: 'Excited' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'grateful', label: 'Grateful' },
  { value: 'sad', label: 'Sad' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'tired', label: 'Tired' },
];

const PREVIEW_ENTRY = {
  id: 'preview-welcome-sample',
  title: 'Welcome to DigiJournal (Read-Only Preview)',
  subtitle: 'A nostalgic digital journaling experience with Y2K retro identity',
  content: 'Welcome, traveler!\n\nThis is a safe preview of your DigiJournal digital book. You can flip through pages, browse the interactive calendar, test out retro handwriting fonts, and see how daily reflections and quests are recorded.\n\nTo write your own memories, save private thoughts, and keep them securely backed up in your personal cloud, create a free account or log in.',
  date: new Date().toISOString().split('T')[0],
  mood: 'happy',
  tags: ['Welcome', 'Preview', 'Retro', 'Diary'],
  isFavorite: true,
  pageType: 'entry',
  handwritingStyle: 'cozy',
  stickers: [],
  isPreview: true,
};

export default function Journal() {
  const [searchParams] = useSearchParams();
  const { user, entries, saveEntry, deleteEntry, toggleFavoriteEntry } = useJournal();

  // Active entries to display: if signed-out and empty, provide a clearly labeled demo page
  const displayEntries = !user && entries.length === 0 ? [PREVIEW_ENTRY] : entries;

  const initialTab = searchParams.get('tab') === 'calendar' ? 'calendar' : 'notebook';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedEntry, setSelectedEntry] = useState(displayEntries[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);

  // Auth prompt modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionPrompt, setAuthActionPrompt] = useState('save journal reflections');

  // Sync tab if search param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'calendar' || tabParam === 'archive' || tabParam === 'notebook') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Keep selectedEntry valid
  useEffect(() => {
    if (!selectedEntry && displayEntries.length > 0) {
      setSelectedEntry(displayEntries[0]);
    }
  }, [displayEntries, selectedEntry]);

  // Filter entries for archive view
  const filteredEntries = displayEntries.filter((e) => {
    const matchesSearch =
      (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.content && e.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesMood = moodFilter === 'all' || e.mood === moodFilter;

    return matchesSearch && matchesMood;
  });

  const handleSelectDateFromCalendar = (dateStr) => {
    const existing = displayEntries.find((e) => e.date === dateStr);
    if (existing) {
      setSelectedEntry(existing);
    } else {
      if (!user) {
        setAuthActionPrompt('write new journal reflections for this date');
        setIsAuthModalOpen(true);
        return;
      }
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
    if (!user) {
      setAuthActionPrompt('create and save new journal pages');
      setIsAuthModalOpen(true);
      return;
    }

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

  const handleRequireAuth = (actionName) => {
    setAuthActionPrompt(actionName || 'save personal journal entries');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 md:py-7 z-10 flex flex-col gap-5">
        {/* Unauthenticated Exploration Notice Banner */}
        {!user && (
          <div className="bg-[#171442] border-2 border-[#f3df23] shadow-[4px_4px_0px_#000] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xs">
            <div className="flex items-center gap-3">
              <span className="font-pixel text-[9px] bg-[#f3df23] text-black px-2.5 py-1 font-bold uppercase shadow-[1px_1px_0px_#000]">
                PREVIEW MODE
              </span>
              <p className="font-sans text-xs sm:text-sm text-white/90">
                You are currently exploring DigiJournal in <strong>read-only preview mode</strong>. Create an account to write, customize, and save private memories.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <PixelButton
                size="sm"
                variant="yellow"
                onClick={() => handleRequireAuth('write and save reflections in your private diary')}
              >
                Sign In to Save →
              </PixelButton>
            </div>
          </div>
        )}

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
              <Star size={14} /> All Pages ({displayEntries.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Digital Book with Persistent Side Index */}
        {activeTab === 'notebook' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start justify-center w-full">
            {/* Desktop Persistent Side Index */}
            <div className="hidden lg:block shrink-0">
              <JournalSideIndex
                entries={displayEntries}
                currentEntryId={selectedEntry?.id}
                onSelectEntry={(entry) => setSelectedEntry(entry)}
                onNewPageClick={() => {
                  if (!user) {
                    handleRequireAuth('create new journal pages');
                    return;
                  }
                  setIsNewPageModalOpen(true);
                }}
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
                      entries={displayEntries}
                      currentEntryId={selectedEntry?.id}
                      onSelectEntry={(entry) => setSelectedEntry(entry)}
                      onNewPageClick={() => {
                        setIsMobileDrawerOpen(false);
                        if (!user) {
                          handleRequireAuth('create new journal pages');
                          return;
                        }
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
                  if (!user) {
                    handleRequireAuth('save journal entries');
                    return false;
                  }
                  saveEntry(data);
                  setSelectedEntry(data);
                }}
                onDelete={(id) => {
                  if (!user) {
                    handleRequireAuth('delete journal entries');
                    return;
                  }
                  deleteEntry(id);
                  setSelectedEntry(null);
                }}
                onToggleFavorite={(id) => {
                  if (!user) {
                    handleRequireAuth('favorite journal entries');
                    return;
                  }
                  toggleFavoriteEntry(id);
                }}
                onNewEntry={(type) => handleCreateNewEntry(type)}
                allEntries={displayEntries}
                onSelectEntry={(entry) => setSelectedEntry(entry)}
                onToggleSideIndex={() => setIsMobileDrawerOpen(true)}
                isReadOnly={!user}
                onRequireAuth={handleRequireAuth}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Calendar Mode */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-2 xl:col-span-3">
              <RetroCalendar
                entries={displayEntries}
                selectedDate={selectedEntry?.date}
                onSelectDate={handleSelectDateFromCalendar}
              />
            </div>

            {/* Selected day preview card */}
            <div className="lg:col-span-1 xl:col-span-1 bg-[#1a1744] border-2 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5 flex flex-col justify-between rounded-sm">
              <div>
                <h3 className="font-pixel text-xs text-[#f3df23] pb-2 border-b border-black/40 mb-3 uppercase tracking-wider">
                  Selected Day Summary
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
                        <p className="text-xs text-white/80 line-clamp-5 italic leading-relaxed">
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
                  onClick={() => {
                    if (selectedEntry) {
                      setActiveTab('notebook');
                    } else {
                      if (!user) {
                        handleRequireAuth('write reflections');
                        return;
                      }
                      handleCreateNewEntry('entry');
                    }
                  }}
                >
                  {selectedEntry ? 'Open in Digital Book →' : '+ Write Reflection'}
                </PixelButton>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Archive Mode */}
        {activeTab === 'archive' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-[#1a1744] border-2 border-black p-4 shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search entries by title, keyword, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-black/60 pl-8 pr-3 py-1.5 text-xs font-sans text-white w-full focus:outline-none focus:border-[#f3df23] rounded-xs"
                />
              </div>

              <div className="flex items-center gap-2 font-sans text-xs w-full sm:w-auto">
                <span className="text-white/70 flex items-center gap-1 font-medium shrink-0">
                  <Filter size={13} /> Filter:
                </span>
                <div className="w-40 sm:w-44">
                  <RetroSelect
                    value={moodFilter}
                    onChange={(val) => setMoodFilter(val)}
                    options={ARCHIVE_MOOD_OPTIONS}
                    size="sm"
                    buttonClassName="bg-[#2a2663] border border-black/60 text-xs py-1.5 px-2.5"
                    menuClassName="bg-[#1b1747] border border-black"
                  />
                </div>
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
                    if (!user) {
                      handleRequireAuth('write first journal entry');
                      return;
                    }
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
                    className="bg-[#1b1847] hover:bg-[#25225c] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer transition-all flex flex-col justify-between rounded-xs hover:-translate-y-0.5 active:translate-y-0.5"
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

                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-black/30 font-sans text-[11px] text-white/60">
                      <span className="capitalize text-[#50fa7b]">Mood: {entry.mood}</span>
                      <span>{entry.wordCount || 0} words</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* New Page Type Modal */}
      <NewPageTypeModal
        isOpen={isNewPageModalOpen}
        onClose={() => setIsNewPageModalOpen(false)}
        onSelectType={(type) => {
          handleCreateNewEntry(type);
          setIsNewPageModalOpen(false);
        }}
      />

      {/* Authentication Prompt Modal for protected actions */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionName={authActionPrompt}
      />
    </div>
  );
}
