import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuButton } from './MenuButton';
import { MenuItems } from './MenuItems';
import { Toast } from '../Toast';
import { shareGame } from '../../utils/share';
import type { Page } from '../../types';
import type { GameState } from '../../types';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  gameState: GameState;
}

export function Navigation({ currentPage, onPageChange, gameState }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async () => {
    try {
      await shareGame(gameState);
      setSuccess('Game details copied to clipboard!');
      setIsOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error && err.message === 'Game details copied to clipboard!') {
        setSuccess(err.message);
      } else {
        setError('Failed to share game');
      }
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  const handleMenuToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <div className="relative z-50" ref={menuRef}>
        <MenuButton 
          isOpen={isOpen} 
          onClick={handleMenuToggle}
        />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-emerald-900 shadow-lg overflow-hidden"
            >
              <MenuItems
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onShare={handleShare}
                onClose={() => setIsOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <Toast
            message={error}
            isVisible={true}
            onClose={() => setError(null)}
            type="error"
          />
        )}
        {success && (
          <Toast
            message={success}
            isVisible={true}
            onClose={() => setSuccess(null)}
            type="success"
          />
        )}
      </AnimatePresence>
    </>
  );
}