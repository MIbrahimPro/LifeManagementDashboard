import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'physical', name: 'Physical', color: 'bg-red-600' },
  { id: 'hobby', name: 'Hobby', color: 'bg-purple-600' },
  { id: 'income', name: 'Income & Expenses', color: 'bg-green-600' },
  { id: 'assets', name: 'Assets & Liabilities', color: 'bg-blue-600' },
  { id: 'family', name: 'Family & Friends', color: 'bg-orange-600' },
  { id: 'oneonone', name: 'One-on-One', color: 'bg-yellow-600' },
  { id: 'politics', name: 'Politics', color: 'bg-indigo-600' },
  { id: 'spiritual', name: 'Spiritual', color: 'bg-amber-600' },
];

export default function JournalPage() {
  const isDarkMode = typeof window !== 'undefined' && window.matchMedia('prefers-color-scheme: dark').matches;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">📖 Journal</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-600 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="mb-6">
          Select a category to view history of every day for that category.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/journal/${cat.id}`}
              className={`${cat.color} text-white rounded-xl p-5 font-semibold text-lg hover:opacity-90 transition block text-center`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
