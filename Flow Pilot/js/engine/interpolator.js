/**
 * FlowPilot Expression & Variable Interpolator
 * Handles template strings, functions, variables, and property paths
 */

class ExpressionInterpolator {
  /**
   * Evaluate a string or object with variable replacements
   */
  static interpolate(target, context = {}) {
    if (target === null || target === undefined) return target;

    if (typeof target === 'string') {
      return this.interpolateString(target, context);
    }

    if (Array.isArray(target)) {
      return target.map(item => this.interpolate(item, context));
    }

    if (typeof target === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(target)) {
        result[key] = this.interpolate(value, context);
      }
      return result;
    }

    return target;
  }

  /**
   * Interpolate a single string
   */
  static interpolateString(template, context) {
    if (!template || typeof template !== 'string' || !template.includes('{{') || !template.includes('}}')) {
      return template;
    }

    // Check if the entire string is just a single expression: e.g. "{{$input.amount}}"
    const singleExprMatch = template.trim().match(/^\{\{([^}]+)\}\}$/);
    if (singleExprMatch) {
      const expr = singleExprMatch[1].trim();
      const val = this.evaluateExpression(expr, context);
      return val !== undefined ? val : template;
    }

    // Replace all occurrences of {{ expr }} within the string
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
      const val = this.evaluateExpression(expr.trim(), context);
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });
  }

  /**
   * Safely evaluate a JS expression in the context
   */
  static evaluateExpression(expr, context) {
    const {
      $input = {},
      $vars = {},
      $nodes = {},
      $executionId = ''
    } = context;

    try {
      // Helper built-ins
      const $now = new Date().toISOString();
      const $timestamp = Date.now();
      const $uuid = 'uuid_' + Math.random().toString(36).substr(2, 9);
      const $random = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;

      const fn = new Function(
        '$input',
        '$vars',
        '$nodes',
        '$executionId',
        '$now',
        '$timestamp',
        '$uuid',
        '$random',
        `
        try {
          const name = $input.name || $input.customerName || $vars.name;
          const email = $input.email || $input.userEmail || $input.customerEmail || $vars.email;
          const id = $input.id || $input.userId || $input.customerId || $input.orderId;
          const amount = $input.amount || $input.orderTotal || $input.finalAmount;

          return (${expr});
        } catch (e) {
          return undefined;
        }
        `
      );

      const result = fn($input, $vars, $nodes, $executionId, $now, $timestamp, $uuid, $random);
      return result !== undefined ? result : `{{${expr}}}`;
    } catch (err) {
      return `{{${expr}}}`;
    }
  }

  /**
   * Resolve nested property path safely
   */
  static getPath(obj, path, fallback = undefined) {
    if (!obj || !path) return fallback;
    const parts = path.split('.');
    let curr = obj;
    for (const part of parts) {
      if (curr === null || curr === undefined) return fallback;
      curr = curr[part];
    }
    return curr !== undefined ? curr : fallback;
  }
}

window.ExpressionInterpolator = ExpressionInterpolator;
