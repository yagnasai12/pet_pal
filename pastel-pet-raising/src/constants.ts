import { PetActivity } from './types';

export const FOODS: PetActivity[] = [
  {
    id: 'cake',
    name: 'Strawberry Roll',
    icon: 'CakeSlice',
    emoji: '🍰',
    statEffect: { hunger: 30, happiness: 15, energy: -5 },
    color: 'bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-700'
  },
  {
    id: 'cookie',
    name: 'Pastel Cookie',
    icon: 'Cookie',
    emoji: '🍪',
    statEffect: { hunger: 15, happiness: 20, energy: 0 },
    color: 'bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-700'
  },
  {
    id: 'milk',
    name: 'Sweet Milk',
    icon: 'Milk',
    emoji: '🥛',
    statEffect: { hunger: 20, happiness: 10, energy: 15 },
    color: 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700'
  },
  {
    id: 'apple',
    name: 'Munchy Apple',
    icon: 'Apple',
    emoji: '🍎',
    statEffect: { hunger: 25, happiness: 5, energy: 5 },
    color: 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200 text-emerald-700'
  }
];

export const PLAY_ACTIVITIES: PetActivity[] = [
  {
    id: 'ball',
    name: 'Beach Ball',
    icon: 'Sparkles',
    emoji: '⚽',
    statEffect: { happiness: 35, energy: -20, hunger: -15 },
    color: 'bg-yellow-105 border-yellow-300 hover:bg-yellow-200 text-yellow-700'
  },
  {
    id: 'bubbles',
    name: 'Bubble Wand',
    icon: 'Wind',
    emoji: '🫧',
    statEffect: { happiness: 20, energy: -10, hunger: -5 },
    color: 'bg-cyan-100 border-cyan-300 hover:bg-cyan-200 text-cyan-700'
  },
  {
    id: 'butterfly',
    name: 'Chase Butterflies',
    icon: 'Flower',
    emoji: '🦋',
    statEffect: { happiness: 25, energy: -15, hunger: -10 },
    color: 'bg-pink-100 border-pink-300 hover:bg-pink-200 text-pink-700'
  },
  {
    id: 'swing',
    name: 'Garden Swing',
    icon: 'Heart',
    emoji: '🪁',
    statEffect: { happiness: 30, energy: -12, hunger: -8 },
    color: 'bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700'
  }
];

export const SLEEP_ACTIVITIES: PetActivity[] = [
  {
    id: 'nap',
    name: 'Power Nap',
    icon: 'MoonStar',
    emoji: '💤',
    statEffect: { energy: 30, happiness: 5, hunger: -5 },
    color: 'bg-violet-100 border-violet-300 hover:bg-violet-200 text-violet-700'
  },
  {
    id: 'deepsleep',
    name: 'Deep Slumber',
    icon: 'Bed',
    emoji: '🌙',
    statEffect: { energy: 80, happiness: 10, hunger: -25 },
    color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-700'
  },
  {
    id: 'cuddle',
    name: 'Cozy Cuddle',
    icon: 'Smile',
    emoji: '🧸',
    statEffect: { energy: 45, happiness: 25, hunger: -10 },
    color: 'bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-700'
  }
];

export const DEFAULT_HUES = {
  cat: 200,    // Sky blueish pastel
  dog: 25,     // Cozy peach pastel
  bunny: 330,  // Soft pink pastel
};
