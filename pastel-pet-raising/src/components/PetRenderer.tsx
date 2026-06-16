import { motion } from 'motion/react';
import { PetType } from '../types';

interface PetRendererProps {
  type: PetType;
  hue: number;
  status: 'idle' | 'eating' | 'playing' | 'sleeping';
  className?: string;
  size?: number;
}

export default function PetRenderer({
  type,
  hue,
  status,
  className = '',
  size = 200,
}: PetRendererProps) {
  // Pastel colors derived from hue
  const primaryColor = `hsl(${hue}, 90%, 82%)`;
  const secondaryColor = `hsl(${hue}, 80%, 75%)`;
  const insideEarColor = `hsl(${(hue + 20) % 360}, 95%, 88%)`;
  const blushColor = 'rgba(255, 170, 185, 0.65)';
  const lineStroke = '#4E3E3D'; // Delightful dark warm charcoal outline

  // Setup animations based on status
  // 1. Sleping: slow, breathing bob, closed cartoon curves
  // 2. Eating: rapid vertical chewing bob + muzzle scale
  // 3. Playing: energetic jumps and squishes
  // 4. Idle: gentle cozy sway
  const getBodyAnimation = () => {
    switch (status) {
      case 'sleeping':
        return {
          y: [0, 6, 0],
          scaleY: [1, 0.96, 1],
          transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'eating':
        return {
          y: [0, -4, 0],
          scaleY: [1, 1.05, 0.95, 1],
          transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'playing':
        return {
          y: [0, -35, 0],
          scaleY: [1, 0.85, 1.15, 0.9, 1],
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'idle':
      default:
        return {
          y: [0, 4, 0],
          scaleY: [1, 0.98, 1],
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        };
    }
  };

  const getEarAnimation = (side: 'left' | 'right') => {
    const angle = side === 'left' ? -8 : 8;
    switch (status) {
      case 'playing':
        return {
          rotate: [angle, angle - 12, angle + 12, angle],
          transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'sleeping':
        return {
          rotate: [angle, angle + 2, angle],
          transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'eating':
        return {
          rotate: [angle, angle - 5, angle],
          transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'idle':
      default:
        return {
          rotate: [angle, angle + (side === 'left' ? -3 : 3), angle],
          transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: side === 'left' ? 0 : 0.4 },
        };
    }
  };

  const getTailAnimation = () => {
    switch (status) {
      case 'playing':
        return {
          rotate: [-15, 25, -15],
          transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'sleeping':
        return {
          rotate: [0, 5, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
        };
      default:
        return {
          rotate: [-5, 10, -5],
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        };
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} id="pet-display-container">
      {/* Absolute floating indicators depending on status */}
      {status === 'sleeping' && (
        <div className="absolute top-0 right-4 pointer-events-none select-none" id="sleeping-bubble-container">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-10, -50, -80],
              scale: [0.7, 1, 1.2, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            className="absolute text-2xl font-bold font-mono text-purple-400 select-none"
            style={{ textShadow: '1px 1px 0px white' }}
          >
            Z
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.5 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              y: [-5, -45, -75],
              scale: [0.6, 0.9, 1.1, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute text-violet-400 font-bold font-mono text-xl select-none"
            style={{ left: '20px', textShadow: '1px 1px 0px white' }}
          >
            z
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.4 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: [0, -35, -60],
              scale: [0.5, 0.8, 1, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            className="absolute text-pink-400 font-semibold font-mono text-lg select-none"
            style={{ left: '-15px', textShadow: '1px 1px 0px white' }}
          >
            z
          </motion.div>
        </div>
      )}

      {status === 'playing' && (
        <div className="absolute inset-0 pointer-events-none select-none" id="playing-star-container">
          {/* Fun sparkles bursting around */}
          {[
            { id: 1, x: -60, y: -40, delay: 0, emoji: '✨' },
            { id: 2, x: 70, y: -60, delay: 0.2, emoji: '🌸' },
            { id: 3, x: -70, y: 40, delay: 0.4, emoji: '🎈' },
            { id: 4, x: 65, y: 30, delay: 0.1, emoji: '⭐' },
          ].map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 10 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.3, 1.2, 1, 0],
                x: [0, item.x],
                y: [10, item.y],
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: item.delay, ease: 'easeOut' }}
              className="absolute text-xl"
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {status === 'eating' && (
        <div className="absolute bottom-8 pointer-events-none select-none" id="eating-crumb-container">
          {/* Mini crumbs jumping off */}
          {[
            { id: 1, x: -25, y: -15, c: '🧁' },
            { id: 2, x: 25, y: -20, c: '💖' },
            { id: 3, x: 0, y: -30, c: '✨' },
          ].map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.2, 0.8, 0],
                x: [0, item.x],
                y: [0, item.y],
              }}
              transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.15 }}
              className="absolute text-sm"
            >
              {item.c}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Pet vector graphics base container */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={getBodyAnimation()}
        className="w-full h-full drop-shadow-md select-none"
        id={`pet-svg-${type}`}
      >
        {/* SHADOW */}
        <ellipse
          cx="100"
          cy="180"
          rx="55"
          ry="10"
          fill="rgba(42, 33, 31, 0.08)"
          id="pet-ground-shadow"
        />

        {/* ========================================================
            TAIL RENDER
            ======================================================== */}
        <motion.g
          animate={getTailAnimation()}
          style={{ originX: '115px', originY: '150px' }}
        >
          {type === 'cat' && (
            <path
              d="M110 145 C130 145, 145 130, 140 100 C138 85, 150 75, 155 85 C160 95, 150 115, 135 155 C128 170, 110 155, 110 145 Z"
              fill={secondaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              id="cat-tail"
            />
          )}

          {type === 'dog' && (
            <path
              d="M112 145 C130 142, 145 132, 150 118 C153 110, 158 114, 156 122 C152 138, 130 156, 112 145 Z"
              fill={secondaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinecap="round"
              id="dog-tail"
            />
          )}

          {type === 'bunny' && (
            <circle
              cx="128"
              cy="148"
              r="14"
              fill={secondaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              id="bunny-tail"
            />
          )}
        </motion.g>

        {/* ========================================================
            BODY RENDER
            ======================================================== */}
        {/* Soft, plump, round torso common to cozy pastel style */}
        <path
          d="M60 160 C55 120, 70 110, 100 110 C130 110, 145 120, 140 160 C138 180, 62 180, 60 160 Z"
          fill={primaryColor}
          stroke={lineStroke}
          strokeWidth="4"
          strokeLinejoin="round"
          id="pet-body"
        />

        {/* Inner belly accent patch */}
        <ellipse
          cx="100"
          cy="144"
          rx="25"
          ry="18"
          fill="white"
          opacity="0.8"
          id="pet-belly"
        />

        {/* FEET / PAWS */}
        <rect
          x="70"
          y="166"
          width="16"
          height="12"
          rx="6"
          fill={secondaryColor}
          stroke={lineStroke}
          strokeWidth="4"
          id="left-foot"
        />
        <rect
          x="114"
          y="166"
          width="16"
          height="12"
          rx="6"
          fill={secondaryColor}
          stroke={lineStroke}
          strokeWidth="4"
          id="right-foot"
        />

        {/* ========================================================
            EARS RENDER (Animated per species)
            ======================================================== */}
        {/* Left Ear */}
        <motion.g
          animate={getEarAnimation('left')}
          style={{ originX: type === 'bunny' ? '75px' : '65px', originY: type === 'bunny' ? '70px' : '85px' }}
        >
          {type === 'cat' && (
            // Pointy triangular ear
            <path
              d="M50 82 L72 38 L88 74 Z"
              fill={primaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="cat-ear-left"
            >
              <path
                d="M56 79 L72 48 L82 74 Z"
                fill={insideEarColor}
              />
            </path>
          )}

          {type === 'dog' && (
            // Playful puppy floppy ear
            <path
              d="M50 78 C40 85, 30 110, 42 122 C52 132, 65 110, 63 90 Z"
              fill={secondaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="dog-ear-left"
            />
          )}

          {type === 'bunny' && (
            // Tall cozy rabbit ear
            <path
              d="M62 75 C55 45, 52 10, 68 10 C82 10, 80 45, 76 75 Z"
              fill={primaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="bunny-ear-left"
            />
          )}
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={getEarAnimation('right')}
          style={{ originX: type === 'bunny' ? '125px' : '135px', originY: type === 'bunny' ? '70px' : '85px' }}
        >
          {type === 'cat' && (
            <path
              d="M150 82 L128 38 L112 74 Z"
              fill={primaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="cat-ear-right"
            >
              <path
                d="M144 79 L128 48 L118 74 Z"
                fill={insideEarColor}
              />
            </path>
          )}

          {type === 'dog' && (
            <path
              d="M150 78 C160 85, 170 110, 158 122 C148 132, 135 110, 137 90 Z"
              fill={secondaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="dog-ear-right"
            />
          )}

          {type === 'bunny' && (
            <path
              d="M138 75 C145 45, 148 10, 132 10 C118 10, 120 45, 124 75 Z"
              fill={primaryColor}
              stroke={lineStroke}
              strokeWidth="4"
              strokeLinejoin="round"
              id="bunny-ear-right"
            />
          )}
        </motion.g>

        {/* Ear inner details (rendered on top of outlines for clean depth) */}
        {type === 'cat' && (
          <>
            <polygon points="56,76 72,48 81,75" fill={insideEarColor} id="cat-ear-inner-left" />
            <polygon points="144,76 128,48 119,75" fill={insideEarColor} id="cat-ear-inner-right" />
          </>
        )}
        {type === 'bunny' && (
          <>
            <path d="M66 70 C60 48, 58 18, 68 18 C76 18, 74 48, 72 70 Z" fill={insideEarColor} id="bunny-ear-inner-left" />
            <path d="M134 70 C140 48, 142 18, 132 18 C124 18, 126 48, 128 70 Z" fill={insideEarColor} id="bunny-ear-inner-right" />
          </>
        )}

        {/* ========================================================
            HEAD RENDER
            ======================================================== */}
        <circle
          cx="100"
          cy="92"
          r="48"
          fill={primaryColor}
          stroke={lineStroke}
          strokeWidth="4"
          id="pet-head"
        />

        {/* ========================================================
            FACE DETAILS RENDER (Eyes, Cheeks, Mouth, Whiskers)
            ======================================================== */}
        {/* Blush cheeks always on for ultra-cute look */}
        <circle cx="68" cy="100" r="8" fill={blushColor} id="left-cheek-blush" />
        <circle cx="132" cy="100" r="8" fill={blushColor} id="right-cheek-blush" />

        {/* Eyes (Change based on state) */}
        <g id="pet-eyes-group">
          {status === 'sleeping' ? (
            // Cute sleeping curved vectors (︶.︶)
            <>
              <path
                d="M60 92 Q68 98 76 92"
                stroke={lineStroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                id="eye-sleep-left"
              />
              <path
                d="M124 92 Q132 98 140 92"
                stroke={lineStroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                id="eye-sleep-right"
              />
            </>
          ) : status === 'playing' ? (
            // Sparkly happy eyes / caret eyes ( ^ . ^ )
            <>
              <path
                d="M58 95 L68 85 L78 95"
                stroke={lineStroke}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                id="eye-play-left"
              />
              <path
                d="M122 95 L132 85 L142 95"
                stroke={lineStroke}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                id="eye-play-right"
              />
            </>
          ) : (
            // Big round blinking eyes with glare circles
            <>
              {/* Left Eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ originX: '68px', originY: '90px' }}
              >
                <circle cx="68" cy="90" r="7" fill={lineStroke} id="eye-idle-left-base" />
                <circle cx="66" cy="87" r="2.5" fill="white" id="eye-idle-left-glare1" />
                <circle cx="70" cy="92" r="1" fill="white" id="eye-idle-left-glare2" />
              </motion.g>

              {/* Right Eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ originX: '132px', originY: '90px' }}
              >
                <circle cx="132" cy="90" r="7" fill={lineStroke} id="eye-idle-right-base" />
                <circle cx="130" cy="87" r="2.5" fill="white" id="eye-idle-right-glare1" />
                <circle cx="134" cy="92" r="1" fill="white" id="eye-idle-right-glare2" />
              </motion.g>
            </>
          )}
        </g>

        {/* Nose and Mouth */}
        <g id="pet-mouth-nose-group">
          {/* Nose */}
          {type === 'dog' ? (
            <path
              d="M94 92 H106 L100 97 Z"
              fill="#2E2528"
              stroke="#2E2528"
              strokeWidth="2"
              strokeLinejoin="round"
              id="dog-nose"
            />
          ) : (
            // Tiny triangular nose
            <polygon points="97,93 103,93 100,97" fill="#E8828E" id="pet-nose-small" />
          )}

          {/* Mouth (Transitions depending on Eating, sleeping, idle) */}
          {status === 'eating' ? (
            // Chewing cycle
            <motion.ellipse
              cx="100"
              cy="104"
              rx="6"
              ry={[2, 6, 2]}
              transition={{ duration: 0.3, repeat: Infinity }}
              fill="#D35160"
              stroke={lineStroke}
              strokeWidth="2.5"
              id="mouth-chewing"
            />
          ) : status === 'sleeping' ? (
            // Gentle open sleep sigh or closed smile line
            <path
              d="M96 101 Q100 105 104 101"
              stroke={lineStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              id="mouth-sleeping"
            />
          ) : (
            // Cute smiley w-mouth standard
            <path
              d="M93 100 Q100 104 100 99 Q100 104 107 100"
              stroke={lineStroke}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              id="mouth-smiley"
            />
          )}
        </g>

        {/* Whiskers / Facial Accents */}
        {type === 'cat' && (
          <g stroke={lineStroke} strokeWidth="2.5" strokeLinecap="round" id="cat-whiskers">
            <line x1="42" y1="100" x2="25" y2="98" />
            <line x1="42" y1="105" x2="22" y2="108" />
            <line x1="158" y1="100" x2="175" y2="98" />
            <line x1="158" y1="105" x2="178" y2="108" />
          </g>
        )}

        {type === 'bunny' && (
          <g stroke={lineStroke} strokeWidth="1.8" strokeLinecap="round" id="bunny-whiskers">
            <line x1="45" y1="102" x2="33" y2="102" />
            <line x1="155" y1="102" x2="167" y2="102" />
          </g>
        )}

        {type === 'dog' && status === 'playing' && (
          // Dog cartoon panting tongue
          <motion.path
            d="M97 101 C97 108, 103 108, 103 101 Z"
            fill="#FF8093"
            stroke={lineStroke}
            strokeWidth="2"
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ originY: '101px' }}
            id="dog-tongue"
          />
        )}
      </motion.svg>
    </div>
  );
}
