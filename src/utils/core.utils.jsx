const evaluateExpression = (expr) => {
  // Safely evaluate mathematical expressions
  try {
    // Remove whitespace and validate characters
    const sanitized = expr.toString().replace(/\s/g, '');
    if (!/^-?\d+(?:[+\-*/]\d+)*$/.test(sanitized)) {
      throw new Error('Invalid expression');
    }
    return Function(`'use strict'; return (${sanitized})`)();
  } catch (error) {
    console.error('Expression evaluation error:', error);
    return NaN;
  }
};

const parseThreshold = (threshold) => {
  if (Array.isArray(threshold)) {
    return threshold.map(Number);
  }
  
  if (typeof threshold === 'string') {
    // Handle string thresholds like "-30-80" or "-30--80"
    const parts = threshold.split('-').filter(x => x !== '');
    if (parts.length === 2) {
      return [
        parts[0] === '' ? -Number(parts[1]) : Number(parts[0]),
        parts[parts.length - 1]
      ].map(Number);
    }
  }
  
  throw new Error('Invalid threshold format');
};

export const newGetStatus = (result, threshold) => {
  try {
    // Evaluate the result if it's an expression
    const evaluatedResult = evaluateExpression(result);
    
    if (isNaN(evaluatedResult)) {
      throw new Error('Invalid result value');
    }

    // Parse threshold
    const [lower, upper] = parseThreshold(threshold);
    
    if (isNaN(lower) || isNaN(upper)) {
      throw new Error('Invalid threshold values');
    }

    // Validate threshold order
    if (lower > upper) {
      throw new Error('Lower threshold cannot be greater than upper threshold');
    }

    // Determine status with precise comparisons
    if (evaluatedResult < lower) {
      return "Very Low"
    }
    
    if (evaluatedResult > upper) {
      return "High"
    }
    
    return  "Adequate"

  } catch (error) {
    return {
      status: "Error",
      error: error.message,
      value: null
    };
  }
};