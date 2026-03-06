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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!game) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Jogo não encontrado</Text>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={false}
      >
        <View style={styles.gameCardsContainer}>
          {game.coverUrl ? (
            <Image
              source={{ uri: game.coverUrl }}
              style={styles.coverImage}
              onError={() => {
                // Handle image loading error
              }}
            />
          ) : (
            <View style={styles.coverImage} />
          )}

          <Text style={styles.gameTitle} numberOfLines={3}>
            {game.name}
          </Text>

          <Text style={styles.releaseYear}>{releaseYear}</Text>

          {game.summary ? (
            <Text style={styles.description} numberOfLines={6}>
              {game.summary}
            </Text>
          ) : (
            <Text style={styles.noDescriptionText}>
              Sem descrição disponível
            </Text>
          )}
        </View>
      </ScrollView>
    );
  };

  const backgroundUri = game?.coverUrl || '';

  return (
    <View style={styles.container}>
      {backgroundUri && (
        <Image
          source={{ uri: backgroundUri }}
          blurRadius={10}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.blurOverlay} />
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>
    </View>
  );
};
