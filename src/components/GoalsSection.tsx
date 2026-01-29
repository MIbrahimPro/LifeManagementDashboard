import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { getGoalsForDate, addGoal, updateGoal, deleteGoal } from '../db';
import type { GoalRecord } from '../db';

const today = () => new Date().toISOString().slice(0, 10);

const GOAL_TYPES = ['short', 'medium', 'long'] as const;

interface GoalsSectionProps {
  isDarkMode: boolean;
  date?: string;
  categoryId?: string;
  title?: string;
}

export const GoalsSection: FC<GoalsSectionProps> = ({
  isDarkMode,
  date = today(),
  categoryId,
  title = "Today's goals",
}) => {
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'short' | 'medium' | 'long'>('short');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const load = useCallback(async () => {
    const list = await getGoalsForDate(date, categoryId);
    setGoals(list);
  }, [date, categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await addGoal(newText.trim(), newType, date, categoryId);
    setNewText('');
    load();
  };

  const startEdit = (g: GoalRecord) => {
    setEditingId(g.id);
    setEditText(g.text);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateGoal(editingId, { text: editText.trim() });
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteGoal(id);
    load();
  };

  const toggleComplete = async (g: GoalRecord) => {
    await updateGoal(g.id, { completed: !g.completed });
    load();
  };

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      }}
      className="rounded-xl border p-4"
    >
      <h3 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="font-bold mb-3 text-sm">
        {title}
      </h3>
      <div className="space-y-2">
        {goals.map((g) => (
          <div
            key={g.id}
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            }}
            className="flex items-center gap-2 p-2 rounded-lg border"
          >
            <button
              onClick={() => toggleComplete(g)}
              className={`w-4 h-4 rounded border flex-shrink-0 ${
                g.completed ? 'bg-green-600 border-green-600' : isDarkMode ? 'border-gray-500' : 'border-gray-400'
              }`}
              title={g.completed ? 'Mark incomplete' : 'Mark done'}
            />
            {editingId === g.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                  }}
                  className="flex-1 min-w-0 px-2 py-1 text-sm border rounded"
                />
                <button onClick={saveEdit} className="text-green-500 text-xs font-medium">Save</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs">Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    textDecoration: g.completed ? 'line-through' : 'none',
                    opacity: g.completed ? 0.7 : 1,
                  }}
                  className="flex-1 min-w-0 text-sm"
                >
                  {g.text}
                </span>
                <span
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  className="text-xs capitalize"
                >
                  {g.goalType}
                </span>
                <button onClick={() => startEdit(g)} className="text-amber-500 hover:text-amber-600 text-xs">
                  Edit
                </button>
                <button onClick={() => handleDelete(g.id)} className="p-1 text-red-500 hover:text-red-600">
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New goal..."
          style={{
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            color: isDarkMode ? '#f3f4f6' : '#111827',
          }}
          className="flex-1 min-w-[120px] px-2 py-1.5 text-sm border rounded"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as 'short' | 'medium' | 'long')}
          style={{
            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            color: isDarkMode ? '#f3f4f6' : '#111827',
          }}
          className="px-2 py-1.5 text-sm border rounded"
        >
          {GOAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}
