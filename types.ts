
export enum SymbolType {
  SCATTER = 'SCATTER',
  WILD = 'WILD',
  BONUS = 'BONUS', // New Bonus Symbol
  ORB = 'ORB',     // New Hold & Spin Symbol
  BUFFALO = 'BUFFALO',
  EAGLE = 'EAGLE',
  WOLF = 'WOLF',
  COUGAR = 'COUGAR',
  A = 'A',
  K = 'K',
  Q = 'Q',
  J = 'J',
  TEN = '10',
  NINE = '9',
  BLANK = 'BLANK' // For Hold & Spin animation
}

export interface SymbolConfig {
  id: SymbolType;
  label: string;
  color: string;
  isHighValue: boolean;
  icon?: string;
  image?: string; // Optional: URL path to your custom image (e.g., '/assets/buffalo.png')
}

export interface CustomAssets {
  mainBgm?: string; // Blob URL for Main Background Music
  featureBgm?: string; // Blob URL
  spinSound?: string; // Blob URL
  featureTriggerSound?: string; // Blob URL for Feature Trigger (Celebration)
  orbImage?: string; // Blob URL
  bonusImage?: string; // Blob URL
  wildImage?: string; // Blob URL
  scatterImage?: string; // Blob URL
  buffaloImage?: string; // Blob URL
  eagleImage?: string; // Blob URL
}

export interface WinLine {
  lineIndex: number;
  amount: number;
  symbol: SymbolType;
  count: number;
  coords: number[][]; // [col, row]
}

export enum GameScreen {
  WELCOME = 'WELCOME',
  GAME = 'GAME'
}

export enum GameMode {
  BASE = 'BASE',
  FREE_GAMES = 'FREE_GAMES',
  HOLD_AND_SPIN = 'HOLD_AND_SPIN'
}

export interface GameState {
  screen: GameScreen;
  mode: GameMode;
  credits: number;
  denomination: number; // in cents
  betMultiplier: number; // 1-5
  selectedLines: number; // 1-25 or 1-5
  isSpinning: boolean;
  
  // The visual grid symbols
  grid: SymbolType[][]; 
  // Overlay values for Orbs (Cash amount or Jackpot Name)
  gridValues: (number | string | null)[][]; 

  lastWinAmount: number;
  winningLines: WinLine[];
  jackpots: {
    mini: number;
    minor: number;
    major: number;
    grand: number;
  };
  showPaytable: boolean;

  // Feature State
  featureWinAmount: number; // Accumulator for feature wins
  
  freeGames: {
    remaining: number;
    totalPlayed: number;
  };

  holdAndSpin: {
    respinsRemaining: number;
    lockedPositions: boolean[][]; // [col][row] true if locked
    isGrandWon: boolean;
  };
  
  // Modal for feature trigger
  featureModalType: 'NONE' | 'FREE_GAMES' | 'HOLD_AND_SPIN' | 'FEATURE_SUMMARY';
  
  // Settings
  isSettingsOpen: boolean;
  customAssets: CustomAssets;
  isMuted: boolean;
  
  // Visual Transition State
  isTransitioning: boolean;
}

export const DENOMINATIONS = [
  { label: '1¢', value: 1, maxLines: 25 },
  { label: '2¢', value: 2, maxLines: 25 },
  { label: '10¢', value: 10, maxLines: 25 },
  { label: '20¢', value: 20, maxLines: 25 },
  { label: '$1', value: 100, maxLines: 5 },
  { label: '$2', value: 200, maxLines: 5 },
];

export const BET_MULTIPLIERS = [1, 2, 3, 4, 5];
