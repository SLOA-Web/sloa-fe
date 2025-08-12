# Authentication Error Handling

This document explains the improvements made to prevent authentication tokens from being cleared when navigating to broken pages or encountering 404 errors.

## Problem

Previously, when users navigated to broken pages (404 errors), the application would sometimes clear the authentication token and log them out. This was happening because:

1. API calls were being made to non-existent endpoints
2. Error handling was too aggressive in clearing authentication data
3. No distinction was made between authentication errors and other types of errors

## Solution

### 1. Custom Error Pages

Created custom error handling pages that don't interfere with authentication:

- `src/app/not-found.tsx` - Custom 404 page
- `src/app/error.tsx` - Global error boundary

### 2. Improved API Error Handling

Enhanced `src/utils/api.ts` to handle different types of errors appropriately:

- **404 Errors**: Handled gracefully without affecting authentication
- **401 Errors**: Specifically identified as authentication issues
- **Network Errors**: Distinguished from authentication errors

### 3. Enhanced AuthContext

Improved `src/context/AuthContext.tsx` to be more resilient:

- Only clears tokens for actual authentication errors
- Preserves authentication state for other types of errors
- Better error classification

### 4. Error Handler Utility

Created `src/utils/errorHandler.ts` with utility functions:

- `handleApiError()` - Centralized error handling
- `isAuthError()` - Check if error is authentication-related
- `isNotFoundError()` - Check if error is a 404 error

## Usage

### In Components

```typescript
import { handleApiError } from '@/utils/errorHandler';

try {
  const data = await api.get('/some-endpoint');
  // Handle success
} catch (err) {
  const errorMessage = handleApiError(err, router);
  setError(errorMessage);
}
```

### Error Types

The system now distinguishes between:

1. **Authentication Errors (401)**: Redirects to login, clears tokens
2. **Not Found Errors (404)**: Shows user-friendly message, preserves authentication
3. **Network Errors**: Shows connection error message, preserves authentication
4. **Other Errors**: Shows original error message, preserves authentication

## Best Practices

1. **Always use the error handler utility** when making API calls
2. **Don't manually clear tokens** unless it's an actual authentication error
3. **Test error scenarios** to ensure authentication state is preserved
4. **Log errors appropriately** for debugging without affecting user experience

## Testing

To test the improvements:

1. Navigate to a non-existent page (e.g., `/broken-page`)
2. Verify that you remain logged in
3. Check that the custom 404 page is displayed
4. Verify that you can navigate back to authenticated pages

## Files Modified

- `src/app/not-found.tsx` - Custom 404 page
- `src/app/error.tsx` - Global error boundary
- `src/utils/api.ts` - Enhanced error handling
- `src/context/AuthContext.tsx` - More resilient authentication
- `src/utils/errorHandler.ts` - Error handling utilities
- `src/app/member-portal/applications/page.tsx` - Updated error handling
- `src/app/application-status/page.tsx` - Updated error handling
