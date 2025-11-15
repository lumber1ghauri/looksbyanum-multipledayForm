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

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const getDayIcon = (dayIndex) => {
    const icons = ['🎨', '💒', '💍', '🎉', '✨', '🌟', '🎊', '🎁', '🎭', '🎪', '🎯', '🎸', '🎹', '🎤'];
    return icons[dayIndex] || '📅';
  };

  // Calculate totals
  const calculateDayTotal = (dayData) => {
    if (!dayData) return 0;
    
    let total = 0;
    
    // Bride services
    if (dayData.bride_makeup_price) total += parseFloat(dayData.bride_makeup_price);
    if (dayData.bride_hair_price) total += parseFloat(dayData.bride_hair_price);
    
    // Party members
    if (dayData.party_total) total += parseFloat(dayData.party_total);
    
    // Add-ons
    if (dayData.bride_addons_total) total += parseFloat(dayData.bride_addons_total);
    if (dayData.party_addons_total) total += parseFloat(dayData.party_addons_total);
    
    return total;
  };

  const subtotal = quote?.subtotal || daysData.reduce((sum, day) => sum + calculateDayTotal(day), 0);
  const discount = multiDayDiscount || quote?.multi_day_discount || 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = quote?.total || (subtotal - discountAmount);

  return (
    <StepLayout
      title="Review Your Multi-Day Booking"
      description="Review services for each day and confirm your booking"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📆</div>
              <div>
                <div className="text-sm text-blue-600 font-medium">Total Days</div>
                <div className="text-2xl font-bold text-blue-900">{totalDays}</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <div className="text-sm text-green-600 font-medium">Subtotal</div>
                <div className="text-2xl font-bold text-green-900">
                  {currencyFormat(subtotal)}
                </div>
              </div>
            </div>
          </div>

          {discount > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎁</div>
                <div>
                  <div className="text-sm text-purple-600 font-medium">
                    Multi-Day Discount ({discount}%)
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    -{currencyFormat(discountAmount)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Per-Day Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Day-by-Day Breakdown
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Click on any day to see detailed services
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {daysData.map((dayData, dayIndex) => {
              const dayTotal = calculateDayTotal(dayData);
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
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {currencyFormat(dayTotal)}
                          </div>
                        </div>

                        {onEditDay && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditDay(dayIndex);
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                        )}

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
                  </div>

                  {/* Expanded Day Details */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-4">
                        {/* Bride Services */}
                        {(dayData.bride_makeup_type || dayData.bride_hair_type) && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">
                              Bride Services
                            </h5>
                            <div className="space-y-2">
                              {dayData.bride_makeup_type && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {dayData.bride_makeup_type} Makeup
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {currencyFormat(dayData.bride_makeup_price || 0)}
                                  </span>
                                </div>
                              )}
                              {dayData.bride_hair_type && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    {dayData.bride_hair_type} Hair
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {currencyFormat(dayData.bride_hair_price || 0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Party Members */}
                        {dayData.party_size > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">
                              Party Members
                            </h5>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {dayData.party_size} member{dayData.party_size > 1 ? 's' : ''}
                              </span>
                              <span className="font-medium text-gray-900">
                                {currencyFormat(dayData.party_total || 0)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Add-ons */}
                        {(dayData.bride_addons_total > 0 || dayData.party_addons_total > 0) && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">
                              Add-ons
                            </h5>
                            <div className="space-y-2">
                              {dayData.bride_addons_total > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Bride Add-ons</span>
                                  <span className="font-medium text-gray-900">
                                    {currencyFormat(dayData.bride_addons_total)}
                                  </span>
                                </div>
                              )}
                              {dayData.party_addons_total > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Party Add-ons</span>
                                  <span className="font-medium text-gray-900">
                                    {currencyFormat(dayData.party_addons_total)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Day Subtotal */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              Day {dayIndex + 1} Subtotal
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {currencyFormat(dayTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Total */}
        <div className="bg-white border-2 border-gray-900 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal ({totalDays} days)</span>
              <span className="font-semibold text-gray-900">
                {currencyFormat(subtotal)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-base">
                <span className="text-green-600">
                  Multi-Day Discount ({discount}%)
                </span>
                <span className="font-semibold text-green-600">
                  -{currencyFormat(discountAmount)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gray-900">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Grand Total</span>
                <span className="text-3xl font-bold text-gray-900">
                  {currencyFormat(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Info */}
        {discount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-900 mb-1">
                  🎉 You're saving {currencyFormat(discountAmount)}!
                </h4>
                <p className="text-sm text-green-800">
                  Your {discount}% multi-day discount has been applied. Thank you for choosing us for your multi-day event!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Important Information
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• This quote is valid for 7 days from today</li>
                <li>• A 50% deposit is required to confirm your booking</li>
                <li>• Changes to individual days may affect the final total</li>
                <li>• Multi-day discount applies only when all days are booked together</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
