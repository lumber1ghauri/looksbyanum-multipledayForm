import { useState } from 'react';

export default function DayNavigator({ 
  totalDays, 
  currentDayIndex, 
  completedDays = [], 
  onDayClick,
  daysData = []
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getDayStatus = (dayIndex) => {
    if (completedDays.includes(dayIndex)) return 'completed';
    if (dayIndex === currentDayIndex) return 'current';
    if (dayIndex < currentDayIndex) return 'completed';
    return 'pending';
  };

  const getDayIcon = (dayIndex) => {
    const icons = ['🎨', '💒', '💍', '🎉', '✨', '🌟', '🎊', '🎁', '🎭', '🎪', '🎯', '🎸', '🎹', '🎤'];
    return icons[dayIndex] || '📅';
  };

  const getDayName = (dayIndex) => {
    return daysData[dayIndex]?.event_name || `Day ${dayIndex + 1}`;
  };

  const getDayDate = (dayIndex) => {
    const date = daysData[dayIndex]?.event_date;
    if (!date) return null;
    
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-gray-700 text-white ring-4 ring-gray-300';
      case 'pending':
        return 'bg-gray-200 text-gray-500';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  const canNavigateToDay = (dayIndex) => {
    // Can navigate to completed days or current day
    return dayIndex <= currentDayIndex;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div 
        className="bg-gray-50 px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl">📋</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Multi-Day Event Progress
              </h3>
              <p className="text-xs text-gray-600">
                {completedDays.length} of {totalDays} days configured
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Overall Progress Bar */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedDays.length / totalDays) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round((completedDays.length / totalDays) * 100)}%
              </span>
            </div>

            {/* Expand/Collapse Icon */}
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Day List */}
      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {Array.from({ length: totalDays }).map((_, dayIndex) => {
            const status = getDayStatus(dayIndex);
            const canNavigate = canNavigateToDay(dayIndex);
            const dayName = getDayName(dayIndex);
            const dayDate = getDayDate(dayIndex);

            return (
              <div
                key={dayIndex}
                onClick={() => canNavigate && onDayClick && onDayClick(dayIndex)}
                className={`p-4 transition-colors ${
                  canNavigate 
                    ? 'cursor-pointer hover:bg-gray-50' 
                    : 'cursor-not-allowed opacity-60'
                } ${status === 'current' ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center gap-3 flex-1">
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${getStatusColor(status)}`}
                    >
                      {status === 'completed' ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        getDayIcon(dayIndex)
                      )}
                    </div>

                    {/* Day Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {dayName}
                        </h4>
                        {status === 'current' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>Day {dayIndex + 1} of {totalDays}</span>
                        {dayDate && (
                          <>
                            <span>•</span>
                            <span>{dayDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status Badge */}
                  <div className="flex items-center gap-2">
                    {status === 'completed' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ {getStatusBadge(status)}
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {getStatusBadge(status)}
                      </span>
                    )}

                    {canNavigate && (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Additional Day Details (if completed) */}
                {status === 'completed' && daysData[dayIndex] && (
                  <div className="mt-3 ml-13 text-xs text-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {daysData[dayIndex].bride_makeup_type && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Makeup: {daysData[dayIndex].bride_makeup_type}
                        </span>
                      )}
                      {daysData[dayIndex].bride_hair_type && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Hair: {daysData[dayIndex].bride_hair_type}
                        </span>
                      )}
                      {daysData[dayIndex].party_size > 0 && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Party: {daysData[dayIndex].party_size} people
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats Footer */}
      {isExpanded && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">
                {completedDays.length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">1</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-600">
                {totalDays - completedDays.length - 1}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
