/**
 * IGDB Authentication Service
 * Manages OAuth2 token refresh and caching
 * Reference: https://api-docs.igdb.com/?javascript#authentication
 */

import secrets from '../../secrets.json';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

class IGDBAuthService {
  private cachedToken: CachedToken | null = null;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.clientId = secrets.igdb['client-id'];
    this.clientSecret = secrets.igdb['client-secret'];
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    // If we have a cached token that hasn't expired, return it
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.token;
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Otherwise, refresh the token
    this.refreshPromise = this.refreshAccessToken();
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Refresh the access token from Twitch OAuth2
   * POST: https://id.twitch.tv/oauth2/token
   */
  private async refreshAccessToken(): Promise<string> {
    try {
      const url = new URL('https://id.twitch.tv/oauth2/token');
      url.searchParams.append('client_id', this.clientId);
      url.searchParams.append('client_secret', this.clientSecret);
      url.searchParams.append('grant_type', 'client_credentials');

      const response = await fetch(url.toString(), {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText}`
        );
      }

      const data: TokenResponse = await response.json();

      // Cache the token with expiration time (subtract 60 seconds as buffer)
      const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
      this.cachedToken = {
        token: data.access_token,
        expiresAt,
      };

      console.log('IGDB token refreshed successfully');
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing IGDB token:', error);
      throw new Error('Failed to obtain IGDB access token');
    }
  }

  /**
   * Force a token refresh (useful when receiving 401 errors)
   */
  async forceRefresh(): Promise<string> {
    this.cachedToken = null;
    return this.getAccessToken();
  }
}

// Export singleton instance
export const igdbAuthService = new IGDBAuthService();
