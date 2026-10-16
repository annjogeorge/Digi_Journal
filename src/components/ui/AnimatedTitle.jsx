import { motion } from 'framer-motion';

export default function AnimatedTitle({ text, className = '' }) {
  const letters = Array.from(text);

  return (
    <h1
      className={`inline-flex flex-nowrap whitespace-nowrap justify-center items-center ${className}`}
      aria-label={text}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 320, damping: 20 }}
          className="inline-block flex-shrink-0"
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
}