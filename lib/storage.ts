/**
 * Storage utilities for authentication tokens and data
 */

const TOKEN_KEY = 'adminpro-token';
const AUTH_KEY = 'adminpro-auth';
const DOCUMENT_STATUS_KEY = 'documentStatus';

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

/**
 * Retrieves the document status from localStorage
 * @returns The document status number (1, 2, or 3) or null if not found
 */
export function getDocumentStatus(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const status = localStorage.getItem(DOCUMENT_STATUS_KEY);
    if (status) {
      return parseInt(status, 10);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving document status:', error);
    return null;
  }
}

/**
 * Saves the document status to localStorage
 * @param status The document status number (1, 2, or 3)
 */
export function setDocumentStatus(status: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(DOCUMENT_STATUS_KEY, status.toString());
  } catch (error) {
    console.error('Error saving document status:', error);
  }
}
