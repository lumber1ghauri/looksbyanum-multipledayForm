import React from 'react';
import DatePicker from './DatePicker';

const DateTimeSelection = ({ onNext, onBack, register, setValue, getValues, errors, dayNumber }) => {
  // Support both single-day and multi-day field paths
  const getFieldName = (field) => {
    return dayNumber !== undefined ? `days.${dayNumber}.${field}` : field;
  };
  
  const getFieldValue = (field) => {
    if (dayNumber !== undefined) {
      const days = getValues('days');
      return days?.[dayNumber]?.[field];
    }
    return getValues(field);
  };
  
  const getFieldError = (field) => {
    if (dayNumber !== undefined) {
      return errors.days?.[dayNumber]?.[field]?.message;
    }
    return errors[field]?.message;
  };
  
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        {dayNumber !== undefined ? `Day ${dayNumber + 1} - Choose Date & Time` : 'Choose Date & Time'}
      </h2>

      <div className="space-y-6 mb-8">
        {/* Event Name (Multi-day only) */}
        {dayNumber !== undefined && (
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register(getFieldName('event_name'), { required: 'Event name is required' })}
              placeholder="e.g., Mehndi Night, Wedding Ceremony, Reception"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent"
            />
            {getFieldError('event_name') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('event_name')}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {['Mehndi', 'Mayun', 'Wedding', 'Reception', 'Engagement'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setValue(getFieldName('event_name'), suggestion)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Service Date Selection */}
        <DatePicker
          register={register}
          name={getFieldName("event_date")}
          label={dayNumber !== undefined ? "Event Date" : "Service Date"}
          required={true}
          error={getFieldError("event_date")}
        />

        {/* Service Time Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            {dayNumber !== undefined ? "Ready Time" : "Service Time"} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
              '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
              '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
            ].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setValue(getFieldName(dayNumber !== undefined ? 'ready_time' : 'service_time'), time)}
                className={`p-3 text-center border rounded-lg transition-all duration-200 ${
                  getFieldValue(dayNumber !== undefined ? 'ready_time' : 'service_time') === time
                    ? 'border-gray-800 bg-gray-900 text-gray-100 font-medium shadow-sm'
                    : 'border-gray-300 hover:border-gray-700 text-gray-800 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {getFieldError(dayNumber !== undefined ? 'ready_time' : 'service_time') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(dayNumber !== undefined ? 'ready_time' : 'service_time')}
            </p>
          )}
        </div>

        {/* Travel Time Notice */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Service duration: Approximately 2–3 hours</li>
            <li>• Please arrive 15 minutes early for your appointment</li>
            <li>• Travel time may be required for locations outside downtown</li>
            <li>• Time slots are subject to artist availability confirmation</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={
            (dayNumber !== undefined && !getFieldValue('event_name')) ||
            !getFieldValue(dayNumber !== undefined ? 'event_date' : 'service_date') || 
            !getFieldValue(dayNumber !== undefined ? 'ready_time' : 'service_time')
          }
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            ((dayNumber === undefined || getFieldValue('event_name')) &&
             getFieldValue(dayNumber !== undefined ? 'event_date' : 'service_date') && 
             getFieldValue(dayNumber !== undefined ? 'ready_time' : 'service_time'))
              ? 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button> 
      </div>
    </div>
  );
};

export default DateTimeSelection;
