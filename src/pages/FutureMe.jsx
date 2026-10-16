import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import PixelButton from '../components/ui/PixelButton';
import RetroWindow from '../components/ui/RetroWindow';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AuthPromptModal from '../components/ui/AuthPromptModal';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { Mail, Lock, Unlock, Plus, Trash2, Calendar, Clock, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function FutureMe() {
  const { user, letters, saveLetter, openLetter, deleteLetter } = useJournal();
  const [filter, setFilter] = useState('all'); // all, locked, ready, opened
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [readingLetter, setReadingLetter] = useState(null);
  const [lockedNotice, setLockedNotice] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('write and seal letters to future self');

  // Form states
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('Future Me');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('grateful');
  const [unlockDate, setUnlockDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [envelopeStyle, setEnvelopeStyle] = useState('classic');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    saveLetter({
      title: title.trim(),
      recipient: recipient.trim() || 'Future Me',
      body,
      mood,
      unlockDate,
      envelopeStyle,
    });

    setIsComposeOpen(false);
    setTitle('');
    setBody('');
  };

  const handleLetterClick = (letter) => {
    const isReady = letter.unlockDate <= todayStr;
    if (letter.isOpened || isReady) {
      if (!letter.isOpened) {
        openLetter(letter.id);
      } else {
        soundFx.play('page');
      }
      setReadingLetter(letter);
    } else {
      soundFx.play('click');
      setLockedNotice(letter);
    }
  };

  const filteredLetters = letters.filter((l) => {
    const isReady = l.unlockDate <= todayStr && !l.isOpened;
    const isLocked = l.unlockDate > todayStr && !l.isOpened;

    if (filter === 'locked') return isLocked;
    if (filter === 'ready') return isReady;
    if (filter === 'opened') return l.isOpened;
    return true;
  });

  const getEnvelopeTheme = (style) => {
    switch (style) {
      case 'lavender':
        return 'bg-[#7b5ea7] border-black text-white';
      case 'gold':
        return 'bg-[#f3df23] border-black text-black';
      case 'pink':
        return 'bg-[#f4c2c2] border-black text-black';
      case 'classic':
      default:
        return 'bg-[#eedbb4] border-black text-black';
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        
        {/* Header banner */}
        <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
                DIGITAL TIME CAPSULE
              </span>
              <Mail size={14} className="text-[#f3df23]" />
            </div>
            <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
              Future Me — Sealed Letters
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-sans mt-0.5">
              Write letters to your future self. They stay locked tight until their arrival date.
            </p>
          </div>

          <PixelButton
            variant="yellow"
            icon={<Plus size={15} />}
            onClick={() => {
              if (!user) {
                setAuthPromptAction('write and seal letters to your future self');
                setIsAuthModalOpen(true);
                return;
              }
              soundFx.play('click');
              setIsComposeOpen(true);
            }}
          >
            Seal New Letter
          </PixelButton>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
          {['all', 'locked', 'ready', 'opened'].map((f) => {
            const count = letters.filter((l) => {
              const isReady = l.unlockDate <= todayStr && !l.isOpened;
              const isLocked = l.unlockDate > todayStr && !l.isOpened;
              if (f === 'locked') return isLocked;
              if (f === 'ready') return isReady;
              if (f === 'opened') return l.isOpened;
              return true;
            }).length;

            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setFilter(f);
                }}
                className={`px-3 py-1.5 border-2 border-black capitalize cursor-pointer shadow-[2px_2px_0px_#000] font-medium transition-all ${
                  filter === f
                    ? 'bg-[#f3df23] text-black font-semibold -translate-y-0.5'
                    : 'bg-[#181646] text-white/70 hover:text-white'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* Letters Grid */}
        {filteredLetters.length === 0 ? (
          <div className="bg-[#181646] border-2 border-black shadow-[3px_3px_0px_#000] p-8 text-center">
            <div className="font-pixel text-xs text-[#f3df23] mb-2">NO LETTERS IN THIS MAILBOX</div>
            <p className="text-xs text-white/70 font-sans mb-4">
              Write your first capsule letter to send words of encouragement to your future self.
            </p>
            <PixelButton
              size="sm"
              variant="yellow"
              onClick={() => setIsComposeOpen(true)}
            >
              + Write a Letter Now
            </PixelButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLetters.map((letter) => {
              const isReady = letter.unlockDate <= todayStr && !letter.isOpened;
              const isLocked = letter.unlockDate > todayStr && !letter.isOpened;

              const diffTime = new Date(letter.unlockDate) - new Date(todayStr);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <motion.div
                  key={letter.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLetterClick(letter)}
                  className={`border-3 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between min-h-[210px] cursor-pointer relative overflow-hidden transition-all rounded-xs ${getEnvelopeTheme(
                    letter.envelopeStyle
                  )}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-3 border-b-2 border-black/25 bg-black/5" />

                  <div>
                    <div className="flex items-center justify-between mt-2 mb-3">
                      <span className="font-sans text-[11px] font-semibold uppercase px-2 py-0.5 border border-black/40 bg-black/10">
                        To: {letter.recipient}
                      </span>

                      {letter.isOpened ? (
                        <span className="flex items-center gap-1 font-sans text-xs text-emerald-900 font-bold">
                          <Unlock size={12} /> Opened
                        </span>
                      ) : isReady ? (
                        <span className="flex items-center gap-1 font-sans text-xs text-black font-bold bg-[#50fa7b] px-2 py-0.5 border border-black animate-bounce">
                          <Sparkles size={12} /> READY
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-sans text-xs text-black/75 font-medium">
                          <Lock size={12} /> Sealed
                        </span>
                      )}
                    </div>

                    <h3 className="font-pixel text-xs sm:text-sm font-bold tracking-wide mb-2 line-clamp-2">
                      {letter.title}
                    </h3>

                    {letter.isOpened ? (
                      <p className="font-sans text-xs text-black/80 line-clamp-3 leading-relaxed">
                        "{letter.body}"
                      </p>
                    ) : (
                      <div className="bg-black/10 border border-black/20 p-2 my-2 text-center rounded-xs">
                        <div className="font-sans text-xs text-black/80 flex items-center justify-center gap-1.5 font-medium">
                          <Clock size={12} />
                          {isReady ? 'Ready to open now!' : `Unlocks in ${diffDays} days`}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-black/20 flex items-center justify-between font-sans text-xs text-black/70">
                    <span>Unlock: {letter.unlockDate}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(letter.id);
                      }}
                      className="text-black/50 hover:text-red-700 transition-colors cursor-pointer p-1"
                      title="Delete letter"
                      aria-label="Delete letter"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Compose Letter Modal */}
        <RetroWindow
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          title="Compose Letter to Future Me"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleComposeSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                Letter Title:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A Note of Encouragement for Tomorrow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-black/60 px-3 py-2 text-sm text-white focus:outline-none rounded-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-pixel text-[10px] text-white/80 uppercase mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-black/40 border border-black/60 px-3 py-1.5 text-xs text-white focus:outline-none font-sans rounded-xs"
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-white/80 uppercase mb-1">
                  Unlock Date:
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full bg-black/40 border border-black/60 px-3 py-1.5 text-xs text-white focus:outline-none font-sans rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-white/80 uppercase mb-1">
                Envelope Style:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'classic', label: 'Classic' },
                  { id: 'lavender', label: 'Lavender' },
                  { id: 'gold', label: 'Gold' },
                  { id: 'pink', label: 'Pastel' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      soundFx.play('blip');
                      setEnvelopeStyle(st.id);
                    }}
                    className={`font-sans text-xs p-2 border-2 text-center cursor-pointer font-medium ${
                      envelopeStyle === st.id
                        ? 'bg-[#f3df23] text-black border-black font-bold shadow-[2px_2px_0px_#000]'
                        : 'bg-[#181646] text-white border-black/60'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1">
                Letter Content:
              </label>
              <textarea
                required
                rows={7}
                placeholder="Write whatever you want your future self to remember. Your current dreams, hopes, thoughts, secrets..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-[#fdfbf7] border-2 border-black text-black font-sans text-sm p-3.5 resize-none focus:outline-none leading-relaxed rounded-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <PixelButton
                variant="dark"
                size="sm"
                onClick={() => setIsComposeOpen(false)}
              >
                Cancel
              </PixelButton>
              <PixelButton
                type="submit"
                variant="yellow"
                size="sm"
                icon={<Send size={14} />}
              >
                Seal & Store In Capsule
              </PixelButton>
            </div>
          </form>
        </RetroWindow>

        {/* Locked Notice Dialog */}
        <ConfirmDialog
          isOpen={Boolean(lockedNotice)}
          title="Letter Locked"
          message={`This letter is sealed in a time-capsule until ${lockedNotice?.unlockDate}. No peeking allowed until the unlock date!`}
          confirmLabel="Understood"
          isDestructive={false}
          onConfirm={() => setLockedNotice(null)}
          onCancel={() => setLockedNotice(null)}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deleteTargetId)}
          title="Delete Future Letter"
          message="Are you sure you want to permanently delete this letter to your future self?"
          confirmLabel="Delete Letter"
          onConfirm={() => {
            if (deleteTargetId) {
              deleteLetter(deleteTargetId);
              setDeleteTargetId(null);
            }
          }}
          onCancel={() => setDeleteTargetId(null)}
        />

        {/* Read Opened Letter Modal */}
        <RetroWindow
          isOpen={!!readingLetter}
          onClose={() => setReadingLetter(null)}
          title={`Letter from the Past: ${readingLetter?.title || ''}`}
          maxWidth="max-w-2xl"
        >
          {readingLetter && (
            <motion.div
              initial={{ scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#fef9eb] border-3 border-[#524436] p-6 text-black flex flex-col justify-between min-h-[340px] shadow-[4px_4px_0px_#000] rounded-xs"
            >
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-300 font-sans text-xs text-stone-600 mb-4">
                  <span>To: <strong className="text-black">{readingLetter.recipient}</strong></span>
                  <span>Written: {readingLetter.createdAt?.split('T')[0]}</span>
                </div>

                <h2 className="font-pixel text-sm sm:text-base text-black mb-3">
                  {readingLetter.title}
                </h2>

                <p className="font-sans text-sm sm:text-base leading-relaxed text-[#2a241f] whitespace-pre-line">
                  {readingLetter.body}
                </p>
              </div>

              <div className="pt-3 mt-6 border-t border-stone-300 flex justify-between items-center font-sans text-xs text-stone-600">
                <span>Unsealed: {todayStr}</span>
                <PixelButton
                  size="sm"
                  variant="yellow"
                  onClick={() => setReadingLetter(null)}
                >
                  Close Letter
                </PixelButton>
              </div>
            </motion.div>
          )}
        </RetroWindow>

        {/* Authentication Prompt Modal for protected actions */}
        <AuthPromptModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          actionName={authPromptAction}
        />
      </main>
    </div>
  );
}
