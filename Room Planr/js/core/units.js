/**
 * RoomPlanr - Unit Measurement & Spatial Coordinate Engine
 * Real-world unit conversion (m, cm, mm, ft/in), area calculation, grid snapping, and currency formatting.
 */

export const UNITS = {
  METERS: 'm',
  CENTIMETERS: 'cm',
  MILLIMETERS: 'mm',
  FEET_INCHES: 'ft'
};

export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar ($)' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro (€)' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound (£)' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen (¥)' }
};

/**
 * Format real-world meter value into target unit string
 */
export function formatDimension(meters, unit = UNITS.METERS) {
  if (meters === null || meters === undefined || isNaN(meters)) return '0.00 m';

  if (unit === UNITS.CENTIMETERS) {
    return `${Math.round(meters * 100)} cm`;
  }

  if (unit === UNITS.MILLIMETERS) {
    return `${Math.round(meters * 1000)} mm`;
  }

  if (unit === UNITS.FEET_INCHES) {
    const totalInches = meters * 39.3700787;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    if (inches === 12) {
      return `${feet + 1}′ 0″`;
    }
    return `${feet}′ ${inches}″`;
  }

  return `${Number(meters).toFixed(2)} m`;
}

/**
 * Format floor area into square meters or square feet
 */
export function formatArea(squareMeters, unit = UNITS.METERS) {
  if (squareMeters === null || squareMeters === undefined || isNaN(squareMeters)) return '0.0 m²';

  if (unit === UNITS.FEET_INCHES) {
    const sqFt = squareMeters * 10.7639;
    return `${sqFt.toFixed(1)} sq ft`;
  }

  return `${Number(squareMeters).toFixed(1)} m²`;
}

/**
 * Convert user input string into meters
 */
export function parseToMeters(valueStr, unit = UNITS.METERS) {
  if (!valueStr) return 0;
  const num = parseFloat(valueStr);
  if (isNaN(num)) return 0;

  if (unit === UNITS.CENTIMETERS) {
    return num / 100;
  }

  if (unit === UNITS.MILLIMETERS) {
    return num / 1000;
  }

  if (unit === UNITS.FEET_INCHES) {
    // Treat plain numeric input as feet
    return num * 0.3048;
  }

  return num;
}

/**
 * Snap coordinate to grid increment in meters
 */
export function snapToGrid(value, gridStepMeters = 0.1) {
  if (!gridStepMeters || gridStepMeters <= 0) return value;
  const snapped = Math.round(value / gridStepMeters) * gridStepMeters;
  return parseFloat(snapped.toFixed(4));
}

/**
 * Snap angle to nearest increment (e.g. 15 or 45 degrees)
 */
export function snapAngle(degrees, step = 45) {
  if (!step || step <= 0) return degrees;
  return Math.round(degrees / step) * step;
}

/**
 * Format price for Bill of Materials takeoff
 */
export function formatPrice(amount, currencyCode = 'USD') {
  const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const formatted = Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `${cur.symbol}${formatted}`;
}
