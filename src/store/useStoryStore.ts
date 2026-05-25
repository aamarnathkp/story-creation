import { create } from 'zustand';

interface StoryState {
  selectedEmojis: string[];
  addEmoji: (emoji: string) => void;
  removeEmoji: (emoji: string) => void;
  clearEmojis: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  selectedEmojis: [],
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
}));
