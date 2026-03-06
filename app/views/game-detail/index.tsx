/**
 * Game Detail Router
 * VIPER Architecture Pattern
 * 
 * This screen uses the VIPER pattern to display game details
 */

import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Game } from '../../entity/Game';
import { useGameDetailPresenter } from '../../presenter/GameDetailPresenter';
import { GameDetailView } from './view';

/**
 * GameDetailRouter component
 * This component assembles the VIPER architecture and provides the fully configured screen
 */
export const GameDetailRouter: React.FC = () => {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    summary?: string;
    coverUrl?: string;
    releaseDate?: string;
    backgroundUrl?: string;
  }>();

  const game = useMemo((): Game | null => {
    if (!params.id || !params.name) {
      return null;
    }

    return {
      id: parseInt(params.id, 10),
      name: params.name,
      summary: params.summary,
      coverUrl: params.coverUrl,
      releaseDate: params.releaseDate ? parseInt(params.releaseDate, 10) : undefined,
      backgroundUrl: params.backgroundUrl,
    };
  }, [params]);

  const state = useGameDetailPresenter(game?.id || 0);

  return (
    <GameDetailView
      game={game}
      isLoading={state.isLoading}
      error={state.error}
    />
  );
};

export default GameDetailRouter;
