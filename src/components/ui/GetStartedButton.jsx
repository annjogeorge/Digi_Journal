import { motion } from 'framer-motion';
import { IMAGES } from '../../constants/assets';
import { idleBounce } from '../../animations/variants';
import { useSound } from '../../hooks/useSound';

export default function GetStartedButton({ onClick }) {
  const playClick = useSound('/sounds/click.wav');

  const handleClick = () => {
    playClick();
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      variants={idleBounce}
      animate="bounce"
      whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 8px #f4d35e)' }}
      whileTap={{ scale: 0.95 }}
      className="focus:outline-none"
    >
      <img
        src={IMAGES.getStartedBtn}
        alt="Get Started"
        draggable={false}
        className="w-56 sm:w-64 md:w-80 max-w-full h-auto drop-shadow-md select-none pointer-events-none"
      />
    </motion.button>
  );
}