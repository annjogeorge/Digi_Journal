import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundFx } from '../utils/soundEffects';
import {
  supabase,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
} from '../services/supabase';
import { useToast } from './ToastContext';

const JournalContext = createContext();

const STORAGE_KEYS = {
  ENTRIES: 'dj_journal_entries',
  TODOS: 'dj_todos',
  LETTERS: 'dj_future_letters',
  XP: 'dj_user_xp',
  ACHIEVEMENTS: 'dj_achievements',
  PROFILE: 'dj_profile',
  TUTORIAL_COMPLETED: 'dj_tutorial_completed',
};

// Documented XP Rules:
// - Create new journal entry: +25 XP
// - Complete a quest: +15 XP
// - Add a quest: +5 XP
// - Seal a letter to future self: +30 XP
// - Open an unlocked capsule: +50 XP
// - Unlocking an achievement: +Achievement XP reward
export const ACHIEVEMENTS_LIST = [
  { id: 'first_entry', title: 'First Entry', desc: 'Saved your very first journal entry', iconName: 'BookOpen', xp: 50 },
  { id: 'seven_streak', title: '7-Day Streak', desc: 'Maintained a 7-day journaling streak', iconName: 'Flame', xp: 150 },
  { id: 'thirty_streak', title: '30-Day Streak', desc: 'Maintained a 30-day journaling streak', iconName: 'Award', xp: 500 },
  { id: 'task_master', title: 'Task Master', desc: 'Completed 5 to-do tasks', iconName: 'CheckSquare', xp: 100 },
  { id: 'future_letter', title: 'First Future Letter', desc: 'Sealed a letter for Future Me', iconName: 'Mail', xp: 75 },
  { id: 'ten_entries', title: 'Memory Keeper', desc: 'Logged 10 journal entries', iconName: 'Star', xp: 200 },
  { id: 'mood_explorer', title: 'Emotion Explorer', desc: 'Logged at least 3 distinct moods', iconName: 'Heart', xp: 60 },
];

