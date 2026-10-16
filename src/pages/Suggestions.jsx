import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import PixelButton from '../components/ui/PixelButton';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { supabase } from '../services/supabase';
import {
  MessageSquare,
  Sparkles,
  Send,
  AlertCircle,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Inbox,
  Filter,
  Clock,
  Tag,
  HelpCircle,
} from 'lucide-react';

const SUGGESTION_CATEGORIES = [
  'New Feature Idea',
  'UI or Design Feedback',
  'Bug Report',
  'Journaling Experience',
  'Performance or Technical Issue',
  'General Feedback',
];

export default function Suggestions() {
  const { user, submitSuggestion } = useJournal();

  const [category, setCategory] = useState(SUGGESTION_CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Tab: 'submit' or 'my_history'
  const [activeTab, setActiveTab] = useState('submit');
  const [mySuggestions, setMySuggestions] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const charCount = message.length;
  const maxChars = 1000;
  const isTooLong = charCount > maxChars;

  // Fetch user's own suggestions when switching to history tab
  useEffect(() => {
    if (activeTab === 'my_history' && user && supabase) {
      setFetchingHistory(true);
      supabase
        .from('user_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setMySuggestions(data);
          }
          setFetchingHistory(false);
        });
    }
  }, [activeTab, user]);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planned':
        return 'bg-[#8be9fd] text-black border-cyan-400';
      case 'reviewing':
        return 'bg-[#f3df23] text-black border-yellow-400';
      case 'implemented':
        return 'bg-[#50fa7b] text-black border-emerald-400';
      case 'declined':
        return 'bg-stone-500 text-white border-stone-600';
      default:
        return 'bg-[#bd93f9] text-black border-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        {/* Page Header */}
        <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
              CREATOR FEEDBACK DESK
            </span>
            <MessageSquare size={14} className="text-[#f3df23]" />
          </div>
          <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
            Suggestion Box
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-sans mt-0.5">
            Share ideas, feature requests, or bug reports to help guide future DigiJournal updates.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-black/30">
            <button
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setActiveTab('submit');
              }}
              className={`font-pixel text-[10px] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer ${
                activeTab === 'submit' ? 'bg-[#f3df23] text-black font-bold' : 'bg-[#131135] text-white/80'
              }`}
            >
              Leave a Suggestion
            </button>

            {user && (
              <button
                type="button"
                onClick={() => {
                  soundFx.play('blip');
                  setActiveTab('my_history');
                }}
                className={`font-pixel text-[10px] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5 cursor-pointer ${
                  activeTab === 'my_history' ? 'bg-[#f3df23] text-black font-bold' : 'bg-[#131135] text-white/80'
                }`}
              >
                My Submissions
              </button>
            )}
          </div>
        </div>

        {activeTab === 'submit' ? (
          /* Suggestion Form Panel */
          <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5 sm:p-6">
            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 bg-[#50fa7b] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                  <CheckCircle2 size={30} className="text-black" />
                </div>

                <h2 className="font-pixel text-base text-white mb-2">
                  Feedback Successfully Received!
                </h2>

                <p className="font-sans text-xs text-white/80 leading-relaxed mb-6 max-w-md">
                  Thank you for contributing to DigiJournal. Your idea has been permanently logged in Supabase for review by the creator.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <PixelButton
                    variant="yellow"
                    size="sm"
                    onClick={() => {
                      soundFx.play('click');
                      setIsSuccess(false);
                    }}
                  >
                    Send Another Note
                  </PixelButton>

                  <Link to="/dashboard">
                    <PixelButton variant="purple" size="sm">
                      Back to Dashboard
                    </PixelButton>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 font-sans text-xs">
                {/* Intro guidance note */}
                <div className="bg-[#131135] border border-black p-3.5 text-white/80 flex items-start gap-3">
                  <Sparkles size={16} className="text-[#f3df23] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-white">A personal note to the creator:</strong> Whether it is a nostalgic Y2K sticker style, a daily quest category, or a cozy soundtrack feature, your constructive thoughts are deeply appreciated!
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-950/80 border-2 border-red-500/80 p-3 flex items-start gap-2.5 text-xs text-red-200">
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Category Dropdown */}
                <div>
                  <label htmlFor="page-suggestion-category" className="block font-pixel text-[10px] text-[#f3df23] uppercase mb-1.5">
                    Feedback Category:
                  </label>
                  <select
                    id="page-suggestion-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/60 border-2 border-black px-3.5 py-2 text-xs text-white font-sans focus:outline-none focus:border-[#f3df23]"
                  >
                    {SUGGESTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1b1847] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multiline Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="page-suggestion-message" className="font-pixel text-[10px] text-[#f3df23] uppercase">
                      Your Suggestion:
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
                      {charCount} / {maxChars} characters
                    </span>
                  </div>
                  <textarea
                    id="page-suggestion-message"
                    rows={6}
                    required
                    maxLength={maxChars}
                    placeholder="Be specific! E.g. 'I'd love to see a retro pixel cat pet widget on the journal page that falls asleep when I haven't written in a while...'"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black/60 border-2 border-black p-3.5 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#f3df23] resize-none leading-relaxed"
                  />
                </div>

                {/* Follow-up Email */}
                <div>
                  <label htmlFor="page-suggestion-email" className="block font-pixel text-[10px] text-white/80 uppercase mb-1.5">
                    Follow-up Email (Optional):
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-2.5 text-white/40" />
                    <input
                      id="page-suggestion-email"
                      type="email"
                      placeholder="you@example.com (only if you would like a reply)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border-2 border-black pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#f3df23]"
                    />
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">
                    If provided, we may reach out for clarification on your suggestion.
                  </p>
                </div>

                {/* Privacy & Disclaimer Notice */}
                <div className="bg-[#141238] border border-black/80 p-3 text-[11px] text-white/70 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-white font-semibold">
                    <ShieldCheck size={14} className="text-[#50fa7b]" />
                    Privacy & Processing Notice
                  </div>
                  <p className="leading-relaxed">
                    This suggestion is stored in Supabase so the application owner can review it. Your private journal reflections, tasks, and future letters are <strong className="text-white">never</strong> attached. Submitting does not guarantee feature implementation or a personal response.
                  </p>
                </div>

                {/* Submit action */}
                <div className="pt-2 flex justify-end gap-3">
                  <Link to="/dashboard">
                    <button
                      type="button"
                      className="px-4 py-2 font-sans text-xs text-white/70 hover:text-white border border-transparent hover:border-black/50"
                    >
                      Cancel
                    </button>
                  </Link>

                  <PixelButton
                    type="submit"
                    variant="yellow"
                    size="md"
                    disabled={loading || !message.trim() || isTooLong}
                    icon={<Send size={14} />}
                  >
                    {loading ? 'Submitting...' : 'Submit Suggestion'}
                  </PixelButton>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* User's Submission History Tab */
          <div className="bg-[#1e1b4b] border-2 border-black shadow-[3px_3px_0px_#000] p-5 sm:p-6">
            <h2 className="font-pixel text-xs text-white mb-3 flex items-center gap-2">
              <Inbox size={15} className="text-[#f3df23]" />
              Your Previous Feedback Submissions
            </h2>

            {fetchingHistory ? (
              <div className="py-8 text-center text-xs text-white/60 font-pixel animate-pulse">
                Loading submissions...
              </div>
            ) : mySuggestions.length === 0 ? (
              <div className="py-8 text-center text-white/60 font-sans text-xs">
                You haven't submitted any suggestions from this account yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {mySuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#131135] border border-black p-3.5 flex flex-col gap-2 font-sans text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-pixel text-[10px] text-[#8be9fd] flex items-center gap-1">
                        <Tag size={11} /> {item.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50 flex items-center gap-1">
                          <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span
                          className={`font-pixel text-[9px] px-2 py-0.5 border uppercase ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/85 leading-relaxed bg-black/30 p-2.5 border border-black/40">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Simple Unobtrusive Footer with Suggestion Box Link */}
      <footer className="w-full py-4 text-center border-t border-black/40 bg-[#16133b] text-white/60 font-sans text-xs z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>DigiJournal &copy; {new Date().getFullYear()} • Retro Digital Diary</span>
          <div className="flex items-center gap-4">
            <Link
              to="/suggestions"
              onClick={() => soundFx.play('blip')}
              className="text-[#f3df23] hover:underline flex items-center gap-1 font-pixel text-[10px]"
            >
              <MessageSquare size={12} /> Suggestion Box
            </Link>
            <Link
              to="/settings"
              onClick={() => soundFx.play('blip')}
              className="text-white/70 hover:text-white hover:underline text-[11px]"
            >
              Settings & Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
