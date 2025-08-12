// Utility function to handle API errors gracefully
export const handleApiError = (error: any, router?: any) => {
  console.error('API Error:', error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  // Handle authentication errors specifically
  if (errorMessage.includes('Authentication error') || errorMessage.includes('401')) {
    // Only redirect to login for actual authentication errors
    if (router) {
      router.push('/login');
    }
    return 'Authentication failed. Please log in again.';
  }
  
  // Handle 404 errors without affecting authentication
  if (errorMessage.includes('404') || errorMessage.includes('Resource not found')) {
    return 'The requested resource was not found.';
  }
  
  // Handle network errors
  if (errorMessage.includes('Network error') || errorMessage.includes('Failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Return the original error message for other cases
  return errorMessage;
};

// Utility to check if an error is authentication-related
export const isAuthError = (error: any): boolean => {
  const errorMessage = error?.message || '';
  return errorMessage.includes('Authentication error') || 
         errorMessage.includes('401') || 
         errorMessage.includes('Unauthorized');
};

// Utility to check if an error is a 404 error
export const isNotFoundError = (error: any): boolean => {
  const errorMessage = error?.message || '';
  return errorMessage.includes('404') || 
         errorMessage.includes('Resource not found') ||
         errorMessage.includes('Not Found');
};
