import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Story {
  title: string;
  content: string;
}

interface StoryState {
  selectedEmojis: string[];
  storyCache: Record<string, Story>;
  dailyUsage: {
    date: string;
    count: number;
  };
  addEmoji: (emoji: string) => void;
  removeEmoji: (emoji: string) => void;
  clearEmojis: () => void;
  getCachedStory: (emojis: string[]) => Story | null;
  cacheStory: (emojis: string[], story: Story) => void;
  incrementUsage: () => void;
  isLimitReached: () => boolean;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      selectedEmojis: [],
      storyCache: {},
      dailyUsage: {
        date: new Date().toISOString().split('T')[0],
        count: 0,
      },

      addEmoji: (emoji) => 
        set((state) => ({
          // Max 3 emojis for the toddler copilot
          selectedEmojis: state.selectedEmojis.length < 3 
            ? [...state.selectedEmojis, emoji] 
            : state.selectedEmojis
        })),

      removeEmoji: (emoji) =>
        set((state) => ({
          selectedEmojis: state.selectedEmojis.filter((e) => e !== emoji)
        })),

      clearEmojis: () => set({ selectedEmojis: [] }),

      getCachedStory: (emojis) => {
        const key = [...emojis].sort().join('-');
        return get().storyCache[key] || null;
      },

      cacheStory: (emojis, story) => {
        const key = [...emojis].sort().join('-');
        set((state) => ({
          storyCache: {
            ...state.storyCache,
            [key]: story,
          },
        }));
      },

      incrementUsage: () => {
        const today = new Date().toISOString().split('T')[0];
        const currentUsage = get().dailyUsage;

        if (currentUsage.date === today) {
          set({
            dailyUsage: {
              date: today,
              count: currentUsage.count + 1,
            },
          });
        } else {
          set({
            dailyUsage: {
              date: today,
              count: 1,
            },
          });
        }
      },

      isLimitReached: () => {
        const today = new Date().toISOString().split('T')[0];
        const currentUsage = get().dailyUsage;
        
        // Define daily limit of 5 stories per user
        const DAILY_LIMIT = 5;

        if (currentUsage.date !== today) {
          return false;
        }
        return currentUsage.count >= DAILY_LIMIT;
      },
    }),
    {
      name: 'magic-tap-story-storage',
      partialize: (state) => ({
        storyCache: state.storyCache,
        dailyUsage: state.dailyUsage,
      }),
    }
  )
);
