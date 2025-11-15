  import React, { useState } from 'react';
  import MultiDayQuoteReview from './MultiDayQuoteReview';

  const QuoteReview = ({ onNext, onBack, getValues, quote }) => {
    const isMultiDay = getValues('is_multi_day');
    const daysData = getValues('days') || [];
    const totalDays = getValues('total_days') || 1;
    const multiDayDiscount = getValues('multi_day_discount') || quote?.multi_day_discount || 0;
    const [selectedPackage, setSelectedPackage] = useState('team'); // Default to team

    // If multi-day, use the specialized component
    if (isMultiDay) {
      return (
        <MultiDayQuoteReview
          quote={quote}
          daysData={daysData}
          totalDays={totalDays}
          multiDayDiscount={multiDayDiscount}
          onNext={onNext}
          onBack={onBack}
        />
      );
    }

    // Get packages from quote (both lead and team)
    const leadPackage = quote?.lead;
    const teamPackage = quote?.team;
    const currentPackage = selectedPackage === 'lead' ? leadPackage : teamPackage;

    // Single-day quote review with package selection
    return (
      <div className="max-w-sm md:max-w-4xl mx-auto p-4 md:p-8 glass-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
          Quote Review - Choose Your Package
        </h2>

        {/* Package Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Lead Package (Anum) */}
          {leadPackage && (
            <div
              onClick={() => setSelectedPackage('lead')}
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedPackage === 'lead'
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-pink-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  By Anum Package
                </h3>
                {selectedPackage === 'lead' && (
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Selected
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Premium service by Anum herself - Lead Artist
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${leadPackage.quote_total?.toFixed(2) || '0.00'} CAD</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Deposit (30%):</span>
                  <span>${leadPackage.deposit_amount?.toFixed(2) || '0.00'} CAD</span>
                </div>
              </div>
            </div>
          )}

          {/* Team Package */}
          {teamPackage && (
            <div
              onClick={() => setSelectedPackage('team')}
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedPackage === 'team'
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-pink-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  By Team Package
                </h3>
                {selectedPackage === 'team' && (
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Selected
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Professional service by trained team members
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${teamPackage.quote_total?.toFixed(2) || '0.00'} CAD</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Deposit (30%):</span>
                  <span>${teamPackage.deposit_amount?.toFixed(2) || '0.00'} CAD</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Package Details */}
        {currentPackage && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {selectedPackage === 'lead' ? 'By Anum Package' : 'By Team Package'} - Detailed Breakdown
            </h3>
            <div className="space-y-4 text-gray-800">
              <div className="flex justify-between">
                <span className="font-semibold">Service Type:</span>
                <span>{getValues('service_type')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Region:</span>
                <span>{getValues('region')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Event Date:</span>
                <span>{getValues('event_date')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Ready Time:</span>
                <span>{getValues('ready_time')}</span>
              </div>

              {/* Services List */}
              {currentPackage.services && currentPackage.services.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Services Included:</h4>
                  <div className="space-y-2 text-sm">
                    {currentPackage.services.map((service, index) => (
                      <div key={index} className="text-gray-700">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t-2 border-gray-300 text-lg font-bold">
                <span>Total Service Fee:</span>
                <span>${currentPackage.quote_total?.toFixed(2) || '0.00'} CAD</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Deposit Required (30%):</span>
                <span>${currentPackage.deposit_amount?.toFixed(2) || '0.00'} CAD</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Remaining Balance:</span>
                <span>${currentPackage.remaining_amount?.toFixed(2) || '0.00'} CAD</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                (Includes 13% HST)
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Review and confirm your selected package</li>
            <li>• Provide service address details</li>
            <li>• Review and sign the service contract</li>
            <li>• Complete deposit payment</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700 focus:ring-4 focus:ring-pink-200"
          >
            Continue with {selectedPackage === 'lead' ? 'Anum' : 'Team'} Package →
          </button>
        </div>
      </div>
    );
  };
 
  export default QuoteReview;