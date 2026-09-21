import { motion } from 'framer-motion';
import { floatVariant } from '../../animations/variants';

export default function FloatingSprite({ src, alt, className = '', delay = 0 }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      variants={floatVariant}
      animate="float"
      transition={{ delay }}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}