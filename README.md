# Jackie Super Money Slot Machine 🎰

A feature-rich, web-based slot machine game built with **React**, **TypeScript**, and **Vite**. This project simulates a professional casino-style slot experience with multiple game modes, jackpots, and dynamic visual effects.

<div align="center">
  <!-- You can add a screenshot here later -->
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
</div>

## ✨ Features

### 🎮 Core Gameplay
*   **5-Reel, 3-Row Video Slot**: Classic layout with smooth spinning animations.
*   **Flexible Betting System**:
    *   **Denominations**: Choose from 1¢, 2¢, 10¢, 20¢, $1, and $2.
    *   **Bet Multipliers**: 1x to 5x bet per line.
    *   **Paylines**: Up to 25 selectable paylines (varies by denomination).
*   **Jackpots**: Four progressive-style jackpots - **Mini**, **Minor**, **Major**, and **Grand**.

### 🌟 Special Features
*   **Hold & Spin Feature**: Triggered by 6+ **Orb** symbols.
    *   Lock Orbs in place and get 3 respins.
    *   New Orbs reset the respin counter.
    *   Fill all 15 positions to win the **Grand Jackpot**!
*   **Free Games**: Triggered by 3+ **Bonus** symbols.
    *   Award 6 Free Games.
    *   Retriggerable feature.
*   **Wilds & Scatters**: Classic special symbols to boost your wins.

### 🎨 Visuals & Audio
*   **Techno/Club Theme**: Dynamic background with laser beams, strobe effects, and neon particles.
*   **Immersive Audio**: Background music, spin sounds, and win celebrations (with mute toggle).
*   **Customization**: **Settings Menu** allows you to upload your own images and sounds to personalize the game assets!

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **State Management**: React Hooks (`useState`, `useEffect`, `useReducer`)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory and add your API key (if using Gemini features):
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

5.  **Play**:
    Open your browser and visit `http://localhost:5173` (or the URL shown in your terminal).

## 📖 How to Play

1.  **Welcome Screen**: Select your desired **Denomination** to enter the game.
2.  **Place Your Bet**:
    *   Use the controls to adjust your **Lines** and **Bet Multiplier**.
    *   Your total bet is calculated as: `Denom × Lines × Multiplier`.
3.  **Spin**: Click the **SPIN** button (or press Spacebar if implemented) to start the reels.
4.  **Win**: Match symbols across active paylines from left to right.
5.  **Trigger Features**:
    *   Land **6 Orbs** to start the **Hold & Spin** bonus.
    *   Land **3 Bonus** symbols to start **Free Games**.

## 📂 Project Structure

*   `src/App.tsx`: Main game controller and state management.
*   `src/components/`: Reusable UI components.
    *   `SlotMachine.tsx`: Renders the reels and grid.
    *   `ControlPanel.tsx`: Betting controls and spin button.
    *   `JackpotDisplay.tsx`: Shows current jackpot values.
    *   `SettingsModal.tsx`: Custom asset management.
*   `src/constants.ts`: Game configuration (Paytable, Reel Strips, Lines).
*   `src/types.ts`: TypeScript interfaces and enums.
*   `src/utils/`: Helper functions (Audio manager, etc.).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for new features, bug fixes, or theme improvements!

---

*Built with ❤️ by Jackie*
