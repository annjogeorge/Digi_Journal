import React, { useState } from 'react';
import { useJournal } from '../../context/JournalContext';
import { soundFx } from '../../utils/soundEffects';
import RetroWindow from './RetroWindow';
import PixelButton from './PixelButton';
import { MessageSquare, Sparkles, Send, AlertCircle, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export const SUGGESTION_CATEGORIES = [
  'New Feature Idea',
  'UI or Design Feedback',
  'Bug Report',
  'Journaling Experience',
  'Performance or Technical Issue',
  'General Feedback',
];

export default function SuggestionModal({ isOpen, onClose }) {
  const { user, submitSuggestion } = useJournal();

  const [category, setCategory] = useState(SUGGESTION_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const charCount = message.length;
  const maxChars = 1000;
  const isTooLong = charCount > maxChars;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!message.trim()) {
      setErrorMessage('Please provide your suggestion text before submitting.');
      return;
    }

    if (isTooLong) {
      setErrorMessage('Suggestion message must be within 1,000 characters.');
      return;
    }

    setLoading(true);
    soundFx.play('click');

    try {
      await submitSuggestion(category, message, email.trim());
      setIsSuccess(true);
      setMessage('');
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to submit suggestion. Your message has been preserved.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <RetroWindow
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="DigiJournal // Suggestion Box"
      maxWidth="max-w-lg"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center text-center py-4 text-white">
          <div className="w-14 h-14 bg-[#50fa7b] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
            <CheckCircle2 size={30} className="text-black" />
          </div>

          <h3 className="font-pixel text-sm text-white mb-2">
            Feedback Transmitted!
          </h3>

          <p className="font-sans text-xs text-white/80 leading-relaxed mb-5 max-w-sm">
            Thank you for sharing your thoughts with the creator. Your suggestion has been saved to the database.
          </p>

          <div className="flex gap-2">
            <PixelButton
              variant="yellow"
              size="sm"
              onClick={() => {
                soundFx.play('blip');
                setIsSuccess(false);
              }}
            >
              Submit Another
            </PixelButton>

            <PixelButton
              variant="purple"
              size="sm"
              onClick={handleResetAndClose}
            >
              Close Box
            </PixelButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs text-white">
          <div className="bg-[#131135] border border-black/80 p-3 text-white/80 leading-relaxed flex items-start gap-2.5">
            <Sparkles size={16} className="text-[#f3df23] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Help Shape DigiJournal:</span> Have an idea for new retro stationery, daily quests, or UI improvements? Send your suggestion directly to the creator!
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-950/80 border-2 border-red-500/80 p-2.5 flex items-start gap-2 text-xs text-red-200">
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label htmlFor="suggestion-category" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
              Feedback Category
            </label>
            <select
              id="suggestion-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black/60 border-2 border-black px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-[#f3df23]"
            >
              {SUGGESTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1b1847] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="suggestion-message" className="font-pixel text-[10px] text-[#f3df23] uppercase">
                Your Suggestion
              </label>
              <span
                className={`font-pixel text-[9px] ${
                  isTooLong
                    ? 'text-red-400 font-bold'
                    : charCount > 850
                    ? 'text-amber-300'
                    : 'text-white/50'
                }`}
              >
                {charCount} / {maxChars}
              </span>
            </div>
            <textarea
              id="suggestion-message"
              rows={5}
              required
              maxLength={maxChars}
              placeholder="Describe your suggestion in detail: what feature, improvement, or bug fix would make DigiJournal better for you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/60 border-2 border-black p-3 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#f3df23] resize-none leading-relaxed"
            />
          </div>

          {/* Optional Follow-up Email */}
          <div>
            <label htmlFor="suggestion-email" className="block font-pixel text-[10px] text-white/70 uppercase mb-1">
              Contact Email (Optional)
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-2.5 top-2.5 text-white/40" />
              <input
                id="suggestion-email"
                type="email"
                placeholder="you@example.com (only if you wish to receive a reply)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border-2 border-black pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#f3df23]"
              />
            </div>
          </div>

          {/* Privacy Note & Disclaimer */}
          <div className="bg-[#141238] border border-black/60 p-2.5 text-[11px] text-white/70 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/90 font-medium">
              <ShieldCheck size={13} className="text-[#50fa7b]" />
              Privacy Assurance
            </div>
            <p className="leading-snug">
              Suggestions are stored solely for review by the application owner. Your private diary entries, quests, and letters are <strong className="text-white">never</strong> attached to submissions. Submitting does not guarantee implementation or personal correspondence.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/40">
            <button
              type="button"
              onClick={handleResetAndClose}
              disabled={loading}
              className="px-3 py-1.5 font-sans text-xs text-white/70 hover:text-white border border-transparent hover:border-black/50"
            >
              Cancel
            </button>

            <PixelButton
              type="submit"
              variant="yellow"
              size="sm"
              disabled={loading || !message.trim() || isTooLong}
              icon={<Send size={13} />}
            >
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </PixelButton>
          </div>
        </form>
      )}
    </RetroWindow>
  );
}
