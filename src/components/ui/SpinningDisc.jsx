import { motion } from 'framer-motion';
import { spinVariant } from '../../animations/variants';

export default function SpinningDisc({ src, alt, className = '' }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      variants={spinVariant}
      animate="spin"
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}