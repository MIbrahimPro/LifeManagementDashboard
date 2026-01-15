import type { FC } from 'react';
import type { JournalEntry } from '../hooks/useLifeTools';

interface JourneyViewProps {
    open: boolean;
    isDarkMode: boolean;
    entries: JournalEntry[];
    onClose: () => void;
}

const categoryColors: { [key: string]: string } = {
    physical: 'bg-red-600',
    hobby: 'bg-purple-600',
    income: 'bg-green-600',
    assets: 'bg-blue-600',
    family: 'bg-orange-600',
    oneonone: 'bg-yellow-600',
    politics: 'bg-indigo-600',
    spiritual: 'bg-amber-600',
    actions: 'bg-cyan-600',
    todos: 'bg-pink-600'
};

export const JourneyView: FC<JourneyViewProps> = ({ open, isDarkMode, entries, onClose }) => {
    if (!open) return null;

    // Sort entries by timestamp (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem',
                overflow: 'hidden'
            }} className="w-full max-w-4xl flex flex-col max-h-[85vh]">
                {/* Header */}
                <div style={{
                    backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
                    borderBottomColor: isDarkMode ? '#b45309' : '#fcd34d'
                }} className="p-5 flex justify-between items-center border-b">
                    <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-xl font-bold flex items-center gap-3">
                        📖 My Journey
                    </h2>
                    <button onClick={onClose} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="hover:text-gray-800 text-2xl transition">
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div style={{ backgroundColor: isDarkMode ? '#111827' : '#ffffff' }} className="p-6 overflow-y-auto flex-1">
                    {sortedEntries.length === 0 ? (
                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic text-center py-8">
                            No journal entries yet. Start your journey by adding reflections in any category!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {sortedEntries.map((entry, idx) => {
                                const colorClass = categoryColors[entry.category] || 'bg-gray-600';
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            borderLeftColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
                                        }}
                                        className="border-l-4 pl-4 py-4 rounded-r-lg"
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <span className={`${colorClass} text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
                                                {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                                            </span>
                                            <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm font-semibold">
                                                {entry.timestamp}
                                            </span>
                                        </div>
                                        <p style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm whitespace-pre-wrap leading-relaxed">
                                            {entry.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
