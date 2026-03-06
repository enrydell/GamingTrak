/**
 * VIPER - Presenter
 * State management and presentation logic for Game Detail screen
 */

import { useEffect, useState } from 'react';
import { Game } from '../entity/Game';
import { SearchInteractor } from '../interactor/SearchInteractor';

interface GameDetailState {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}

export const useGameDetailPresenter = (gameId: number) => {
  const [state, setState] = useState<GameDetailState>({
    game: null,
    isLoading: true,
    error: null,
  });

  const interactor = new SearchInteractor();

  useEffect(() => {
    // In a real application, you would fetch the game details from the API
    // For now, we'll just set up the loading state
    // The game data is typically passed via navigation params
    setState(prev => ({
      ...prev,
      isLoading: false,
    }));
  }, [gameId]);

  return state;
};
