'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink, Clock, Calendar } from 'lucide-react';

// Robust date parsing utility (timezone-safe and handles various styles)
function parseSarkariDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  // 1. Try dd/mm/yyyy or dd-mm-yyyy (most common Indian date format)
  const dmy = clean.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy) {
    return new Date(parseInt(dmy[3]), parseInt(dmy[2]) - 1, parseInt(dmy[1]));
  }
  
  // 2. Try yyyy-mm-dd or yyyy/mm/dd (standard ISO style)
  const ymd = clean.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymd) {
    return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
  }
  
  // 3. Try "dd MMM YYYY" like "15 Jun 2026" or "15 June 2026"
  const m = clean.match(/(\d{1,2})\s+([A-Za-z]{3,10})\s+(\d{4})/);
  if (m) {
    const day = parseInt(m[1]);
    const monthStr = m[2].toLowerCase().slice(0, 3);
    const year = parseInt(m[3]);
    const month = months[monthStr];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // 4. Try "MMM dd, YYYY" like "June 20, 2026"
  const mdy = clean.match(/([A-Za-z]{3,10})\s+(\d{1,2}),?\s+(\d{4})/);
  if (mdy) {
    const monthStr = mdy[1].toLowerCase().slice(0, 3);
    const day = parseInt(mdy[2]);
    const year = parseInt(mdy[3]);
    const month = months[monthStr];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }
  
  // No fallback to native new Date(clean) to avoid timezone/locale parsing ambiguities.
  return null;
}

export default function SarkariCalendar({ allItems }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Server-side render fallback (June 2026)
  const [selectedDay, setSelectedDay] = useState(null);

  // Client-side initialization to dynamic current date on mount to avoid hydration mismatch
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Process all items to build events list
  const events = [];
  if (allItems && Array.isArray(allItems)) {
    allItems.forEach(item => {
      // Apply Start
      if (item.dates?.applyStart) {
        const d = parseSarkariDate(item.dates.applyStart);
        if (d) {
          events.push({
            date: d,
            type: 'start',
            label: 'Apply Starts',
            color: 'green',
            badge: 'bg-green-50 text-green-700 border-green-200',
            dot: 'bg-green-500',
            title: item.title,
            org: item.org || 'Latest Job',
            slug: item.slug || item.id
          });
        }
      }
      // Apply End (Last Date)
      if (item.dates?.applyEnd || item.lastDate) {
        const d = parseSarkariDate(item.dates?.applyEnd || item.lastDate);
        if (d) {
          events.push({
            date: d,
            type: 'end',
            label: 'Last Date to Apply',
            color: 'red',
            badge: 'bg-red-50 text-red-700 border-red-200',
            dot: 'bg-red-500',
            title: item.title,
            org: item.org || 'Latest Job',
            slug: item.slug || item.id
          });
        }
      }
      // Exam Date
      if (item.examDate || item.dates?.examDate) {
        const d = parseSarkariDate(item.examDate || item.dates.examDate);
        if (d) {
          events.push({
            date: d,
            type: 'exam',
            label: 'Exam Date',
            color: 'blue',
            badge: 'bg-blue-50 text-blue-700 border-blue-200',
            dot: 'bg-blue-500',
            title: item.title,
            org: item.org || 'Exam Alert',
            slug: item.slug || item.id
          });
        }
      }
    });
  }

  // 2. Generate days in calendar grid
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week for 1st of month (0-6)
  const totalDays = new Date(year, month + 1, 0).getDate(); // Number of days in current month

  const daysGrid = [];
  // Add empty spaces for padding
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  // Add actual days
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(new Date(year, month, d));
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Get events falling on a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(e => 
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  };

  // Helper to compare selected day
  const isSelected = (date) => {
    if (!date || !selectedDay) return false;
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    );
  };

  const selectedDayEvents = selectedDay ? getEventsForDate(selectedDay) : [];

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm w-full animate-fade-in-up">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-900" />
          <h3 className="font-extrabold text-blue-950 text-lg uppercase tracking-wide">
            Exam & Application Calendar
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm text-gray-800 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-6">
        {/* Days of week */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
            {day}
          </span>
        ))}

        {/* Days cells */}
        {daysGrid.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="bg-gray-50/50 rounded-lg min-h-[75px] opacity-40"></div>;
          }

          const dateEvents = getEventsForDate(date);
          const hasEvents = dateEvents.length > 0;
          const selected = isSelected(date);

          return (
            <button
              key={`day-${date.getDate()}`}
              onClick={() => setSelectedDay(date)}
              className={`rounded-xl p-2 min-h-[75px] md:min-h-[85px] transition-all relative border flex flex-col justify-between items-start text-left cursor-pointer ${
                selected 
                  ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-100' 
                  : 'border-gray-200/70 hover:border-gray-300 hover:bg-gray-50/60 bg-white'
              }`}
            >
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                selected ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
              }`}>
                {date.getDate()}
              </span>

              {/* Event indicators */}
              <div className="w-full mt-2 space-y-1">
                {/* Desktop view indicators */}
                <div className="hidden md:block space-y-0.5">
                  {dateEvents.slice(0, 2).map((e, eIdx) => (
                    <div 
                      key={eIdx}
                      className={`text-[9px] font-bold px-1 py-0.5 rounded truncate border leading-none ${e.badge}`}
                    >
                      {e.label.split(' ')[0]}: {e.org}
                    </div>
                  ))}
                  {dateEvents.length > 2 && (
                    <div className="text-[8px] text-gray-400 font-semibold pl-1">
                      + {dateEvents.length - 2} more
                    </div>
                  )}
                </div>

                {/* Mobile view dots */}
                <div className="flex md:hidden gap-1 justify-center w-full">
                  {dateEvents.slice(0, 3).map((e, eIdx) => (
                    <span 
                      key={eIdx} 
                      className={`w-1.5 h-1.5 rounded-full ${e.dot}`}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Events Drawer */}
      <div className="border-t border-gray-100 pt-6">
        {selectedDay ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h4 className="font-bold text-gray-700 text-sm">
                Sarkari Updates for {selectedDay.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </h4>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDayEvents.map((e, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-sm flex flex-col justify-between items-start gap-2.5"
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${e.badge}`}>
                          {e.label}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">
                          {e.org}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {e.title}
                      </p>
                    </div>
                    <Link 
                      href={`/job/${e.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-750 font-bold hover:underline cursor-pointer"
                    >
                      View Details & Form <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5 text-center text-xs text-gray-450 border border-gray-200/40">
                No major application openings, closings, or exam dates scheduled on this date.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-5 text-center text-xs text-gray-450 border border-gray-200/40 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Click any date in the calendar above to view its exam deadlines and application details.
          </div>
        )}
      </div>
    </div>
  );
}
