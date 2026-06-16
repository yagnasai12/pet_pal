import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, ActiveRoom } from './types';
import StatBar from './components/StatBar';
import PetRenderer from './components/PetRenderer';
import PetCreationModal from './components/PetCreationModal';
import RoomKitchen from './components/RoomKitchen';
import RoomGarden from './components/RoomGarden';
import RoomBedroom from './components/RoomBedroom';
import * as Lucide from 'lucide-react';

const LOCAL_STORAGE_KEY = 'pastel-pets-state';

// Seed initial pets if user has none
const INITIAL_PETS: Pet[] = [
  {
    id: 'seed-mochi',
    name: 'Mochi',
    type: 'cat',
    hue: 195, // Cute pastel sky-blue
    hunger: 70,
    happiness: 75,
    energy: 65,
    birthday: Date.now() - 86400000 * 2, // 2 days old
    lastUpdate: Date.now(),
  },
  {
    id: 'seed-puff',
    name: 'Puff',
    type: 'bunny',
    hue: 335, // Delicately sweet rose pink
    hunger: 60,
    happiness: 90,
    energy: 50,
    birthday: Date.now() - 86400000 * 5, // 5 days old
    lastUpdate: Date.now(),
  }
];

export default function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<string>('');
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>('home');
  const [isAdopting, setIsAdopting] = useState(false);
  
  // Custom states per room
  const [petStatuses, setPetStatuses] = useState<Record<string, 'idle' | 'eating' | 'playing' | 'sleeping'>>({});
  const [sleepingPets, setSleepingPets] = useState<Record<string, boolean>>({}); // tracking pets tucked in bed

  // Toast / Status notification overlay on home screen
  const [welcomeAlert, setWelcomeAlert] = useState<string | null>(null);

  // 1. Initial Load and Offline Calculation
  useEffect(() => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    let loadedPets: Pet[] = [];

    if (rawData) {
      try {
        loadedPets = JSON.parse(rawData);
      } catch (e) {
        console.error('Error reading localStorage data, resetting', e);
        loadedPets = INITIAL_PETS;
      }
    } else {
      loadedPets = INITIAL_PETS;
    }

    // Process idle stats decay while user was offline
    let statsAlerted = false;
    const now = Date.now();
    const processedPets = loadedPets.map((pet) => {
      const msPassed = now - pet.lastUpdate;
      if (msPassed > 15000) { // If away for more than 15 seconds
        statsAlerted = true;
        const minutes = msPassed / 60000;
        
        // Decay parameters per minute offline
        const hungerDecay = Math.round(minutes * 0.25); // -15 hunger per hour
        const happinessDecay = Math.round(minutes * 0.20); // -12 happiness per hour
        const energyDecay = Math.round(minutes * 0.15); // -9 energy per hour

        return {
          ...pet,
          hunger: Math.max(10, pet.hunger - hungerDecay),
          happiness: Math.max(15, pet.happiness - happinessDecay),
          energy: Math.max(8, pet.energy - energyDecay),
          lastUpdate: now,
        };
      }
      return { ...pet, lastUpdate: now };
    });

    setPets(processedPets);
    if (processedPets.length > 0) {
      setActivePetId(processedPets[0].id);
    }

    if (statsAlerted) {
      setWelcomeAlert('Welcome back! Your pets missed you. They got a little bit hungry and sleepy while you were offline! 🍪💤');
    }
    
    // Auto-save initial calculations
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(processedPets));
  }, []);

  // 2. Real-Time Tick Counter
  // Decreases stats of idle pets, and increases stats of sleeping pets in real time
  useEffect(() => {
    if (pets.length === 0) return;

    const interval = setInterval(() => {
      setPets((prevPets) => {
        const nextPets = prevPets.map((pet) => {
          const isAsleep = sleepingPets[pet.id] || false;
          let newHunger = pet.hunger;
          let newHappiness = pet.happiness;
          let newEnergy = pet.energy;

          if (isAsleep) {
            // Recover energy rapidly when sleeping!
            newEnergy = Math.min(100, pet.energy + 2.5);
            // Slower hunger decay when sleeping
            newHunger = Math.max(5, pet.hunger - 0.2);
            newHappiness = Math.max(10, pet.happiness - 0.1);
          } else {
            // Standard decay when awake
            newHunger = Math.max(5, pet.hunger - 0.8);
            newHappiness = Math.max(10, pet.happiness - 0.6);
            newEnergy = Math.max(5, pet.energy - 0.5);
          }

          return {
            ...pet,
            hunger: newHunger,
            happiness: newHappiness,
            energy: newEnergy,
            lastUpdate: Date.now(),
          };
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextPets));
        return nextPets;
      });
    }, 5500); // Ticks every 5.5 seconds for visible game progress

    return () => clearInterval(interval);
  }, [pets, sleepingPets]);

  const activePet = pets.find((p) => p.id === activePetId);

  // Adopt a pet submission
  const handleAdoptPet = (newPetData: Omit<Pet, 'id' | 'birthday' | 'lastUpdate'>) => {
    const freshPet: Pet = {
      ...newPetData,
      id: `pet-${Math.random().toString(36).substr(2, 9)}`,
      birthday: Date.now(),
      lastUpdate: Date.now(),
    };

    const updated = [...pets, freshPet];
    setPets(updated);
    setActivePetId(freshPet.id);
    setIsAdopting(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setWelcomeAlert(`💖 You adopted ${freshPet.name}! Bring them to the rooms to play!`);
  };

  const handleDeletePet = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to say goodbye to ${name}? 🥺`)) {
      const updated = pets.filter((p) => p.id !== id);
      setPets(updated);
      if (updated.length > 0) {
        setActivePetId(updated[0].id);
      } else {
        setActivePetId('');
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Modify active pet stats directly (feeding, petting, sleeping)
  const handleUpdatePetStats = (hungerDiff: number, happinessDiff: number, energyDiff: number) => {
    if (!activePetId) return;

    setPets((prevPets) => {
      const updated = prevPets.map((pet) => {
        if (pet.id === activePetId) {
          return {
            ...pet,
            hunger: Math.max(0, Math.min(100, pet.hunger + hungerDiff)),
            happiness: Math.max(0, Math.min(100, pet.happiness + happinessDiff)),
            energy: Math.max(0, Math.min(100, pet.energy + energyDiff)),
            lastUpdate: Date.now(),
          };
        }
        return pet;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getPetStatus = (id: string) => {
    return petStatuses[id] || 'idle';
  };

  const setPetStatus = (status: 'idle' | 'eating' | 'playing' | 'sleeping') => {
    if (!activePetId) return;
    setPetStatuses((prev) => ({ ...prev, [activePetId]: status }));
  };

  const getPetAgeDays = (birthday: number) => {
    const diffTime = Math.abs(Date.now() - birthday);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? '1 day' : `${diffDays} days`;
  };

  const currentPetStatus = activePet ? getPetStatus(activePet.id) : 'idle';
  const currentPetIsNight = activePet ? (sleepingPets[activePet.id] || false) : false;

  return (
    <div className="min-h-screen bg-[#FDF2F8] py-4 px-3 sm:px-6 flex flex-col justify-between font-sans relative text-gray-800" id="app-root-container">
      {/* Decorative Pastel Clouds Floating in outer margin */}
      <div className="absolute top-10 left-6 w-20 h-8 bg-pink-200/25 rounded-full blur-md pointer-events-none" />
      <div className="absolute top-24 right-12 w-28 h-10 bg-pink-100/30 rounded-full blur-xs pointer-events-none shadow-xs" />

      {/* Main Container Wrapper */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between space-y-4" id="main-viewframe-inner">
        
        {/* ========================================================
            NAVBAR / HEADER DASHBOARD
            ======================================================== */}
        <header className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 z-20" id="header-dashboard">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <span className="text-white text-2xl font-bold">🐾</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-pink-600">
                PetPal
              </h1>
              <p className="text-2xs sm:text-xs font-semibold text-pink-400 select-none uppercase tracking-widest">
                Home Dashboard
              </p>
            </div>
          </div>

          {/* Quick Pet Selection Slide */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full" id="pet-selection-header-slider">
            {pets.map((p) => {
              const isActive = p.id === activePetId;
              const isAsleep = sleepingPets[p.id] || false;
              const petEmoji = p.type === 'cat' ? '🐱' : p.type === 'dog' ? '🐶' : '🐰';
              return (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActivePetId(p.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `bg-white shadow-md border-transparent ring-2`
                      : 'bg-white/40 hover:bg-white/60 border-pink-50 opacity-80'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 4px 12px rgba(244,63,94,0.1)` : undefined,
                    borderColor: isActive ? `hsl(${p.hue}, 80%, 75%)` : undefined,
                    ringColor: isActive ? `hsl(${p.hue}, 80%, 75%)` : undefined,
                  }}
                  id={`select-pet-tab-${p.name.toLowerCase()}`}
                >
                  <span className="text-lg">{petEmoji}</span>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-none text-gray-750">{p.name}</p>
                    <p className="text-[9px] text-gray-400 font-semibold leading-none mt-0.5">
                      {isAsleep ? '💤 Asleep' : `Age: ${getPetAgeDays(p.birthday)}`}
                    </p>
                  </div>
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full animate-pulse bg-pink-400"
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Adopt (+) Add new pet button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAdopting(true)}
              className="w-10 h-10 rounded-2xl bg-white/60 hover:bg-white border border-dashed border-pink-300 flex items-center justify-center text-pink-500 font-bold shadow-xs cursor-pointer"
              title="Adopt a New Pet"
              id="adopt-plus-btn"
            >
              <Lucide.Plus size={18} />
            </motion.button>
          </div>
        </header>

        {/* ========================================================
            ALERTS / NOTIFICATION TOAST
            ======================================================== */}
        <AnimatePresence>
          {welcomeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-purple-50 border border-purple-100 rounded-2xl p-3.5 text-xs font-medium text-purple-800 flex items-start gap-2.5 shadow-xs relative z-10"
              id="home-welcome-alert"
            >
              <span>✨</span>
              <p className="flex-1 pr-4">{welcomeAlert}</p>
              <button
                onClick={() => setWelcomeAlert(null)}
                className="absolute top-3 right-3 text-purple-400 hover:text-purple-600 transition-colors"
              >
                <Lucide.X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            CORE ROOM VIEWS PORTPORT (Interactive Slide Transitions)
            ======================================================== */}
        <main className="flex-1 flex flex-col justify-center relative min-h-[450px]" id="rooms-stage">
          <AnimatePresence mode="wait">
            
            {/* NO PETS ADOPTED YET SCREEN */}
            {pets.length === 0 ? (
              <motion.div
                key="no-pets-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 p-8 text-center flex flex-col items-center justify-center space-y-5 shadow-sm"
              >
                <span className="text-6xl animate-bounce">🐰🐶🐱</span>
                <h3 className="text-2xl font-bold">Adopt your very first pet!</h3>
                <p className="text-gray-500 max-w-sm text-sm">
                  Welcome to the Pastel Pet Raising sanctuary. Name, color, and raise cutest animals. Press below to begin!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAdopting(true)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-colors"
                  id="adopt-first-pet-huge-btn"
                >
                  Adopt First Pet 🎀
                </motion.button>
              </motion.div>
            ) : !activePet ? (
              <div className="text-center p-8 text-gray-400">Loading active pet...</div>
            ) : (
              
              /* ========================================================
                  HOME PAGE MEADOW VIEW
                  ======================================================== */
              activeRoom === 'home' && (
                <motion.div
                  key="home-meadow-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="relative flex flex-col md:flex-row w-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-pink-200/20 p-6 md:p-8 gap-6 overflow-hidden md:min-h-[550px]"
                  id="home-room-meadow"
                >
                  {/* Decorative soft tree fence & background radial glow, contained beautifully */}
                  <div className="absolute inset-0 bg-radial-gradient from-pink-100/10 to-transparent pointer-events-none" />

                  {/* LEFT COLUMN: Bio & Vital Stats */}
                  <div className="w-full md:w-72 flex flex-col gap-5 shrink-0 order-2 md:order-1" id="home-left-sidebar">
                    {/* Bio details card */}
                    <div className="flex justify-between items-center bg-white/60 p-4 rounded-3xl border border-pink-50/50 shadow-xs" id="home-pet-infobar">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner bg-pink-50">
                          {activePet.type === 'cat' ? '🐱' : activePet.type === 'dog' ? '🐶' : '🐰'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-sm font-black text-gray-800 leading-none">{activePet.name}</h2>
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: `hsl(${activePet.hue}, 90%, 75%)` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold mt-1">
                            Age: <span className="text-pink-500">{getPetAgeDays(activePet.birthday)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Delete Say Goodbye option */}
                      <button
                        onClick={() => handleDeletePet(activePet.id, activePet.name)}
                        className="p-2.5 bg-white hover:bg-rose-50 text-rose-450 hover:text-rose-600 rounded-xl transition-all border border-pink-100 shadow-xs text-xs font-bold cursor-pointer"
                        title="Say Goodbye (Delete Pet)"
                        id="goodbye-delete-btn"
                      >
                        <Lucide.HeartCrack size={16} />
                      </button>
                    </div>

                    {/* VITAL HEALTH STATS list (vertical layout for desktop) */}
                    <div className="flex flex-col gap-3" id="home-stats-dashboard">
                      <div className="px-1 flex justify-between items-center text-2xs uppercase font-extrabold text-pink-400 tracking-widest">
                        <span>Vital Stats</span>
                        <span>Level: Healthy 🌱</span>
                      </div>
                      <StatBar
                        label="Hunger"
                        value={activePet.hunger}
                        iconName="Apple"
                        colorClass="bg-orange-400"
                        bgClass="bg-white"
                        iconColor="text-orange-500"
                      />
                      <StatBar
                        label="Happiness"
                        value={activePet.happiness}
                        iconName="Heart"
                        colorClass="bg-green-400"
                        bgClass="bg-white"
                        iconColor="text-green-500"
                      />
                      <StatBar
                        label="Energy"
                        value={activePet.energy}
                        iconName="Zap"
                        colorClass="bg-[#3B82F6]"
                        bgClass="bg-white"
                        iconColor="text-blue-500"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN/MAIN CONTENT: Centered pet circus & Action utilities */}
                  <div className="flex-1 flex flex-col items-center justify-center relative gap-6 order-1 md:order-2 py-4" id="home-right-main-panel">
                    
                    {/* Central Stage Pet circular spotlight theater */}
                    <div className="relative flex flex-col items-center w-full" id="meadow-central-view">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-80 md:h-80 bg-pink-100/10 rounded-full blur-xl pointer-events-none" />

                      <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center shadow-xl shadow-pink-200/30 border-[8px] border-white">
                        <div className="scale-105 drop-shadow-lg">
                          <PetRenderer
                            type={activePet.type}
                            hue={activePet.hue}
                            status={currentPetIsNight ? 'sleeping' : currentPetStatus}
                            size={160}
                          />
                        </div>
                        <div className="absolute -bottom-3 bg-pink-500 text-white px-5 py-1.5 rounded-full font-bold shadow-md text-xs uppercase tracking-widest select-none">
                          {activePet.name}
                        </div>
                      </div>
                    </div>

                    {/* Speech / Meadow bubble */}
                    <div className="text-center z-10 select-none pointer-events-none max-w-sm mt-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400 mb-1.5">Meadow Status</p>
                      <p className="text-xs bg-white/95 px-4 py-2 rounded-full border border-pink-100/50 font-bold text-gray-600 shadow-xs">
                        {currentPetIsNight ? (
                          <span className="text-pink-500 font-normal animate-pulse">💤 Shh... Cozy and sleeping in bed!</span>
                        ) : activePet.hunger <= 30 ? (
                          <span>😭 I'm starving! Take me to the Kitchen! 🍕</span>
                        ) : activePet.happiness <= 30 ? (
                          <span>🥺 I'm bored! Let's go to the Garden! 🌿</span>
                        ) : activePet.energy <= 30 ? (
                          <span>🥱 I'm exhausted! Let's sleep in the Bedroom! 🛌</span>
                        ) : (
                          <span>💖 Living happily in our sweet little home!</span>
                        )}
                      </p>
                    </div>

                    {/* Clean Action Navigation Drawer aligned directly in flow underneath pet spotlight */}
                    <div className="flex gap-4 sm:gap-6 justify-center w-full pt-2" id="three-floating-activity-buttons">
                      
                      {/* 1. Eat Action */}
                      <button
                        onClick={() => setActiveRoom('kitchen')}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Kitchen (Eating)"
                        id="float-btn-eating"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 h-16 bg-[#FEF3C7] hover:bg-yellow-100 rounded-2xl flex items-center justify-center shadow-md border-4 border-white transition-colors"
                        >
                          <span className="text-2xl select-none leading-none">🥣</span>
                        </motion.div>
                        <span className="text-[10px] font-extrabold text-yellow-700 uppercase tracking-widest bg-yellow-200/40 px-2.5 py-0.5 rounded-md">
                          Eat
                        </span>
                      </button>

                      {/* 2. Play Action */}
                      <button
                        onClick={() => setActiveRoom('garden')}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Garden (Playing)"
                        id="float-btn-playing"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 h-16 bg-[#DCFCE7] hover:bg-green-100 rounded-2xl flex items-center justify-center shadow-md border-4 border-white transition-colors"
                        >
                          <span className="text-2xl select-none leading-none">🎾</span>
                        </motion.div>
                        <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-widest bg-green-200/40 px-2.5 py-0.5 rounded-md">
                          Play
                        </span>
                      </button>

                      {/* 3. Sleep Action */}
                      <button
                        onClick={() => setActiveRoom('bedroom')}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Bedroom (Sleeping)"
                        id="float-btn-sleeping"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 h-16 bg-[#E0F2FE] hover:bg-blue-100 rounded-2xl flex items-center justify-center shadow-md border-4 border-white transition-colors"
                        >
                          <span className="text-2xl select-none leading-none">💤</span>
                        </motion.div>
                        <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest bg-blue-200/40 px-2.5 py-0.5 rounded-md">
                          Sleep
                        </span>
                      </button>

                    </div>

                  </div>

                </motion.div>
              )
            )}

            {/* ========================================================
                ROOM: KITCHEN VIEW (Active Room: 'kitchen')
                ======================================================== */}
            {activeRoom === 'kitchen' && activePet && (
              <motion.div
                key="kitchen-view-frame"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              >
                <RoomKitchen
                  pet={activePet}
                  currentStatus={currentPetStatus}
                  onUpdatePetStats={handleUpdatePetStats}
                  onBackHome={() => setActiveRoom('home')}
                  onSetPetStatus={setPetStatus}
                />
              </motion.div>
            )}

            {/* ========================================================
                ROOM: GARDEN VIEW (Active Room: 'garden')
                ======================================================== */}
            {activeRoom === 'garden' && activePet && (
              <motion.div
                key="garden-view-frame"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              >
                <RoomGarden
                  pet={activePet}
                  currentStatus={currentPetStatus}
                  onUpdatePetStats={handleUpdatePetStats}
                  onBackHome={() => setActiveRoom('home')}
                  onSetPetStatus={setPetStatus}
                />
              </motion.div>
            )}

            {/* ========================================================
                ROOM: BEDROOM VIEW (Active Room: 'bedroom')
                ======================================================== */}
            {activeRoom === 'bedroom' && activePet && (
              <motion.div
                key="bedroom-view-frame"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              >
                <RoomBedroom
                  pet={activePet}
                  currentStatus={currentPetStatus}
                  onUpdatePetStats={handleUpdatePetStats}
                  onBackHome={() => setActiveRoom('home')}
                  onSetPetStatus={setPetStatus}
                  isNightMode={currentPetIsNight}
                  onToggleNightMode={(night) => {
                    setSleepingPets((prev) => ({ ...prev, [activePet.id]: night }));
                  }}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* ========================================================
            FOOTER CREDITS
            ======================================================== */}
        <footer className="px-6 py-4 bg-white/20 border-t border-white rounded-[1.5rem] mt-3" id="app-sleek-footer">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] sm:text-xs font-bold text-pink-500 bg-white/60 px-3 py-1.5 rounded-full shadow-2xs border border-pink-50">Companion App 🐾</span>
              <span className="text-[10px] sm:text-xs font-bold text-orange-500 bg-white/60 px-3 py-1.5 rounded-full shadow-2xs border border-pink-50">Level: Active Meadow ✨</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-pink-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-pink-200 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-pink-100 rounded-full"></div>
            </div>
          </div>
        </footer>

      </div>

      {/* ========================================================
          ADOPTION SELECTION MODAL
          ======================================================== */}
      <PetCreationModal
        isOpen={isAdopting}
        onClose={() => setIsAdopting(false)}
        onAdopt={handleAdoptPet}
        canCancel={pets.length > 0} // Must finalize adoption if roster is fully empty
      />
    </div>
  );
}
