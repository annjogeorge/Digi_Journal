import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RetroNavbar from '../components/ui/RetroNavbar';
import PixelStars from '../components/ui/PixelStars';
import PixelButton from '../components/ui/PixelButton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import RetroSelect from '../components/ui/RetroSelect';
import AuthPromptModal from '../components/ui/AuthPromptModal';
import { useJournal } from '../context/JournalContext';
import { soundFx } from '../utils/soundEffects';
import { Check, Plus, Trash2, Calendar, CheckSquare, Sparkles, ShieldAlert } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'Personal', label: 'Personal' },
  { value: 'Work', label: 'Work' },
  { value: 'Journal', label: 'Journal' },
  { value: 'Habits', label: 'Habits' },
  { value: 'Creative', label: 'Creative' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
];

export default function Todo() {
  const { todos, addTodo, toggleTodo, deleteTodo, user } = useJournal();
  const [filter, setFilter] = useState('all'); // all, active, completed, overdue
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    if (!user) {
      setIsAuthPromptOpen(true);
      return;
    }

    addTodo({
      text: newText.trim(),
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
    });
    setNewText('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'overdue') return !todo.completed && todo.dueDate < todayStr;
    return true;
  });

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityColors = {
    low: 'text-[#8be9fd] border-[#8be9fd]/40',
    medium: 'text-[#f3df23] border-[#f3df23]/40',
    high: 'text-[#ff5555] border-[#ff5555]/40',
  };

  return (
    <div className="min-h-screen bg-[#242262] bg-grid text-white flex flex-col relative select-none">
      <RetroNavbar />
      <PixelStars />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 z-10 flex flex-col gap-6">
        
        {/* Guest Preview Notice */}
        {!user && (
          <div className="bg-[#1b1847] border-2 border-black p-3.5 shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2 text-white/90">
              <ShieldAlert size={16} className="text-[#f3df23] shrink-0" />
              <span>
                <strong>Preview Mode:</strong> You are exploring Tasks in guest mode. Create an account to save daily quests and earn XP.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthPromptOpen(true)}
              className="font-pixel text-[10px] bg-[#f3df23] text-black px-3 py-1.5 border border-black shadow-[1px_1px_0px_#000] whitespace-nowrap cursor-pointer hover:bg-[#ffe83d]"
            >
              Sign In to Save
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel text-[10px] text-[#f3df23] tracking-widest uppercase">
                DAILY TASKS & QUEST LOG
              </span>
              <CheckSquare size={14} className="text-[#f3df23]" />
            </div>
            <h1 className="font-pixel text-lg sm:text-xl text-white tracking-wide">
              Task Checklist
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-sans mt-0.5">
              Complete your daily tasks to earn bonus XP and level up your player profile.
            </p>
          </div>

          {/* Quest Progress summary */}
          <div className="bg-[#121035] border border-black/60 p-3 min-w-[210px] shadow-[2px_2px_0px_#000]">
            <div className="flex justify-between items-center font-sans text-xs mb-1 font-medium">
              <span className="text-white/70">Task Progress</span>
              <span className="text-[#50fa7b] font-bold">{percentComplete}%</span>
            </div>
            <div className="w-full bg-black/70 h-2.5 border border-black/60 overflow-hidden rounded-xs">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentComplete}%` }}
                className="bg-[#50fa7b] h-full"
              />
            </div>
            <div className="font-sans text-xs text-[#f3df23] mt-1.5 text-right font-medium">
              {completedTasks} of {totalTasks} Tasks Completed
            </div>
          </div>
        </div>

        {/* Add New Quest Form */}
        <form
          onSubmit={handleAddSubmit}
          className="bg-[#1a1744] border-2 border-black shadow-[3px_3px_0px_#000] p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="font-sans text-xs font-semibold text-[#f3df23] flex items-center gap-1.5 uppercase">
            <Plus size={14} /> Add New Task
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="What task do you want to accomplish today?..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 bg-black/40 border border-black/60 px-3 py-2 text-sm font-sans text-white focus:outline-none placeholder:text-white/40 rounded-xs"
            />

            <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
              <RetroSelect
                value={newCategory}
                onChange={setNewCategory}
                options={CATEGORY_OPTIONS}
                className="w-auto"
                buttonClassName="min-w-[110px]"
              />

              <RetroSelect
                value={newPriority}
                onChange={setNewPriority}
                options={PRIORITY_OPTIONS}
                className="w-auto"
                buttonClassName="min-w-[130px]"
              />

              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-[#1b1847] border-2 border-black px-2.5 py-2 text-white font-sans text-xs focus:outline-none shadow-[2px_2px_0px_#000]"
              />

              <PixelButton type="submit" size="sm" variant="yellow">
                Add Task
              </PixelButton>
            </div>
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
          {['all', 'active', 'completed', 'overdue'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                soundFx.play('blip');
                setFilter(f);
              }}
              className={`px-3 py-1.5 border-2 border-black capitalize cursor-pointer shadow-[2px_2px_0px_#000] font-medium transition-transform active:translate-y-0.5 ${
                filter === f
                  ? 'bg-[#f3df23] text-black font-semibold'
                  : 'bg-[#181646] text-white/70 hover:text-white'
              }`}
            >
              {f} ({f === 'all' ? todos.length : f === 'active' ? todos.filter(t => !t.completed).length : f === 'completed' ? completedTasks : todos.filter(t => !t.completed && t.dueDate < todayStr).length})
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="flex flex-col gap-2.5">
          {filteredTodos.length === 0 ? (
            <div className="bg-[#181646] border-2 border-black shadow-[3px_3px_0px_#000] p-8 text-center">
              <div className="font-pixel text-xs text-[#f3df23] mb-2">NO QUESTS FOUND</div>
              <p className="text-xs text-white/70 font-sans">
                {filter === 'completed'
                  ? 'No completed quests yet. Finish one to hear the victory chime!'
                  : 'All quests in this view are completed or empty.'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredTodos.map((todo) => {
                const isOverdue = !todo.completed && todo.dueDate < todayStr;
                return (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`border-2 border-black shadow-[3px_3px_0px_#000] p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors rounded-sm ${
                      todo.completed
                        ? 'bg-[#141235]/60 text-white/40'
                        : 'bg-[#1d1a4e] text-white hover:bg-[#25225e]'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 border-2 border-black flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
                          todo.completed
                            ? 'bg-[#50fa7b] text-black shadow-inner'
                            : 'bg-black/40 hover:bg-black/60'
                        }`}
                        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {todo.completed && <Check size={14} strokeWidth={3} />}
                      </button>

                      <div className="flex-1">
                        <div
                          className={`font-sans text-sm font-medium ${
                            todo.completed ? 'line-through text-white/40' : 'text-white'
                          }`}
                        >
                          {todo.text}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-1 font-sans text-xs">
                          <span className="bg-black/40 px-2 py-0.5 border border-black/40 text-white/70 text-[11px]">
                            {todo.category}
                          </span>

                          <span
                            className={`px-2 py-0.5 border text-[11px] font-medium uppercase ${
                              priorityColors[todo.priority] || priorityColors.medium
                            }`}
                          >
                            {todo.priority}
                          </span>

                          <span
                            className={`flex items-center gap-1 text-[11px] ${
                              isOverdue ? 'text-rose-400 font-semibold' : 'text-white/60'
                            }`}
                          >
                            <Calendar size={11} />
                            {todo.dueDate} {isOverdue && '(Overdue)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(todo.id)}
                      className="p-1.5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete quest"
                      aria-label="Delete quest"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Task"
        message="Are you sure you want to remove this task from your checklist?"
        confirmLabel="Delete Task"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteTodo(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        title="Sign In to Manage Tasks"
        actionName="create, complete, and save your daily task checklist"
        redirectPath="/todo"
      />
    </div>
  );
}
