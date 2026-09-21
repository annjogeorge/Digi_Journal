import { motion } from 'framer-motion';
import { twinkleVariant } from '../../animations/variants';

// Generates a fixed set of star positions once, so they don't reshuffle on re-render
const STAR_COUNT = 25;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 3 + 2, // 2px–5px
  delay: Math.random() * 2,
}));

export default function PixelStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          custom={star.delay}
          variants={twinkleVariant}
          animate="twinkle"
          className="absolute bg-white rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </div>
  );
}