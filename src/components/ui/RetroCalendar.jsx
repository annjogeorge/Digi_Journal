import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Calendar as CalendarIcon } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function RetroCalendar({ entries = [], onSelectDate, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    soundFx.play('blip');
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    soundFx.play('blip');
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build days grid
  const days = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      dayNumber: prevMonthDays - i,
      dateStr: null,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(i).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const entry = entries.find((e) => e.date === dateStr);

    days.push({
      dayNumber: i,
      dateStr,
      isCurrentMonth: true,
      entry,
    });
  }

  // Next month padding to keep 35 or 42 cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      dayNumber: i,
      dateStr: null,
      isCurrentMonth: false,
    });
  }

  // Mood color helper for legend
  const getDayStatusColor = (entry) => {
    if (!entry) return 'bg-[#181646] hover:bg-[#282563] text-white/50 border-black/50';

    // Positive
    if (['happy', 'excited', 'grateful'].includes(entry.mood)) {
      return 'bg-[#50fa7b] text-black border-black font-semibold';
    }
    // Neutral or calm
    if (['calm', 'neutral'].includes(entry.mood)) {
      return 'bg-[#8be9fd] text-black border-black font-semibold';
    }
    // Negative or tired
    if (['sad', 'anxious', 'tired'].includes(entry.mood)) {
      return 'bg-[#ff79c6] text-black border-black font-semibold';
    }
    // Entry exists without specific mood
    return 'bg-[#bd93f9] text-black border-black font-semibold';
  };

  return (
    <div className="bg-[#191642] border-3 border-black shadow-[5px_5px_0px_#000] p-4 sm:p-6 select-none rounded-sm w-full">
      {/* Month & Year Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-black/40">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 sm:px-2.5 sm:py-2 bg-[#f3df23] text-black border-2 border-black hover:bg-[#ffe838] active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3df23]"
            aria-label={`Previous Month, ${monthNames[(month + 11) % 12]}`}
            title="Previous Month"
          >
            <ChevronLeft size={18} className="stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-[#f3df23] hidden sm:inline" />
            <h2 className="font-pixel text-sm sm:text-base md:text-lg text-white tracking-wider">
              {monthNames[month].toUpperCase()} {year}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 sm:px-2.5 sm:py-2 bg-[#f3df23] text-black border-2 border-black hover:bg-[#ffe838] active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3df23]"
            aria-label={`Next Month, ${monthNames[(month + 1) % 12]}`}
            title="Next Month"
          >
            <ChevronRight size={18} className="stroke-[2.5]" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.play('blip');
              setCurrentDate(new Date());
              onSelectDate?.(todayStr);
            }}
            className="font-pixel text-xs bg-[#f3df23] text-black px-4 py-2 border-2 border-black hover:bg-[#ffe838] active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_#000] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Go to Today"
          >
            TODAY
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-pixel text-[10px] sm:text-xs text-[#f3df23] mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-2 bg-black/30 border border-black/40 rounded-xs">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid with large, comfortable touch and click targets */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[56px] sm:min-h-[72px] md:min-h-[82px] border border-black/20 bg-black/25 flex items-start justify-end p-1.5 sm:p-2 opacity-25 text-xs sm:text-sm font-mono text-white/40 rounded-xs select-none"
                aria-hidden="true"
              >
                {item.dayNumber}
              </div>
            );
          }

          const isToday = item.dateStr === todayStr;
          const isSelected = item.dateStr === selectedDate;
          const hasEntry = Boolean(item.entry);
          const statusClass = getDayStatusColor(item.entry);

          return (
            <motion.button
              key={item.dateStr}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundFx.play('click');
                onSelectDate?.(item.dateStr);
              }}
              aria-label={`${monthNames[month]} ${item.dayNumber}, ${year}${
                hasEntry ? ` - Journal entry: ${item.entry.title || 'Untitled'}` : ' - No entry'
              }${isToday ? ' (Today)' : ''}`}
              className={`min-h-[56px] sm:min-h-[72px] md:min-h-[82px] border-2 flex flex-col justify-between p-1.5 sm:p-2 relative transition-all cursor-pointer rounded-xs text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3df23] ${statusClass} ${
                isToday
                  ? 'ring-2 sm:ring-3 ring-[#f3df23] ring-offset-2 ring-offset-[#191642] font-black z-10'
                  : ''
              } ${
                isSelected
                  ? 'outline-2 outline-white scale-102 shadow-[0_0_10px_rgba(255,255,255,0.4)] z-10'
                  : ''
              }`}
            >
              <div className="flex justify-between w-full items-start">
                <span className={`text-xs sm:text-sm font-bold ${hasEntry ? 'font-sans' : 'font-mono'}`}>
                  {item.dayNumber}
                </span>
                <div className="flex items-center gap-1">
                  {item.entry?.isFavorite && (
                    <Star size={13} className="fill-yellow-400 text-yellow-600 drop-shadow-sm" />
                  )}
                  {isToday && (
                    <span className="font-pixel text-[7px] bg-[#f3df23] text-black px-1 py-0.2 rounded-xs border border-black hidden sm:inline">
                      NOW
                    </span>
                  )}
                </div>
              </div>

              {/* Entry metadata or dot indicator */}
              {hasEntry ? (
                <div className="w-full mt-1">
                  <div className="hidden sm:block text-[10px] font-sans font-medium line-clamp-1 opacity-90 leading-tight">
                    {item.entry.title || 'Journaled'}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-black/70" />
                    <span className="font-pixel text-[8px] uppercase opacity-75 hidden md:inline">
                      {item.entry.mood}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-white/20 font-mono hidden sm:block self-end">
                  —
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mood Legend and Status indicators */}
      <div className="mt-5 pt-3.5 border-t-2 border-black/40 flex flex-wrap items-center justify-between gap-3 font-sans text-xs text-white/90">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#50fa7b] border border-black rounded-xs inline-block shadow-[1px_1px_0px_#000]" />
            <span className="font-medium">Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#8be9fd] border border-black rounded-xs inline-block shadow-[1px_1px_0px_#000]" />
            <span className="font-medium">Calm / Neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#ff79c6] border border-black rounded-xs inline-block shadow-[1px_1px_0px_#000]" />
            <span className="font-medium">Difficult</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#bd93f9] border border-black rounded-xs inline-block shadow-[1px_1px_0px_#000]" />
            <span className="font-medium">Reflection</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 border border-black/30 rounded-xs">
          <span className="w-3 h-3 border-2 border-[#f3df23] rounded-xs inline-block bg-[#191642]" />
          <span className="font-pixel text-[10px] text-[#f3df23]">TODAY'S DATE</span>
        </div>
      </div>
    </div>
  );
}
