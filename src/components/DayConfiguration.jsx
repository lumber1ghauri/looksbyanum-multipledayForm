import { useState } from 'react';

export default function DayConfiguration({ 
  dayNumber, 
  totalDays, 
  daysData,
  currentDayIndex,
  children
}) {
  // Progress calculation
  const progress = ((dayNumber + 1) / totalDays) * 100;
  const eventName = daysData?.[dayNumber]?.event_name || '';

  return (
    <div className="space-y-6">
      {/* Day Progress Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {dayNumber === 0 && '🎨'}
                {dayNumber === 1 && '💒'}
                {dayNumber === 2 && '💍'}
                {dayNumber >= 3 && '🎉'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Day {dayNumber + 1} of {totalDays}
                </h2>
                <p className="text-sm text-gray-600">
                  {eventName || 'Configure services for this day'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="text-xl font-bold text-gray-900">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-gray-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Day Indicators */}
        <div className="flex items-center justify-between mt-4">
          {Array.from({ length: totalDays }).map((_, idx) => (
            <div
              key={idx}
              className={`flex items-center ${idx < totalDays - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  idx < dayNumber
                    ? 'bg-green-500 text-white'
                    : idx === dayNumber
                    ? 'bg-gray-700 text-white ring-4 ring-gray-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx < dayNumber ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              {idx < totalDays - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    idx < dayNumber ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render Children (the actual step content) */}
      {children}
    </div>
  );
}
