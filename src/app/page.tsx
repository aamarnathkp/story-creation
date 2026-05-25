'use client';

import { EmojiGrid } from '@/components/copilot/EmojiGrid';
import { StoryViewer } from '@/components/reader/StoryViewer';
import { useStoryStore } from '@/store/useStoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

export default function Home() {
  const { selectedEmojis, clearEmojis } = useStoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);
  const { initAudio, playSuccess } = useAudio();

  const handleGenerate = async () => {
    if (selectedEmojis.length < 1) return;
    
    initAudio();
    playSuccess();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emojis: selectedEmojis }),
      });
      
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        // Show mock if error
        if (data.mock) setStory({ title: data.title, content: data.content });
      } else {
        setStory(data);
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-20 px-6">
      {/* Playful Header */}
      <div className="text-center mb-12 space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-indigo-950"
        >
          Magic Tap ✨
        </motion.h1>
        <p className="text-indigo-900/60 font-medium">
          Pick 3 emojis to start your story!
        </p>
      </div>

      {/* Emoji Grid Container */}
      <EmojiGrid />

      {/* Selection Drawer */}
      <AnimatePresence>
        {selectedEmojis.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white rounded-4xl shadow-2xl border-4 border-indigo-100 p-6 flex items-center justify-between z-50"
          >
            <div className="flex gap-4">
              {selectedEmojis.map((emoji, i) => (
                <motion.span 
                  key={`${emoji}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={clearEmojis}
                disabled={isLoading}
                className="px-4 py-2 text-indigo-400 font-bold hover:text-indigo-600 transition-colors disabled:opacity-30"
              >
                Clear
              </button>
              <button 
                onClick={handleGenerate}
                disabled={selectedEmojis.length < 3 || isLoading}
                className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 min-w-[120px]"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Magic... ✨
                  </motion.span>
                ) : "Go! 🚀"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Story Viewer */}
      <AnimatePresence>
        {story && (
          <StoryViewer 
            title={story.title} 
            content={story.content} 
            onExit={() => setStory(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
