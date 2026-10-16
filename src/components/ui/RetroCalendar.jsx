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
    <div className="bg-[#191642] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5 select-none rounded-sm">
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 bg-[#f3df23] text-black border-2 border-black hover:bg-[#ffe838] cursor-pointer shadow-[2px_2px_0px_#000]"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-pixel text-xs sm:text-sm text-white tracking-wider">
            {monthNames[month].toUpperCase()} {year}
          </h2>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 bg-[#f3df23] text-black border-2 border-black hover:bg-[#ffe838] cursor-pointer shadow-[2px_2px_0px_#000]"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.play('blip');
            setCurrentDate(new Date());
            onSelectDate?.(todayStr);
          }}
          className="font-pixel text-[10px] bg-[#3b3378] text-white px-3 py-1.5 border-2 border-black hover:bg-[#4d4496] cursor-pointer shadow-[2px_2px_0px_#000]"
        >
          TODAY
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-pixel text-[9px] text-[#f3df23] mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return (
              <div
                key={`empty-${idx}`}
                className="h-10 sm:h-12 border border-black/20 bg-black/20 flex items-center justify-center opacity-30 text-xs font-sans text-white/40"
              >
                {item.dayNumber}
              </div>
            );
          }

          const isToday = item.dateStr === todayStr;
          const isSelected = item.dateStr === selectedDate;
          const statusClass = getDayStatusColor(item.entry);

          return (
            <motion.button
              key={item.dateStr}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundFx.play('click');
                onSelectDate?.(item.dateStr);
              }}
              className={`h-10 sm:h-12 border-2 flex flex-col items-center justify-between p-1 relative transition-all cursor-pointer rounded-xs ${statusClass} ${
                isToday ? 'ring-2 ring-[#f3df23] ring-offset-2 ring-offset-[#191642]' : ''
              } ${isSelected ? 'outline-2 outline-white scale-102' : ''}`}
            >
              <div className="flex justify-between w-full items-start">
                <span className="font-sans text-xs font-semibold">{item.dayNumber}</span>
                {item.entry?.isFavorite && (
                  <Star size={11} className="fill-yellow-400 text-yellow-500" />
                )}
              </div>

              {item.entry && (
                <div className="w-1.5 h-1.5 rounded-full bg-current mb-0.5 opacity-80" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mood Legend with clean badge dots */}
      <div className="mt-4 pt-3 border-t-2 border-black/30 flex flex-wrap gap-3 font-sans text-xs text-white/85">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#50fa7b] border border-black rounded-xs inline-block" />
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#8be9fd] border border-black rounded-xs inline-block" />
          <span>Calm / Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#ff79c6] border border-black rounded-xs inline-block" />
          <span>Difficult</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-[#f3df23] rounded-xs inline-block" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
