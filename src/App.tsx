import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Maximize2, Minimize2 } from 'lucide-react';
import { WordDisplay } from './components/WordDisplay';
import { GuessInput } from './components/GuessInput';
import { Timer } from './components/Timer';
import { GameOver } from './components/GameOver';
import { Navigation } from './components/Navigation';
import { StaticPage } from './components/StaticPage';
import { fetchWordData } from './utils/api';
import { STARTER_WORDS } from './utils/constants';
import { saveGameToHistory } from './utils/storage';
import { toggleFullscreen } from './utils/fullscreen';
import type { WordChain, GameState, Page } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('game');
  const [guessedVowels, setGuessedVowels] = useState<string[]>([]);
  
  const [gameState, setGameState] = useState<GameState>({
    currentChain: [],
    nextWordHint: '',
    score: 0,
    gameOver: false,
    timeLeft: 30,
    startWord: STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missedWordDefinition, setMissedWordDefinition] = useState<string>('');

  const getCurrentWord = useCallback(() => {
    if (gameState.currentChain.length === 0) return null;
    return gameState.currentChain[gameState.currentChain.length - 1];
  }, [gameState.currentChain]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (gameState.gameOver && gameState.currentChain.length > 0) {
      saveGameToHistory({
        startWord: gameState.startWord,
        score: gameState.score,
        chain: gameState.currentChain,
        missedWord: gameState.nextWordHint,
        missedWordDefinition
      });
    }
  }, [gameState.gameOver, gameState.currentChain, gameState.score, gameState.startWord, gameState.nextWordHint, missedWordDefinition]);

  const handleFullscreenToggle = async () => {
    try {
      await toggleFullscreen();
      setIsFullscreen(!isFullscreen);
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
  };

  const selectNextWord = (synonyms: string[], usedWords: Set<string>): string => {
    const availableSynonyms = synonyms.filter(
      word => !usedWords.has(word.toLowerCase())
    );
    if (availableSynonyms.length === 0) return '';
    return availableSynonyms[Math.floor(Math.random() * availableSynonyms.length)];
  };

  const initializeGame = useCallback(async (startWord?: string) => {
    setLoading(true);
    setError(null);
    setMissedWordDefinition('');
    setGuessedVowels([]);
    try {
      const initialWord = startWord || STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
      const wordData = await fetchWordData(initialWord);
      const usedWords = new Set([initialWord.toLowerCase()]);
      const nextWord = selectNextWord(wordData.synonyms, usedWords);
      
      setGameState({
        currentChain: [wordData],
        nextWordHint: nextWord,
        gameOver: false,
        timeLeft: 30,
        score: 0,
        startWord: initialWord
      });

      setCurrentPage('game');
    } catch (err) {
      setError('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, gameOver: true }));
    }

    const timer = setInterval(() => {
      if (!gameState.gameOver && gameState.timeLeft > 0) {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.timeLeft, gameState.gameOver]);

  useEffect(() => {
    if (gameState.gameOver && gameState.nextWordHint) {
      fetchWordData(gameState.nextWordHint).then(wordData => {
        setMissedWordDefinition(wordData.definition);
      });
    }
  }, [gameState.gameOver, gameState.nextWordHint]);

  const handleGuess = async (guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    
    if (normalizedGuess !== gameState.nextWordHint.toLowerCase()) {
      setError('Not the word I\'m thinking of. Try again!');
      return;
    }

    setLoading(true);
    setError(null);
    setGuessedVowels([]);
    
    try {
      const wordData = await fetchWordData(normalizedGuess);
      
      const usedWords = new Set(
        gameState.currentChain.map(word => word.word.toLowerCase())
      );
      usedWords.add(normalizedGuess);
      
      const nextWord = selectNextWord(wordData.synonyms, usedWords);
      
      if (!nextWord) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        currentChain: [...prev.currentChain, wordData],
        nextWordHint: nextWord,
        score: prev.score + (prev.timeLeft * 10),
        timeLeft: 30
      }));
    } catch (err) {
      setError('Failed to validate word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-emerald-50 dark:bg-emerald-950 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-100">
              QuizWordz Chain
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleFullscreenToggle}
                className="p-2 rounded-lg bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-100 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-100 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Navigation 
                currentPage={currentPage} 
                onPageChange={handlePageChange}
                gameState={gameState}
              />
            </div>
          </header>

          <main className="flex flex-col items-center gap-6">
            {currentPage === 'game' ? (
              loading && !gameState.gameOver ? (
                <div className="text-emerald-800 dark:text-emerald-100">Loading...</div>
              ) : !gameState.gameOver ? (
                <div className="game-container">
                  <div className="game-layout">
                    <div className="game-section">
                      {getCurrentWord() && (
                        <WordDisplay 
                          currentWord={getCurrentWord()!}
                          error={error}
                          isFirstWord={gameState.currentChain.length === 1}
                        />
                      )}
                      
                      <div className="w-full">
                        <Timer 
                          timeLeft={gameState.timeLeft} 
                          onTimeUp={() => setGameState(prev => ({ ...prev, gameOver: true }))}
                        />
                      </div>
                    </div>
                    
                    <div className="game-section">
                      <GuessInput 
                        onGuess={handleGuess}
                        disabled={loading || gameState.timeLeft === 0}
                        nextWordHint={gameState.nextWordHint}
                        guessedVowels={guessedVowels}
                      />
                      
                      <div className="text-xl font-bold text-emerald-800 dark:text-emerald-100 text-center mt-4">
                        Score: {gameState.score}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <GameOver 
                  score={gameState.score}
                  chain={gameState.currentChain}
                  onRestart={() => initializeGame()}
                  startWord={gameState.startWord}
                  missedWord={gameState.nextWordHint}
                  missedWordDefinition={missedWordDefinition}
                />
              )
            ) : (
              <StaticPage 
                title={currentPage === 'how-to-play' ? 'How to Play' : 
                       currentPage === 'privacy' ? 'Privacy Policy' : 
                       currentPage === 'contact' ? 'Contact Us' : 
                       currentPage === 'history' ? 'Game History' : currentPage}
                currentPage={currentPage}
                onReplay={initializeGame}
                onNavigate={setCurrentPage}
              >
                {currentPage === 'how-to-play' && (
                  <>
                    <p className="text-emerald-800 dark:text-emerald-100">QuizWordz Chain is a word association game where you build a chain of related words:</p>
                    <ol className="list-decimal pl-6 space-y-2 text-emerald-800 dark:text-emerald-100">
                      <li>Start with a given word</li>
                      <li>Use the vowel keys to reveal vowels in the hidden word</li>
                      <li>Find the similar word by guessing the correct vowels</li>
                      <li>Continue building the chain with new similar words</li>
                      <li>Score points based on your speed and chain length</li>
                    </ol>
                    <p className="mt-4 text-emerald-800 dark:text-emerald-100">The game ends when you either:</p>
                    <ul className="list-disc pl-6 space-y-2 text-emerald-800 dark:text-emerald-100">
                      <li>Run out of time (30 seconds per word)</li>
                      <li>Make an incorrect guess</li>
                      <li>No more valid similar words are available</li>
                    </ul>
                  </>
                )}
                {currentPage === 'privacy' && (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-100">Data Collection</h3>
                    <p className="mb-4 text-emerald-800 dark:text-emerald-100">We only store your game history locally on your device. No personal information is collected or transmitted.</p>
                    <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-100">Cookies</h3>
                    <p className="text-emerald-800 dark:text-emerald-100">We use local storage to save your game history and preferences. No tracking cookies are used.</p>
                  </>
                )}
                {currentPage === 'contact' && (
                  <>
                    <p className="text-emerald-800 dark:text-emerald-100">Have questions or feedback about QuizWordz Chain? We'd love to hear from you!</p>
                    <p className="text-emerald-800 dark:text-emerald-100">Email us at: support@quizwordz.com</p>
                  </>
                )}
              </StaticPage>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;