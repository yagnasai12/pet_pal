import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetActivity } from '../types';
import { PLAY_ACTIVITIES } from '../constants';
import PetRenderer from './PetRenderer';
import * as Lucide from 'lucide-react';

interface RoomGardenProps {
  pet: Pet;
  onUpdatePetStats: (hungerDiff: number, happinessDiff: number, energyDiff: number) => void;
  onBackHome: () => void;
  onSetPetStatus: (status: 'idle' | 'eating' | 'playing' | 'sleeping') => void;
  currentStatus: 'idle' | 'eating' | 'playing' | 'sleeping';
}

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Butterfly {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
}

export default function RoomGarden({
  pet,
  onUpdatePetStats,
  onBackHome,
  onSetPetStatus,
  currentStatus,
}: RoomGardenProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [showBall, setShowBall] = useState(false);
  const [joyNotification, setJoyNotification] = useState<{ id: string; text: string } | null>(null);

  const handlePlayActivity = (play: PetActivity) => {
    onSetPetStatus('playing');
    
    // Default stat upgrade
    onUpdatePetStats(
      play.statEffect.hunger || 0,
      play.statEffect.happiness || 0,
      play.statEffect.energy || 0
    );

    // Trigger visual toys depending on which one was selected
    if (play.id === 'bubbles') {
      // Spawn 8 bubbles with various positions and sizes
      const newBubbles = Array.from({ length: 9 }).map((_, idx) => ({
        id: Math.random().toString(),
        x: 10 + Math.random() * 80, // percentage x
        y: 20 + Math.random() * 50, // percentage y
        size: 20 + Math.random() * 32,
        delay: idx * 0.1,
      }));
      setBubbles(newBubbles);
    } else if (play.id === 'ball') {
      setShowBall(true);
      setTimeout(() => setShowBall(false), 3500); // hide ball after complete bounce pattern
    } else if (play.id === 'butterfly') {
      // Spawn 3 cute butterflies fluttering across
      const colors = ['bg-pink-300', 'bg-blue-300', 'bg-yellow-300', 'bg-purple-300'];
      const newButterflies = Array.from({ length: 4 }).map(() => {
        const xPos = Math.random() * 100;
        const yPos = 30 + Math.random() * 30;
        return {
          id: Math.random().toString(),
          x: xPos,
          y: yPos,
          targetX: xPos + (Math.random() * 40 - 20),
          targetY: yPos + (Math.random() * 30 - 15),
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
      setButterflies(newButterflies);
      setTimeout(() => setButterflies([]), 4500);
    } else if (play.id === 'swing') {
      // Soft custom notification bubble
      triggerNotification('Yippee! Love the swing! 🥰');
    }

    // Return to idle state after moderate playing duration
    setTimeout(() => {
      onSetPetStatus('idle');
    }, 3000);
  };

  // Allow clicking on bubbles dynamically to pop them for extra joy points!
  const popBubble = (bubbleId: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
    onUpdatePetStats(0, 2, 0); // extra +2 happiness reward!
    triggerNotification('Bubble Popped! +2 Happiness 💖');
  };

  const triggerNotification = (text: string) => {
    setJoyNotification({ id: Math.random().toString(), text });
  };

  return (
    <div
      className="relative flex flex-col justify-between w-full h-[600px] md:h-[650px] bg-gradient-to-b from-[#F2FDFB] via-white/50 to-[#EBFDF9] rounded-[2.5rem] border border-white shadow-xl shadow-pink-200/20 overflow-hidden p-6"
      id="garden-room-view"
    >
      {/* Lawn line detail */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#EBFDF9]/80 to-[#EBFDF9]/20 border-t border-pink-100/30 pointer-events-none" />

      {/* Sun overlay */}
      <div className="absolute top-10 left-12 w-14 h-14 rounded-full bg-[#FFFACD]/40 blur-xs shadow-inner pointer-events-none" />

      {/* Clouds bobbing */}
      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-24 pointer-events-none select-none opacity-60 text-3xl"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-32 pointer-events-none select-none opacity-50 text-2xl"
      >
        ☁️
      </motion.div>

      {/* Decorative Pastel Sunflowers at sides */}
      <div className="absolute bottom-16 left-6 select-none pointer-events-none flex gap-1 items-end opacity-85">
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌻</span>
        <span className="text-2xl opacity-75">🌷</span>
        <span className="text-xl opacity-60">🌱</span>
      </div>
      <div className="absolute bottom-16 right-6 select-none pointer-events-none flex gap-1 items-end opacity-85">
        <span className="text-xl opacity-60">🌱</span>
        <span className="text-2xl opacity-75">🌸</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌻</span>
      </div>

      {/* Header controls */}
      <div className="flex items-center justify-between z-10">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackHome}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-2xl border border-pink-100 text-pink-600 font-bold text-sm shadow-xs hover:shadow-md cursor-pointer transition-shadow"
          id="garden-back-btn"
        >
          <Lucide.ArrowLeft size={16} />
          <span>Back Home</span>
        </motion.button>

        <div className="text-right">
          <h1 className="text-xl font-bold text-pink-600 flex items-center gap-1 justify-end">
            <span>🌿</span> Meadow Garden
          </h1>
          <p className="text-2xs sm:text-xs text-pink-400 font-bold uppercase tracking-wider">
            Play with <span className="text-pink-500">{pet.name}</span> in nature
          </p>
        </div>
      </div>

      {/* Interactive Play Arena */}
      <div className="flex flex-col items-center justify-center relative flex-1 my-4" id="garden-arena">
        
        {/* Floating Beach Ball physical play logic */}
        {showBall && (
          <motion.div
            initial={{ y: -180, x: -60, rotate: 0 }}
            animate={{
              // Bouncing trail synced with pet jumping
              y: [-180, 40, -110, 40, -40, 40, 40],
              x: [-60, -10, 20, -5, -40, -10, -10],
              rotate: [0, 180, 360, 480, 540, 600, 600],
            }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            className="absolute z-20 text-4xl select-none"
            style={{ bottom: '110px' }}
          >
            ⚽
          </motion.div>
        )}

        {/* Interactive Soap Bubbles Overlay */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, x: `${bubble.x}%`, y: '160%', opacity: 0 }}
              animate={{
                scale: 1,
                y: [`${bubble.y + 30}%`, `${bubble.y}%`],
                opacity: [0, 0.7, 0.7, 0.5],
              }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 3.5, damping: 10, ease: 'easeOut', delay: bubble.delay }}
              onClick={() => popBubble(bubble.id)}
              className="absolute z-20 rounded-full border border-white bg-radial-gradient bg-cyan-200/25 cursor-pointer flex items-center justify-center select-none shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,180,210,0.15)] group animate-pulse"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
              }}
            >
              {/* Highlight flare reflection inside soap bubble */}
              <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Interactive Butterflies */}
        {butterflies.map((butterfly) => (
          <motion.div
            key={butterfly.id}
            initial={{ x: `${butterfly.x}%`, y: `${butterfly.y}%`, scale: 0.8 }}
            animate={{
              x: [`${butterfly.x}%`, `${butterfly.targetX}%`, `${butterfly.x}%`],
              y: [`${butterfly.y}%`, `${butterfly.targetY}%`, `${butterfly.y}%`],
              scale: [0.8, 1, 0.8],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute z-20 text-lg select-none`}
            style={{ left: `${butterfly.x}%`, top: `${butterfly.y}%` }}
          >
            🦋
          </motion.div>
        ))}

        {/* Pet Platform */}
        <div className="relative z-10 w-56 h-56 flex items-center justify-center">
          <PetRenderer type={pet.type} hue={pet.hue} status={currentStatus} size={190} />

          {/* Floating Joy Notifications */}
          <AnimatePresence>
            {joyNotification && (
              <motion.div
                key={joyNotification.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: -45 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                onAnimationComplete={() => {
                  setTimeout(() => setJoyNotification(null), 1200);
                }}
                className="absolute bg-white px-3.5 py-1.5 rounded-full border border-pink-100 shadow-md text-2xs font-extrabold text-pink-600 pointer-events-none uppercase tracking-wide select-none"
                style={{ top: '10px' }}
              >
                {joyNotification.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Garden description dialog */}
        <div className="mt-2 text-center max-w-sm z-10">
          <p className="text-xs font-bold px-4 py-2 bg-white/90 rounded-full border border-pink-100/60 shadow-xs text-gray-500 select-none">
            {bubbles.length > 0 ? (
              <span className="text-cyan-500 animate-bounce">🫧 Tap the bubbles to POP them for bonus fun! 🫧</span>
            ) : pet.happiness >= 95 ? (
              <span className="text-green-500">🥳 Wheee! I love playing in the garden with you so much!</span>
            ) : pet.happiness <= 35 ? (
              <span className="text-pink-600 animate-pulse">🥺 I feel a bit lonely... Play with me please!</span>
            ) : (
              <span>🌸 Pick an activity below to boost happiness!</span>
            )}
          </p>
        </div>
      </div>

      {/* Play Controls Tray drawer */}
      <div className="z-10 bg-white/60 backdrop-blur-md p-5 rounded-[2.5rem] border border-white shadow-sm" id="garden-activities-drawer">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-sm">🪁</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Play Items Drawer</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PLAY_ACTIVITIES.map((activity) => {
            const hasNoEnergy = pet.energy <= 15;
            return (
              <motion.button
                key={activity.id}
                whileHover={{ scale: hasNoEnergy ? 1 : 1.04 }}
                whileTap={{ scale: hasNoEnergy ? 1 : 0.96 }}
                disabled={hasNoEnergy}
                onClick={() => handlePlayActivity(activity)}
                className={`flex flex-col items-center justify-between py-2 text-center rounded-2xl border-2 border-white shadow-sm transition-all cursor-pointer ${activity.color} ${
                  hasNoEnergy ? 'opacity-40 cursor-not-allowed grayscale' : ''
                }`}
                id={`play-item-${activity.id}`}
              >
                <span className="text-2xl mb-1 filter drop-shadow-xs select-none">{activity.emoji}</span>
                <span className="text-2xs font-bold tracking-tight select-none truncate max-w-[75px] text-gray-600">{activity.name}</span>
                <div className="mt-1 bg-white/85 px-1.5 py-0.5 rounded-md border border-pink-50">
                  <span className="text-[9px] font-bold text-pink-600 font-mono">+{activity.statEffect.happiness}🎈</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
