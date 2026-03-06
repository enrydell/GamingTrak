/**
 * VIPER - View
 * React component that renders the Search UI
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Game } from "../../entity/Game";
import { SearchState } from '../../entity/SearchState';

interface SearchViewProps {
  state: SearchState;
  onSearchChange: (query: string) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gameCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gameImage: {
    width: 60,
    height: 85,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  gameSummary: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

const GameCard: React.FC<{ game: Game; }> = ({ game }) => (
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
);

export const SearchView: React.FC<SearchViewProps> = ({
  state,
  onSearchChange,
}) => {
  const renderContent = () => {
    if (state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      );
    }

    if (state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      );
    }

    if (state.searchQuery && state.games.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No games found</Text>
        </View>
      );
    }

    if (!state.searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Search for a game</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={state.games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GameCard game={item} />}
        scrollEnabled={false}
        nestedScrollEnabled={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onSearchChange}
          value={state.searchQuery}
          placeholder="Search for a game"
          placeholderTextColor="#999"
          keyboardType="default"
        />
      </View>
      <ScrollView style={styles.contentContainer} nestedScrollEnabled={true}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};
