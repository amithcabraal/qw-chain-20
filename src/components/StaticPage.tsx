import { motion } from 'framer-motion';
import { GameHistory } from './GameHistory';
import type { Page } from '../types';

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
  currentPage: Page;
  onReplay?: (startWord: string) => void;
  onNavigate?: (page: Page) => void;
}

export function StaticPage({ 
  title, 
  children, 
  currentPage,
  onReplay,
  onNavigate 
}: StaticPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="p-6 rounded-xl bg-emerald-800/20 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100 mb-6">{title}</h2>
        {currentPage === 'history' && onReplay && onNavigate ? (
          <GameHistory onReplay={onReplay} onNavigate={onNavigate} />
        ) : (
          <div className="text-emerald-100/90 space-y-4">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}