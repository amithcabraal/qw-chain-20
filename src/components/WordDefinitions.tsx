import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WordDefinitionsProps {
  definitions: string[];
  variant?: 'default' | 'game-over';
}

export function WordDefinitions({ definitions, variant = 'default' }: WordDefinitionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const tooltipTimeoutRef = useRef<number>();

  const checkTextTruncation = () => {
    if (textRef.current) {
      const isTruncated = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTextTruncated(isTruncated);
    }
  };

  useEffect(() => {
    checkTextTruncation();
    window.addEventListener('resize', checkTextTruncation);
    return () => {
      window.removeEventListener('resize', checkTextTruncation);
      if (tooltipTimeoutRef.current) {
        window.clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [currentIndex, definitions]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < definitions.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
      setShowTooltip(false);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    setShowTooltip(false);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const handleTextInteraction = (show: boolean) => {
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current);
    }

    if (show && isTextTruncated) {
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(true);
      }, 200);
    } else {
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(false);
      }, 200);
    }
  };

  if (!definitions.length) return null;

  const bgClass = variant === 'game-over' 
    ? 'bg-red-50 dark:bg-red-500/10' 
    : 'bg-emerald-50 dark:bg-emerald-900/30';

  return (
    <div className={`relative rounded-lg ${bgClass}`}>
      <div className="flex items-center">
        {definitions.length > 1 && (
          <button
            onClick={() => paginate(-1)}
            disabled={currentIndex === 0}
            className={`flex-none p-2 m-1 rounded-lg transition-colors ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : variant === 'game-over'
                ? 'hover:bg-red-100 dark:hover:bg-red-900/20'
                : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
            }`}
            aria-label="Previous definition"
          >
            <ChevronLeft className={`w-5 h-5 ${
              variant === 'game-over'
                ? 'text-red-600 dark:text-red-200'
                : 'text-emerald-700 dark:text-emerald-200'
            }`} />
          </button>
        )}

        <div className="flex-grow relative min-h-[120px] px-2">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 flex items-center px-2 py-4"
            >
              <div className="relative w-full">
                <p
                  ref={textRef}
                  className={`text-sm line-clamp-4 ${
                    variant === 'game-over' 
                      ? 'text-red-600 dark:text-red-200/80' 
                      : 'text-emerald-700 dark:text-emerald-100/80'
                  } ${isTextTruncated ? 'cursor-pointer' : ''}`}
                  onMouseEnter={() => handleTextInteraction(true)}
                  onMouseLeave={() => handleTextInteraction(false)}
                  onTouchStart={() => handleTextInteraction(true)}
                  onTouchEnd={() => handleTextInteraction(false)}
                >
                  {definitions[currentIndex]}
                </p>
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 left-0 -top-12 w-full pointer-events-none"
                    >
                      <div className={`p-2 rounded shadow-lg text-sm max-w-[calc(100vw-2rem)] ${
                        variant === 'game-over'
                          ? 'bg-white dark:bg-gray-900 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800'
                          : 'bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {definitions[currentIndex]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {definitions.length > 1 && (
          <button
            onClick={() => paginate(1)}
            disabled={currentIndex === definitions.length - 1}
            className={`flex-none p-2 m-1 rounded-lg transition-colors ${
              currentIndex === definitions.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : variant === 'game-over'
                ? 'hover:bg-red-100 dark:hover:bg-red-900/20'
                : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
            }`}
            aria-label="Next definition"
          >
            <ChevronRight className={`w-5 h-5 ${
              variant === 'game-over'
                ? 'text-red-600 dark:text-red-200'
                : 'text-emerald-700 dark:text-emerald-200'
            }`} />
          </button>
        )}
      </div>

      {definitions.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-2">
          {definitions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                setShowTooltip(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                variant === 'game-over'
                  ? index === currentIndex
                    ? 'bg-red-500 dark:bg-red-400'
                    : 'bg-red-200 dark:bg-red-800'
                  : index === currentIndex
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : 'bg-emerald-200 dark:bg-emerald-800'
              }`}
              aria-label={`Go to definition ${index + 1} of ${definitions.length}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}