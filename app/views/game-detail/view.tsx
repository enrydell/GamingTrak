/**
 * VIPER - View
 * React component that renders the Game Detail UI
 */

import React, { useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
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

  const scrollY = useRef(new Animated.Value(0)).current;

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

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

      <Animated.ScrollView
        style={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.imageSection}>
          {game.coverUrl && (
            <Animated.Image
              source={{ uri: game.coverUrl }}
              style={[
                styles.gameImageLarge,
                {
                  transform: [{ translateY: imageTranslateY }],
                },
              ]}
              onError={() => {
                // Handle image loading error
              }}
            />
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
      </Animated.ScrollView>
    </View>
  );
};
