import { useState } from 'react';
import type { FC } from 'react';
import { Check, Trash2, X, PenTool } from 'lucide-react';
import type { ActionItem } from '../hooks/useLifeTools';

interface ActionsModalProps {
    open: boolean;
    isDarkMode: boolean;
    actions: ActionItem[];
    onClose: () => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAddToJournal: (actionText: string, journalEntry: string) => void;
}

export const ActionsModal: FC<ActionsModalProps> = ({
    open,
    isDarkMode,
    actions,
    onClose,
    onToggle,
    onDelete,
    onAddToJournal
}) => {
    const [journalActionId, setJournalActionId] = useState<string | null>(null);
    const [journalText, setJournalText] = useState('');

    if (!open) return null;

    const handleAddToJournal = (_actionId: string, actionText: string) => {
        onAddToJournal(actionText, journalText);
        setJournalActionId(null);
        setJournalText('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem'
            }} className="w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold">
                        Actions ({actions.length})
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        className="hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ backgroundColor: isDarkMode ? '#111827' : '#ffffff' }} className="flex-1 overflow-y-auto p-6">
                    {journalActionId ? (
                        <div className="space-y-4">
                            <p style={{ color: isDarkMode ? '#d1d5db' : '#111827' }} className="font-semibold">
                                Log this action to journal:
                            </p>
                            <div style={{
                                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb'
                            }} className="p-3 rounded-lg border">
                                <p style={{ color: isDarkMode ? '#d1d5db' : '#111827' }} className="text-sm">
                                    {actions.find(a => a.id === journalActionId)?.text}
                                </p>
                            </div>
                            <textarea
                                value={journalText}
                                onChange={(e) => setJournalText(e.target.value)}
                                placeholder="Add details about completing this action..."
                                style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }}
                                className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={4}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        handleAddToJournal(journalActionId, actions.find(a => a.id === journalActionId)?.text || '');
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                                >
                                    Save to Journal
                                </button>
                                <button
                                    onClick={() => setJournalActionId(null)}
                                    style={{
                                        backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                        color: isDarkMode ? '#f3f4f6' : '#111827'
                                    }}
                                    className="flex-1 py-2 rounded-lg font-semibold transition hover:opacity-80"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {actions.length === 0 ? (
                                <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic text-center py-8">
                                    No actions. Add one using the quick add button!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {actions.map((action) => (
                                        <div
                                            key={action.id}
                                            style={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                                                borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                                            }}
                                            className="flex items-center gap-3 p-4 rounded-lg border group"
                                        >
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onToggle(action.id)}
                                                    className="w-8 h-8 rounded flex items-center justify-center bg-green-600 hover:bg-green-700 text-white transition"
                                                    title="Complete"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setJournalActionId(action.id)}
                                                    className="w-8 h-8 rounded flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white transition"
                                                    title="Log to journal"
                                                >
                                                    <PenTool size={16} />
                                                </button>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    style={{
                                                        color: isDarkMode ? '#d1d5db' : '#111827',
                                                        textDecoration: action.completed ? 'line-through' : 'none',
                                                        opacity: action.completed ? 0.6 : 1
                                                    }}
                                                    className="text-sm wrap-break-word"
                                                >
                                                    {action.text}
                                                </p>
                                                {action.timestamp && (
                                                    <p style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }} className="text-xs mt-1">
                                                        {action.timestamp}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => onDelete(action.id)}
                                                className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                            color: isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                        className="w-full py-2 rounded-lg font-semibold transition hover:opacity-80"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
