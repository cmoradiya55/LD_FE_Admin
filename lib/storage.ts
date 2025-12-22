/**
 * Storage utilities for authentication tokens and data
 */

const TOKEN_KEY = 'adminpro-token';
const AUTH_KEY = 'adminpro-auth';

/**
 * Retrieves the authentication token from localStorage
 * @returns The token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // First, try to get token from dedicated token storage
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return token;
    }

    // Fallback: try to get token from auth object
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token || null;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Clears all authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}
