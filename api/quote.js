// Vercel Serverless Function for Quote Generation
// This uses the EXACT same pricing logic as src/lib/pricing.js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// PRICING CONSTANTS - Exact copy from pricing.js
const PRICING = {
  // Bride services by artist (for Bridal only)
  BRIDE_SERVICES: {
    Lead: {
      "Both Hair & Makeup": 450,
      "Hair Only": 200,
      "Makeup Only": 275,
    },
    Team: {
      "Both Hair & Makeup": 360,
      "Hair Only": 160,
      "Makeup Only": 220,
    },
  },

  // Semi-Bridal bride services by artist
  SEMI_BRIDE_SERVICES: {
    Lead: {
      "Both Hair & Makeup": 400,
      "Hair Only": 175,
      "Makeup Only": 225,
    },
    Team: {
      "Both Hair & Makeup": 320,
      "Hair Only": 140,
      "Makeup Only": 180,
    },
  },

  // Trial services by artist (for Bridal only)
  TRIAL_SERVICES: {
    Lead: {
      "Both Hair & Makeup": 250,
      "Hair Only": 150,
      "Makeup Only": 150,
    },
    Team: {
      "Both Hair & Makeup": 200,
      "Hair Only": 120,
      "Makeup Only": 120,
    },
  },

  // Party member services (for Bridal only)
  PARTY_SERVICES: {
    both: 200, // Both hair & makeup per person
    makeup_only: 100, // Makeup only per person
    hair_only: 100, // Hair only per person
  },

  // Party add-ons (for Bridal only)
  PARTY_ADD_ONS: {
    dupatta: 20, // Jewelry/Dupatta setting per person
    extensions: 20, // Hair extensions per person
    saree_draping: 50, // Saree Draping per person
    hijab_setting: 15, // Hijab Setting per person
    airbrush: 50, // Airbrush makeup per person
  },

  // Non-Bridal / Semi-Bridal services (per person)
  NON_BRIDAL_SERVICES: {
    Lead: 250, // CAD per person (for group pricing)
    Team: 200, // CAD per person (for group pricing)
  },

  // Individual Non-Bridal services by artist
  NON_BRIDAL_INDIVIDUAL_SERVICES: {
    Lead: {
      "Both Hair & Makeup": 250,
      "Makeup Only": 140,
      "Hair Only": 130,
    },
    Team: {
      "Both Hair & Makeup": 200,
      "Makeup Only": 110,
      "Hair Only": 110,
    },
  },

  // Add-ons (different rates for bridal vs non-bridal)
  ADD_ONS: {
    bridal: {
      jewelry: 50,
      extensions: 30,
      saree_draping: 50, // Saree Draping for Bridal/Semi-Bridal
      hijab_setting: 15, // Hijab Setting for Bridal/Semi-Bridal
    },
    non_bridal: {
      jewelry: 20, // per person
      extensions: 20, // per person
      airbrush: 50, // per person
      saree_draping: 35, // Saree Draping for Non-Bridal (per person)
      hijab_setting: 15, // Hijab Setting for Non-Bridal (per person)
    },
  },

  // Travel fee mapping - different rates for Lead (Anum) vs Team
  TRAVEL_FEES: {
    Lead: {
      "Toronto/GTA": 50,
      OUTSIDE_GTA: {
        "Immediate Neighbors (15-30 Minutes)": 150,
        "Moderate Distance (30 Minutes to 1 Hour Drive)": 150,
        "Further Out But Still Reachable (1 Hour Plus)": 150,
      },
    },
    Team: {
      "Toronto/GTA": 25,
      OUTSIDE_GTA: {
        "Immediate Neighbors (15-30 Minutes)": 40,
        "Moderate Distance (30 Minutes to 1 Hour Drive)": 80,
        "Further Out But Still Reachable (1 Hour Plus)": 120,
      },
    },
    default: 25,
  },

  // Tax rate
  HST_RATE: 0.13,

  // Deposit percentage (different for bridal vs non-bridal)
  DEPOSIT_PERCENTAGES: {
    bridal: 0.3,
    non_bridal: 0.5,
  },
};

/**
 * Calculate the total price for a booking - EXACT copy from pricing.js
 */
