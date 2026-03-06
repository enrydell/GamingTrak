/**
 * VIPER - Interactor
 * Business logic for fetching games from IGDB API
 */

import secrets from '../../secrets.json';
import { Game } from '../entity/Game';
import { igdbAuthService } from '../services/igdbAuthService';

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  first_release_date?: number;
  artworks?: Array<{ image_id: string; }>;
}

export interface IGDBCover {
  image_id: string;
}

export class SearchInteractor {
  private clientId: string;

  constructor() {
    this.clientId = secrets.igdb['client-id'];
  }

  /**
   * Fetch games from IGDB API by name
   */
  async fetchGamesByName(searchQuery: string): Promise<Game[]> {
    if (!searchQuery.trim()) {
      return [];
    }

    try {
      const response = await this.makeRequest('https://api.igdb.com/v4/games',
        `fields *; search "${searchQuery}"; limit 20;`
      );

      const games: IGDBGame[] = await response.json();

      // Fetch covers and artwork for each game
      const gamesWithCovers = await Promise.all(
        games.map(async (game) => ({
          id: game.id,
          name: game.name,
          summary: game.summary,
          releaseDate: game.first_release_date,
          coverUrl: await this.fetchGameCover(game.id),
          backgroundUrl: await this.fetchGameArtwork(game.id),
        }))
      );

      return gamesWithCovers;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw new Error('Failed to fetch games from IGDB');
    }
  }

  /**
   * Fetch cover image for a specific game
   */
  private async fetchGameCover(gameId: number): Promise<string> {
    try {
      const response = await this.makeRequest(
        'https://api.igdb.com/v4/covers',
        `fields *; where game = ${gameId};`
      );

      const covers: IGDBCover[] = await response.json();

      if (covers.length > 0) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${covers[0].image_id}.jpg`;
      }

      return '';
    } catch (error) {
      console.error(`Error fetching cover for game ${gameId}:`, error);
      return '';
    }
  }

  /**
   * Fetch artwork image for a specific game
   */
  private async fetchGameArtwork(gameId: number): Promise<string> {
    try {
      const response = await this.makeRequest(
        'https://api.igdb.com/v4/artworks',
        `fields *; where game = ${gameId}; limit 1;`
      );

      const artworks: Array<{ image_id: string; }> = await response.json();

      if (artworks.length > 0) {
        return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${artworks[0].image_id}.jpg`;
      }

      return '';
    } catch (error) {
      console.error(`Error fetching artwork for game ${gameId}:`, error);
      return '';
    }
  }

  /**
   * Make an authenticated request to IGDB API with automatic token refresh on 401
   */
  private async makeRequest(url: string, body: string, retryCount = 0): Promise<Response> {
    const maxRetries = 1;

    try {
      const accessToken = await igdbAuthService.getAccessToken();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
        body,
      });

      // If we get a 401, the token might have expired, refresh and retry once
      if (response.status === 401 && retryCount < maxRetries) {
        console.warn('Received 401, refreshing token and retrying...');
        await igdbAuthService.forceRefresh();
        return this.makeRequest(url, body, retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Error making IGDB request:', error);
      throw error;
    }
  }
}
