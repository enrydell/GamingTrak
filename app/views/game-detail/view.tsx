/**
 * VIPER - View
 * React component that renders the Game Detail UI
 */

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Game } from '../../entity/Game';
import { styles } from './styling';

interface GameDetailViewProps {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}

const getReleaseYear = (timestamp?: number): string => {
  if (!timestamp) return 'Data desconhecida';
  return new Date(timestamp * 1000).getFullYear().toString();
};

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  isLoading,
  error,
}) => {
  const releaseYear = useMemo(() => {
    return getReleaseYear(game?.releaseDate);
  }, [game?.releaseDate]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Jogo não encontrado</Text>
        </View>
      </View>
    );
  }

  const backgroundUri = game?.coverUrl || '';

  return (
    <View style={styles.container}>
      {backgroundUri && (
        <Image
          source={{ uri: backgroundUri }}
          blurRadius={5}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.blurOverlay} />
      <ScrollView
        style={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          {game.coverUrl ? (
            <Image
              source={{ uri: game.coverUrl }}
              style={styles.gameImageLarge}
              onError={() => {
                // Handle image loading error
              }}
            />
          ) : (
            <View style={styles.gameImageLarge} />
          )}
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.gameTitle} numberOfLines={3}>
            {game.name}
          </Text>

          <Text style={styles.releaseYear}>{releaseYear}</Text>

          {game.summary ? (
            <Text style={styles.description}>
              {game.summary}
            </Text>
          ) : (
            <Text style={styles.noDescriptionText}>
              Sem descrição disponível
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
