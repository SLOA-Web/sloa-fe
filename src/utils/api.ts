const getApiBaseUrl = () => {
  // The API base URL is read from the `NEXT_PUBLIC_API_URL` environment variable.
  // This is configured in the `.env.local` file for local development.
  return process.env.NEXT_PUBLIC_API_URL || '';
};

const api = {
  async post(endpoint: string, body: any, token?: string | null) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async get(endpoint: string, token: string | null) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },
  
  async postFormData(endpoint: string, formData: FormData, token: string | null) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
    }
    return response.json();
  }
};

export default api;
