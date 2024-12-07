import type { GameHistory, WordChain } from '../types';

const HISTORY_KEY = 'quidz-wordz-history';

export const saveGameToHistory = (game: {
  startWord: string;
  score: number;
  chain: WordChain[];
  missedWord?: string;
  missedWordDefinition?: string;
}) => {
  const history = getGameHistory();
  const newGame: GameHistory = {
    ...game,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  
  // Keep only the last 10 games
  history.unshift(newGame);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
};

export const getGameHistory = (): GameHistory[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error reading game history:', error);
    return [];
  }
};

export const clearGameHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};