'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface MagicTapTargetProps {
  emoji: string;
}

export function MagicTapTarget({ emoji }: MagicTapTargetProps) {
  const [isMashed, setIsMashed] = useState(false);
  const { playPop, initAudio } = useAudio();
  const controls = useAnimation();

  const handleTap = async () => {
    if (isMashed) return;

    initAudio(); // Ensure context is running
    playPop();
    setIsMashed(true);
    
    // Random jitter between -5 and 5 degrees
    const jitter = Math.floor(Math.random() * 11) - 5;

    await controls.start({
      scale: 0.85,
      rotate: jitter,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
        mass: 0.5
      }
    });

    await controls.start({
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
        mass: 0.8
      }
    });

    setIsMashed(false);
  };

  return (
    <motion.span
      animate={controls}
      onTap={handleTap}
      className="inline-block cursor-pointer select-none mx-1 text-4xl sm:text-5xl align-middle"
      aria-hidden="true"
    >
      {emoji}
    </motion.span>
  );
}
