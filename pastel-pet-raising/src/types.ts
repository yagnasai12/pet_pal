export type PetType = 'cat' | 'dog' | 'bunny';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  hue: number; // 0 to 360 for HSL pastel coloring
  hunger: number; // 0 (starving) to 100 (full)
  happiness: number; // 0 (sad) to 100 (joyful)
  energy: number; // 0 (exhausted) to 100 (energized)
  birthday: number; // Timestamp
  lastUpdate: number; // Timestamp for idle stats decaying
}

export type ActiveRoom = 'home' | 'kitchen' | 'garden' | 'bedroom';

export interface PetActivity {
  id: string;
  name: string;
  icon: string;
  statEffect: {
    hunger?: number;
    happiness?: number;
    energy?: number;
  };
  emoji: string;
  color: string;
}
