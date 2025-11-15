import { useState } from 'react';
import StepLayout from './StepLayout';

export default function MultiDaySelection({ register, setValue, watch, errors, onNext, onBack }) {
  const isMultiDay = watch('is_multi_day');
  const totalDays = watch('total_days');

  const [selectedMode, setSelectedMode] = useState(isMultiDay ? 'multi' : 'single');
  const [dayCount, setDayCount] = useState(totalDays || 2);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const isMulti = mode === 'multi';
    setValue('is_multi_day', isMulti);
    
    if (!isMulti) {
      setValue('total_days', 1);
      setDayCount(1);
    } else {
      setValue('total_days', dayCount);
    }
  };

  const handleDayCountChange = (e) => {
    const count = parseInt(e.target.value);
    setDayCount(count);
    setValue('total_days', count);
  };

  return (
    <StepLayout
      title="How many days do you need service?"
      description="Choose single day or multiple days for your event"
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Single Day Option */}
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`p-6 border-2 rounded-lg transition-all text-left ${
              selectedMode === 'single'
                ? 'border-gray-700 bg-gray-50 shadow-md'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Single Day Event
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Perfect for one-day events like weddings, parties, or photoshoots
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Simple and straightforward
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One date, one service
                  </li>
                </ul>
              </div>
              <div className="ml-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === 'single'
                      ? 'border-gray-700 bg-gray-700'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedMode === 'single' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Multiple Days Option */}
          <button
            type="button"
            onClick={() => handleModeChange('multi')}
            className={`p-6 border-2 rounded-lg transition-all text-left ${
              selectedMode === 'multi'
                ? 'border-gray-700 bg-gray-50 shadow-md'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">📆</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Multiple Days
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Ideal for multi-day weddings, destination events, or week-long celebrations
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Different services per day
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Multi-day discount available
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One payment for all days
                  </li>
                </ul>
              </div>
              <div className="ml-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === 'multi'
                      ? 'border-gray-700 bg-gray-700'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedMode === 'multi' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Day Count Slider (shown only for multi-day) */}
        {selectedMode === 'multi' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              How many days do you need service?
            </label>
            
            <div className="space-y-4">
              {/* Slider */}
              <div className="px-2">
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={dayCount}
                  onChange={handleDayCountChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
                  style={{
                    background: `linear-gradient(to right, #374151 0%, #374151 ${((dayCount - 2) / 12) * 100}%, #e5e7eb ${((dayCount - 2) / 12) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Day Count Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">{dayCount}</span>
                  <span className="text-lg text-gray-600">days</span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">Recommended for:</div>
                  <div className="text-sm font-medium text-gray-900">
                    {dayCount === 2 && 'Weekend events'}
                    {dayCount === 3 && 'Traditional 3-day weddings'}
                    {dayCount === 4 && 'Extended celebrations'}
                    {dayCount >= 5 && dayCount <= 7 && 'Week-long events'}
                    {dayCount > 7 && 'Destination weddings'}
                  </div>
                </div>
              </div>

              {/* Day Range Labels */}
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>2 days</span>
                <span>7 days</span>
                <span>14 days</span>
              </div>
            </div>

            {/* Discount Badge */}
            {dayCount >= 3 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    {dayCount >= 5 ? '10% multi-day discount' : '5% multi-day discount'} will be applied!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                {selectedMode === 'multi' ? 'Multi-Day Booking Benefits' : 'Single Day Booking'}
              </h4>
              <p className="text-sm text-blue-800">
                {selectedMode === 'multi' 
                  ? `You'll configure services for each day separately. Each day can have different services, party sizes, and add-ons. Perfect for events like Mehndi, Wedding Ceremony, and Reception.`
                  : 'Perfect for one-time events. You\'ll configure your services once and we\'ll make your day special!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Hidden Inputs for Form Registration */}
        <input type="hidden" {...register('is_multi_day')} value={selectedMode === 'multi'} />
        <input type="hidden" {...register('total_days')} value={selectedMode === 'multi' ? dayCount : 1} />

        {/* Error Display */}
        {errors.is_multi_day && (
          <p className="text-sm text-red-600">{errors.is_multi_day.message}</p>
        )}
        {errors.total_days && (
          <p className="text-sm text-red-600">{errors.total_days.message}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            ← Back
          </button>
          
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedMode}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to {selectedMode === 'multi' ? `Day 1 Configuration` : 'Event Details'} →
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
