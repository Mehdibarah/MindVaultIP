// Base44 specific error handler to prevent authentication errors from breaking the app
export const handleBase44Error = (error, context = 'Base44 API call') => {
  console.warn(`Base44 Error in ${context}:`, error);
  
  // List of error messages that should be silently handled
  const silentErrors = [
    'You must be logged in',
    'Base44Error',
    'authentication',
    'unauthorized',
    'login-info',
    'by-id/null',
    '500',
    '401',
    '403',
    'Network Error',
    'Failed to fetch'
  ];
  
  // Check if this is an error we should silently handle
  const shouldSilence = silentErrors.some(errorType => 
    error?.message?.toLowerCase().includes(errorType.toLowerCase())
  );
  
  if (shouldSilence) {
    return null; // Silently handle these errors
  }
  
  // For other errors, log them but don't break the app
  console.error('Unhandled Base44 error:', error);
  return error;
};

// Enhanced safe API call specifically for Base44
export const safeBase44Call = async (apiCall, fallbackValue = null, context = 'Base44 API') => {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    const handledError = handleBase44Error(error, context);
    if (handledError === null) {
      // Error was silently handled, return fallback
      return fallbackValue;
    }
    // Error was not silently handled, but we still return fallback to prevent app crash
    return fallbackValue;
  }
};

// Wrapper for Base44 authentication calls
export const safeBase44Auth = async (authCall, fallbackValue = null) => {
  return safeBase44Call(authCall, fallbackValue, 'Base44 Auth');
};

// Wrapper for Base44 entity calls
export const safeBase44Entity = async (entityCall, fallbackValue = null) => {
  return safeBase44Call(entityCall, fallbackValue, 'Base44 Entity');
};

// Wrapper for Base44 function calls
export const safeBase44Function = async (functionCall, fallbackValue = null) => {
  return safeBase44Call(functionCall, fallbackValue, 'Base44 Function');
};