export function JournalProvider({ children }) {
  const { showToast } = useToast();

  // 1. Supabase Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);

  // 2. Journal entries (genuine default is empty array for clean zero-state)
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Todos
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Future Letters
  const [letters, setLetters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LETTERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. XP and Level
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.XP);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // 6. Unlocked achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. User Profile / Settings
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : { name: 'Annjo', soundEnabled: true, volume: 0.5 };
    } catch {
      return { name: 'Annjo', soundEnabled: true, volume: 0.5 };
    }
  });

  // 8. Onboarding Tutorial State
  const [tutorialCompleted, setTutorialCompleted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED) === 'true';
    } catch {
      return false;
    }
  });
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Auto-launch tutorial on initial load if not previously finished
  useEffect(() => {
    if (!tutorialCompleted) {
      const timer = setTimeout(() => {
        setIsTutorialOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [tutorialCompleted]);

  // Fetch data from Supabase for logged-in user
  const fetchSupabaseData = useCallback(async (userId) => {
    if (!supabase) return;
    try {
      // 1. Fetch entries
      const { data: remoteEntries, error: eErr } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });

      if (!eErr && remoteEntries) {
        const formatted = remoteEntries.map((e) => ({
          id: e.id,
          date: e.entry_date,
          title: e.title,
          content: e.content,
          mood: e.mood,
          tags: e.tags || [],
          isFavorite: e.is_favorite,
          wordCount: e.word_count,
          handwritingStyle: e.handwriting_style || 'cozy',
          stickers: Array.isArray(e.stickers) ? e.stickers : [],
          pageType: e.page_type || 'entry',
          subtitle: e.subtitle || '',
          createdAt: e.created_at,
        }));
        setEntries(formatted);
      }

      // 2. Fetch todos
      const { data: remoteTodos, error: tErr } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!tErr && remoteTodos) {
        setTodos(remoteTodos.map((t) => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          priority: t.priority,
          category: t.category,
          dueDate: t.due_date,
          completedAt: t.completed_at,
          createdAt: t.created_at,
        })));
      }

      // 3. Fetch future letters
      const { data: remoteLetters, error: lErr } = await supabase
        .from('future_letters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!lErr && remoteLetters) {
        setLetters(remoteLetters.map((l) => ({
          id: l.id,
          title: l.title,
          recipient: l.recipient,
          body: l.body,
          mood: l.mood,
          envelopeStyle: l.envelope_style,
          unlockDate: l.unlock_date,
          isOpened: l.is_opened,
          openedAt: l.opened_at,
          createdAt: l.created_at,
        })));
      }

      // 4. Fetch profile (or initialize safe profile for first-time user)
      const currentUserObj = userObj || user;
      const fallbackName =
        currentUserObj?.user_metadata?.name ||
        currentUserObj?.user_metadata?.full_name ||
        currentUserObj?.email?.split('@')[0] ||
        'Adventurer';

      const { data: remoteProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (remoteProfile) {
        if (remoteProfile.name && remoteProfile.name !== 'Guest') {
          setProfile((p) => ({ ...p, name: remoteProfile.name }));
        } else {
          setProfile((p) => ({ ...p, name: fallbackName }));
          supabase.from('profiles').update({ name: fallbackName }).eq('id', userId).then();
        }
        if (remoteProfile.xp !== undefined) setXp(remoteProfile.xp);
        if (remoteProfile.unlocked_achievements) setUnlockedAchievements(remoteProfile.unlocked_achievements);
      } else {
        // Safe profile creation for new user
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: fallbackName,
            xp: 0,
            unlocked_achievements: [],
            sound_enabled: true,
            volume: 0.5,
            tutorial_completed: false,
          })
          .then();
        setProfile((p) => ({ ...p, name: fallbackName }));
      }
    } catch {
      // Offline fallback / profile table missing: guarantee name is never left as 'Guest'
      const currentUserObj = userObj || user;
      const fallbackName =
        currentUserObj?.user_metadata?.name ||
        currentUserObj?.user_metadata?.full_name ||
        currentUserObj?.email?.split('@')[0] ||
        'Adventurer';
      setProfile((p) => ({ ...p, name: fallbackName }));
    }
  }, [user]);

  // Completely wipe in-memory state and cached storage to prevent data leaks across accounts
  const clearUserData = useCallback(() => {
    setEntries([]);
    setTodos([]);
    setLetters([]);
    setXp(0);
    setUnlockedAchievements([]);
    setProfile({ name: 'Guest', soundEnabled: true, volume: 0.5 });
    try {
      localStorage.removeItem(STORAGE_KEYS.ENTRIES);
      localStorage.removeItem(STORAGE_KEYS.TODOS);
      localStorage.removeItem(STORAGE_KEYS.LETTERS);
      localStorage.removeItem(STORAGE_KEYS.XP);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {
      // storage unavailable or blocked
    }
  }, []);

  // Auth session initialization
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const initialUser = session?.user ?? null;
      setUser(initialUser);
      setAuthLoading(false);
      if (initialUser) {
        const initialName =
          initialUser.user_metadata?.name ||
          initialUser.user_metadata?.full_name ||
          initialUser.email?.split('@')[0] ||
          'Adventurer';
        setProfile((p) => ({ ...p, name: initialName }));
        fetchSupabaseData(initialUser.id, initialUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_OUT' || !currentUser) {
        clearUserData();
      } else if (currentUser) {
        // If switched to a new user account, clear previous data first then load remote records
        clearUserData();
        const initialName =
          currentUser.user_metadata?.name ||
          currentUser.user_metadata?.full_name ||
          currentUser.email?.split('@')[0] ||
          'Adventurer';
        setProfile((p) => ({ ...p, name: initialName }));
        await fetchSupabaseData(currentUser.id, currentUser);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchSupabaseData, clearUserData]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.XP, xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // Gamification: Level calculation (Each level is 100 XP)
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpNeeded = 100;

  // Award XP helper
  const addXp = (amount, reason = '') => {
    setXp((prev) => {
      const nextXp = prev + amount;
      if (user && supabase) {
        supabase.from('profiles').upsert({ id: user.id, xp: nextXp }).then();
      }
      return nextXp;
    });

    if (reason) {
      showToast(`+${amount} XP: ${reason}`, 'success');
    }
  };

  // Check achievements against current stats
  const checkAchievements = (newEntries = entries, newTodos = todos, newLetters = letters) => {
    const toUnlock = [];

    if (newEntries.length >= 1 && !unlockedAchievements.includes('first_entry')) {
      toUnlock.push('first_entry');
    }
    if (newEntries.length >= 10 && !unlockedAchievements.includes('ten_entries')) {
      toUnlock.push('ten_entries');
    }

    const completedTodosCount = newTodos.filter((t) => t.completed).length;
    if (completedTodosCount >= 5 && !unlockedAchievements.includes('task_master')) {
      toUnlock.push('task_master');
    }

    if (newLetters.length >= 1 && !unlockedAchievements.includes('future_letter')) {
      toUnlock.push('future_letter');
    }

    const uniqueMoods = new Set(newEntries.map((e) => e.mood).filter(Boolean));
    if (uniqueMoods.size >= 3 && !unlockedAchievements.includes('mood_explorer')) {
      toUnlock.push('mood_explorer');
    }

    if (toUnlock.length > 0) {
      toUnlock.forEach((achId) => {
        const ach = ACHIEVEMENTS_LIST.find((a) => a.id === achId);
        if (ach) {
          soundFx.play('achievement');
          showToast(`Unlocked: ${ach.title}!`, 'achievement');
          addXp(ach.xp);
        }
      });
      const updatedAchievements = [...unlockedAchievements, ...toUnlock];
      setUnlockedAchievements(updatedAchievements);
      if (user && supabase) {
        supabase.from('profiles').upsert({ id: user.id, unlocked_achievements: updatedAchievements }).then();
      }
    }
  };

  // Journal CRUD
  const saveEntry = async (entryData) => {
    const isNew = !entries.some((e) => e.id === entryData.id);
    const dateStr = entryData.date || new Date().toISOString().split('T')[0];

    let entryToSave = {
      ...entryData,
      id: entryData.id || (user ? undefined : `entry-${Date.now()}`),
      date: dateStr,
      pageType: entryData.pageType || 'entry',
      subtitle: entryData.subtitle || '',
      handwritingStyle: entryData.handwritingStyle || 'cozy',
      stickers: entryData.stickers || [],
      createdAt: entryData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If Supabase authenticated
    if (user && supabase) {
      try {
        const payload = {
          user_id: user.id,
          entry_date: dateStr,
          title: entryData.title || (entryData.pageType === 'title_page' ? 'Title Page' : ''),
          content: entryData.content || '',
          mood: entryData.mood || 'happy',
          tags: entryData.tags || [],
          is_favorite: Boolean(entryData.isFavorite),
          word_count: entryData.wordCount || 0,
          handwriting_style: entryData.handwritingStyle || 'cozy',
          stickers: entryData.stickers || [],
          page_type: entryData.pageType || 'entry',
          subtitle: entryData.subtitle || '',
          updated_at: new Date().toISOString(),
        };

        if (entryData.id && !entryData.id.startsWith('entry-')) {
          payload.id = entryData.id;
        }

        const { data: savedDb, error } = await supabase
          .from('journal_entries')
          .upsert(payload)
          .select()
          .single();

        if (error) {
          showToast('Failed to save to cloud: ' + error.message, 'error');
          return false;
        }

        entryToSave = {
          ...entryToSave,
          id: savedDb.id,
        };
      } catch {
        showToast('Network error while saving journal entry.', 'error');
        return false;
      }
    }

    let updated;
    if (isNew) {
      updated = [entryToSave, ...entries.filter((e) => e.id !== entryToSave.id)];
      addXp(25, 'Journal Entry Logged');
    } else {
      updated = entries.map((e) => (e.id === entryToSave.id ? entryToSave : e));
    }

    setEntries(updated);
    soundFx.play('save');
    showToast('Journal page saved successfully!', 'success');
    checkAchievements(updated, todos, letters);
    return true;
  };

  const deleteEntry = async (id) => {
    if (user && supabase && !id.startsWith('entry-')) {
      try {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          showToast('Failed to delete cloud entry: ' + error.message, 'error');
          return;
        }
      } catch {
        showToast('Network error during deletion.', 'error');
        return;
      }
    }

    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    soundFx.play('delete');
    showToast('Journal entry deleted.', 'info');
  };

  const toggleFavoriteEntry = async (id) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;
    const nextFavorite = !target.isFavorite;

    if (user && supabase && !id.startsWith('entry-')) {
      supabase
        .from('journal_entries')
        .update({ is_favorite: nextFavorite })
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }

    setEntries(entries.map((e) => (e.id === id ? { ...e, isFavorite: nextFavorite } : e)));
    soundFx.play('blip');
  };

  // Todo CRUD
  const addTodo = async (todoData) => {
    let newTodo = {
      id: `todo-${Date.now()}`,
      text: todoData.text,
      completed: false,
      priority: todoData.priority || 'medium',
      category: todoData.category || 'General',
      dueDate: todoData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    if (user && supabase) {
      try {
        const { data: dbTodo, error } = await supabase
          .from('todos')
          .insert({
            user_id: user.id,
            text: newTodo.text,
            priority: newTodo.priority,
            category: newTodo.category,
            due_date: newTodo.dueDate,
          })
          .select()
          .single();

        if (!error && dbTodo) {
          newTodo.id = dbTodo.id;
        }
      } catch {}
    }

    const updated = [newTodo, ...todos];
    setTodos(updated);
    soundFx.play('click');
    addXp(5, 'Task Added');
    showToast('New quest added to log!', 'success');
  };

  const toggleTodo = async (id) => {
    let wasCompleted = false;
    const updated = todos.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        wasCompleted = nextState;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : null,
        };
      }
      return t;
    });

    const target = updated.find((t) => t.id === id);
    if (user && supabase && target && !id.startsWith('todo-')) {
      supabase
        .from('todos')
        .update({
          completed: target.completed,
          completed_at: target.completedAt,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }

    setTodos(updated);
    if (wasCompleted) {
      soundFx.play('complete');
      addXp(15, 'Task Completed!');
      showToast('Quest cleared!', 'success');
    } else {
      soundFx.play('blip');
    }
    checkAchievements(entries, updated, letters);
  };

  const deleteTodo = async (id) => {
    if (user && supabase && !id.startsWith('todo-')) {
      supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }
    setTodos(todos.filter((t) => t.id !== id));
    soundFx.play('delete');
    showToast('Quest removed.', 'info');
  };

  // Future Letters CRUD
  const saveLetter = async (letterData) => {
    let newLetter = {
      ...letterData,
      id: letterData.id || `letter-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isOpened: false,
    };

    if (user && supabase) {
      try {
        const { data: dbLetter, error } = await supabase
          .from('future_letters')
          .insert({
            user_id: user.id,
            title: newLetter.title,
            recipient: newLetter.recipient,
            body: newLetter.body,
            mood: newLetter.mood,
            envelope_style: newLetter.envelopeStyle,
            unlock_date: newLetter.unlockDate,
          })
          .select()
          .single();

        if (!error && dbLetter) {
          newLetter.id = dbLetter.id;
        }
      } catch {}
    }

    const updated = [newLetter, ...letters];
    setLetters(updated);
    soundFx.play('save');
    addXp(30, 'Letter Sealed to Future Me');
    showToast('Time-capsule letter sealed!', 'success');
    checkAchievements(entries, todos, updated);
    return true;
  };

  const openLetter = async (id) => {
    const updated = letters.map((l) =>
      l.id === id ? { ...l, isOpened: true, openedAt: new Date().toISOString() } : l
    );

    if (user && supabase && !id.startsWith('letter-')) {
      supabase
        .from('future_letters')
        .update({ is_opened: true, opened_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }

    setLetters(updated);
    soundFx.play('unlock');
    addXp(50, 'Time Capsule Letter Opened!');
    showToast('Time-capsule letter unsealed!', 'success');
  };

  const deleteLetter = async (id) => {
    if (user && supabase && !id.startsWith('letter-')) {
      supabase
        .from('future_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .then();
    }
    setLetters(letters.filter((l) => l.id !== id));
    soundFx.play('delete');
    showToast('Letter deleted.', 'info');
  };

  // Calculate streaks from real saved entries
  const getStreakData = () => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const uniqueDates = Array.from(new Set(entries.map((e) => e.date))).sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    const hasToday = uniqueDates.includes(today);
    const hasYesterday = uniqueDates.includes(yesterday);

    if (hasToday || hasYesterday) {
      let d = hasToday ? new Date() : new Date(Date.now() - 86400000);
      while (true) {
        const dateStr = d.toISOString().split('T')[0];
        if (uniqueDates.includes(dateStr)) {
          currentStreak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, uniqueDates.length > 0 ? 1 : 0),
    };
  };

  // Auth Operations
  const loginOfflineGuest = (name = 'Adventurer', email = 'adventurer@local.test') => {
    const offlineUser = {
      id: 'local-offline-user',
      email,
      user_metadata: { name },
    };
    setUser(offlineUser);
    setProfile((p) => ({ ...p, name }));
    showToast(`Started guest session as ${name}.`, 'info');
    return offlineUser;
  };

  const signInWithPassword = async (email, password) => {
    if (!supabase) {
      const errorMsg = 'Account services are temporarily unavailable. Please try again later.';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message, 'error');
      throw error;
    }
    showToast('Signed in successfully!', 'success');
    return data;
  };

  const signUpWithPassword = async (email, password, displayName) => {
    if (!supabase) {
      const errorMsg = 'Account services are temporarily unavailable. Please try again later.';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: displayName } },
    });
    if (error) {
      showToast(error.message, 'error');
      throw error;
    }

    // Auto authenticate if session provided or try immediate login
    if (data?.session) {
      setUser(data.user);
      setProfile((p) => ({ ...p, name: displayName }));
      showToast(`Welcome to DigiJournal, ${displayName}!`, 'success');
      return data;
    }

    try {
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!signInErr && signInData?.user) {
        setUser(signInData.user);
        setProfile((p) => ({ ...p, name: displayName }));
        showToast(`Welcome to DigiJournal, ${displayName}!`, 'success');
        return signInData;
      }
    } catch {
      // Email confirmation may be active in Supabase project
    }

    if (data?.user) {
      setUser(data.user);
      setProfile((p) => ({ ...p, name: displayName }));
    }

    showToast(`Welcome to DigiJournal, ${displayName}!`, 'success');
    return data;
  };

  const signOutUser = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
    clearUserData();
    setUser(null);
    showToast('Signed out of cloud account.', 'info');
  };

  // Password Recovery Operations
  const resetPassword = async (email) => {
    if (!supabase) {
      const errorMsg = 'Account services are temporarily unavailable. Please try again later.';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      showToast(error.message, 'error');
      throw error;
    }
    showToast('Password reset link sent! Check your inbox.', 'success');
    return data;
  };

  const updateUserPassword = async (newPassword) => {
    if (!supabase) {
      const errorMsg = 'Account services are temporarily unavailable. Please try again later.';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      showToast(error.message, 'error');
      throw error;
    }
    showToast('Password updated successfully!', 'success');
    return data;
  };

  // Suggestion Box Operation
  const submitSuggestion = async (category, message, contactEmail = '') => {
    if (!category || !message?.trim()) {
      showToast('Please choose a category and enter your suggestion.', 'warning');
      throw new Error('Category and message are required.');
    }

    if (message.length > 1000) {
      showToast('Suggestion cannot exceed 1,000 characters.', 'warning');
      throw new Error('Character limit exceeded.');
    }

    if (!supabase) {
      showToast('Supabase client is not configured. Feedback cannot be saved to cloud.', 'warning');
      throw new Error('Supabase client is not configured.');
    }

    const payload = {
      user_id: user ? user.id : null,
      email: contactEmail || (user ? user.email : null),
      category,
      message: message.trim(),
      status: 'new',
    };

    const { data, error } = await supabase.from('user_suggestions').insert([payload]).select();
    if (error) {
      showToast('Error saving suggestion: ' + error.message, 'error');
      throw error;
    }

    soundFx.play('complete');
    showToast('Suggestion submitted! Thank you for helping DigiJournal improve.', 'success');
    return data;
  };

  // Onboarding controls
  const completeTutorial = () => {
    setTutorialCompleted(true);
    setIsTutorialOpen(false);
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
    showToast('Tutorial complete! Welcome to DigiJournal.', 'success');
  };

  const replayTutorial = () => {
    setIsTutorialOpen(true);
  };

  // Export / Import
  const exportAllData = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      entries,
      todos,
      letters,
      xp,
      unlockedAchievements,
      profile,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digijournal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundFx.play('complete');
    showToast('Data backup exported successfully!', 'success');
  };

  const importAllData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.entries)) setEntries(parsed.entries);
      if (Array.isArray(parsed.todos)) setTodos(parsed.todos);
      if (Array.isArray(parsed.letters)) setLetters(parsed.letters);
      if (typeof parsed.xp === 'number') setXp(parsed.xp);
      if (Array.isArray(parsed.unlockedAchievements)) setUnlockedAchievements(parsed.unlockedAchievements);
      if (parsed.profile) setProfile(parsed.profile);
      soundFx.play('save');
      showToast('Backup restored successfully!', 'success');
      return true;
    } catch {
      showToast('Invalid backup file. Please provide a valid JSON file.', 'error');
      return false;
    }
  };

  return (
    <JournalContext.Provider
      value={{
        user,
        authLoading,
        isCloudConnected,
        signInWithPassword,
        signUpWithPassword,
        signOutUser,
        resetPassword,
        updateUserPassword,
        submitSuggestion,
        clearUserData,
        entries,
        todos,
        letters,
        xp,
        currentLevel,
        xpInCurrentLevel,
        xpNeeded,
        addXp,
        unlockedAchievements,
        achievementsList: ACHIEVEMENTS_LIST,
        profile,
        setProfile,
        saveEntry,
        deleteEntry,
        toggleFavoriteEntry,
        addTodo,
        toggleTodo,
        deleteTodo,
        saveLetter,
        openLetter,
        deleteLetter,
        getStreakData,
        exportAllData,
        importAllData,
        isTutorialOpen,
        setIsTutorialOpen,
        completeTutorial,
        replayTutorial,
        loginOfflineGuest,
        isSupabaseConfigured,
        saveSupabaseCredentials,
        clearSupabaseCredentials,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
