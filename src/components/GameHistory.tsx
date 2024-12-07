import { motion } from 'framer-motion';
import { History, Trophy, Play, Calendar, ChevronRight } from 'lucide-react';
import { getGameHistory } from '../utils/storage';
import type { Page } from '../types';

interface GameHistoryProps {
  onReplay: (startWord: string) => void;
  onNavigate: (page: Page) => void;
}

export function GameHistory({ onReplay, onNavigate }: GameHistoryProps) {
  const history = getGameHistory();

  const handleReplay = (startWord: string) => {
    onReplay(startWord);
    onNavigate('game');
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-emerald-800 dark:text-emerald-100/80 p-8">
        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No games played yet. Start playing to see your history!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4 pb-8 overflow-y-auto max-h-[calc(100vh-16rem)]"
    >
      {history.map((game) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg bg-white dark:bg-emerald-800/20 backdrop-blur-sm shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-100">
                  Score: {game.score}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-100/70">
                <Calendar className="w-4 h-4" />
                {new Date(game.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <button
              onClick={() => handleReplay(game.startWord)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              Replay
            </button>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-emerald-700 dark:text-emerald-100/80">
                Started with: <span className="font-semibold text-emerald-800 dark:text-emerald-100">{game.startWord}</span>
              </p>
              <span className="text-emerald-400/40">•</span>
              <p className="text-sm text-emerald-700 dark:text-emerald-100/80">
                Chain length: <span className="font-semibold text-emerald-800 dark:text-emerald-100">{game.chain.length} words</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {game.chain.map((word, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-emerald-400/50 mx-1" />}
                  <div className="px-2 py-1 rounded text-sm bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-100">
                    {word.word}
                  </div>
                </div>
              ))}
              {game.missedWord && (
                <>
                  <ChevronRight className="w-4 h-4 text-emerald-400/50 mx-1" />
                  <div className="px-2 py-1 rounded text-sm bg-red-50 dark:bg-red-800/40 text-red-700 dark:text-red-100">
                    {game.missedWord}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}