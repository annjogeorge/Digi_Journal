import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PixelStars from '../components/ui/PixelStars';
import FloatingSprite from '../components/ui/FloatingSprite';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelButton from '../components/ui/PixelButton';
import RetroPet from '../components/ui/RetroPet';
import OnboardingTutorial from '../components/ui/OnboardingTutorial';
import { IMAGES } from '../constants/assets';
import { soundFx } from '../utils/soundEffects';
import { useJournal } from '../context/JournalContext';
import {
  BookOpen,
  CheckSquare,
  Mail,
  Sparkles,
  Flame,
  LayoutGrid,
  Monitor,
  HelpCircle,
  BookMarked,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    entries,
    todos,
    letters,
    currentLevel,
    xpInCurrentLevel,
    profile,
    getStreakData,
    isTutorialOpen,
    setIsTutorialOpen,
    completeTutorial,
    replayTutorial,
  } = useJournal();
  const [viewMode, setViewMode] = useState('desktop'); // default to 'desktop' as requested

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find((e) => e.date === todayStr);
  const tasksCompletedToday = todos.filter((t) => t.completed).length;
  const streak = getStreakData();

  const desktopIcons = [
    { title: 'My Journal', path: '/journal', icon: IMAGES.hero || IMAGES.computer, label: 'jounaling' },
    { title: 'To-Do Quest', path: '/todo', icon: IMAGES.todo || IMAGES.controller, label: 'to dooo' },
    { title: 'Future Mail', path: '/future-me', icon: IMAGES.future || IMAGES.msg, label: 'future mails' },
    { title: 'Calendar', path: '/journal', isCalendar: true, label: 'calendar' },
    { title: 'Stats & XP', path: '/stats', icon: IMAGES.computer, label: 'stats' },
    { title: 'Settings', path: '/settings', icon: IMAGES.cd, label: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      {/* Decorative Floating Sprites */}
      <FloatingSprite
        src={IMAGES.computer}
        alt="Computer"
        className="absolute top-20 left-4 md:left-8 w-16 md:w-24 opacity-50 pointer-events-none hidden lg:block"
      />
      <FloatingSprite
        src={IMAGES.phone}
        alt="Phone"
        className="absolute top-24 right-4 md:right-8 w-14 md:w-20 opacity-50 pointer-events-none hidden lg:block"
        delay={0.5}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        {/* Top Header / Player Level & Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1744] border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_#000]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
                PLAYER DASHBOARD
              </span>
              <Sparkles size={12} className="text-[#f3df23]" />
            </div>
            <h1 className="font-pixel text-lg sm:text-xl md:text-2xl text-white tracking-wide">
              Welcome back, {profile.name || 'Annjo'}!
            </h1>
            <p className="text-white/75 text-xs sm:text-sm mt-1 font-sans">
              Ready for your daily journaling quest? Level {currentLevel} Adventurer.
            </p>
          </div>

          {/* Level / XP Progress Bar */}
          <div className="bg-[#121035] border-2 border-black p-3 min-w-[230px] shadow-[2px_2px_0px_#000]">
            <div className="flex justify-between items-center font-sans text-xs mb-1 font-medium">
              <span className="text-[#f3df23]">Level {currentLevel}</span>
              <span className="text-[#50fa7b] font-bold">{xpInCurrentLevel} / 100 XP</span>
            </div>
            <div className="w-full bg-black/70 h-2.5 border border-black/50 overflow-hidden rounded-xs">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpInCurrentLevel}%` }}
                transition={{ duration: 0.8 }}
                className="bg-[#50fa7b] h-full"
              />
            </div>
            <div className="flex items-center justify-between mt-2 font-sans text-xs text-white/70">
              <span className="flex items-center gap-1 text-orange-300 font-medium">
                <Flame size={13} /> {streak.currentStreak}-Day Streak
              </span>
              <button
                type="button"
                onClick={() => navigate('/stats')}
                className="text-[#f3df23] underline hover:text-white cursor-pointer"
              >
                Badges →
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher: Arcade vs Desktop OS Mode */}
        <div className="flex items-center justify-between border-b border-black/30 pb-2">
          <div className="font-sans text-xs text-white/70 font-medium">
            Navigation Mode:
          </div>
          <div className="flex items-center gap-2 font-sans text-xs">
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setViewMode('arcade');
              }}
              className={`px-3 py-1.5 border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                viewMode === 'arcade'
                  ? 'bg-[#f3df23] text-black shadow-[2px_2px_0px_#000] font-bold'
                  : 'bg-[#1a1744] text-white hover:bg-[#272363]'
              }`}
            >
              <LayoutGrid size={13} /> Journal & Quests
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.play('click');
                setViewMode('desktop');
              }}
              className={`px-3 py-1.5 border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                viewMode === 'desktop'
                  ? 'bg-[#f3df23] text-black shadow-[2px_2px_0px_#000] font-bold'
                  : 'bg-[#1a1744] text-white hover:bg-[#272363]'
              }`}
            >
              <Monitor size={13} /> Desktop Icons
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                replayTutorial();
              }}
              className="px-2.5 py-1.5 border-2 border-black bg-[#3b3378] text-white hover:bg-[#4d4399] flex items-center gap-1 cursor-pointer font-medium text-xs ml-2"
              title="Replay First-Time Tutorial"
            >
              <HelpCircle size={13} />
              <span className="hidden sm:inline">Tutorial</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            JOURNAL SPOTLIGHT: PRIMARY EXPERIENCE ON DASHBOARD
            ========================================================================= */}
        {viewMode === 'arcade' ? (
          <div className="flex flex-col gap-5">
            {/* Grand Hero Journal Card */}
            <div className="bg-[#1b1847] border-3 border-black shadow-[5px_5px_0px_#000] p-5 sm:p-7 relative overflow-hidden">
              {/* Corner Accent Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[10px] bg-[#f3df23] text-black px-2.5 py-1 font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_#000]">
                    ★ MAIN FEATURE ★
                  </span>
                  <span className="font-pixel text-xs text-white/90">
                    DIGITAL FLIP-BOOK JOURNAL
                  </span>
                </div>

                <div className="font-sans text-xs text-white/80 bg-black/30 border border-black/40 px-2.5 py-1 rounded-xs">
                  {entries.length} {entries.length === 1 ? 'Page' : 'Pages'} Written in Diary
                </div>
              </div>

              {/* Journal Spotlight Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <h2 className="font-pixel text-lg sm:text-xl text-white">
                    {todayEntry ? 'Today’s Memory is Recorded!' : 'Write Today’s Reflection'}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
                    {todayEntry
                      ? `You wrote "${todayEntry.title || 'Untitled'}" today (${todayEntry.wordCount || 0} words). Turn the pages of your real digital book, customize with stickers, or browse the complete table of contents.`
                      : 'Take a quiet moment to record your thoughts, mood, and memories. Enjoy authentic handwriting fonts, realistic page-turning animations, and retro stickers.'}
                  </p>

                  {/* Primary & Secondary Call to Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <PixelButton
                      variant="yellow"
                      size="md"
                      icon={<BookOpen size={16} />}
                      onClick={() => {
                        soundFx.play('click');
                        navigate('/journal');
                      }}
                    >
                      {todayEntry ? 'Open My Journal →' : 'Write Today’s Entry →'}
                    </PixelButton>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.play('click');
                        navigate('/journal');
                      }}
                      className="px-3.5 py-2 bg-[#2a2663] hover:bg-[#38337d] text-white border-2 border-black font-sans text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                    >
                      <BookMarked size={14} className="text-[#f3df23]" />
                      <span>Browse Book Index</span>
                    </button>
                  </div>
                </div>

                {/* Right Mini Preview of the Book Cover / Today */}
                <div
                  onClick={() => {
                    soundFx.play('click');
                    navigate('/journal');
                  }}
                  className="bg-[#efe5cf] border-3 border-[#3d2f1f] shadow-[4px_4px_0px_#000] p-4 text-[#2b251f] cursor-pointer hover:scale-[1.02] transition-transform rounded-xs select-none"
                >
                  <div className="border-b border-[#3d2f1f]/30 pb-2 mb-2 flex justify-between items-center font-sans text-xs">
                    <span className="font-bold text-[#3d2f1f]">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-pixel text-[9px] text-rose-600">PAGE #{Math.max(1, entries.length)}</span>
                  </div>
                  <h3 className="font-pixel text-xs text-[#2b251f] truncate mb-1">
                    {todayEntry ? todayEntry.title : 'Blank Page Waiting...'}
                  </h3>
                  <p className="font-sans text-[11px] text-[#2b251f]/75 line-clamp-2 italic">
                    {todayEntry ? todayEntry.content : 'Click to open book and write today’s memory...'}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#3d2f1f]/20 flex justify-between items-center text-[10px] font-sans text-[#3d2f1f]/80">
                    <span className="capitalize font-medium">
                      Mood: {todayEntry?.mood || 'Ready to write'}
                    </span>
                    <span className="text-black font-bold">Open Book →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Features Grid (Tasks & Future Letters) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tasks / Quests Card */}
              <div
                onClick={() => {
                  soundFx.play('click');
                  navigate('/todo');
                }}
                className="bg-[#7b5ea7] hover:bg-[#8e6fc0] text-white border-3 border-black shadow-[4px_4px_0px_#000] p-5 cursor-pointer flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-black/20 border border-black/30 rounded-xs">
                    <CheckSquare size={22} className="text-white" />
                  </div>
                  <span className="font-pixel text-[9px] px-2 py-0.5 bg-black/25 font-bold uppercase tracking-wider">
                    {todos.filter((t) => !t.completed).length} PENDING
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-pixel text-sm sm:text-base font-bold tracking-wide">
                    Daily Quests & To-Do
                  </h3>
                  <p className="font-sans text-xs opacity-90 mt-1 font-medium">
                    Check off daily tasks to earn +15 XP and level up.
                  </p>
                </div>
              </div>

              {/* Future Me Letters Card */}
              <div
                onClick={() => {
                  soundFx.play('click');
                  navigate('/future-me');
                }}
                className="bg-[#f4c2c2] hover:bg-[#ffd1d1] text-black border-3 border-black shadow-[4px_4px_0px_#000] p-5 cursor-pointer flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-black/10 border border-black/20 rounded-xs">
                    <Mail size={22} className="text-black" />
                  </div>
                  <span className="font-pixel text-[9px] px-2 py-0.5 bg-black/15 font-bold uppercase tracking-wider">
                    {letters.length} PRESERVED
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-pixel text-sm sm:text-base font-bold tracking-wide">
                    Future Me Time Capsules
                  </h3>
                  <p className="font-sans text-xs opacity-90 mt-1 font-medium">
                    Write sealed letters to your future self with unlock timers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop OS Icon Navigation */
          <div className="bg-[#181646] border-2 border-black shadow-[4px_4px_0px_#000] p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 rounded-sm">
            {desktopIcons.map((app) => (
              <motion.div
                key={app.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundFx.play('blip');
                  navigate(app.path);
                }}
                className="flex flex-col items-center justify-center p-3 hover:bg-white/10 border-2 border-transparent hover:border-black/50 cursor-pointer transition-all text-center rounded-xs"
              >
                <div className="w-13 h-13 bg-[#2e2a5c] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] mb-2 p-1.5 overflow-hidden">
                  {app.isCalendar ? (
                    <div className="w-10 h-10 bg-[#fffdf0] border-2 border-black flex flex-col overflow-hidden shadow-[1px_1px_0px_#000]">
                      <div className="bg-[#ff4757] h-3.5 border-b-2 border-black flex items-center justify-around px-1">
                        <div className="w-1.5 h-1.5 bg-black rounded-xs" />
                        <div className="w-1.5 h-1.5 bg-black rounded-xs" />
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center text-black">
                        <span className="font-pixel text-[11px] font-bold leading-none">
                          {new Date().getDate()}
                        </span>
                        <span className="font-sans text-[7px] font-bold uppercase tracking-wider text-black/60 leading-none mt-0.5">
                          {new Date().toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img src={app.icon} alt={app.title} className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <span className="font-pixel text-[10px] text-white tracking-tight">{app.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Daily Summary & Virtual Pet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Status Card */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1744] border-2 border-black shadow-[4px_4px_0px_#000] p-5">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/30">
                <BookOpen size={16} className="text-[#f3df23]" />
                <h3 className="font-pixel text-xs text-white">Daily Journal & Quest Summary</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4 font-sans">
                <div className="bg-[#121035] border-2 border-black p-3 rounded-xs shadow-[2px_2px_0px_#000]">
                  <div className="text-[11px] text-white/60 font-medium">DATE</div>
                  <div className="font-pixel text-xs text-[#f3df23] mt-1">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="bg-[#121035] border-2 border-black p-3 rounded-xs shadow-[2px_2px_0px_#000]">
                  <div className="text-[11px] text-white/60 font-medium">JOURNAL</div>
                  <div className="font-pixel text-xs text-[#50fa7b] mt-1">
                    {todayEntry ? 'LOGGED' : 'EMPTY'}
                  </div>
                </div>
                <div className="bg-[#121035] border-2 border-black p-3 rounded-xs shadow-[2px_2px_0px_#000]">
                  <div className="text-[11px] text-white/60 font-medium">QUESTS</div>
                  <div className="font-pixel text-xs text-[#8be9fd] mt-1">
                    {tasksCompletedToday} / {todos.length}
                  </div>
                </div>
                <div className="bg-[#121035] border-2 border-black p-3 rounded-xs shadow-[2px_2px_0px_#000]">
                  <div className="text-[11px] text-white/60 font-medium">TOTAL PAGES</div>
                  <div className="font-pixel text-xs text-[#ff79c6] mt-1">
                    {entries.length}
                  </div>
                </div>
              </div>

              {/* Quick Jump Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/30 font-sans">
                <div className="text-xs text-white/80">
                  {todayEntry
                    ? `Today’s reflection is recorded with mood: ${todayEntry.mood}`
                    : 'Take 2 minutes to record your reflections for today.'}
                </div>
                <div className="flex gap-2">
                  <PixelButton
                    size="sm"
                    variant="yellow"
                    onClick={() => navigate('/journal')}
                  >
                    {todayEntry ? 'Open Digital Book' : '+ Write Reflection'}
                  </PixelButton>
                  <PixelButton
                    size="sm"
                    variant="purple"
                    onClick={() => navigate('/stats')}
                  >
                    Badges & XP
                  </PixelButton>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Pixel Companion Card */}
          <div className="lg:col-span-1">
            <RetroPet />
          </div>
        </div>
      </main>

      {/* Guided First-Time Onboarding Tutorial */}
      <OnboardingTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onFinish={completeTutorial}
      />
    </div>
  );
}
