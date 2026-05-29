'use client';

import { EmojiGrid } from '@/components/copilot/EmojiGrid';
import { StoryViewer } from '@/components/reader/StoryViewer';
import { useStoryStore } from '@/store/useStoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

export default function Home() {
  const { 
    selectedEmojis, 
    clearEmojis, 
    getCachedStory, 
    cacheStory, 
    incrementUsage, 
    isLimitReached 
  } = useStoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);
  const { initAudio, playSuccess } = useAudio();

  const handleGenerate = async () => {
    if (selectedEmojis.length < 3) return;
    
    initAudio();

    // 1. Check local cache first
    const cached = getCachedStory(selectedEmojis);
    if (cached) {
      playSuccess();
      setStory(cached);
      return;
    }

    // 2. Check daily rate limit
    if (isLimitReached()) {
      setShowLimitModal(true);
      return;
    }
    
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
        if (data.mock) {
          const mockStory = { title: data.title, content: data.content };
          setStory(mockStory);
          cacheStory(selectedEmojis, mockStory);
          incrementUsage();
        }
      } else {
        setStory(data);
        cacheStory(selectedEmojis, data);
        incrementUsage();
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

      {/* Footer / Creator Link */}
      <footer className="w-full max-w-4xl mx-auto mt-auto py-8 border-t-2 border-dashed border-indigo-100/50 text-center text-sm font-bold text-indigo-950/30 hover:text-indigo-950/50 transition-colors">
        Made with ✨ by{' '}
        <a
          href="https://aamarnathkp.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-wavy decoration-indigo-200 hover:decoration-indigo-400 underline-offset-4 text-indigo-600/60 hover:text-indigo-600 transition-colors"
        >
          Amarnath
        </a>
      </footer>

      {/* Selection Drawer */}
      <AnimatePresence>
        {selectedEmojis.length > 0 && (
          <motion.div
            initial={{ y: 120, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: 120, x: "-50%" }}
            className="fixed bottom-6 left-1/2 w-[92%] max-w-lg bg-white rounded-3xl sm:rounded-4xl shadow-2xl border-4 border-indigo-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 z-50"
          >
            {/* Slot-based Emoji Viewer */}
            <div className="flex gap-3 sm:gap-4 items-center justify-center flex-shrink-0">
              {[0, 1, 2].map((index) => {
                const emoji = selectedEmojis[index];
                return (
                  <div
                    key={index}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-100 flex items-center justify-center relative overflow-visible flex-shrink-0"
                  >
                    <AnimatePresence mode="popLayout">
                      {emoji ? (
                        <motion.span
                          key={emoji}
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className="text-3xl sm:text-4xl select-none"
                        >
                          {emoji}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.25 }}
                          exit={{ opacity: 0 }}
                          className="text-lg sm:text-xl text-indigo-400 font-bold"
                        >
                          ?
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto items-center justify-end">
              <button 
                onClick={clearEmojis}
                disabled={isLoading}
                className="px-4 py-2.5 text-indigo-500 font-bold hover:text-indigo-700 transition-colors disabled:opacity-30 text-sm sm:text-base flex-1 sm:flex-none text-center"
              >
                Clear
              </button>
              <button 
                onClick={handleGenerate}
                disabled={selectedEmojis.length < 3 || isLoading}
                className="bg-indigo-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black text-base sm:text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 min-w-[110px] sm:min-w-[130px] flex-1 sm:flex-none text-center flex items-center justify-center"
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

      {/* Rate Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLimitModal(false)}
              className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md"
            />
            
            {/* Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl sm:rounded-4xl border-4 border-indigo-100 shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative z-10 space-y-6"
            >
              <div className="text-6xl animate-bounce">😴✨</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-indigo-950">
                  Wand is Sleeping!
                </h3>
                <p className="text-indigo-900/60 font-medium text-sm leading-relaxed">
                  Your magic wand did a lot of work today. Let's rest the wand and make new stories tomorrow!
                </p>
              </div>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white py-3 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100"
              >
                Okay! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
