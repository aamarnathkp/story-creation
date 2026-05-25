# Magic Tap ✨

An interactive, toddler-focused storybook generator application built using Next.js, Tailwind CSS, Framer Motion, and Gemini API. Children choose emoji ingredients, and the magic wand generates silly, bouncy storybooks with interactive tap targets, custom sound effects, and spring physics.

---

## 🚀 Features

* **Interactive Emoji Grid**: A child-friendly emoji selection panel across four fun categories: *Animals, Vehicles, Magic,* and *Feelings*.
* **Whimsical Story Generation (Gemini 2.5 Flash)**: Generates short, goofy, and toddler-appropriate stories (under 120 words) using custom sound effects (e.g., *Boing!*, *Splat!*, *Toot!*).
* **Magic Tap Targets**: Inside the story reader, emojis in the text are rendered as bouncy tap targets. Tapping them triggers procedural sound effects and playful spring-jitter animations.
* **Adult-Gated Exit Lock**: A hold-to-exit mechanism positioned at the top-right of the reader prevents toddlers from accidentally backing out of stories.
* **Zero-Asset Audio Engine**: Playful "pop" and success sparkle frequencies are synthesized on the fly using the browser's native **Web Audio API** (avoiding large file downloads).
* **Cost Controls & Rate Limiting**:
  * **Local Combo Caching**: Alphabetically sorts selected emojis and caches generated stories. Running the same combination again loads **instantly (0ms)** with zero API cost.
  * **Daily Generation Cap**: Limits users to **5 new story generations per day** to control API usage.
  * **"Wand is Sleeping" Cooldown UI**: A playful, bouncing `😴✨` sleep modal blocks generation once the daily limit is hit.
  * **LocalStorage Persistence**: Stores cache and usage history persistently across sessions.

---

## 🛠️ Getting Started

### Prerequisites
* Node.js v20.9.0 or higher
* A valid Gemini API Key

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY="your_api_key_here"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to experience the magic!
