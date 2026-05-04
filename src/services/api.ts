export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle auth errors globally if needed
    if (response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Something went wrong');
  }

  // Handle 204 No Content or empty responses
  if (response.status === 204) return null;
  
  return response.json();
};
