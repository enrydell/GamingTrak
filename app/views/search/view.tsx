/**
 * VIPER - View
 * React component that renders the Search UI
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SearchState } from '../../entity/SearchState';
import { GameCard } from './components/GameCard';
import { styles } from './styling';

interface SearchViewProps {
  state: SearchState;
  onSearchChange: (query: string) => void;
}

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
