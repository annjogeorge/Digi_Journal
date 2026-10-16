# DigiJournal 🎮✨

> A nostalgic, retro-game-inspired digital journaling universe blending early 2000s desktop aesthetics, Nintendo handheld games, Tamagotchi gamification, cozy personal diaries, and secure Supabase cloud persistence.

Inspired by the original Canva vision at [annjos.my.canva.site/digijournal](https://annjos.my.canva.site/digijournal).

---

## 🌟 Key Features

### 1. 🕹️ Nostalgic Landing Page
- Retro grid background with twinkling pixel stars.
- Floating, interactive pixel-art sprites (Retro PC, Flip Phone, Controller, Spinning CD).
- Staggered letter title animation with guaranteed single-line "DigiJournal" display across viewports.
- Arcade "Get Started" button and screen wipe transition.

### 2. 🎮 Interactive Player Dashboard
- Personalized player greeting (`Welcome back, Annjo!`).
- Live Level & XP progression bar with next-level milestones.
- Dual navigation modes: **🕹️ Arcade Menu** & **🖥️ Desktop OS Icons (`Journal.exe`, `Quests.app`, etc.)**.
- Daily Quest & Habit summary with streak tracking.
- Interactive Tamagotchi pocket pet that reacts with speech bubbles and tracks your daily journaling status.

### 3. 📖 Physical Flip-Book Digital Journal
- Physical spiral notebook design with authentic paper textures, red margin lines, ruled lines, and page-turning animations.
- Clean, readable sans-serif typography for comfortable writing and reading during long reflections.
- Real-time word counter and autosave status indicators.
- Mood picker using consistent Lucide icons.
- Full CRUD: Create, Edit, Delete (with custom retro confirm dialog), Favorite, and Tag entries.
- Search and filter archive by title, keywords, or mood.

### 4. 📅 Color-Coded Mood Calendar
- Monthly calendar grid with correct weekday alignment and month navigation.
- Color-coded days reflecting daily mood (Green: Positive, Blue: Calm/Neutral, Pink: Difficult, Purple: No mood).
- Today indicator, favorite badges, and day detail preview card.

### 5. ⚔️ Daily Quest / To-Do Manager
- Create, edit, prioritize (Low/Medium/High), and categorize quests.
- Interactive checkboxes with tactile sound feedback.
- Real-time quest completion progress bar.
- Filters for All, Active, Completed, and Overdue tasks.

### 6. 💌 Future Me — Sealed Letters & Time Capsules
- Digital time-capsule mailbox for writing letters to your future self.
- Sealed envelope styling (Classic Cream, Lavender, Gold Arcade, Pastel Pink).
- Hard countdown and lock enforcement preventing premature opening (with custom retro modal notice).
- Paper unfolding reveal animation and unlock fanfare.

### 7. 🏆 Gamification, XP & Achievements
- Centralized XP reward engine for meaningful user actions (saving reflections, checking off quests, sealing capsules).
- Cohesive toast notification system for achievements, saves, deletions, and cloud sync.
- Showcase of unlockable trophies (`First Entry`, `7-Day Streak`, `Task Master`, `Memory Keeper`, etc.).

### 8. 📊 Real-Time Game Statistics
- Monthly 28-day journaling activity heatmap.
- Mood distribution progress breakdown.
- Streak counters (Current & Longest streak calculated from real entries).
- Total words written, total entries, and quests cleared.

### 9. 🔊 Synthesized Web Audio Sound System
- Centralized 8-bit sound effects using the Web Audio API (zero external audio file dependencies).
- Distinct arcade sounds: button click, blip, quest completion chime, notebook page flip, save chime, achievement fanfare, and unlock.
- Master sound toggle, volume slider, and optional chiptune background music loop.

### 10. ☁️ Supabase Real Backend Integration
- Official `@supabase/supabase-js` client with environment variable security.
- Row Level Security (RLS) policies guaranteeing complete data privacy between users.
- Full authentication (Sign-up, Sign-in, Sign-out, Session recovery).
- Offline fallback to `localStorage` when credentials are not configured.

### 11. 🧭 First-Time-User Onboarding Tutorial
- Interactive step-by-step modal introducing the application in logical sequence.
- Persistent completion preference with a "Replay Tutorial" button in Settings and Dashboard.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS + Subtle Neomorphic Depth + Custom Pixel Utilities
- **Animation**: Framer Motion
- **Icons**: Lucide React (100% consistent across entire app, no emoji replacements)
- **Audio**: Web Audio API Retro Sound Synthesizer
- **Backend / Auth**: Supabase (PostgreSQL with Row Level Security)
- **Routing**: React Router DOM 7

---

## ☁️ Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Open and run the provided [supabase_schema.sql](file:///Users/annjogeorge/Desktop/digijournal/supabase_schema.sql) file. This creates:
   - `journal_entries` table with RLS policies
   - `todos` table with RLS policies
   - `future_letters` table with RLS policies
   - `profiles` table with RLS policies
   - Automatic user ownership checks via `auth.uid() = user_id`
4. Copy your project credentials from **Project Settings > API**.
5. Create a `.env.local` file in your project root (see [.env.example](file:///Users/annjogeorge/Desktop/digijournal/.env.example)):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/annjogeorge/Digi_Journal.git
cd Digi_Journal

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `Digi_Journal` repository.
4. Add your Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the project settings.
5. The included [vercel.json](file:///Users/annjogeorge/Desktop/digijournal/vercel.json) handles Single Page Application (SPA) routing automatically.
6. Click **Deploy**.

### Deploy to Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add Environment Variables in Netlify **Site configuration > Environment variables**.
5. The included [public/_redirects](file:///Users/annjogeorge/Desktop/digijournal/public/_redirects) ensures SPA routes work properly on page reload.
6. Click **Deploy site**.
