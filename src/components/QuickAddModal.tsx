import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { X } from 'lucide-react';

interface QuickAddModalProps {
    open: boolean;
    isDarkMode: boolean;
    onClose: () => void;
    onAddTodo: (text: string) => void;
    onAddAction: (text: string) => void;
    onAddJournal: (text: string, category: string) => void;
}

export const QuickAddModal: FC<QuickAddModalProps> = ({
    open,
    isDarkMode,
    onClose,
    onAddTodo,
    onAddAction,
    onAddJournal
}) => {
    const [mode, setMode] = useState<'todo' | 'action' | 'journal'>('todo');
    const [text, setText] = useState('');
    const [category, setCategory] = useState('general');
    const [feedback, setFeedback] = useState('');

    const handleAdd = useCallback(() => {
        if (!text.trim()) {
            setFeedback('Please enter something');
            return;
        }

        if (mode === 'todo') {
            onAddTodo(text);
            setFeedback('✓ Added to To-Do List');
        } else if (mode === 'action') {
            onAddAction(text);
            setFeedback('✓ Added to Actions');
        } else if (mode === 'journal') {
            onAddJournal(text, category);
            setFeedback('✓ Added to Journal');
        }

        setText('');
        setTimeout(() => {
            setFeedback('');
            onClose();
        }, 1500);
    }, [text, mode, category, onAddTodo, onAddAction, onAddJournal, onClose]);

    if (!open) return null;

    const modeConfig = {
        todo: { color: 'bg-blue-600', label: 'Add to To-Do List' },
        action: { color: 'bg-green-600', label: 'Add to Actions' },
        journal: { color: 'bg-amber-600', label: 'Add to Journal' }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem'
            }} className="w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold">
                        Quick Add
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        className="hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        {(['todo', 'action', 'journal'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === m
                                        ? `${modeConfig[m].color} text-white`
                                        : isDarkMode
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {modeConfig[m].label}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleAdd()}
                        placeholder={`Enter ${mode}...`}
                        style={{
                            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                            color: isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                        className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                    />

                    {mode === 'journal' && (
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="general">General</option>
                            <option value="physical">Physical</option>
                            <option value="spiritual">Spiritual</option>
                            <option value="family">Family</option>
                            <option value="work">Work</option>
                        </select>
                    )}

                    {feedback && (
                        <div style={{
                            backgroundColor: isDarkMode ? 'rgba(6, 78, 59, 0.3)' : '#dcfce7',
                            color: isDarkMode ? '#86efac' : '#166534'
                        }} className="p-3 rounded-lg text-sm font-medium">
                            {feedback}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="px-4 py-2 rounded-lg font-semibold transition hover:opacity-80"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className={`${modeConfig[mode].color} text-white px-6 py-2 rounded-lg font-semibold transition hover:opacity-90`}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
