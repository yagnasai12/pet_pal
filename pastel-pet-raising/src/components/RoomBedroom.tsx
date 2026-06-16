import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetActivity } from '../types';
import { SLEEP_ACTIVITIES } from '../constants';
import PetRenderer from './PetRenderer';
import * as Lucide from 'lucide-react';

interface RoomBedroomProps {
  pet: Pet;
  onUpdatePetStats: (hungerDiff: number, happinessDiff: number, energyDiff: number) => void;
  onBackHome: () => void;
  onSetPetStatus: (status: 'idle' | 'eating' | 'playing' | 'sleeping') => void;
  currentStatus: 'idle' | 'eating' | 'playing' | 'sleeping';
  isNightMode: boolean;
  onToggleNightMode: (night: boolean) => void;
}

export default function RoomBedroom({
  pet,
  onUpdatePetStats,
  onBackHome,
  onSetPetStatus,
  currentStatus,
  isNightMode,
  onToggleNightMode,
}: RoomBedroomProps) {
  const [sleepMessage, setSleepMessage] = useState('Snore... Cozy and warm. 💤');

  // Sync pet status automatically based on Night Mode
  useEffect(() => {
    if (isNightMode) {
      onSetPetStatus('sleeping');
    } else {
      if (currentStatus === 'sleeping') {
        onSetPetStatus('idle');
      }
    }
  }, [isNightMode]);

  // Handle active rest procedures
  const handleSleepActivity = (activity: PetActivity) => {
    if (isNightMode) return; // Already asleep in dark!
    
    onSetPetStatus('sleeping');
    onUpdatePetStats(
      activity.statEffect.hunger || 0,
      activity.statEffect.happiness || 0,
      activity.statEffect.energy || 0
    );

    triggerRestMessage(`${activity.name} Mode activated! 🛋️`);

    // Wake up after some seconds
    setTimeout(() => {
      onSetPetStatus('idle');
    }, 4500);
  };

  const triggerRestMessage = (msg: string) => {
    setSleepMessage(msg);
  };

  const toggleLights = () => {
    onToggleNightMode(!isNightMode);
  };

  return (
    <div
      className={`relative flex flex-col justify-between w-full h-[600px] md:h-[650px] transition-colors duration-1000 overflow-hidden p-6 rounded-[2.5rem] border shadow-xl ${
        isNightMode
          ? 'bg-gradient-to-b from-[#1C1630] via-[#2D2248] to-[#141021] border-[#1C1630]'
          : 'bg-gradient-to-b from-[#FDF2F8] via-white/50 to-[#FDF2F8]/80 border-white text-gray-800'
      }`}
      id="bedroom-room-view"
    >
      {/* Interactive Light switch pull cord hanger */}
      <div className="absolute right-12 top-0 flex flex-col items-center z-30" id="light-cord-attachment">
        {/* The hang cord */}
        <motion.div
          animate={{ height: isNightMode ? 90 : 130 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-1 bg-gray-400 rounded-b-md relative cursor-pointer group"
          onClick={toggleLights}
        >
          {/* Handle knob */}
          <div className={`absolute bottom-0 -left-2.5 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shadow-md active:scale-95 ${
            isNightMode ? 'bg-[#FFEB60] border-amber-300 text-amber-900 animate-pulse' : 'bg-white border-gray-300 text-gray-500'
          }`}>
            <Lucide.Lightbulb size={12} className="pointer-events-none" />
          </div>
        </motion.div>
        <span className="text-[10px] mt-1 font-bold opacity-45 uppercase select-none tracking-widest">
          {isNightMode ? 'On' : 'Off'}
        </span>
      </div>

      {/* Twinkling stars only shown in night mode */}
      {isNightMode && (
        <div className="absolute inset-0 pointer-events-none select-none" id="twinkle-stars-bedroom">
          {[
            { top: '15%', left: '10%', delay: '0s', size: 'text-lg' },
            { top: '35%', left: '85%', delay: '0.4s', size: 'text-2xs' },
            { top: '65%', left: '12%', delay: '0.8s', size: 'text-xs' },
            { top: '22%', left: '60%', delay: '1.2s', size: 'text-2xl' },
            { top: '50%', left: '78%', delay: '1.6s', size: 'text-sm' },
            { top: '75%', left: '45%', delay: '2s', size: 'text-xs' },
          ].map((star, i) => (
            <div
              key={i}
              className={`absolute animate-pulse text-yellow-200/60 ${star.size}`}
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                animationDuration: '2.5s',
              }}
            >
              ⭐
            </div>
          ))}

          {/* Shooting Star effect */}
          <motion.div
            initial={{ x: -100, y: -50, opacity: 0 }}
            animate={{ x: 600, y: 300, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 12, ease: 'easeOut' }}
            className="absolute text-yellow-200/40 text-xl font-bold select-none pointer-events-none"
            style={{ top: '10%' }}
          >
            ☄️
          </motion.div>
        </div>
      )}

      {/* Night switch wallpaper accent */}
      <div className={`absolute inset-x-0 top-1/4 h-24 border-y pointer-events-none select-none transition-colors duration-1000 ${
        isNightMode ? 'border-indigo-950/20 bg-indigo-950/5' : 'border-pink-100/10 bg-pink-100/5'
      }`} />

      {/* Header Room controls */}
      <div className="flex items-center justify-between z-10">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackHome}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border font-bold text-sm shadow-xs hover:shadow-md cursor-pointer transition-all ${
            isNightMode
              ? 'bg-indigo-900/30 border-indigo-900 text-purple-200 hover:bg-indigo-900/50'
              : 'bg-white border-pink-100 text-pink-600'
          }`}
          id="bedroom-back-btn"
        >
          <Lucide.ArrowLeft size={16} />
          <span>Back Home</span>
        </motion.button>

        <div className="text-right">
          <h1 className={`text-xl font-bold flex items-center gap-1 justify-end ${isNightMode ? 'text-amber-100' : 'text-pink-600'}`}>
            <span>🌙</span> Starry Bedroom
          </h1>
          <p className={`text-2xs sm:text-xs font-bold uppercase tracking-wider ${isNightMode ? 'text-purple-300' : 'text-pink-400'}`}>
            Tuck in <span className="font-bold">{pet.name}</span> for dreams
          </p>
        </div>
      </div>

      {/* Sleeping Bed station */}
      <div className="flex flex-col items-center justify-center relative flex-1 my-4" id="bedroom-arena">
        
        {/* Soft rug vector base */}
        <div className={`absolute w-64 h-16 rounded-full bottom-7 border transition-all pointer-events-none ${
          isNightMode ? 'bg-[#291F44] border-purple-900/30' : 'bg-pink-100/30 border-pink-200/50'
        }`} />

        {/* Outer Wooden Crib Bed Headboard Backing */}
        <div className={`absolute w-44 h-32 rounded-t-3xl bottom-14 border transition-all ${
          isNightMode
            ? 'bg-[#18112C] border-purple-900/40 text-purple-950/35'
            : 'bg-pink-50 border-pink-100 text-pink-200/30'
        } flex justify-center pt-2 gap-2 select-none pointer-events-none`}>
          {/* Cute bed railings */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-2 h-20 rounded-md ${isNightMode ? 'bg-purple-950' : 'bg-pink-100 font-bold'}`} />
          ))}
        </div>

        {/* Pet inside bed */}
        <div className="relative z-10 w-52 h-52 flex items-center justify-center pb-2">
          <PetRenderer type={pet.type} hue={pet.hue} status={currentStatus} size={180} />
        </div>

        {/* Blanket overlay that covers the pet's feet when sleeping */}
        {currentStatus === 'sleeping' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-[66px] w-[90px] h-[34px] rounded-t-xl border-t-2 shadow-xs z-15 flex flex-col justify-center px-1.5 select-none pointer-events-none text-center ${
              isNightMode
                ? 'bg-indigo-900 border-indigo-700 text-purple-300'
                : 'bg-pink-100 border-pink-300 text-pink-700'
            }`}
          >
            <div className="text-[8px] font-bold uppercase tracking-wider scale-90">Sweet Dreams</div>
            <div className="text-2xs font-bold font-mono">{(pet.hue % 2 === 0) ? '💕 🌸' : '⭐ ✨'}</div>
          </motion.div>
        )}

        {/* Sleeping Status Bubble */}
        <div className="mt-2 text-center max-w-sm z-15">
          <p className={`text-xs font-bold px-4 py-2 backdrop-blur-md rounded-full border transition-all select-none ${
            isNightMode
              ? 'bg-indigo-950/70 border-indigo-900/50 text-indigo-300'
              : 'bg-white/90 border-pink-100/60 text-gray-500'
          }`}>
            {isNightMode ? (
              <span className="text-yellow-250 animate-pulse">💤 Shh... {pet.name} is sleeping. Energy is recovering! 💤</span>
            ) : pet.energy >= 90 ? (
              <span className="text-green-500">⚡ I have full energy! No need to sleep now. Let's play!</span>
            ) : (
              <span>🧸 Pull the Light Switch cord to put me to sleep, or take a nap.</span>
            )}
          </p>
        </div>
      </div>

      {/* Bed Rest activity controls (Available when light is ON) */}
      <div className={`z-10 bg-white/60 backdrop-blur-md p-5 rounded-[2.5rem] border shadow-sm transition-all ${
        isNightMode ? 'opacity-30 pointer-events-none select-none grayscale' : 'border-white'
      }`} id="bedroom-activities-drawer">
        <div className="flex items-center gap-2 mb-3 px-1 text-gray-700">
          <span className="text-sm">🧸</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rest Drawer</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SLEEP_ACTIVITIES.map((activity) => (
            <motion.button
              key={activity.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSleepActivity(activity)}
              disabled={isNightMode}
              className={`flex flex-col items-center justify-between py-2 text-center rounded-2xl border-2 border-white shadow-sm transition-all cursor-pointer ${activity.color}`}
              id={`sleep-item-${activity.id}`}
            >
              <span className="text-2xl mb-1 filter drop-shadow-xs select-none">{activity.emoji}</span>
              <span className="text-2xs font-bold tracking-tight select-none truncate max-w-[85px] text-gray-600">{activity.name}</span>
              <div className="mt-1 bg-white/85 px-1.5 py-0.5 rounded-md border border-pink-50">
                <span className="text-[9px] font-bold text-pink-600 font-mono">+{activity.statEffect.energy}⚡</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
