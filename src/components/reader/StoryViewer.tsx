'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicTapTarget } from './MagicTapTarget';

interface StoryViewerProps {
  title: string;
  content: string;
  onExit: () => void;
}

export function StoryViewer({ title, content, onExit }: StoryViewerProps) {
  const [exitProgress, setExitProgress] = useState(0);
  const exitTimer = useRef<NodeJS.Timeout | null>(null);
  const exitStartTime = useRef<number | null>(null);

  // Regex to split by emojis while keeping them
  // This matches common emojis and preserves them in the array
  const parts = content.split(/([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/u);

  const startExit = () => {
    exitStartTime.current = Date.now();
    exitTimer.current = setInterval(() => {
      if (exitStartTime.current) {
        const elapsed = Date.now() - exitStartTime.current;
        const progress = Math.min(elapsed / 2000, 1); // 2 second hold
        setExitProgress(progress);
        if (progress >= 1) {
          stopExit();
          onExit();
        }
      }
    }, 50);
  };

  const stopExit = () => {
    if (exitTimer.current) clearInterval(exitTimer.current);
    exitTimer.current = null;
    exitStartTime.current = null;
    setExitProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col px-6 py-4 sm:p-12 md:p-16 overflow-y-auto select-none"
    >
      <div className="max-w-3xl mx-auto w-full space-y-12 pt-8 pb-32 sm:pt-12">
        <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 leading-tight pr-14 sm:pr-0">
          {title}
        </h1>
        
        <div className="text-2xl sm:text-3xl leading-[1.6] text-indigo-900/90 font-medium tracking-wide">
          {parts.map((part, i) => {
            // Simple check if part is an emoji
            const isEmoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(part);
            if (isEmoji) {
              return <MagicTapTarget key={i} emoji={part} />;
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      </div>

      {/* Adult-Gated Exit Button */}
      <div className="fixed top-4 right-4 sm:top-10 sm:right-10 flex flex-col items-center gap-2 z-[110]">
        <div className="relative">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-indigo-100/70"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={175.9}
              strokeDashoffset={175.9 - (175.9 * exitProgress)}
              className="text-indigo-500 transition-all duration-75"
            />
          </svg>
          <button
            onMouseDown={startExit}
            onMouseUp={stopExit}
            onMouseLeave={stopExit}
            onTouchStart={startExit}
            onTouchEnd={stopExit}
            className="absolute inset-0 flex items-center justify-center text-indigo-500 hover:scale-110 active:scale-95 transition-transform"
            aria-label="Hold to exit"
          >
            <span className="text-xl sm:text-2xl font-bold">✕</span>
          </button>
        </div>
        <p className="text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-widest text-center">
          Hold to exit
        </p>
      </div>
    </motion.div>
  );
}
