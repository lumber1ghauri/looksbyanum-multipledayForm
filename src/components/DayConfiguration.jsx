import { useState } from 'react';
import StepLayout from './StepLayout';
import BrideServiceSelection from './BrideServiceSelection';
import SemiBridalServiceSelection from './SemiBridalServiceSelection';
import NonBridalServiceSelection from './NonBridalServiceSelection';

export default function DayConfiguration({ 
  dayNumber, 
  totalDays, 
  register, 
  setValue, 
  watch, 
  errors, 
  onNext, 
  onBack,
  serviceType 
}) {
  const currentDay = watch(`days.${dayNumber}`);
  const eventName = currentDay?.event_name || '';
  const eventDate = currentDay?.event_date || '';

  // Progress calculation
  const progress = ((dayNumber + 1) / totalDays) * 100;

  const handleEventNameChange = (e) => {
    setValue(`days.${dayNumber}.event_name`, e.target.value);
  };

  const handleEventDateChange = (e) => {
    setValue(`days.${dayNumber}.event_date`, e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Day Progress Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {dayNumber === 0 && '🎨'}
                {dayNumber === 1 && '💒'}
                {dayNumber === 2 && '💍'}
                {dayNumber >= 3 && '🎉'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Day {dayNumber + 1} of {totalDays}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure services for this day
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Overall Progress</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
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

      {/* Event Details for This Day */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Details for Day {dayNumber + 1}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={handleEventNameChange}
              placeholder="e.g., Mehndi, Wedding Ceremony, Reception"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
            />
            {errors?.days?.[dayNumber]?.event_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.days[dayNumber].event_name.message}
              </p>
            )}
            
            {/* Common event suggestions */}
            <div className="mt-2 flex flex-wrap gap-2">
              {['Mehndi', 'Mayun', 'Wedding', 'Reception', 'Engagement'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setValue(`days.${dayNumber}.event_name`, suggestion)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={handleEventDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
            />
            {errors?.days?.[dayNumber]?.event_date && (
              <p className="text-sm text-red-600 mt-1">
                {errors.days[dayNumber].event_date.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Service Selection Component Based on Service Type */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Services for {eventName || `Day ${dayNumber + 1}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose your makeup and hair services for this specific day
          </p>
        </div>

        {serviceType === 'bridal' && (
          <BrideServiceSelection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            dayNumber={dayNumber}
          />
        )}

        {serviceType === 'semi-bridal' && (
          <SemiBridalServiceSelection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            dayNumber={dayNumber}
          />
        )}

        {serviceType === 'non-bridal' && (
          <NonBridalServiceSelection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            dayNumber={dayNumber}
          />
        )}
      </div>

      {/* Helper Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Day {dayNumber + 1} Configuration
            </h4>
            <p className="text-sm text-blue-800">
              Each day is configured separately. You can have different services, party sizes, and add-ons for each event. 
              After completing this day, you'll move to the next day's configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
