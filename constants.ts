
import { SymbolType, SymbolConfig } from './types';

// ==========================================
// CONFIGURATION GUIDE (配置指南)
// ==========================================
// 1. IMAGES (图片):
//    Add 'image' property to SYMBOLS below.
//    Example: image: 'https://mysite.com/images/buffalo.png'
//
// 2. PROBABILITIES (概率):
//    Modify REEL_STRIPS array.
//    To INCREASE probability: Add more of that symbol to the array.
//    To DECREASE probability: Remove that symbol from the array.
// ==========================================

export const SYMBOLS: Record<SymbolType, SymbolConfig> = {
  [SymbolType.SCATTER]: { id: SymbolType.SCATTER, label: 'Scatter', color: 'text-yellow-400', isHighValue: true, icon: '🪙', image: '/assets/images/scatter.jpg' },
  [SymbolType.WILD]:    { id: SymbolType.WILD,    label: 'Wild',    color: 'text-orange-500', isHighValue: true, icon: '🌅', image: '/assets/images/A5.jpeg' },
  [SymbolType.BONUS]:   { id: SymbolType.BONUS,   label: 'Bonus',   color: 'text-purple-400', isHighValue: true, icon: '⛩️', image: '/assets/images/bonus.jpg' },
  [SymbolType.ORB]:     { id: SymbolType.ORB,     label: 'Orb',     color: 'text-cyan-300',   isHighValue: true, icon: '🔮', image: '/assets/images/orb.png' },
  [SymbolType.BUFFALO]: { id: SymbolType.BUFFALO, label: 'Buffalo', color: 'text-red-600',    isHighValue: true, icon: '🐃', image: '/assets/images/A1.jpeg' },
  [SymbolType.EAGLE]:   { id: SymbolType.EAGLE,   label: 'Eagle',   color: 'text-blue-400',   isHighValue: true, icon: '🦅', image: '/assets/images/A2.jpeg' },
  [SymbolType.WOLF]:    { id: SymbolType.WOLF,    label: 'Wolf',    color: 'text-gray-300',   isHighValue: true, icon: '🐺', image: '/assets/images/A3.jpg' },
  [SymbolType.COUGAR]:  { id: SymbolType.COUGAR,  label: 'Cougar',  color: 'text-yellow-700', isHighValue: true, icon: '🐆', image: '/assets/images/A4.jpg' },
  [SymbolType.A]:       { id: SymbolType.A,       label: 'A',       color: 'text-red-500',    isHighValue: false, icon: 'A' },
  [SymbolType.K]:       { id: SymbolType.K,       label: 'K',       color: 'text-blue-500',   isHighValue: false, icon: 'K' },
  [SymbolType.Q]:       { id: SymbolType.Q,       label: 'Q',       color: 'text-yellow-500', isHighValue: false, icon: 'Q' },
  [SymbolType.J]:       { id: SymbolType.J,       label: 'J',       color: 'text-purple-500', isHighValue: false, icon: 'J' },
  [SymbolType.TEN]:     { id: SymbolType.TEN,     label: '10',      color: 'text-pink-500',   isHighValue: false, icon: '10' },
  [SymbolType.NINE]:    { id: SymbolType.NINE,    label: '9',       color: 'text-green-500',  isHighValue: false, icon: '9' },
  [SymbolType.BLANK]:   { id: SymbolType.BLANK,   label: '',        color: 'text-transparent', isHighValue: false, icon: '' },
};

export const DEFAULT_ASSETS = {
  mainBgm: '/assets/audio/main_background_music.mp3',
  featureBgm: '/assets/audio/feature music.mp3',
  spinSound: '/assets/audio/spin.mp3',
  featureTriggerSound: '/assets/audio/feature trigger.mp3',
  nearJackpotSound: '/assets/audio/near jackpot.mp3',
  featureEndSound: '/assets/audio/feature end.mp3',
  winningSound: '/assets/audio/winning Sound.mp3',

  // Images
  orbImage: '/assets/images/orb.png',
  bonusImage: '/assets/images/bonus.jpg',
  wildImage: '/assets/images/A5.jpeg',
  scatterImage: '/assets/images/scatter.jpg',
  buffaloImage: '/assets/images/A1.jpeg',
  eagleImage: '/assets/images/A2.jpeg',
};