function calculateBookingPrice(booking, artist = "Team") {
  console.log("🔍 Backend API pricing - booking data:", booking);
  console.log("🔍 Backend API pricing - artist:", artist);
  
  if (!booking) return null;

  let subtotal = 0;
  const services = [];
  let travelFee = 0;
  const isNonBridal = booking.service_type === "Non-Bridal";
  const isSemiBridal = booking.service_type === "Semi-Bridal";

  if (isNonBridal) {
    // Non-Bridal pricing
    let bothCount = parseInt(booking.non_bridal_both_count) || 0;
    if (bothCount === 0 && booking.non_bridal_everyone_both === "Yes") {
      bothCount = parseInt(booking.non_bridal_count) || 0;
    }
    if (bothCount > 0) {
      const bothPrice = PRICING.NON_BRIDAL_INDIVIDUAL_SERVICES[artist]["Both Hair & Makeup"];
      const bothTotal = bothCount * bothPrice;
      subtotal += bothTotal;
      services.push(`Non-Bridal Hair & Makeup (${artist === "Lead" ? "Anum" : "Team"}) x ${bothCount} $${bothTotal.toFixed(2)}`);
    }

    const makeupCount = parseInt(booking.non_bridal_makeup_count) || 0;
    if (makeupCount > 0) {
      const makeupPrice = PRICING.NON_BRIDAL_INDIVIDUAL_SERVICES[artist]["Makeup Only"];
      const makeupTotal = makeupCount * makeupPrice;
      subtotal += makeupTotal;
      services.push(`Non-Bridal Makeup Only (${artist === "Lead" ? "Anum" : "Team"}) x ${makeupCount} $${makeupTotal.toFixed(2)}`);
    }

    const hairCount = parseInt(booking.non_bridal_hair_count) || 0;
    if (hairCount > 0) {
      const hairPrice = PRICING.NON_BRIDAL_INDIVIDUAL_SERVICES[artist]["Hair Only"];
      const hairTotal = hairCount * hairPrice;
      subtotal += hairTotal;
      services.push(`Non-Bridal Hair Only (${artist === "Lead" ? "Anum" : "Team"}) x ${hairCount} $${hairTotal.toFixed(2)}`);
    }

    // Add-ons
    const jewelryCount = parseInt(booking.non_bridal_jewelry_count) || 0;
    if (jewelryCount > 0) {
      const jewelryTotal = jewelryCount * PRICING.ADD_ONS.non_bridal.jewelry;
      subtotal += jewelryTotal;
      services.push(`Jewelry/Dupatta Setting x ${jewelryCount} $${jewelryTotal.toFixed(2)}`);
    }

    const extensionsCount = parseInt(booking.non_bridal_extensions_count) || 0;
    if (extensionsCount > 0) {
      const extensionsTotal = extensionsCount * PRICING.ADD_ONS.non_bridal.extensions;
      subtotal += extensionsTotal;
      services.push(`Hair Extensions Installation x ${extensionsCount} $${extensionsTotal.toFixed(2)}`);
    }

    const airbrushCount = parseInt(booking.non_bridal_airbrush_count) || 0;
    if (airbrushCount > 0) {
      const airbrushTotal = airbrushCount * PRICING.ADD_ONS.non_bridal.airbrush;
      subtotal += airbrushTotal;
      services.push(`Airbrush Makeup x ${airbrushCount} $${airbrushTotal.toFixed(2)}`);
    }

    const sareeDrapingCount = parseInt(booking.non_bridal_saree_draping_count) || 0;
    if (sareeDrapingCount > 0) {
      const sareeDrapingTotal = sareeDrapingCount * PRICING.ADD_ONS.non_bridal.saree_draping;
      subtotal += sareeDrapingTotal;
      services.push(`Saree Draping x ${sareeDrapingCount} $${sareeDrapingTotal.toFixed(2)}`);
    }

    const hijabSettingCount = parseInt(booking.non_bridal_hijab_setting_count) || 0;
    if (hijabSettingCount > 0) {
      const hijabSettingTotal = hijabSettingCount * PRICING.ADD_ONS.non_bridal.hijab_setting;
      subtotal += hijabSettingTotal;
      services.push(`Hijab Setting x ${hijabSettingCount} $${hijabSettingTotal.toFixed(2)}`);
    }

    // Travel fee
    if (booking.service_mode !== "Studio Service") {
      const artistTravelFees = PRICING.TRAVEL_FEES[artist] || PRICING.TRAVEL_FEES.Team;
      if (booking.region === "Toronto/GTA") {
        travelFee = artistTravelFees["Toronto/GTA"];
        services.push(`Travel Fee (Toronto/GTA) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
      } else if (booking.region === "Outside GTA") {
        const label = booking.subRegion || "Immediate Neighbors (15-30 Minutes)";
        travelFee = artistTravelFees.OUTSIDE_GTA[label] ?? artistTravelFees.OUTSIDE_GTA["Immediate Neighbors (15-30 Minutes)"];
        services.push(`Travel Fee (${label}) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
      } else {
        travelFee = PRICING.TRAVEL_FEES.default;
        services.push(`Travel Fee (Default) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
      }
      subtotal += travelFee;
    }
  } else if (isSemiBridal) {
    // Semi-Bridal pricing
    let brideServiceType = booking.bride_service;
    if (brideServiceType === "bridal") {
      brideServiceType = "Both Hair & Makeup";
    }

    if (brideServiceType) {
      const bridePrice = PRICING.SEMI_BRIDE_SERVICES[artist][brideServiceType] || 0;
      subtotal += bridePrice;
      services.push(`Semi Bridal ${brideServiceType} (with ${artist === "Lead" ? "Anum" : "Team"}) x 1: $${bridePrice.toFixed(2)}`);
    }

    // Add-ons for bride
    if (booking.needs_jewelry === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.jewelry;
      services.push(`Bridal Jewelry & Dupatta/Veil Setting x 1: $${PRICING.ADD_ONS.bridal.jewelry.toFixed(2)}`);
    }
    if (booking.needs_extensions === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.extensions;
      services.push(`Bridal Hair Extensions Installation x 1: $${PRICING.ADD_ONS.bridal.extensions.toFixed(2)}`);
    }
    if (booking.needs_saree_draping === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.saree_draping;
      services.push(`Semi-Bridal Saree Draping x 1: $${PRICING.ADD_ONS.bridal.saree_draping.toFixed(2)}`);
    }
    if (booking.needs_hijab_setting === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.hijab_setting;
      services.push(`Bridal Hijab Setting x 1: $${PRICING.ADD_ONS.bridal.hijab_setting.toFixed(2)}`);
    }

    // Party members
    if (booking.has_party_members === "Yes") {
      const partyBothCount = parseInt(booking.party_both_count) || 0;
      if (partyBothCount > 0) {
        const partyBothTotal = partyBothCount * PRICING.PARTY_SERVICES.both;
        subtotal += partyBothTotal;
        services.push(`Bridal Party Hair and Makeup (${PRICING.PARTY_SERVICES.both} CAD x ${partyBothCount}): $${partyBothTotal.toFixed(2)}`);
      }

      const partyMakeupCount = parseInt(booking.party_makeup_count) || 0;
      if (partyMakeupCount > 0) {
        const partyMakeupTotal = partyMakeupCount * PRICING.PARTY_SERVICES.makeup_only;
        subtotal += partyMakeupTotal;
        services.push(`Bridal Party Makeup Only (${PRICING.PARTY_SERVICES.makeup_only} CAD x ${partyMakeupCount}): $${partyMakeupTotal.toFixed(2)}`);
      }

      const partyHairCount = parseInt(booking.party_hair_count) || 0;
      if (partyHairCount > 0) {
        const partyHairTotal = partyHairCount * PRICING.PARTY_SERVICES.hair_only;
        subtotal += partyHairTotal;
        services.push(`Bridal Party Hair Only (${PRICING.PARTY_SERVICES.hair_only} CAD x ${partyHairCount}): $${partyHairTotal.toFixed(2)}`);
      }

      // Party add-ons
      const partyDupattaCount = parseInt(booking.party_dupatta_count) || 0;
      if (partyDupattaCount > 0) {
        const partyDupattaTotal = partyDupattaCount * PRICING.PARTY_ADD_ONS.dupatta;
        subtotal += partyDupattaTotal;
        services.push(`Bridal Party Dupatta/Veil Setting (${PRICING.PARTY_ADD_ONS.dupatta} CAD x ${partyDupattaCount}): $${partyDupattaTotal.toFixed(2)}`);
      }

      const partyExtensionsCount = parseInt(booking.party_extensions_count) || 0;
      if (partyExtensionsCount > 0) {
        const partyExtensionsTotal = partyExtensionsCount * PRICING.PARTY_ADD_ONS.extensions;
        subtotal += partyExtensionsTotal;
        services.push(`Bridal Party Hair Extensions Installation (${PRICING.PARTY_ADD_ONS.extensions} CAD x ${partyExtensionsCount}): $${partyExtensionsTotal.toFixed(2)}`);
      }

      const partySareeDrapingCount = parseInt(booking.party_saree_draping_count) || 0;
      if (partySareeDrapingCount > 0) {
        const partySareeDrapingTotal = partySareeDrapingCount * PRICING.PARTY_ADD_ONS.saree_draping;
        subtotal += partySareeDrapingTotal;
        services.push(`Bridal Party Saree Draping (${PRICING.PARTY_ADD_ONS.saree_draping} CAD x ${partySareeDrapingCount}): $${partySareeDrapingTotal.toFixed(2)}`);
      }

      const partyHijabSettingCount = parseInt(booking.party_hijab_setting_count) || 0;
      if (partyHijabSettingCount > 0) {
        const partyHijabSettingTotal = partyHijabSettingCount * PRICING.PARTY_ADD_ONS.hijab_setting;
        subtotal += partyHijabSettingTotal;
        services.push(`Bridal Party Hijab Setting (${PRICING.PARTY_ADD_ONS.hijab_setting} CAD x ${partyHijabSettingCount}): $${partyHijabSettingTotal.toFixed(2)}`);
      }

      const partyAirbrushCount = parseInt(booking.airbrush_count) || 0;
      if (partyAirbrushCount > 0) {
        const partyAirbrushTotal = partyAirbrushCount * PRICING.PARTY_ADD_ONS.airbrush;
        subtotal += partyAirbrushTotal;
        services.push(`Bridal Party Airbrush Makeup (${PRICING.PARTY_ADD_ONS.airbrush} CAD x ${partyAirbrushCount}): $${partyAirbrushTotal.toFixed(2)}`);
      }
    }
  } else {
    // Bridal pricing
    let brideServiceType = booking.bride_service;
    if (brideServiceType === "bridal") {
      brideServiceType = "Both Hair & Makeup";
    }

    if (brideServiceType) {
      const bridePrice = PRICING.BRIDE_SERVICES[artist][brideServiceType] || 0;
      subtotal += bridePrice;
      services.push(`Bridal ${brideServiceType} (with ${artist === "Lead" ? "Anum" : "Team"}) x 1: $${bridePrice.toFixed(2)}`);
    }

    // Trial service
    if (booking.needs_trial === "Yes" && booking.trial_service) {
      const trialPrice = PRICING.TRIAL_SERVICES[artist][booking.trial_service] || 0;
      subtotal += trialPrice;
      services.push(`Bridal Trial (${booking.trial_service}) x 1: $${trialPrice.toFixed(2)}`);
    }

    // Add-ons for bride
    if (booking.needs_jewelry === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.jewelry;
      services.push(`Bridal Jewelry & Dupatta/Veil Setting x 1: $${PRICING.ADD_ONS.bridal.jewelry.toFixed(2)}`);
    }
    if (booking.needs_extensions === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.extensions;
      services.push(`Bridal Hair Extensions Installation x 1: $${PRICING.ADD_ONS.bridal.extensions.toFixed(2)}`);
    }
    if (booking.needs_saree_draping === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.saree_draping;
      services.push(`Bridal Saree Draping x 1: $${PRICING.ADD_ONS.bridal.saree_draping.toFixed(2)}`);
    }
    if (booking.needs_hijab_setting === "Yes") {
      subtotal += PRICING.ADD_ONS.bridal.hijab_setting;
      services.push(`Bridal Hijab Setting x 1: $${PRICING.ADD_ONS.bridal.hijab_setting.toFixed(2)}`);
    }

    // Party members
    if (booking.has_party_members === "Yes") {
      const partyBothCount = parseInt(booking.party_both_count) || 0;
      if (partyBothCount > 0) {
        const partyBothTotal = partyBothCount * PRICING.PARTY_SERVICES.both;
        subtotal += partyBothTotal;
        services.push(`Bridal Party Hair and Makeup (${PRICING.PARTY_SERVICES.both} CAD x ${partyBothCount}): $${partyBothTotal.toFixed(2)}`);
      }

      const partyMakeupCount = parseInt(booking.party_makeup_count) || 0;
      if (partyMakeupCount > 0) {
        const partyMakeupTotal = partyMakeupCount * PRICING.PARTY_SERVICES.makeup_only;
        subtotal += partyMakeupTotal;
        services.push(`Bridal Party Makeup Only (${PRICING.PARTY_SERVICES.makeup_only} CAD x ${partyMakeupCount}): $${partyMakeupTotal.toFixed(2)}`);
      }

      const partyHairCount = parseInt(booking.party_hair_count) || 0;
      if (partyHairCount > 0) {
        const partyHairTotal = partyHairCount * PRICING.PARTY_SERVICES.hair_only;
        subtotal += partyHairTotal;
        services.push(`Bridal Party Hair Only (${PRICING.PARTY_SERVICES.hair_only} CAD x ${partyHairCount}): $${partyHairTotal.toFixed(2)}`);
      }

      // Party add-ons
      const partyDupattaCount = parseInt(booking.party_dupatta_count) || 0;
      if (partyDupattaCount > 0) {
        const partyDupattaTotal = partyDupattaCount * PRICING.PARTY_ADD_ONS.dupatta;
        subtotal += partyDupattaTotal;
        services.push(`Bridal Party Dupatta/Veil Setting (${PRICING.PARTY_ADD_ONS.dupatta} CAD x ${partyDupattaCount}): $${partyDupattaTotal.toFixed(2)}`);
      }

      const partyExtensionsCount = parseInt(booking.party_extensions_count) || 0;
      if (partyExtensionsCount > 0) {
        const partyExtensionsTotal = partyExtensionsCount * PRICING.PARTY_ADD_ONS.extensions;
        subtotal += partyExtensionsTotal;
        services.push(`Bridal Party Hair Extensions Installation (${PRICING.PARTY_ADD_ONS.extensions} CAD x ${partyExtensionsCount}): $${partyExtensionsTotal.toFixed(2)}`);
      }

      const partySareeDrapingCount = parseInt(booking.party_saree_draping_count) || 0;
      if (partySareeDrapingCount > 0) {
        const partySareeDrapingTotal = partySareeDrapingCount * PRICING.PARTY_ADD_ONS.saree_draping;
        subtotal += partySareeDrapingTotal;
        services.push(`Bridal Party Saree Draping (${PRICING.PARTY_ADD_ONS.saree_draping} CAD x ${partySareeDrapingCount}): $${partySareeDrapingTotal.toFixed(2)}`);
      }

      const partyHijabSettingCount = parseInt(booking.party_hijab_setting_count) || 0;
      if (partyHijabSettingCount > 0) {
        const partyHijabSettingTotal = partyHijabSettingCount * PRICING.PARTY_ADD_ONS.hijab_setting;
        subtotal += partyHijabSettingTotal;
        services.push(`Bridal Party Hijab Setting (${PRICING.PARTY_ADD_ONS.hijab_setting} CAD x ${partyHijabSettingCount}): $${partyHijabSettingTotal.toFixed(2)}`);
      }

      const partyAirbrushCount = parseInt(booking.airbrush_count) || 0;
      if (partyAirbrushCount > 0) {
        const partyAirbrushTotal = partyAirbrushCount * PRICING.PARTY_ADD_ONS.airbrush;
        subtotal += partyAirbrushTotal;
        services.push(`Bridal Party Airbrush Makeup (${PRICING.PARTY_ADD_ONS.airbrush} CAD x ${partyAirbrushCount}): $${partyAirbrushTotal.toFixed(2)}`);
      }
    }
  }

  // Travel fee for Bridal/Semi-Bridal
  if (!isNonBridal && booking.service_mode !== "Studio Service") {
    const artistTravelFees = PRICING.TRAVEL_FEES[artist] || PRICING.TRAVEL_FEES.Team;
    if (booking.region === "Toronto/GTA") {
      travelFee = artistTravelFees["Toronto/GTA"];
      services.push(`Travel Fee (Toronto/GTA) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
    } else if (booking.region === "Outside GTA") {
      const label = booking.subRegion || "Immediate Neighbors (15-30 Minutes)";
      travelFee = artistTravelFees.OUTSIDE_GTA[label] ?? artistTravelFees.OUTSIDE_GTA["Immediate Neighbors (15-30 Minutes)"];
      services.push(`Travel Fee (${label}) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
    } else {
      travelFee = PRICING.TRAVEL_FEES.default;
      services.push(`Travel Fee (Default) - ${artist === "Lead" ? "Anum" : "Team"}: $${travelFee.toFixed(2)}`);
    }
    subtotal += travelFee;
  }

  // Calculate tax
  const hst = subtotal * PRICING.HST_RATE;
  const total = subtotal + hst;

  // Calculate deposit
  const depositPercentage = isNonBridal ? PRICING.DEPOSIT_PERCENTAGES.non_bridal : PRICING.DEPOSIT_PERCENTAGES.bridal;
  const deposit = total * depositPercentage;

  services.push(`Subtotal: $${subtotal.toFixed(2)}`);
  services.push(`HST (13%): $${hst.toFixed(2)}`);
  services.push(`Total: $${total.toFixed(2)} CAD`);
  services.push(`Deposit required (${(depositPercentage * 100).toFixed(0)}%): $${deposit.toFixed(2)}`);

  return {
    subtotal: subtotal,
    hst: hst,
    total: total,
    deposit: deposit,
    services: services,
  };
}

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    if (req.method === 'POST') {
      const bookingData = req.body;
      
      console.log("🔍 Quote API called with service_type:", bookingData.service_type);
      
      // Calculate quote for both artists
      const teamPricing = calculateBookingPrice(bookingData, 'Team');
      const leadPricing = calculateBookingPrice(bookingData, 'Lead');

      console.log("✅ Team pricing calculated:", teamPricing?.total);
      console.log("✅ Lead pricing calculated:", leadPricing?.total);

      return res.status(200).json({
        // Default response (Team pricing)
        subtotal: teamPricing?.subtotal || 0,
        travel_fee: 0, // Already included in subtotal
        early_fee: 0,
        subtotal_with_fees: teamPricing?.subtotal || 0,
        gst: teamPricing?.hst || 0,
        pst: 0,
        total_tax: teamPricing?.hst || 0,
        quote_total: teamPricing?.total || 0,
        deposit_amount: teamPricing?.deposit || 0,
        remaining_amount: (teamPricing?.total || 0) - (teamPricing?.deposit || 0),
        services: teamPricing?.services || [],
        
        // Both packages for frontend display
        lead: leadPricing ? {
          subtotal: leadPricing.subtotal,
          travel_fee: 0,
          early_fee: 0,
          subtotal_with_fees: leadPricing.subtotal,
          gst: leadPricing.hst,
          pst: 0,
          total_tax: leadPricing.hst,
          quote_total: leadPricing.total,
          deposit_amount: leadPricing.deposit,
          remaining_amount: leadPricing.total - leadPricing.deposit,
          services: leadPricing.services,
          artist: 'Lead',
          artist_name: 'Anum (Lead Artist)',
        } : null,
        
        team: teamPricing ? {
          subtotal: teamPricing.subtotal,
          travel_fee: 0,
          early_fee: 0,
          subtotal_with_fees: teamPricing.subtotal,
          gst: teamPricing.hst,
          pst: 0,
          total_tax: teamPricing.hst,
          quote_total: teamPricing.total,
          deposit_amount: teamPricing.deposit,
          remaining_amount: teamPricing.total - teamPricing.deposit,
          services: teamPricing.services,
          artist: 'Team',
          artist_name: 'Team Artist',
        } : null,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Quote API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
