import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export function Timer({ timeLeft, onTimeUp }: TimerProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(timeLeft);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }

    // Only update if time has actually changed
    if (timeLeft !== lastTimeRef.current) {
      lastTimeRef.current = timeLeft;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${timeLeft / 30})`;
      }
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="flex items-center gap-2">
      <TimerIcon className="w-5 h-5 text-emerald-400" />
      <div className="w-full bg-emerald-900/20 rounded-full h-2 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-emerald-500 origin-left transition-transform duration-1000 ease-linear will-change-transform"
          style={{ transform: `scaleX(${timeLeft / 30})` }}
        />
      </div>
      <span className="text-emerald-100 min-w-[3ch]">{timeLeft}s</span>
    </div>
  );
}