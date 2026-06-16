import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetActivity } from '../types';
import { FOODS } from '../constants';
import PetRenderer from './PetRenderer';
import * as Lucide from 'lucide-react';

interface RoomKitchenProps {
  pet: Pet;
  onUpdatePetStats: (hungerDiff: number, happinessDiff: number, energyDiff: number) => void;
  onBackHome: () => void;
  onSetPetStatus: (status: 'idle' | 'eating' | 'playing' | 'sleeping') => void;
  currentStatus: 'idle' | 'eating' | 'playing' | 'sleeping';
}

interface FlyingFood {
  id: string;
  emoji: string;
  startX: number;
  startY: number;
}

export default function RoomKitchen({
  pet,
  onUpdatePetStats,
  onBackHome,
  onSetPetStatus,
  currentStatus,
}: RoomKitchenProps) {
  const [flyingFoods, setFlyingFoods] = useState<FlyingFood[]>([]);
  const [biteText, setBiteText] = useState<{ id: string; text: string; x: number; y: number } | null>(null);

  const handleFeed = (food: PetActivity, e: React.MouseEvent<HTMLButtonElement>) => {
    // Determine start click position relative to the window/relative parent
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const spawnId = Math.random().toString();

    // Create flying effect package
    const newFlying: FlyingFood = {
      id: spawnId,
      emoji: food.emoji,
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top - 20,
    };

    setFlyingFoods((prev) => [...prev, newFlying]);

    // Set pet status to eating
    onSetPetStatus('eating');

    // Trigger stats update
    onUpdatePetStats(
      food.statEffect.hunger || 0,
      food.statEffect.happiness || 0,
      food.statEffect.energy || 0
    );
  };

  const handleFoodLanded = (id: string, emoji: string) => {
    // Remove from flying state
    setFlyingFoods((prev) => prev.filter((f) => f.id !== id));

    // Show funny chewing bubble text
    const biteId = Math.random().toString();
    const sounds = ['Chomp! 😋', 'Munch! 💕', 'Nibble! ✨', 'Yum!! 😍', 'Nom Nom! 🍪'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    
    setBiteText({
      id: biteId,
      text: randomSound,
      x: 100 + (Math.random() * 40 - 20),
      y: 60 + (Math.random() * 20 - 10),
    });

    // Reset pet to idle after a moderate eating duration
    setTimeout(() => {
      onSetPetStatus('idle');
    }, 2200);
  };

  return (
    <div
      className="relative flex flex-col justify-between w-full h-[600px] md:h-[650px] bg-gradient-to-b from-[#FDF2F8] via-white/50 to-[#FDF2F8]/80 rounded-[2.5rem] border border-white shadow-xl shadow-pink-200/20 overflow-hidden p-6"
      id="kitchen-room-view"
    >
      {/* Background decorations: Shelf, clock, wallpaper tile line */}
      <div className="absolute inset-x-0 top-1/3 border-b-2 border-dashed border-pink-100/30 opacity-60 pointer-events-none" />
      
      {/* Decorative Kitchen utilities */}
      <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-pink-50 select-none text-xs text-pink-600 font-bold uppercase tracking-widest" id="kitchen-decor-hud">
        <span>🧁 Pantry</span>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 opacity-15 pointer-events-none select-none">
        <Lucide.Clock size={36} className="text-pink-900" />
      </div>

      {/* Header Room controls */}
      <div className="flex items-center justify-between z-10">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackHome}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-2xl border border-pink-100 text-pink-600 font-bold text-sm shadow-xs hover:shadow-md cursor-pointer transition-shadow"
          id="kitchen-back-btn"
        >
          <Lucide.ArrowLeft size={16} />
          <span>Back Home</span>
        </motion.button>

        <div className="text-right">
          <h1 className="text-xl font-bold text-pink-600 flex items-center gap-1 justify-end">
            <span>🍕</span> Cozy Kitchen
          </h1>
          <p className="text-2xs sm:text-xs text-pink-400 font-bold uppercase tracking-wider">
            Feed <span className="text-pink-500">{pet.name}</span> treats
          </p>
        </div>
      </div>

      {/* Core Pet display plate station */}
      <div className="flex flex-col items-center justify-center relative flex-1 my-4" id="kitchen-pet-display-station">
        {/* Table outline */}
        <div className="absolute w-72 h-8 bg-pink-100/30 backdrop-blur-md rounded-full bottom-4 border border-white shadow-xs z-0 pointer-events-none" />
        
        {/* Interactive plate */}
        <div className="absolute w-44 h-4 bg-white/95 rounded-full bottom-7 border border-pink-50 shadow-xs z-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-1 bg-pink-100 rounded-full" />
        </div>

        <div className="relative z-10 w-56 h-56 flex items-center justify-center">
          <PetRenderer type={pet.type} hue={pet.hue} status={currentStatus} size={190} />

          {/* Floating sound chomp text */}
          <AnimatePresence>
            {biteText && (
              <motion.div
                key={biteText.id}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1.1, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => {
                  setTimeout(() => setBiteText(null), 1000);
                }}
                className="absolute bg-white/95 px-3 py-1.5 rounded-2xl border border-pink-100 shadow-sm text-xs font-bold text-pink-600 pointer-events-none"
                style={{ top: '40px' }}
              >
                {biteText.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic speech bubble telling hunger status */}
        <div className="mt-2 text-center max-w-sm z-10">
          <p className="text-xs font-bold px-4 py-2 bg-white/90 rounded-full border border-pink-100/60 shadow-xs text-gray-500 select-none">
            {pet.hunger >= 95 ? (
              <span className="text-green-500">😋 My tummy is very full!</span>
            ) : pet.hunger <= 35 ? (
              <span className="text-pink-600 animate-pulse">😭 I am super hungry! feed me cookies!</span>
            ) : (
              <span>🍪 Tap a confectionery treat below to feed me!</span>
            )}
          </p>
        </div>
      </div>

      {/* Foods Shelf Drawer interface */}
      <div className="z-10 bg-white/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-white shadow-sm" id="kitchen-cabinet-drawer">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-sm">🍞</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Feed Treats Drawer</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {FOODS.map((food) => {
            const isFull = pet.hunger >= 100;
            return (
              <motion.button
                key={food.id}
                whileHover={{ scale: isFull ? 1 : 1.04 }}
                whileTap={{ scale: isFull ? 1 : 0.96 }}
                disabled={isFull}
                onClick={(e) => handleFeed(food, e)}
                className={`flex flex-col items-center justify-between py-2 text-center rounded-2xl border-2 border-white shadow-sm transition-all cursor-pointer ${food.color} ${
                  isFull ? 'opacity-40 cursor-not-allowed grayscale' : ''
                }`}
                id={`feed-item-${food.id}`}
              >
                <span className="text-2xl mb-1 filter drop-shadow-xs select-none">{food.emoji}</span>
                <span className="text-2xs font-bold tracking-tight select-none truncate max-w-[70px] text-gray-600">{food.name}</span>
                <div className="mt-1 bg-white/85 px-1.5 py-0.5 rounded-md border border-pink-50">
                  <span className="text-[9px] font-bold text-pink-600 font-mono">+{food.statEffect.hunger}🍖</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fly food container in absolute overlay relative to container */}
      <AnimatePresence>
        {flyingFoods.map((flying) => (
          <motion.div
            key={flying.id}
            initial={{
              position: 'fixed',
              left: flying.startX,
              top: flying.startY,
              scale: 1,
              opacity: 1,
              zIndex: 100,
            }}
            animate={{
              // Simple slide curved projectile towards estimate center of pet renderer mouth
              // Calculate screen coordinates safely
              top: window.innerHeight / 2 - 20,
              left: window.innerWidth / 2 - 12,
              scale: [1, 1.3, 0.4],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            onAnimationComplete={() => handleFoodLanded(flying.id, flying.emoji)}
            className="text-3xl select-none pointer-events-none"
          >
            {flying.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
