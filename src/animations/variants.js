// Gentle up-down float, used for laptop/phone/controller
export const floatVariant = {
  float: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Slow continuous rotation, used for the CD
export const spinVariant = {
  spin: {
    rotate: 360,
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
};

// Twinkling opacity pulse, used for background stars
export const twinkleVariant = {
  twinkle: (delay) => ({
    opacity: [0.2, 1, 0.2],
    transition: { duration: 2, repeat: Infinity, delay, ease: 'easeInOut' },
  }),
};

// Pop-in on mount, used for buttons/cards appearing
export const popIn = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

// Idle bounce loop, used for the Get Started button
export const idleBounce = {
  bounce: {
    y: [0, -6, 0],
    transition: { duration: 1.8, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' },
  },
};