/**
 * GameCard Component
 * Displays individual game information with cover image
 */

import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Game } from "../../../entity/Game";
import { styles } from '../styling';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '../../router/game-detail',
      params: {
        id: game.id.toString(),
        name: game.name,
        summary: game.summary || '',
        coverUrl: game.coverUrl || '',
        releaseDate: game.releaseDate?.toString() || '',
        backgroundUrl: game.backgroundUrl || '',
      },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.gameCard}>
        {game.coverUrl ? (
          <Image
            source={{ uri: game.coverUrl }}
            style={styles.gameImage}
            onError={() => {
              // Handle image loading error
            }}
          />
        ) : (
          <View style={styles.gameImage} />
        )}
        <View style={styles.gameInfo}>
          <Text style={styles.gameName} numberOfLines={2}>
            {game.name}
          </Text>
          {game.summary && (
            <Text style={styles.gameSummary} numberOfLines={2}>
              {game.summary}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};
