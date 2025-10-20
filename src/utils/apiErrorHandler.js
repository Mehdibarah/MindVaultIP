// Global API error handler to prevent unhandled errors from breaking the app
export const handleApiError = (error, context = 'API call') => {
  console.warn(`API Error in ${context}:`, error);
  
  // Don't throw errors for common API issues
  if (error?.message?.includes('500') || 
      error?.message?.includes('login-info') ||
      error?.message?.includes('by-id/null') ||
      error?.message?.includes('You must be logged in') ||
      error?.message?.includes('Base44Error') ||
      error?.message?.includes('authentication') ||
      error?.message?.includes('unauthorized')) {
    return null; // Silently handle these errors
  }
  
  // For other errors, you might want to show a user-friendly message
  return error;
};

// Wrapper for base44 API calls to handle errors gracefully
export const safeApiCall = async (apiCall, fallbackValue = null) => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, 'Safe API call');
    return fallbackValue;
  }
};
