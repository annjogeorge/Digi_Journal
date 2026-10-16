import React from 'react';

export default function PixelCard({
  children,
  title = '',
  icon = null,
  headerAction = null,
  className = '',
  variant = 'default', // default, yellow, purple, dark
}) {
  const variantStyles = {
    default: 'bg-[#1e1c50]/90 border-black text-white',
    yellow: 'bg-[#f3df23] border-black text-black',
    purple: 'bg-[#3b3378]/90 border-black text-white',
    dark: 'bg-[#151336]/95 border-black text-white',
  };

  return (
    <div
      className={`border-4 shadow-[5px_5px_0px_#000000] p-4 sm:p-5 relative ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-current/20">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            {title && <h3 className="font-pixel text-xs sm:text-sm tracking-wide">{title}</h3>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
