/**
 * RoomPlanr - Unit Measurement & Spatial Coordinate Engine
 * Real-world unit conversion (m, cm, ft/in), grid snapping, and dimensional formatting.
 */

export const UNITS = {
  METERS: 'm',
  CENTIMETERS: 'cm',
  FEET_INCHES: 'ft'
};

/**
 * Format real-world meter value into target unit string
 */
export function formatDimension(meters, unit = UNITS.METERS) {
  if (meters === null || meters === undefined || isNaN(meters)) return '0.00 m';

  if (unit === UNITS.CENTIMETERS) {
    return `${Math.round(meters * 100)} cm`;
  }

  if (unit === UNITS.FEET_INCHES) {
    const totalInches = meters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}′ ${inches}″`;
  }

  return `${meters.toFixed(2)} m`;
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

  if (unit === UNITS.FEET_INCHES) {
    // Treat numeric input as feet decimal
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
 * Snap angle to nearest increment (e.g. 45 degrees)
 */
export function snapAngle(degrees, step = 45) {
  return Math.round(degrees / step) * step;
}
