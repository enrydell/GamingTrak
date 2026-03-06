/**
 * Search Screen
 * VIPER Architecture Pattern
 * 
 * This screen uses the VIPER pattern to display search results from IGDB API
 */

import React from 'react';
import { useSearchPresenter } from '../../presenter/SearchPresenter';
import { SearchView } from '../../views/search/view';

/**
 * SearchRouter component
 * This component assembles the VIPER architecture and provides the fully configured screen
 */
export const SearchRouter: React.FC = () => {
  const { state, handleSearch } = useSearchPresenter();

  return (
    <SearchView state={state} onSearchChange={handleSearch} />
  );
};

export default SearchRouter;