const getApiBaseUrl = () => {
  // The API base URL is read from the `NEXT_PUBLIC_API_URL` environment variable.
  // This is configured in the `.env.local` file for local development.
  return process.env.NEXT_PUBLIC_API_URL || '';
};

const api = {
  async post(endpoint: string, body: any) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'GET',
      credentials: 'include', // Send cookies with requests
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
        credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
    }
    return response.json();
  },

  async put(endpoint: string, body: any) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include', // Send cookies with requests
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  }
};

export default api;
