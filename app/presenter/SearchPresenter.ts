/**
 * VIPER - Presenter
 * Presentation logic and state management for Search module
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchState } from '../entity/SearchState';
import { SearchInteractor } from '../interactor/SearchInteractor';

export class SearchPresenter {
  private interactor: SearchInteractor;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(interactor: SearchInteractor) {
    this.interactor = interactor;
  }

  /**
   * Handle search query with debouncing
   */
  handleSearch(
    searchQuery: string,
    onStateChange: (state: Partial<SearchState>) => void
  ): void {
    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // If query is empty, clear results
    if (!searchQuery.trim()) {
      onStateChange({
        games: [],
        searchQuery,
        isLoading: false,
        error: null,
      });
      return;
    }

    // Set loading state
    onStateChange({
      searchQuery,
      isLoading: true,
      error: null,
    });

    // Debounce search request
    this.debounceTimer = setTimeout(async () => {
      try {
        const games = await this.interactor.fetchGamesByName(searchQuery);
        onStateChange({
          games,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        onStateChange({
          games: [],
          isLoading: false,
          error: errorMessage,
        });
      }
    }, 800); // 800ms debounce delay
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}

/**
 * Custom hook to use the Search presenter
 */
export function useSearchPresenter() {
  const [state, setState] = useState<SearchState>({
    games: [],
    isLoading: false,
    error: null,
    searchQuery: '',
  });

  const presenterRef = useRef<SearchPresenter | null>(null);

  // Initialize presenter
  useEffect(() => {
    const interactor = new SearchInteractor();
    presenterRef.current = new SearchPresenter(interactor);

    return () => {
      presenterRef.current?.destroy();
    };
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    if (presenterRef.current) {
      presenterRef.current.handleSearch(searchQuery, (updates) => {
        setState((prevState) => ({ ...prevState, ...updates }));
      });
    }
  }, []);

  return {
    state,
    handleSearch,
  };
}
