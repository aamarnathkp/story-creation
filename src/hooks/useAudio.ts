'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Procedural Audio Engine for Magic Tap.
 * Generates a satisfying "Pop" sound using the Web Audio API.
 * This ensures no external assets are required for the initial engine.
 */
export function useAudio() {
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // We don't initialize until the first user interaction to satisfy browser policies
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  }, []);

  const playPop = useCallback(() => {
    if (!audioContext.current) return;
    
    const ctx = audioContext.current;
    const now = ctx.currentTime;
    
    // Create oscillator for the "pop" core
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // High-to-low frequency sweep creates the "pop" feel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    
    // Quick volume envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }, []);

  const playSuccess = useCallback(() => {
    if (!audioContext.current) return;
    
    const ctx = audioContext.current;
    const now = ctx.currentTime;
    
    // A little "sparkle" sound for success
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + (i * 0.05);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }, []);

  return { initAudio, playPop, playSuccess };
}
