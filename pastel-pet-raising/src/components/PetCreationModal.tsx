import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pet, PetType } from '../types';
import PetRenderer from './PetRenderer';
import { DEFAULT_HUES } from '../constants';
import * as Lucide from 'lucide-react';

interface PetCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdopt: (pet: Omit<Pet, 'id' | 'birthday' | 'lastUpdate'>) => void;
  canCancel: boolean;
}

export default function PetCreationModal({ isOpen, onClose, onAdopt, canCancel }: PetCreationModalProps) {
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<PetType>('cat');
  // Initialize with species-default HSL hue
  const [hue, setHue] = useState<number>(DEFAULT_HUES.cat);
  const [errorString, setErrorString] = useState('');

  const handleTypeSelect = (type: PetType) => {
    setPetType(type);
    setHue(DEFAULT_HUES[type]);
    setErrorString('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorString('Please give your sweet pet a name!');
      return;
    }
    if (name.length > 14) {
      setErrorString('Maximum name length is 14 characters.');
      return;
    }

    onAdopt({
      name: name.trim(),
      type: petType,
      hue,
      hunger: 80, // Healthy starting stats
      happiness: 80,
      energy: 80,
    });

    // Reset fields for future additions
    setName('');
    setPetType('cat');
    setHue(DEFAULT_HUES.cat);
    setErrorString('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/25 backdrop-blur-md" id="creation-modal-backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FFF9F2] rounded-3xl border-4 border-amber-100 shadow-xl overflow-hidden p-6 text-[#4E3E3D]"
          id="creation-modal-body"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-sans tracking-tight text-[#4E3E3D] flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 rounded-xl text-rose-500 text-lg">🌸</span>
              Adopt a Cute Pet!
            </h2>
            {canCancel && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
                id="close-creation-btn"
                type="button"
              >
                <Lucide.X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Live customizable preview */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-6 px-4 rounded-3xl border border-white relative overflow-hidden" id="live-adopt-preview-section">
              <div className="absolute top-2 left-3 bg-white/75 backdrop-blur-md px-2.5 py-1 rounded-full text-2xs font-bold text-slate-500 uppercase tracking-widest">
                My Dream Palette
              </div>
              
              <div className="w-52 h-52 flex items-center justify-center">
                <PetRenderer type={petType} hue={hue} status="idle" size={170} />
              </div>
              
              <div className="text-center mt-1">
                <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm text-amber-800/80 font-medium border border-amber-50">
                  {name.trim() ? name : `Unnamed ${petType}`}
                </span>
              </div>
            </div>

            {/* Input Name */}
            <div>
              <label className="block text-sm font-bold mb-1.5 select-none" htmlFor="pet-name-input">
                1. What is your pet's name?
              </label>
              <input
                id="pet-name-input"
                type="text"
                placeholder="Cookie, Sparky, Bubbles..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorString('');
                }}
                className="w-full px-4 py-3 bg-white border-2 border-amber-100 rounded-2xl focus:outline-none focus:border-amber-300 font-medium text-lg placeholder-amber-800/30 transition-all text-center tracking-normal shadow-inner"
                maxLength={14}
                required
              />
              {errorString && (
                <p className="text-rose-500 text-xs font-semibold mt-1 px-1 flex items-center gap-1">
                  <span>⚠️</span> {errorString}
                </p>
              )}
            </div>

            {/* Select Pet Type */}
            <div>
              <label className="block text-sm font-bold mb-1.5 select-none">
                2. Choose Pet breed:
              </label>
              <div className="grid grid-cols-3 gap-3" id="pet-breed-grid">
                {[
                  { id: 'cat', emoji: '🐱', label: 'Cat', bg: 'bg-sky-50 border-sky-100', active: 'ring-4 ring-sky-300' },
                  { id: 'dog', emoji: '🐶', label: 'Dog', bg: 'bg-amber-50 border-amber-100', active: 'ring-4 ring-amber-300' },
                  { id: 'bunny', emoji: '🐰', label: 'Bunny', bg: 'bg-pink-50 border-pink-100', active: 'ring-4 ring-pink-300' },
                ].map((breed) => {
                  const isSelected = petType === breed.id;
                  return (
                    <button
                      key={breed.id}
                      type="button"
                      onClick={() => handleTypeSelect(breed.id as PetType)}
                      className={`relative flex flex-col items-center py-3.5 px-2 rounded-2xl border-2 transition-all cursor-pointer ${breed.bg} ${
                        isSelected ? `${breed.active} border-transparent scale-[1.03] shadow-md` : 'opacity-70 hover:opacity-100 border-dashed hover:border-solid hover:scale-102 hover:shadow-xs'
                      }`}
                    >
                      <span className="text-3xl mb-1">{breed.emoji}</span>
                      <span className="text-xs font-bold">{breed.label}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-white p-0.5 rounded-full text-emerald-500 border border-slate-50">
                          <Lucide.Check size={10} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pastel Hue Slider bar */}
            <div>
              <div className="flex justify-between items-center mb-1 select-none">
                <label className="text-sm font-bold">
                  3. Customize Pastel Color:
                </label>
                <span className="text-xs font-mono text-slate-500">Hue: {hue}°</span>
              </div>
              <div className="relative mt-2 flex items-center px-1">
                {/* Visual spectrum background gutter */}
                <div
                  className="absolute left-1.5 right-1.5 h-3 rounded-full pointer-events-none border border-slate-200/50"
                  style={{
                    background: 'linear-gradient(to right, hsl(0,90%,85%), hsl(60,90%,85%), hsl(120,90%,85%), hsl(180,90%,85%), hsl(240,90%,85%), hsl(300,90%,85%), hsl(360,90%,85%))'
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full h-8 opacity-0 cursor-pointer relative z-10 accent-transparent"
                />
                {/* Visual Custom indicator slider thumb overlay */}
                <div
                  className="absolute pointer-events-none w-5 h-5 rounded-full border-2 border-white shadow-md top-1.5 -translate-x-1/2 transition-shadow"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    backgroundColor: `hsl(${hue}, 90%, 82%)`,
                    transform: `translate(${(hue / 360) * -4 + 2}px, 0.5px)`
                  }}
                />
              </div>
            </div>

            {/* Confirm adopt btn */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 px-6 font-bold text-white text-lg rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-pink-500 hover:to-indigo-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-pink-300"
                id="adopt-submit-btn"
              >
                <span>🎀</span> Adopt {name.trim() || 'My Pet'}!
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
