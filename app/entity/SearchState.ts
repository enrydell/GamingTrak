/**
 * VIPER - Entity
 * Models and data structures used in the Search module
 */
import { Game } from "./Game";

export type SearchState = {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
};
