import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/soundEffects';

export default function PixelButton({
  children,
  onClick,
  variant = 'yellow', // yellow, purple, dark, red, green
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  sound = 'click',
  icon = null,
  type = 'button',
}) {
  const handleClick = (e) => {
    if (disabled) return;
    if (sound) soundFx.play(sound);
    if (onClick) onClick(e);
  };

  const variantStyles = {
    yellow: 'bg-[#f3df23] hover:bg-[#ffe838] text-black border-black',
    purple: 'bg-[#7b5ea7] hover:bg-[#8e6fc0] text-white border-black',
    dark: 'bg-[#191742] hover:bg-[#25225c] text-white border-black',
    red: 'bg-[#ff5555] hover:bg-[#ff6e6e] text-white border-black',
    green: 'bg-[#50fa7b] hover:bg-[#69ff94] text-black border-black',
    pink: 'bg-[#f4c2c2] hover:bg-[#ffd1d1] text-black border-black',
    ghost: 'bg-transparent hover:bg-white/10 text-white border-transparent hover:border-white/30',
  };

  const sizeStyles = {
    sm: 'text-[10px] py-1.5 px-3 border-2 shadow-[2px_2px_0px_#000]',
    md: 'text-xs md:text-sm py-2.5 px-5 border-4 shadow-[4px_4px_0px_#000]',
    lg: 'text-sm md:text-base py-3.5 px-7 border-4 shadow-[6px_6px_0px_#000]',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.96, y: 2 }}
      className={`font-pixel rounded-none transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer select-none active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.yellow} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {icon && <span className="inline-block text-base leading-none">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
