// Cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getApiBaseUrl = () => {
  // The API base URL is read from the `NEXT_PUBLIC_API_URL` environment variable.
  // This is configured in the `.env.local` file for local development.
  return process.env.NEXT_PUBLIC_API_URL || '';
};

const getAuthHeaders = () => {
  const token = getCookie('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const api = {
  async post(endpoint: string, body: any) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      // Handle 404 errors gracefully without affecting authentication
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({ message: 'Resource not found' }));
        throw new Error(errorData.message || 'Resource not found');
      }
      
      // Handle 401 errors specifically for authentication issues
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
      headers: getAuthHeaders(),
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      // Handle 404 errors gracefully without affecting authentication
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({ message: 'Resource not found' }));
        throw new Error(errorData.message || 'Resource not found');
      }
      
      // Handle 401 errors specifically for authentication issues
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
    const token = getCookie('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'File upload failed' }));
        throw new Error(errorData.message || 'File upload failed');
    }
    return response.json();
  },

  async put(endpoint: string, body: any) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      credentials: 'include', // Send cookies with requests
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
      headers: getAuthHeaders(),
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  }
};

export default api;
