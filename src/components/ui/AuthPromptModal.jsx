import React from 'react';
import { useNavigate } from 'react-router-dom';
import RetroWindow from './RetroWindow';
import PixelButton from './PixelButton';
import { soundFx } from '../../utils/soundEffects';
import { ShieldAlert, UserPlus, LogIn, Sparkles, BookOpen } from 'lucide-react';

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = 'Sign In to Save Your Journey',
  actionName = 'save your personal reflections',
  redirectPath = '/journal',
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToSignup = () => {
    soundFx.play('click');
    onClose();
    navigate('/signup', { state: { redirectTo: redirectPath } });
  };

  const handleGoToLogin = () => {
    soundFx.play('click');
    onClose();
    navigate('/login', { state: { redirectTo: redirectPath } });
  };

  return (
    <RetroWindow
      isOpen={isOpen}
      onClose={onClose}
      title="DIGIJOURNAL // ACCOUNT REQUIRED"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 text-white text-center py-2 select-none">
        {/* Animated Badge Icon */}
        <div className="w-14 h-14 bg-[#1b1847] border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
          <ShieldAlert size={28} className="text-[#f3df23]" />
        </div>

        <div>
          <h2 className="font-pixel text-sm sm:text-base text-white mb-1.5">
            {title}
          </h2>
          <p className="font-sans text-xs text-white/80 leading-relaxed max-w-sm mx-auto">
            An account is required to {actionName}. Your entries, quests, and letters are stored in your own private cloud database secured by PostgreSQL Row Level Security.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-[#121035] border border-black/80 p-3 text-left font-sans text-xs text-white/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Sparkles size={14} className="text-[#50fa7b]" />
            What you unlock with a free account:
          </div>
          <div className="text-[11px] text-white/70 space-y-1 pl-5 list-disc">
            <div>• Private, encrypted diary entries only you can access</div>
            <div>• Daily task checklist & gamified level progress</div>
            <div>• Time-capsule letters to Future You</div>
            <div>• Synchronization across all your devices</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <PixelButton
            variant="yellow"
            size="md"
            icon={<UserPlus size={15} />}
            onClick={handleGoToSignup}
            className="w-full justify-center"
          >
            Create Free Account
          </PixelButton>

          <PixelButton
            variant="purple"
            size="sm"
            icon={<LogIn size={14} />}
            onClick={handleGoToLogin}
            className="w-full justify-center"
          >
            Already have an account? Log In
          </PixelButton>

          <button
            type="button"
            onClick={() => {
              soundFx.play('blip');
              onClose();
            }}
            className="text-xs font-sans text-white/60 hover:text-white underline pt-1 cursor-pointer"
          >
            Continue in Read-Only Preview Mode
          </button>
        </div>
      </div>
    </RetroWindow>
  );
}