// Base Game Strips
// PROBABILITY CONTROL: This determines how often symbols appear.
// Currently optimized for moderate Bonus/Feature hit rate (1 BONUS per reel).
// (想增加中奖率？在这里多复制粘贴几个 SymbolType.BONUS 或 SymbolType.ORB)
export const REEL_STRIPS: SymbolType[][] = [
  [
    SymbolType.A, SymbolType.BUFFALO, SymbolType.NINE, SymbolType.J, SymbolType.WILD, SymbolType.K, SymbolType.TEN, SymbolType.WOLF,
    SymbolType.Q, SymbolType.A, SymbolType.NINE, SymbolType.ORB, SymbolType.J, SymbolType.COUGAR, SymbolType.K, SymbolType.TEN,
    SymbolType.BUFFALO, SymbolType.Q, SymbolType.NINE, SymbolType.BONUS, SymbolType.J, SymbolType.EAGLE, SymbolType.A, SymbolType.K, SymbolType.WOLF
  ],
  [
    SymbolType.K, SymbolType.EAGLE, SymbolType.TEN, SymbolType.Q, SymbolType.WILD, SymbolType.J, SymbolType.COUGAR, SymbolType.A,
    SymbolType.K, SymbolType.NINE, SymbolType.TEN, SymbolType.ORB, SymbolType.Q, SymbolType.J, SymbolType.WOLF, SymbolType.A,
    SymbolType.EAGLE, SymbolType.K, SymbolType.TEN, SymbolType.Q, SymbolType.BONUS, SymbolType.J, SymbolType.COUGAR, SymbolType.NINE
  ],
  [
    SymbolType.Q, SymbolType.BUFFALO, SymbolType.J, SymbolType.NINE, SymbolType.WILD, SymbolType.TEN, SymbolType.WOLF, SymbolType.K,
    SymbolType.A, SymbolType.Q, SymbolType.SCATTER, SymbolType.J, SymbolType.ORB, SymbolType.NINE, SymbolType.K, SymbolType.TEN,
    SymbolType.BUFFALO, SymbolType.Q, SymbolType.J, SymbolType.A, SymbolType.BONUS, SymbolType.NINE, SymbolType.COUGAR, SymbolType.WOLF
  ],
  [
    SymbolType.J, SymbolType.EAGLE, SymbolType.A, SymbolType.K, SymbolType.WILD, SymbolType.NINE, SymbolType.COUGAR, SymbolType.Q,
    SymbolType.TEN, SymbolType.J, SymbolType.K, SymbolType.BONUS, SymbolType.ORB, SymbolType.A, SymbolType.Q, SymbolType.NINE, SymbolType.EAGLE,
    SymbolType.J, SymbolType.K, SymbolType.TEN, SymbolType.Q, SymbolType.BUFFALO, SymbolType.A, SymbolType.COUGAR, SymbolType.NINE
  ],
  [
    SymbolType.TEN, SymbolType.BUFFALO, SymbolType.Q, SymbolType.K, SymbolType.WILD, SymbolType.A, SymbolType.WOLF, SymbolType.J,
    SymbolType.NINE, SymbolType.TEN, SymbolType.BONUS, SymbolType.Q, SymbolType.ORB, SymbolType.K, SymbolType.A, SymbolType.J, SymbolType.COUGAR,
    SymbolType.TEN, SymbolType.Q, SymbolType.K, SymbolType.A, SymbolType.EAGLE, SymbolType.J, SymbolType.WOLF, SymbolType.NINE
  ],
];

