import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getJournalEntriesForDate, addJournalEntry, getDailySnapshot } from '../db';

const today = () => new Date().toISOString().slice(0, 10);

const categoryColors: Record<string, string> = {
  physical: 'bg-red-600',
  hobby: 'bg-purple-600',
  income: 'bg-green-600',
  assets: 'bg-blue-600',
  family: 'bg-orange-600',
  oneonone: 'bg-yellow-600',
  politics: 'bg-indigo-600',
  spiritual: 'bg-amber-600',
  actions: 'bg-cyan-600',
  todos: 'bg-pink-600',
  general: 'bg-gray-600',
};

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(today());
  const [entries, setEntries] = useState<{ id: string; text: string; category: string; timestamp: string; date: string }[]>([]);
  const [snapshot, setSnapshot] = useState<{
    todosDone: { text: string; completed: boolean }[];
    todosNotDone: { text: string }[];
    trackerLog: { label: string; completed: boolean; value?: string }[];
    goalsLog: { text: string; type: string; completed: boolean }[];
    journalExtra: string[];
  } | null>(null);
  const [mindText, setMindText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(dark);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [journalList, snap] = await Promise.all([
      getJournalEntriesForDate(selectedDate),
      getDailySnapshot(selectedDate),
    ]);
    setEntries(journalList);
    setSnapshot(snap ?? null);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddMind = async () => {
    if (!mindText.trim()) return;
    await addJournalEntry(mindText.trim(), 'general', selectedDate);
    setMindText('');
    load();
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">📖 Journal</h1>
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          }}
          className="rounded-xl border p-4 mb-6"
        >
          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>
            View date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#fff',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              color: isDarkMode ? '#f3f4f6' : '#111827',
            }}
            className="px-3 py-2 border rounded-lg w-full"
          />
          <p className="text-sm mt-1" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* What's on your mind */}
        <div
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          }}
          className="rounded-xl border p-4 mb-6"
        >
          <label className="block text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>
            What's on your mind?
          </label>
          <textarea
            value={mindText}
            onChange={(e) => setMindText(e.target.value)}
            placeholder="Add a note for this day..."
            rows={3}
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              color: isDarkMode ? '#f3f4f6' : '#111827',
            }}
            className="w-full px-3 py-2 border rounded-lg resize-none"
          />
          <button
            onClick={handleAddMind}
            disabled={!mindText.trim()}
            className="mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium text-sm"
          >
            Add to journal
          </button>
        </div>

        {loading ? (
          <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Loading...</p>
        ) : (
          <div className="space-y-4">
            {snapshot && (
              <div
                style={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#f0fdf4',
                  borderColor: isDarkMode ? '#374151' : '#bbf7d0',
                }}
                className="rounded-xl border p-4"
              >
                <h3 className="font-bold mb-2" style={{ color: isDarkMode ? '#f3f4f6' : '#166534' }}>
                  End of day snapshot
                </h3>
                {snapshot.todosDone.length > 0 && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Done:</span>{' '}
                    {snapshot.todosDone.map((t) => t.text).join(', ')}
                  </p>
                )}
                {snapshot.todosNotDone.length > 0 && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Not done:</span>{' '}
                    {snapshot.todosNotDone.map((t) => t.text).join(', ')}
                  </p>
                )}
                {snapshot.trackerLog.length > 0 && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Tracker:</span>{' '}
                    {snapshot.trackerLog.map((l) => `${l.label}${l.completed ? ' ✓' : ''}`).join(', ')}
                  </p>
                )}
                {snapshot.goalsLog.length > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Goals:</span>{' '}
                    {snapshot.goalsLog.map((g) => `${g.text} (${g.type})${g.completed ? ' ✓' : ''}`).join(', ')}
                  </p>
                )}
              </div>
            )}

            {entries.length === 0 && !snapshot ? (
              <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic text-center py-8">
                No entries for this day. Add something above or from the dashboard.
              </p>
            ) : (
              entries.map((entry) => {
                const colorClass = categoryColors[entry.category] ?? 'bg-gray-600';
                return (
                  <div
                    key={entry.id}
                    style={{
                      borderLeftColor: isDarkMode ? '#4b5563' : '#d1d5db',
                      backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                    }}
                    className="border-l-4 pl-4 py-4 rounded-r-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${colorClass} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                        {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                      </span>
                      <span className="text-xs" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>
                      {entry.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
