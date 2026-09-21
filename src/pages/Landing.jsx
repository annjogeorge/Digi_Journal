import AnimatedTitle from '../components/ui/AnimatedTitle';
import FloatingSprite from '../components/ui/FloatingSprite';
import SpinningDisc from '../components/ui/SpinningDisc';
import PixelStars from '../components/ui/PixelStars';
import GetStartedButton from '../components/ui/GetStartedButton';
import { IMAGES } from '../constants/assets';

export default function Landing({ onGetStarted }) {
  return (
    <section className="relative min-h-screen bg-dj-navy bg-grid overflow-hidden flex flex-col items-center justify-center text-white">
      <PixelStars />

      <FloatingSprite
        src={IMAGES.computer}
        alt="Retro computer"
        className="absolute top-10 left-10 w-24"
      />
      <FloatingSprite
        src={IMAGES.phone}
        alt="Retro phone"
        className="absolute top-14 right-10 w-16"
        delay={0.5}
      />
      <FloatingSprite
        src={IMAGES.controller}
        alt="Game controller"
        className="absolute bottom-16 left-14 w-20"
        delay={1}
      />
      <SpinningDisc
        src={IMAGES.cd}
        alt="Spinning CD"
        className="absolute top-24 right-24 w-16"
      />

      <p className="font-pixel text-xs tracking-widest mb-2 z-10">Introducing</p>
      <AnimatedTitle
        text="DigiJournal"
        className="font-pixel text-3xl md:text-5xl mb-8 z-10"
      />

      <div className="z-10">
        <GetStartedButton onClick={onGetStarted} />
      </div>
    </section>
  );
}