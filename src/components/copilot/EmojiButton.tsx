'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

interface EmojiButtonProps {
  emoji: string;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function EmojiButton({ emoji, label, isSelected, onClick }: EmojiButtonProps) {
  const { playPop, initAudio } = useAudio();

  const handleTap = () => {
    initAudio();
    playPop();
    onClick();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleTap}
      className={cn(
        "relative flex flex-col items-center justify-center w-28 h-28 rounded-3xl text-5xl shadow-sm transition-colors",
        "bg-white border-4",
        isSelected 
          ? "border-indigo-500 bg-indigo-50/50 shadow-indigo-100" 
          : "border-transparent hover:border-indigo-200"
      )}
      aria-label={label}
    >
      <span>{emoji}</span>
      <span className="sr-only">{label}</span>
      
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}
