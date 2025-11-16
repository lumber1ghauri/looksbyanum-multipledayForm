import { useState } from 'react';
import StepLayout from './StepLayout';
import { formatCurrency } from '../../lib/currencyFormat';

export default function MultiDayQuoteReview({ 
  quote, 
  daysData, 
  totalDays,
  multiDayDiscount,
  onEditDay,
  onNext,
  onBack 
}) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('team'); // Default to team

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const getDayIcon = (dayIndex) => {
    const icons = ['🎨', '💒', '💍', '🎉', '✨', '🌟', '🎊', '🎁', '🎭', '🎪', '🎯', '🎸', '🎹', '🎤'];
    return icons[dayIndex] || '📅';
  };

  // Get the package data
  const leadPackage = quote?.lead || {};
  const teamPackage = quote?.team || {};
  const currentPackage = selectedPackage === 'lead' ? leadPackage : teamPackage;

  const handleContinue = () => {
    onNext({ selectedPackage, packageData: currentPackage });
  };

  return (
    <StepLayout
      title="📋 Your Multi-Day Quote"
      subtitle={`Review your ${totalDays}-day event details and pricing`}
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Package Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Package Card */}
          <div
            onClick={() => setSelectedPackage('team')}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedPackage === 'team'
                ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
            }`}
          >
            {selectedPackage === 'team' && (
              <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-lg mb-2">By Team Package</h3>
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {formatCurrency(teamPackage.quote_total || 0)}
              </div>
              <p className="text-sm text-gray-600">Professional team artists</p>
            </div>
          </div>

          {/* Lead Package Card */}
          <div
            onClick={() => setSelectedPackage('lead')}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedPackage === 'lead'
                ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
            }`}
          >
            {selectedPackage === 'lead' && (
              <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-full p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-lg mb-2">By Anum Package</h3>
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {formatCurrency(leadPackage.quote_total || 0)}
              </div>
              <p className="text-sm text-gray-600">Premium lead artist service</p>
            </div>
          </div>
        </div>

        {/* Selected Package Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedPackage === 'lead' ? '⭐ By Anum Package' : '👥 By Team Package'}
            </h2>
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              {totalDays} Days Event
            </span>
          </div>

          {/* Multi-Day Discount Badge */}
          {currentPackage.multi_day_discount > 0 && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎁</div>
                <div className="flex-1">
                  <div className="font-semibold text-purple-900">
                    Multi-Day Event Discount
                  </div>
                  <div className="text-sm text-purple-700">
                    You're saving {currentPackage.multi_day_discount}% on this {totalDays}-day booking!
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  -{currentPackage.multi_day_discount}%
                </div>
              </div>
            </div>
          )}

          {/* Services Breakdown */}
          {currentPackage.services && currentPackage.services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Services Included</h3>
              <div className="space-y-3">
                {currentPackage.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      {service.day && (
                        <div className="text-sm text-gray-600">
                          {service.day}
                          {service.date && ` • ${new Date(service.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}`}
                        </div>
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(service.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(currentPackage.subtotal || 0)}</span>
            </div>
            
            {currentPackage.multi_day_discount > 0 && (
              <div className="flex justify-between text-purple-600">
                <span>Multi-Day Discount ({currentPackage.multi_day_discount}%)</span>
                <span className="font-medium">
                  -{formatCurrency((currentPackage.subtotal * currentPackage.multi_day_discount) / 100)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>GST/HST (13%)</span>
              <span className="font-medium">{formatCurrency(currentPackage.gst || 0)}</span>
            </div>
            
            <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-pink-600">{formatCurrency(currentPackage.quote_total || 0)}</span>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-pink-700 font-medium">Deposit Required (50%)</div>
                  <div className="text-xs text-pink-600 mt-1">To secure your booking</div>
                </div>
                <div className="text-2xl font-bold text-pink-600">
                  {formatCurrency(currentPackage.deposit_amount || 0)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-700 font-medium">Remaining Balance</div>
                  <div className="text-xs text-gray-600 mt-1">Due on event day</div>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {formatCurrency(currentPackage.remaining_amount || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Day Breakdown (Collapsible) */}
        {daysData && daysData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Day-by-Day Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Click to view services for each day
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {daysData.map((dayData, dayIndex) => {
                const isExpanded = expandedDay === dayIndex;

                return (
                  <div key={dayIndex} className="bg-white">
                    {/* Day Header */}
                    <div
                      onClick={() => toggleDayExpansion(dayIndex)}
                      className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">{getDayIcon(dayIndex)}</div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              {dayData.event_name || `Day ${dayIndex + 1}`}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span>Day {dayIndex + 1} of {totalDays}</span>
                              {dayData.event_date && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {new Date(dayData.event_date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </>
                              )}
                              {dayData.ready_time && (
                                <>
                                  <span>•</span>
                                  <span>{dayData.ready_time}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Day Details */}
                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Event Details</h5>
                            <div className="space-y-2 text-sm">
                              {dayData.event_name && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Event Name:</span>
                                  <span className="font-medium text-gray-900">{dayData.event_name}</span>
                                </div>
                              )}
                              {dayData.event_date && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-medium text-gray-900">
                                    {new Date(dayData.event_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {dayData.ready_time && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Ready Time:</span>
                                  <span className="font-medium text-gray-900">{dayData.ready_time}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {(dayData.bride_makeup_type || dayData.bride_hair_type || dayData.party_count > 0) && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Services</h5>
                              <div className="space-y-2 text-sm">
                                {dayData.bride_makeup_type && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bride Makeup:</span>
                                    <span className="font-medium text-gray-900">{dayData.bride_makeup_type}</span>
                                  </div>
                                )}
                                {dayData.bride_hair_type && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bride Hair:</span>
                                    <span className="font-medium text-gray-900">{dayData.bride_hair_type}</span>
                                  </div>
                                )}
                                {dayData.party_count > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Party Members:</span>
                                    <span className="font-medium text-gray-900">{dayData.party_count} people</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors shadow-md"
          >
            Continue with {selectedPackage === 'lead' ? 'Anum' : 'Team'} Package →
          </button>
        </div>
      </div>
    </StepLayout>
  );
}
