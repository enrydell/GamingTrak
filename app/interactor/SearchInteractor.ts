/**
 * VIPER - Interactor
 * Business logic for fetching games from IGDB API
 */

import secrets from '../../secrets.json';
import { Game } from '../entity/Game';

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
}

export interface IGDBCover {
  image_id: string;
}

export class SearchInteractor {
  private clientId: string;
  private bearer: string;

  constructor() {
    this.clientId = secrets.igdb['client-id'];
    this.bearer = secrets.igdb.bearer;
  }

  /**
   * Fetch games from IGDB API by name
   */
  async fetchGamesByName(searchQuery: string): Promise<Game[]> {
    if (!searchQuery.trim()) {
      return [];
    }

    try {
      const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer "${this.bearer}"`,
        },
        body: `fields *; search "${searchQuery}"; limit 20;`,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const games: IGDBGame[] = await response.json();

      // Fetch covers for each game
      const gamesWithCovers = await Promise.all(
        games.map(async (game) => ({
          ...game,
          coverUrl: await this.fetchGameCover(game.id),
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
      const response = await fetch('https://api.igdb.com/v4/covers', {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer "${this.bearer}"`,
        },
        body: `fields *; where game = ${gameId};`,
      });

      if (!response.ok) {
        return '';
      }

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
}
