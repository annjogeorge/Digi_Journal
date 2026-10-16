import React from 'react';
import { motion } from 'framer-motion';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import PixelCard from '../components/ui/PixelCard';
import { useJournal } from '../context/JournalContext';
import { MOODS } from '../components/ui/MoodSelector';
import {
  Award,
  Flame,
  BookOpen,
  CheckSquare,
  Mail,
  Calendar,
  BarChart3,
  Star,
  Trophy,
  Heart,
} from 'lucide-react';

export default function Statistics() {
  const {
    entries,
    todos,
    letters,
    xp,
    currentLevel,
    xpInCurrentLevel,
    achievementsList,
    unlockedAchievements,
    getStreakData,
  } = useJournal();

  const totalWords = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
  const tasksDone = todos.filter((t) => t.completed).length;
  const streak = getStreakData();

  // Mood breakdown counts
  const moodCounts = MOODS.map((m) => {
    const count = entries.filter((e) => e.mood === m.id).length;
    return { ...m, count };
  });

  const totalLoggedMoods = moodCounts.reduce((acc, curr) => acc + curr.count, 0);

  // Top mood
  const sortedMoods = [...moodCounts].sort((a, b) => b.count - a.count);
  const favoriteMood = sortedMoods[0]?.count > 0 ? sortedMoods[0] : null;

  // Mini activity heatmap for last 28 days
  const today = new Date();
  const last28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hasEntry = entries.some((e) => e.date === dateStr);
    return {
      dateStr,
      hasEntry,
      dayNum: d.getDate(),
    };
  });

  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen size={20} className="text-[#8be9fd]" />;
      case 'Flame':
        return <Flame size={20} className="text-orange-400" />;
      case 'Award':
        return <Award size={20} className="text-[#f3df23]" />;
      case 'CheckSquare':
        return <CheckSquare size={20} className="text-[#50fa7b]" />;
      case 'Mail':
        return <Mail size={20} className="text-[#f4c2c2]" />;
      case 'Star':
        return <Star size={20} className="text-[#f1fa8c]" />;
      case 'Heart':
        return <Heart size={20} className="text-[#ff79c6]" />;
      default:
        return <Trophy size={20} className="text-[#f3df23]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
                PLAYER ACHIEVEMENTS & METRICS
              </span>
              <BarChart3 size={14} className="text-[#f3df23]" />
            </div>
            <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
              Game Stats & Trophies
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-sans mt-0.5">
              Live statistics calculated directly from your real journal entries, quests, and letters.
            </p>
          </div>

          <div className="bg-[#121035] border border-black/60 bg-[#131135] p-3 min-w-[210px]">
            <div className="flex justify-between items-center font-sans text-xs text-white/70 mb-1 font-medium">
              <span>Level {currentLevel}</span>
              <span className="text-[#50fa7b] font-bold">{xp} Total XP</span>
            </div>
            <div className="w-full bg-black/70 h-2.5 border border-black/60 overflow-hidden rounded-xs">
              <div
                className="bg-[#50fa7b] h-full"
                style={{ width: `${xpInCurrentLevel}%` }}
              />
            </div>
            <div className="font-sans text-xs text-[#f3df23] mt-1 text-right font-medium">
              {100 - xpInCurrentLevel} XP to Level {currentLevel + 1}
            </div>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PixelCard variant="yellow">
            <div className="flex items-center justify-between text-black mb-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider">Entries</span>
              <BookOpen size={16} />
            </div>
            <div className="font-pixel text-2xl text-black">{entries.length}</div>
            <div className="font-sans text-xs text-black/75 mt-1">{totalWords} words recorded</div>
          </PixelCard>

          <PixelCard variant="purple">
            <div className="flex items-center justify-between text-white mb-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider">Streak</span>
              <Flame size={16} className="text-orange-400" />
            </div>
            <div className="font-pixel text-2xl text-white">{streak.currentStreak} Days</div>
            <div className="font-sans text-xs text-white/75 mt-1">Best: {streak.longestStreak} days active</div>
          </PixelCard>

          <PixelCard variant="dark">
            <div className="flex items-center justify-between text-[#50fa7b] mb-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider">Quests</span>
              <CheckSquare size={16} />
            </div>
            <div className="font-pixel text-2xl text-white">{tasksDone}</div>
            <div className="font-sans text-xs text-white/75 mt-1">Out of {todos.length} total tasks</div>
          </PixelCard>

          <PixelCard variant="default">
            <div className="flex items-center justify-between text-[#f4c2c2] mb-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider">Top Mood</span>
              {favoriteMood ? <favoriteMood.icon size={16} /> : <Star size={16} />}
            </div>
            <div className="font-pixel text-xl capitalize text-white">
              {favoriteMood ? favoriteMood.label : 'None'}
            </div>
            <div className="font-sans text-xs text-white/75 mt-1">
              {letters.length} Letters sealed
            </div>
          </PixelCard>
        </div>

        {/* 28-Day Heatmap & Mood Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5">
            <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/30">
              <Calendar size={16} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs text-white">28-Day Activity Heatmap</h3>
            </div>
            <p className="text-xs text-white/70 font-sans mb-3">
              Journaling consistency over the last 4 weeks:
            </p>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {last28Days.map((day) => (
                <div
                  key={day.dateStr}
                  title={`${day.dateStr}: ${day.hasEntry ? 'Journaled' : 'No entry'}`}
                  className={`h-9 border border-black/60 flex items-center justify-center font-sans text-xs transition-transform hover:scale-105 cursor-pointer rounded-xs ${
                    day.hasEntry
                      ? 'bg-[#50fa7b] text-black font-bold shadow-[2px_2px_0px_#000]'
                      : 'bg-black/30 text-white/30'
                  }`}
                >
                  {day.dayNum}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/30 font-sans text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-black/40 border border-black/50 inline-block" />
                <span>No Entry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#50fa7b] border border-black inline-block" />
                <span>Journaled</span>
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5">
            <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/30">
              <Award size={16} className="text-[#f3df23]" />
              <h3 className="font-pixel text-xs text-white">Mood Distribution</h3>
            </div>
            {totalLoggedMoods === 0 ? (
              <p className="text-xs text-white/60 font-sans py-6 text-center leading-relaxed">
                Log moods with your daily reflections to populate your emotional distribution chart.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {moodCounts
                  .filter((m) => m.count > 0)
                  .map((m) => {
                    const percent = Math.round((m.count / totalLoggedMoods) * 100);
                    const IconComponent = m.icon;
                    return (
                      <div key={m.id}>
                        <div className="flex justify-between items-center font-sans text-xs text-white/90 mb-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <IconComponent size={14} style={{ color: m.color }} /> {m.label}
                          </span>
                          <span className="text-[#f3df23] font-medium">{m.count} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-black/50 h-2 border border-black/40 overflow-hidden rounded-xs">
                          <div
                            className="h-full transition-all duration-400"
                            style={{ width: `${percent}%`, backgroundColor: m.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Trophies & Achievements Showcase */}
        <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5">
          <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/30">
            <Trophy size={16} className="text-[#f3df23]" />
            <h3 className="font-pixel text-xs text-white">Trophies & Badges</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievementsList.map((ach) => {
              const isUnlocked = unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`border-2 border-black shadow-[3px_3px_0px_#000] p-3 flex items-start gap-3 transition-all rounded-xs ${
                    isUnlocked
                      ? 'bg-[#191642] text-white shadow-[3px_3px_0px_#000]'
                      : 'bg-black/40 text-white/30 border-black/60 grayscale opacity-55'
                  }`}
                >
                  <div className="p-2 bg-black/40 border border-black/40 shrink-0">
                    {getAchievementIcon(ach.iconName)}
                  </div>
                  <div>
                    <div className="font-pixel text-[10px] font-bold text-[#f3df23]">
                      {ach.title}
                    </div>
                    <div className="font-sans text-xs text-white/70 mt-0.5 leading-snug">
                      {ach.desc}
                    </div>
                    <div className="font-sans text-[11px] text-[#50fa7b] font-semibold mt-1">
                      {isUnlocked ? 'Unlocked' : `+${ach.xp} XP`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
