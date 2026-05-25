'use client';

import { EmojiButton } from './EmojiButton';
import { useStoryStore } from '@/store/useStoryStore';

const CATEGORIES = [
  {
    name: 'Animals',
    emojis: [
      { char: '🦁', label: 'Lion' },
      { char: '🐘', label: 'Elephant' },
      { char: '🐶', label: 'Puppy' },
      { char: '🐱', label: 'Cat' },
      { char: '🦖', label: 'Dino' },
    ],
  },
  {
    name: 'Vehicles',
    emojis: [
      { char: '🚀', label: 'Rocket' },
      { char: '🚗', label: 'Car' },
      { char: '🚂', label: 'Train' },
      { char: '🚒', label: 'Fire Truck' },
      { char: '⛵', label: 'Boat' },
    ],
  },
  {
    name: 'Magic',
    emojis: [
      { char: '🧙', label: 'Wizard' },
      { char: '🧚', label: 'Fairy' },
      { char: '🐉', label: 'Dragon' },
      { char: '✨', label: 'Sparkles' },
      { char: '🪄', label: 'Magic Wand' },
    ],
  },
  {
    name: 'Feelings',
    emojis: [
      { char: '😊', label: 'Happy' },
      { char: '😢', label: 'Sad' },
      { char: '🤪', label: 'Silly' },
      { char: '🦁', label: 'Brave' }, // Using Lion for Brave as per toddler logic
      { char: '😴', label: 'Sleepy' },
    ],
  },
];

export function EmojiGrid() {
  const { selectedEmojis, addEmoji, removeEmoji } = useStoryStore();

  const handleEmojiClick = (char: string) => {
    if (selectedEmojis.includes(char)) {
      removeEmoji(char);
    } else {
      addEmoji(char);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24">
      {CATEGORIES.map((category) => (
        <section key={category.name} className="space-y-4">
          <h2 className="text-2xl font-bold text-indigo-900/40 px-4 uppercase tracking-widest">
            {category.name}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 justify-items-center">
            {category.emojis.map((emoji) => (
              <EmojiButton
                key={emoji.char}
                emoji={emoji.char}
                label={emoji.label}
                isSelected={selectedEmojis.includes(emoji.char)}
                onClick={() => handleEmojiClick(emoji.char)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