// Free Game Strips (Stacked symbols for bigger wins)
// MODIFIED: Significantly increased strip length and reduced BONUS frequency to lower retrigger probability.
// Each strip now contains roughly 30 symbols with only 1 BONUS symbol (approx 3% chance per reel per stop).
export const FREE_GAME_STRIPS: SymbolType[][] = [
  [
    SymbolType.WILD, SymbolType.WILD, SymbolType.BUFFALO, SymbolType.BUFFALO, SymbolType.BUFFALO,
    SymbolType.A, SymbolType.K, SymbolType.Q, SymbolType.J, SymbolType.TEN, SymbolType.NINE,
    SymbolType.WOLF, SymbolType.COUGAR, SymbolType.ORB, SymbolType.A, SymbolType.K,
    SymbolType.WILD, SymbolType.BUFFALO, SymbolType.NINE, SymbolType.J, SymbolType.Q,
    SymbolType.BONUS, // 1 instance
    SymbolType.A, SymbolType.K, SymbolType.WOLF, SymbolType.COUGAR, SymbolType.J, SymbolType.TEN, SymbolType.NINE
  ],
  [
    SymbolType.WILD, SymbolType.WILD, SymbolType.EAGLE, SymbolType.EAGLE, SymbolType.EAGLE,
    SymbolType.K, SymbolType.Q, SymbolType.J, SymbolType.TEN, SymbolType.NINE, SymbolType.A,
    SymbolType.WOLF, SymbolType.COUGAR, SymbolType.ORB, SymbolType.Q, SymbolType.J,
    SymbolType.WILD, SymbolType.EAGLE, SymbolType.TEN, SymbolType.NINE, SymbolType.A,
    SymbolType.BONUS, // 1 instance
    SymbolType.K, SymbolType.Q, SymbolType.WOLF, SymbolType.COUGAR, SymbolType.J, SymbolType.TEN
  ],
  [
    SymbolType.WILD, SymbolType.WILD, SymbolType.WOLF, SymbolType.WOLF, SymbolType.WOLF,
    SymbolType.Q, SymbolType.J, SymbolType.TEN, SymbolType.NINE, SymbolType.A, SymbolType.K,
    SymbolType.EAGLE, SymbolType.COUGAR, SymbolType.ORB, SymbolType.J, SymbolType.TEN,
    SymbolType.WILD, SymbolType.WOLF, SymbolType.NINE, SymbolType.A, SymbolType.K,
    SymbolType.BONUS, // 1 instance
    SymbolType.Q, SymbolType.J, SymbolType.BUFFALO, SymbolType.COUGAR, SymbolType.TEN, SymbolType.NINE
  ],
  [
    SymbolType.WILD, SymbolType.WILD, SymbolType.COUGAR, SymbolType.COUGAR, SymbolType.COUGAR,
    SymbolType.J, SymbolType.TEN, SymbolType.NINE, SymbolType.A, SymbolType.K, SymbolType.Q,
    SymbolType.BUFFALO, SymbolType.EAGLE, SymbolType.ORB, SymbolType.TEN, SymbolType.NINE,
    SymbolType.WILD, SymbolType.COUGAR, SymbolType.A, SymbolType.K, SymbolType.Q,
    SymbolType.BONUS, // 1 instance
    SymbolType.J, SymbolType.TEN, SymbolType.WOLF, SymbolType.EAGLE, SymbolType.NINE, SymbolType.A
  ],
  [
    SymbolType.WILD, SymbolType.WILD, SymbolType.BUFFALO, SymbolType.BUFFALO, SymbolType.BUFFALO,
    SymbolType.TEN, SymbolType.NINE, SymbolType.A, SymbolType.K, SymbolType.Q, SymbolType.J,
    SymbolType.WOLF, SymbolType.EAGLE, SymbolType.ORB, SymbolType.NINE, SymbolType.A,
    SymbolType.WILD, SymbolType.BUFFALO, SymbolType.K, SymbolType.Q, SymbolType.J,
    SymbolType.BONUS, // 1 instance
    SymbolType.TEN, SymbolType.NINE, SymbolType.COUGAR, SymbolType.WOLF, SymbolType.A, SymbolType.K
  ],
];

export const PAYTABLE: Record<SymbolType, number[]> = {
  [SymbolType.SCATTER]: [0, 0, 2, 10, 100],
  [SymbolType.WILD]:    [0, 0, 50, 200, 1000],
  [SymbolType.BUFFALO]: [0, 0, 50, 150, 300],
  [SymbolType.EAGLE]:   [0, 0, 30, 100, 150],
  [SymbolType.WOLF]:    [0, 0, 20, 80, 120],
  [SymbolType.COUGAR]:  [0, 0, 20, 80, 120],
  [SymbolType.A]:       [0, 0, 10, 50, 100],
  [SymbolType.K]:       [0, 0, 10, 50, 100],
  [SymbolType.Q]:       [0, 0, 5, 20, 100],
  [SymbolType.J]:       [0, 0, 5, 20, 100],
  [SymbolType.TEN]:     [0, 0, 5, 10, 100],
  [SymbolType.NINE]:    [0, 0, 5, 10, 100],
  [SymbolType.BONUS]:   [0, 0, 0, 0, 0],
  [SymbolType.ORB]:     [0, 0, 0, 0, 0],
  [SymbolType.BLANK]:   [0, 0, 0, 0, 0],
};

export const LINES_5: number[][] = [
  [1, 1, 1, 1, 1], // Middle
  [0, 0, 0, 0, 0], // Top
  [2, 2, 2, 2, 2], // Bottom
  [0, 1, 2, 1, 0], // V shape
  [2, 1, 0, 1, 2], // Inverted V
];

export const LINES_25: number[][] = [
  ...LINES_5,
  [0, 0, 1, 2, 2], // 6
  [2, 2, 1, 0, 0], // 7
  [1, 0, 1, 2, 1], // 8
  [1, 2, 1, 0, 1], // 9
  [0, 1, 0, 1, 0], // 10
  [2, 1, 2, 1, 2], // 11
  [0, 1, 1, 1, 0], // 12
  [2, 1, 1, 1, 2], // 13
  [0, 0, 1, 0, 0], // 14
  [2, 2, 1, 2, 2], // 15
  [1, 1, 0, 1, 1], // 16
  [1, 1, 2, 1, 1], // 17
  [0, 2, 0, 2, 0], // 18
  [2, 0, 2, 0, 2], // 19
  [1, 0, 0, 0, 1], // 20
  [1, 2, 2, 2, 1], // 21
  [0, 0, 0, 1, 2], // 22
  [2, 2, 2, 1, 0], // 23
  [0, 1, 2, 2, 2], // 24
  [2, 1, 0, 0, 0], // 25
];
