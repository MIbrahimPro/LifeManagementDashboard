import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Loader, ChevronDown } from 'lucide-react';
import type { Religion } from '../data/verses';
import { getAiVerses } from '../data/verseUtils';
import { versesCache } from '../data/verses';
import { useTodoList, useActionsList, useJournal } from '../hooks/useLifeTools';
import { QuickAddModal } from '../components/QuickAddModal';
import { TodoListModal } from '../components/TodoListModal';
import { ActionsModal } from '../components/ActionsModal';
import { TopTools } from '../components/TopTools';
import { CategoryCardContainer } from '../components/CategoryCardContainer';
import { JourneyView } from '../components/JourneyView';

interface VerseIndices {
    [categoryId: string]: number;
}

export default function BiblicalLifeDashboard() {
    const [religion, setReligion] = useState<Religion | null>(() => 'christianity');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoadingVerses, setIsLoadingVerses] = useState(false);
    const [versesRefreshKey, setVersesRefreshKey] = useState(0);
    const [verseIndices, setVerseIndices] = useState<VerseIndices>(() => {
        const indices: VerseIndices = {};
        ['physical', 'hobby', 'income', 'assets', 'family', 'oneonone', 'politics', 'spiritual'].forEach(cat => {
            indices[cat] = 0;
        });
        return indices;
    });

    // Custom hooks for data management
    const { todos, addTodo, toggleTodo, deleteTodo, clearCompletedTodos } = useTodoList();
    const { actions, addAction, toggleAction, deleteAction } = useActionsList();
    const { entries, addEntry } = useJournal();

    // UI state
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showTodoList, setShowTodoList] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showJourney, setShowJourney] = useState(false);
    const [quickAddInput, setQuickAddInput] = useState('');
    const [addToDropdownOpen, setAddToDropdownOpen] = useState(false);
    const [showCustomReligionForm, setShowCustomReligionForm] = useState(false);
    const [customReligionInput, setCustomReligionInput] = useState('');

    // Initialize theme
    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Load religion and verses on mount
    useEffect(() => {
        const storedReligion = localStorage.getItem('userReligion') as Religion | null;
        const initialReligion = storedReligion || 'christianity';

        if (!storedReligion) {
            localStorage.setItem('userReligion', 'christianity');
        }
        setReligion(initialReligion);

        (async () => {
            setIsLoadingVerses(true);
            try {
                const allVerses = await getAiVerses(initialReligion);
                if (Object.keys(allVerses).length > 0) {
                    versesCache[initialReligion] = allVerses;
                    console.log(`Loaded verses for ${initialReligion}:`, allVerses);
                    setVersesRefreshKey(prev => prev + 1);
                }
            } finally {
                setIsLoadingVerses(false);
            }
        })();
    }, []);

    const handleReligionSelect = useCallback(async (selectedReligion: Religion) => {
        localStorage.setItem('userReligion', selectedReligion);
        setReligion(selectedReligion);
        const newVerseIndices: VerseIndices = {};
        ['physical', 'hobby', 'income', 'assets', 'family', 'oneonone', 'politics', 'spiritual'].forEach(cat => {
            newVerseIndices[cat] = 0;
        });
        setVerseIndices(newVerseIndices);

        setIsLoadingVerses(true);
        try {
            console.log(`Fetching all verses for ${selectedReligion}`);
            const allVerses = await getAiVerses(selectedReligion);

            if (Object.keys(allVerses).length > 0) {
                versesCache[selectedReligion] = allVerses;
                console.log(`Cached verses for ${selectedReligion}:`, allVerses);
                setVersesRefreshKey(prev => prev + 1);
            }
        } finally {
            setIsLoadingVerses(false);
        }
    }, []);

    const cycleVerse = useCallback((categoryId: string) => {
        if (!religion) return;
        const verseCount = (versesCache[religion] && versesCache[religion][categoryId]?.length) || 1;
        setVerseIndices(prev => ({
            ...prev,
            [categoryId]: (prev[categoryId] + 1) % verseCount
        }));
    }, [religion]);

    const handleAddToJournal = useCallback((actionText: string, journalEntry: string) => {
        addEntry(`[ACTION] ${actionText}\n${journalEntry}`, 'actions');
        const actionItem = actions.find(a => a.text === actionText);
        if (actionItem) {
            toggleAction(actionItem.id);
        }
    }, [addEntry, toggleAction, actions]);

    const handleQuickAddSubmit = useCallback((type: 'todo' | 'action' | 'journal') => {
        if (!quickAddInput.trim()) return;

        if (type === 'todo') {
            addTodo(quickAddInput);
        } else if (type === 'action') {
            addAction(quickAddInput);
        } else if (type === 'journal') {
            addEntry(quickAddInput, 'general');
        }

        setQuickAddInput('');
        setAddToDropdownOpen(false);
    }, [quickAddInput, addTodo, addAction, addEntry]);

    const handleCustomReligion = useCallback(() => {
        if (!customReligionInput.trim()) return;
        handleReligionSelect(customReligionInput as Religion);
        setCustomReligionInput('');
        setShowCustomReligionForm(false);
    }, [customReligionInput]);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`} style={{
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
        }}>
            {isLoadingVerses && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div style={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        borderRadius: '1rem'
                    }} className="p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <Loader size={40} className="animate-spin text-blue-500" />
                        <p style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-lg font-semibold">Loading verses...</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-center flex-1">
                            <h1 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-4xl font-bold tracking-tight mb-2">
                                Faithful Life Dashboard
                            </h1>
                            <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-lg">
                                A sacred space to align your daily life with your spiritual values.
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            style={{
                                backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                            }}
                            className="ml-4 p-2.5 rounded-lg hover:bg-gray-200 transition"
                            title="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="text-amber-500" />
                            ) : (
                                <Moon size={20} className="text-indigo-600" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Top Tools */}
                <TopTools isDarkMode={isDarkMode} />

                {/* Quick Add Section - Search Bar */}
                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                }} className="rounded-2xl shadow-sm border p-5 mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={quickAddInput}
                            onChange={(e) => setQuickAddInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && addToDropdownOpen) {
                                    // Submit to the first option (Todo)
                                    handleQuickAddSubmit('todo');
                                }
                            }}
                            placeholder="What's on your mind today?"
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        />
                        <div className="relative">
                            <button
                                onClick={() => setAddToDropdownOpen(!addToDropdownOpen)}
                                style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }}
                                className="px-4 py-3 rounded-lg font-semibold transition hover:opacity-80 flex items-center gap-2 whitespace-nowrap"
                            >
                                Add to...
                                <ChevronDown size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {addToDropdownOpen && (
                                <div
                                    style={{
                                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                                    }}
                                    className="absolute right-0 top-full mt-2 border rounded-lg shadow-lg z-10 min-w-max"
                                >
                                    <button
                                        onClick={() => handleQuickAddSubmit('todo')}
                                        style={{
                                            color: isDarkMode ? '#f3f4f6' : '#111827',
                                            backgroundColor: isDarkMode ? 'transparent' : 'transparent'
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition first:rounded-t-lg"
                                    >
                                        📋 To-Do
                                    </button>
                                    <button
                                        onClick={() => handleQuickAddSubmit('action')}
                                        style={{
                                            color: isDarkMode ? '#f3f4f6' : '#111827'
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-green-500 hover:text-white transition"
                                    >
                                        ✓ Action
                                    </button>
                                    <button
                                        onClick={() => handleQuickAddSubmit('journal')}
                                        style={{
                                            color: isDarkMode ? '#f3f4f6' : '#111827'
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-amber-500 hover:text-white transition last:rounded-b-lg"
                                    >
                                        📖 Journal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* View Buttons Section */}
                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                }} className="rounded-2xl shadow-sm border p-5 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowTodoList(true)}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                        >
                            📋 To-Do List ({todos.filter(t => !t.completed).length})
                        </button>
                        <button
                            onClick={() => setShowActions(true)}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                        >
                            ✓ Actions ({actions.length})
                        </button>
                        <button
                            onClick={() => setShowJourney(true)}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                        >
                            📖 My Journey ({entries.length})
                        </button>
                    </div>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    <CategoryCardContainer
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        isDarkMode={isDarkMode}
                        versesRefreshKey={versesRefreshKey}
                    />
                </div>

                {/* Modals */}
                <QuickAddModal
                    open={showQuickAdd}
                    isDarkMode={isDarkMode}
                    onClose={() => setShowQuickAdd(false)}
                    onAddTodo={addTodo}
                    onAddAction={addAction}
                    onAddJournal={addEntry}
                />

                <TodoListModal
                    open={showTodoList}
                    isDarkMode={isDarkMode}
                    todos={todos}
                    onClose={() => setShowTodoList(false)}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onClearCompleted={clearCompletedTodos}
                />

                <ActionsModal
                    open={showActions}
                    isDarkMode={isDarkMode}
                    actions={actions}
                    onClose={() => setShowActions(false)}
                    onToggle={toggleAction}
                    onDelete={deleteAction}
                    onAddToJournal={handleAddToJournal}
                />

                <JourneyView
                    open={showJourney}
                    isDarkMode={isDarkMode}
                    entries={entries}
                    onClose={() => setShowJourney(false)}
                />

                {/* Footer */}
                <footer style={{ borderTopColor: isDarkMode ? '#374151' : '#e5e7eb' }} className="mt-12 pt-8 border-t">
                    <div className="flex flex-col items-center gap-6">
                        {!showCustomReligionForm ? (
                            <>
                                <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-sm font-semibold">Select Your Religious Focus</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['christianity', 'islam', 'judaism', 'buddhism', 'hinduism', 'Atheism'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => handleReligionSelect(r as Religion)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${religion === r
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowCustomReligionForm(true)}
                                        style={{
                                            backgroundColor: isDarkMode ? '#374151' : '#f0f4ff',
                                            color: isDarkMode ? '#f3f4f6' : '#1e40af',
                                            borderColor: isDarkMode ? '#4b5563' : '#93c5fd'
                                        }}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition border hover:opacity-80"
                                    >
                                        ✨ Other
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full max-w-sm">
                                <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-sm font-semibold mb-3 text-center">Enter Your Spiritual Tradition</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customReligionInput}
                                        onChange={(e) => setCustomReligionInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCustomReligion()}
                                        placeholder="e.g., Zoroastrianism, Wicca..."
                                        autoFocus
                                        style={{
                                            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                                            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                            color: isDarkMode ? '#f3f4f6' : '#111827'
                                        }}
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            setShowCustomReligionForm(false);
                                            setCustomReligionInput('');
                                        }}
                                        style={{
                                            backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                            color: isDarkMode ? '#f3f4f6' : '#111827'
                                        }}
                                        className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition hover:opacity-80"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleCustomReligion}
                                        disabled={!customReligionInput.trim()}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg text-sm font-semibold transition"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
