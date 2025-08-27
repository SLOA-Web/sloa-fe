// Get API base URL from environment or fallback to localhost
const getBaseUrl = () => {
  // Always use the direct backend URL
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
};

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string | FormData | object;
  params?: Record<string, unknown>;
  skipCredentials?: boolean; // For cases where credentials shouldn't be sent
}

// User profile update interface
interface UserProfileUpdate {
  fullName?: string;
  nic?: string;
  specialization?: string;
  hospital?: string;
  location?: string;
  cv?: string;
  birthDate?: string;
  documents?: string[];
}

// Removed unused interface

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  /**
   * Main API method - handles all HTTP requests with consistent configuration
   */
  async request<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    try {
      const { 
        method = 'GET', 
        headers = {}, 
        body, 
        params, 
        skipCredentials = false 
      } = options;
      
      // Build URL with query parameters for GET requests
      let url = `${this.baseUrl}${endpoint}`;
      if (params && method === 'GET') {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        url += query ? `?${query}` : '';
      }

      // Set default headers with credentials
      const defaultHeaders: Record<string, string> = {};

      // Handle different body types
      let processedBody: string | FormData | undefined;
      if (body instanceof FormData) {
        // FormData - don't set Content-Type, let browser set it
        processedBody = body;
      } else if (body && typeof body === 'object') {
        // JSON object - stringify and set content type
        defaultHeaders['Content-Type'] = 'application/json';
        processedBody = JSON.stringify(body);
      } else if (body) {
        // String body
        processedBody = body as string;
        if (!headers['Content-Type']) {
          defaultHeaders['Content-Type'] = 'application/json';
        }
      }

      const fetchOptions: RequestInit = {
        method,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        body: processedBody,
      };

      // Always include credentials unless explicitly skipped
      if (!skipCredentials) {
        fetchOptions.credentials = 'include';
      }

      const response = await fetch(url, fetchOptions);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let responseData: unknown;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage: string;

        if (typeof responseData === 'object' && responseData !== null) {
          // Try to extract message or error property if present
          const data = responseData as Record<string, unknown>;
          errorMessage =
            (typeof data.message === 'string' && data.message) ||
            (typeof data.error === 'string' && data.error) ||
            `HTTP error! status: ${response.status}`;
        } else if (typeof responseData === 'string' && responseData.length > 0) {
          errorMessage = responseData;
        } else {
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return responseData as T;
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred";
      console.error(`API call failed [${options.method || 'GET'} ${endpoint}]:`, errorMessage);
      throw err; // Re-throw the error so the calling function can handle it
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, params?: Record<string, unknown>, options?: Omit<FetchOptions, 'method' | 'params'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T = unknown>(endpoint: string, body?: string | FormData | object, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(endpoint: string, body?: string | object | FormData, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(endpoint: string, body?: string | object | FormData, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Upload file(s) with FormData
   */
  async upload<T = unknown>(endpoint: string, formData: FormData, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: formData });
  }

  /**
   * Update current user's profile details
   */
  async updateUserProfile(profileData: UserProfileUpdate): Promise<{ message: string; user: any }> {
    return this.patch('/api/v1/users/me/details', profileData);
  }

  /**
   * Get current user's profile
   */
  async getCurrentUser(): Promise<{ user: any }> {
    return this.get('/api/v1/auth/me');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

// Export the main methods for backwards compatibility
export const api = apiClient;

// Legacy function for backwards compatibility
export const fetchData = (endpoint: string, options: FetchOptions = {}) => {
  return apiClient.request(endpoint, options);
};

// Export convenience methods with proper binding
export const get = apiClient.get.bind(apiClient);
export const post = apiClient.post.bind(apiClient);
export const put = apiClient.put.bind(apiClient);
export const patch = apiClient.patch.bind(apiClient);
export const del = apiClient.delete.bind(apiClient);
export const upload = apiClient.upload.bind(apiClient);

export default apiClient;