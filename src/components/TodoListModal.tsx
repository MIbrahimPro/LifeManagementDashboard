import type { FC } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import type { TodoItem } from '../hooks/useLifeTools';

interface TodoListModalProps {
    open: boolean;
    isDarkMode: boolean;
    todos: TodoItem[];
    onClose: () => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClearCompleted: () => void;
}

export const TodoListModal: FC<TodoListModalProps> = ({
    open,
    isDarkMode,
    todos,
    onClose,
    onToggle,
    onDelete,
    onClearCompleted
}) => {
    if (!open) return null;

    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem'
            }} className="w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold">
                        To-Do List ({todos.length})
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
                    {todos.length === 0 ? (
                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic text-center py-8">
                            No to-do items. Add one using the quick add button!
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    style={{
                                        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                                        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                                    }}
                                    className="flex items-center gap-3 p-4 rounded-lg border group hover:shadow-md transition"
                                >
                                    <button
                                        onClick={() => onToggle(todo.id)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${todo.completed
                                                ? 'bg-green-600 border-green-600'
                                                : isDarkMode
                                                    ? 'border-gray-600 hover:border-green-600'
                                                    : 'border-gray-400 hover:border-green-600'
                                            }`}
                                    >
                                        {todo.completed && <Check size={14} className="text-white" />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            style={{
                                                color: isDarkMode ? '#d1d5db' : '#111827',
                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                opacity: todo.completed ? 0.6 : 1
                                            }}
                                            className="text-sm wrap-break-word"
                                        >
                                            {todo.text}
                                        </p>
                                        {todo.timestamp && (
                                            <p style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }} className="text-xs mt-1">
                                                {todo.timestamp}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onDelete(todo.id)}
                                        className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t space-y-3" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    {completedCount > 0 && (
                        <button
                            onClick={onClearCompleted}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                        >
                            Clear Completed ({completedCount})
                        </button>
                    )}
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
