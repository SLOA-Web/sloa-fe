
// Helper to get the API base URL
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // Use same-origin in the browser so dev on port 8000 works
    return '';
  }
  // Fallback for server-side (build/SSR)
  return 'http://localhost:3000';
};

// Helper to get default headers
const getDefaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
  } as HeadersInit;
};

const api = {
  async me() {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/me`, {
      method: 'GET',
      headers: getDefaultHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, body: unknown) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({ message: 'Resource not found' }));
        throw new Error(errorData.message || 'Resource not found');
      }
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ message: 'Unauthorized' }));
        throw new Error(`Authentication error: ${errorData.message || 'Unauthorized'}`);
      }
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'GET',
      headers: getDefaultHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({ message: 'Resource not found' }));
        throw new Error(errorData.message || 'Resource not found');
      }
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ message: 'Unauthorized' }));
        throw new Error(`Authentication error: ${errorData.message || 'Unauthorized'}`);
      }
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async postFormData(endpoint: string, formData: FormData) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'File upload failed' }));
      throw new Error(errorData.message || 'File upload failed');
    }
    return response.json();
  },

  async put(endpoint: string, body: unknown) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: getDefaultHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },
};

export default api;
