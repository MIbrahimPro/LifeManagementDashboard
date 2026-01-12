import { useState, useEffect, useCallback } from 'react';
import type { FC, SetStateAction, Dispatch } from 'react';
import { Heart, Palette, DollarSign, Building2, User, Users, Flag, Book, Sun, Moon } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { verses } from '../data/verses';
import type { Religion } from '../data/verses';

interface Category {
    id: string;
    name: string;
    icon: FC<LucideProps>;
    color: string;
}

const categories: Category[] = [
    { id: 'spiritual', name: 'SPIRITUAL', icon: Book, color: 'bg-amber-600' },
    { id: 'physical', name: 'PHYSICAL', icon: Heart, color: 'bg-red-600' },
    { id: 'family', name: 'FAMILY & FRIENDS', icon: Users, color: 'bg-orange-600' },
    { id: 'oneonone', name: 'ONE-ON-ONE', icon: User, color: 'bg-yellow-600' },
    { id: 'assets', name: 'ASSETS', icon: Building2, color: 'bg-blue-600' },
    { id: 'income', name: 'INCOME', icon: DollarSign, color: 'bg-green-600' },
    { id: 'hobby', name: 'HOBBY', icon: Palette, color: 'bg-purple-600' },
    { id: 'politics', name: 'CIVIC', icon: Flag, color: 'bg-indigo-600' }
];

interface CategoryData {
    [categoryId: string]: { [field: string]: string };
}

interface VerseIndices {
    [categoryId: string]: number;
}

interface CategoryCardProps {
    category: Category;
    data: { [field: string]: string };
    religion: Religion | null;
    verseIndices: VerseIndices;
    cycleVerse: (categoryId: string) => void;
    updateField: (categoryId: string, field: string, value: string) => void;
    addTimestamp: (categoryId: string, field: string) => void;
    setShowConstitution: Dispatch<SetStateAction<boolean>>;
    setShowResetReligionPrompt: Dispatch<SetStateAction<boolean>>;
    showResetReligionPrompt: boolean;
    resetReligion: () => void;
    isDarkMode: boolean;
}


const CategoryCard: FC<CategoryCardProps> = ({
    category,
    data,
    religion,
    verseIndices,
    cycleVerse,
    updateField,
    addTimestamp,
    setShowConstitution,
    isDarkMode,
}) => {
    const Icon = category.icon;

    const renderTextarea = (field: string, placeholder: string, rows: number = 2) => (
        <textarea
            placeholder={placeholder}
            value={data[field] || ''}
            onChange={(e) => updateField(category.id, field, e.target.value)}
            style={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                color: isDarkMode ? '#f3f4f6' : '#111827'
            }}
            className="w-full text-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 transition resize-none"
            rows={rows}
        />
    );

    const renderJournal = (field: string) => (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold">Journal</label>
                <button
                    onClick={() => addTimestamp(category.id, field)}
                    className={`${category.color} text-white px-3 py-1 rounded-lg text-xs font-semibold hover:opacity-90 transition`}
                >
                    +Date
                </button>
            </div>
            <textarea
                value={data[field] || ''}
                onChange={(e) => updateField(category.id, field, e.target.value)}
                placeholder="Your thoughts, prayers, and reflections..."
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                    color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
                className="w-full text-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 transition resize-none"
                rows={4}
            />
        </div>
    );

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
        }} className="rounded-2xl shadow-sm border p-5 flex flex-col h-full hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${category.color}`}>
                    <Icon size={20} className="text-white" />
                </div>
                <h2 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-base font-bold">{category.name}</h2>
            </div>

            <div
                style={{
                    backgroundColor: isDarkMode ? 'rgba(92, 51, 0, 0.15)' : '#fffbeb',
                    borderLeftColor: isDarkMode ? '#b45309' : '#fcd34d',
                    color: isDarkMode ? '#fef3c7' : '#78350f'
                }}
                className="border-l-4 p-3 rounded-lg mb-4 text-xs italic cursor-pointer transition hover:opacity-80"
                onClick={() => cycleVerse(category.id)}
            >
                {religion ? verses[religion][category.id][verseIndices[category.id]] : "Loading..."}
            </div>

            <div className="space-y-3 grow">
                {category.id === 'spiritual' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Practices</label>
                            {renderTextarea('spiritual_practices', "Daily prayers, weekly readings...")}
                        </div>
                        {renderJournal('spiritual_journal')}
                    </>
                )}

                {category.id === 'physical' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Goals (S/M/L)</label>
                            {renderTextarea('physical_goals', "Short, Medium, Long term goals...")}
                        </div>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Actions</label>
                            {renderTextarea('physical_actions', "Workout plan, dietary changes...")}
                        </div>
                        {renderJournal('physical_journal')}
                    </>
                )}

                {category.id === 'family' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Contacts & Intentions</label>
                            {renderTextarea('family_contacts', "Call mom, pray for cousin...")}
                        </div>
                        {renderJournal('family_journal')}
                    </>
                )}

                {category.id === 'oneonone' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Relationship Goals</label>
                            {renderTextarea('oneonone_goals', "Spend quality time, have patient conversations...")}
                        </div>
                        {renderJournal('oneonone_journal')}
                    </>
                )}

                {category.id === 'income' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Income Sources & Tithe</label>
                            {renderTextarea('income_sources', "Salary, side business, tithe allocation...")}
                        </div>
                        {renderJournal('income_journal')}
                    </>
                )}

                {category.id === 'assets' && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 mb-1">
                            <div style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-center text-sm font-semibold">Goals</div>
                            <div style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-center text-sm font-semibold">Actions</div>
                            <div style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-center text-sm font-semibold">Research</div>
                        </div>
                        {[1, 2, 3].map(n => (
                            <div key={n} className="grid grid-cols-3 gap-2">
                                <input type="text" placeholder={`Goal ${n}`} value={data[`goal${n}`] || ''} onChange={(e) => updateField(category.id, `goal${n}`, e.target.value)} style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }} className="text-sm p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                <input type="text" placeholder={`Action ${n}`} value={data[`action${n}`] || ''} onChange={(e) => updateField(category.id, `action${n}`, e.target.value)} style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }} className="text-sm p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                                <input type="text" placeholder={`Research ${n}`} value={data[`resource${n}`] || ''} onChange={(e) => updateField(category.id, `resource${n}`, e.target.value)} style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }} className="text-sm p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                            </div>
                        ))}
                    </div>
                )}

                {category.id === 'hobby' && (
                    <>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Hobbies & Skills</label>
                            {renderTextarea('hobbies_list', "Painting, coding, gardening...")}
                        </div>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Goals</label>
                            {renderTextarea('hobby_goals', "Finish a painting, learn a new song...")}
                        </div>
                        {renderJournal('hobby_journal')}
                    </>
                )}

                {category.id === 'politics' && (
                    <>
                        <button
                            onClick={() => setShowConstitution(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                            <Flag size={16} /> US Constitution
                        </button>
                        <div>
                            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">Civic Research & Prayer Topics</label>
                            {renderTextarea('politics_research', "Local elections, community service, pray for leaders...")}
                        </div>
                        {renderJournal('politics_journal')}
                    </>
                )}
            </div>
        </div>
    );
};

export default function BiblicalLifeDashboard() {
    const [religion, setReligion] = useState<Religion | null>(null);
    const [showReligionPopup, setShowReligionPopup] = useState(false);
    const [categoryData, setCategoryData] = useState<CategoryData>(() => {
        try {
            const storedData = localStorage.getItem('categoryData');
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("Error parsing categoryData from localStorage", error);
            return {};
        }
    });
    const [showConstitution, setShowConstitution] = useState(false);
    const [verseIndices, setVerseIndices] = useState<VerseIndices>(() => {
        const initialIndices: VerseIndices = {};
        categories.forEach(cat => {
            initialIndices[cat.id] = 0;
        });
        return initialIndices;
    });
    const [quickAdd, setQuickAdd] = useState('');
    const [quickResult, setQuickResult] = useState('');
    const [showAllJournals, setShowAllJournals] = useState(false);
    const [showCrossActions, setShowCrossActions] = useState(false);
    const [showResetReligionPrompt, setShowResetReligionPrompt] = useState(false);
    const [showResetAllFieldsPrompt, setShowResetAllFieldsPrompt] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        const storedReligion = localStorage.getItem('userReligion') as Religion | null;
        if (storedReligion) {
            setReligion(storedReligion);
        } else {
            setShowReligionPopup(true);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('categoryData', JSON.stringify(categoryData));
        } catch (error) {
            console.error("Error saving categoryData to localStorage", error);
        }
    }, [categoryData]);

    const handleReligionSelect = useCallback((selectedReligion: Religion) => {
        localStorage.setItem('userReligion', selectedReligion);
        setReligion(selectedReligion);
        const newVerseIndices: VerseIndices = {};
        categories.forEach(cat => {
            newVerseIndices[cat.id] = 0;
        });
        setVerseIndices(newVerseIndices);
        setShowReligionPopup(false);
    }, []);

    const resetReligion = useCallback(() => {
        localStorage.removeItem('userReligion');
        setReligion(null);
        setShowReligionPopup(true);
        setShowResetReligionPrompt(false);
    }, []);

    const resetAllFields = useCallback(() => {
        localStorage.removeItem('categoryData');
        setCategoryData({});
        const newVerseIndices: VerseIndices = {};
        categories.forEach(cat => {
            newVerseIndices[cat.id] = 0;
        });
        setVerseIndices(newVerseIndices);
        setShowResetAllFieldsPrompt(false);
    }, []);

    const cycleVerse = useCallback((categoryId: string) => {
        if (!religion) return;
        setVerseIndices(prev => ({
            ...prev,
            [categoryId]: (prev[categoryId] + 1) % verses[religion][categoryId].length
        }));
    }, [religion]);

    const updateField = useCallback((categoryId: string, field: string, value: string) => {
        setCategoryData(prev => ({
            ...prev,
            [categoryId]: { ...prev[categoryId], [field]: value }
        }));
    }, []);

    const addTimestamp = useCallback((categoryId: string, field: string) => {
        const data = categoryData[categoryId] || {};
        const current = data[field] || '';
        const timestamp = new Date().toLocaleString();
        const updated = current + `\n\n--- ${timestamp} ---\n`;
        updateField(categoryId, field, updated);
    }, [categoryData, updateField]);

    const processQuickAdd = useCallback(() => {
        if (!quickAdd.trim()) {
            alert('Please enter something!');
            return;
        }
        setQuickResult(`✓ Added: ${quickAdd}`);
        setQuickAdd('');
        setTimeout(() => setQuickResult(''), 3000);
    }, [quickAdd]);

    interface JournalEntry {
        category: string;
        text: string;
        color: string;
        content?: string;
    }

    const getAllJournalEntries = useCallback((): JournalEntry[] => {
        const entries: JournalEntry[] = [];
        categories.forEach(cat => {
            const journalField = `${cat.id}_journal`;
            const data = categoryData[cat.id] || {};
            const journal = data[journalField];
            if (journal) {
                const lines: string[] = journal.split('\n');
                let currentEntry: JournalEntry | null = null;
                lines.forEach((line: string) => {
                    if (line.includes('---') && line.includes(':')) {
                        if (currentEntry) {
                            entries.push(currentEntry);
                        }
                        currentEntry = { category: cat.name, text: line, color: cat.color, content: '' };
                    } else if (line.trim() && currentEntry) {
                        currentEntry.content += (currentEntry.content ? '\n' : '') + line;
                    }
                });
                if (currentEntry) {
                    entries.push(currentEntry);
                }
            }
        });
        return entries.sort((a, b) => {
            const dateA = a.text.match(/(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2} (?:AM|PM))/);
            const dateB = b.text.match(/(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2} (?:AM|PM))/);
            if (dateA && dateB) return new Date(dateB[0]).getTime() - new Date(dateA[0]).getTime();
            return 0;
        });
    }, [categoryData]);

    interface ActionItem {
        category: string;
        field: string;
        text: string;
        color: string;
    }

    const getAllActions = useCallback((): ActionItem[] => {
        const actions: ActionItem[] = [];
        categories.forEach(cat => {
            const data = categoryData[cat.id] || {};
            Object.keys(data).forEach(key => {
                if (key.includes('action') || key.includes('goal')) {
                    const value = data[key];
                    if (value && value.trim()) {
                        actions.push({ category: cat.name, field: key, text: value, color: cat.color });
                    }
                }
            });
        });
        return actions;
    }, [categoryData]);

    const Modal: FC<{ children: React.ReactNode; open: boolean; onClose: () => void; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' }> = ({ children, open, size = 'md' }) => {
        if (!open) return null;
        const sizeMap = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            '4xl': 'max-w-4xl',
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity">
                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderRadius: '1rem',
                    overflow: 'hidden'
                }} className={`shadow-2xl w-full ${sizeMap[size]} flex flex-col`}>
                    {children}
                </div>
            </div>
        );
    };

    const ReligionPopup = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem',
                overflow: 'hidden'
            }} className="max-w-md w-full text-center p-8 shadow-2xl">
                <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-3xl font-bold mb-3">Choose Your Path</h2>
                <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="mb-8">Please select a religious focus to personalize your verses and experience.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => handleReligionSelect('christianity')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Christianity</button>
                    <button onClick={() => handleReligionSelect('islam')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Islam</button>
                    <button onClick={() => handleReligionSelect('judaism')} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Judaism</button>
                    <button onClick={() => handleReligionSelect('buddhism')} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Buddhism</button>
                    <button onClick={() => handleReligionSelect('hinduism')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Hinduism</button>
                    <button onClick={() => handleReligionSelect('sikhism')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Sikhism</button>
                    <button onClick={() => handleReligionSelect('bahaif')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Baha'i Faith</button>
                    <button onClick={() => handleReligionSelect('taoism')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Taoism</button>
                    <button onClick={() => handleReligionSelect('shinto')} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105">Shinto</button>
                </div>
            </div>
        </div>
    );

    if (showReligionPopup) {
        return <ReligionPopup />;
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`} style={{
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-center flex-1">
                            <h1 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-4xl font-bold tracking-tight mb-2">Faithful Life Dashboard</h1>
                            <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-lg">A sacred space to align your daily life with your spiritual values.</p>
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

                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                }} className="rounded-2xl shadow-sm border p-5 mb-8">
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            value={quickAdd}
                            onChange={(e) => setQuickAdd(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && processQuickAdd()}
                            placeholder="Quick add an action, goal, or journal entry..."
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="flex-1 p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            onClick={processQuickAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition"
                        >
                            Add
                        </button>
                    </div>
                    {quickResult && (
                        <div style={{
                            backgroundColor: isDarkMode ? 'rgba(6, 78, 59, 0.3)' : '#dcfce7',
                            color: isDarkMode ? '#86efac' : '#166534'
                        }} className="mt-3 p-3 rounded-lg text-sm font-medium">
                            {quickResult}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <button
                        onClick={() => setShowAllJournals(true)}
                        style={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                            color: isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                        className="flex items-center gap-2 border px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-80"
                    >
                        <Book size={18} /> All Journals
                    </button>
                    <button
                        onClick={() => setShowCrossActions(true)}
                        style={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                            color: isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                        className="flex items-center gap-2 border px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-80"
                    >
                        <Flag size={18} /> All Actions
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {categories.map(category => (
                        <div key={category.id} className={category.id === 'assets' ? 'lg:col-span-2' : ''}>
                            <CategoryCard
                                category={category}
                                data={categoryData[category.id] || {}}
                                religion={religion}
                                verseIndices={verseIndices}
                                cycleVerse={cycleVerse}
                                updateField={updateField}
                                addTimestamp={addTimestamp}
                                setShowConstitution={setShowConstitution}
                                setShowResetReligionPrompt={setShowResetReligionPrompt}
                                showResetReligionPrompt={showResetReligionPrompt}
                                resetReligion={resetReligion}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    ))}
                </div>

                <Modal open={showConstitution} onClose={() => setShowConstitution(false)} size="2xl">
                    <div style={{
                        backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#f0f4ff',
                        borderBottomColor: isDarkMode ? '#4f46e5' : '#dbeafe'
                    }} className="p-5 flex justify-between items-center border-b">
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold flex items-center gap-3"><Flag size={22} className="text-indigo-600" /> U.S. Constitution</h2>
                        <button onClick={() => setShowConstitution(false)} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="hover:text-gray-800 text-2xl transition">&times;</button>
                    </div>
                    <div style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="p-6 text-sm">
                        <p className="mb-4">View the full Constitution of the United States on the official government archive.</p>
                        <a href="https://constitution.congress.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                            constitution.congress.gov
                        </a>
                    </div>
                </Modal>

                <Modal open={showAllJournals} onClose={() => setShowAllJournals(false)} size="4xl">
                    <div style={{
                        backgroundColor: isDarkMode ? 'rgba(92, 51, 0, 0.15)' : '#fffbeb',
                        borderBottomColor: isDarkMode ? '#b45309' : '#fcd34d'
                    }} className="p-5 flex justify-between items-center border-b">
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold flex items-center gap-3"><Book size={22} className="text-amber-600" /> All Journal Entries</h2>
                        <button onClick={() => setShowAllJournals(false)} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="hover:text-gray-800 text-2xl transition">&times;</button>
                    </div>
                    <div style={{ backgroundColor: isDarkMode ? '#111827' : '#ffffff' }} className="p-6 overflow-y-auto max-h-[70vh]">
                        {getAllJournalEntries().length === 0 ? (
                            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic">No journal entries yet. Start journaling in any category!</p>
                        ) : (
                            <div className="space-y-4">
                                {getAllJournalEntries().map((entry, idx) => (
                                    <div key={idx} style={{ borderLeftColor: isDarkMode ? '#4b5563' : '#d1d5db' }} className="border-l-4 pl-4 py-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`${entry.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                                                {entry.category}
                                            </span>
                                            <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-xs">{entry.text.replace(/---/g, '').trim()}</span>
                                        </div>
                                        {entry.content && <p style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm whitespace-pre-wrap">{entry.content}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Modal>

                <Modal open={showCrossActions} onClose={() => setShowCrossActions(false)} size="4xl">
                    <div style={{
                        backgroundColor: isDarkMode ? 'rgba(30, 58, 138, 0.15)' : '#eff6ff',
                        borderBottomColor: isDarkMode ? '#1e3a8a' : '#93c5fd'
                    }} className="p-5 flex justify-between items-center border-b">
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-lg font-bold flex items-center gap-3"><Flag size={22} className="text-blue-600" /> All Goals & Actions</h2>
                        <button onClick={() => setShowCrossActions(false)} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="hover:text-gray-800 text-2xl transition">&times;</button>
                    </div>
                    <div style={{ backgroundColor: isDarkMode ? '#111827' : '#ffffff' }} className="p-6 overflow-y-auto max-h-[70vh]">
                        {getAllActions().length === 0 ? (
                            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic">No goals or actions defined. Add some in the cards above.</p>
                        ) : (
                            <div className="space-y-3">
                                {getAllActions().map((action, idx) => (
                                    <div key={idx} style={{
                                        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                                        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                                    }} className="flex items-start gap-3 p-4 rounded-lg border transition">
                                        <span className={`${action.color} text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
                                            {action.category}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <span style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }} className="text-xs font-semibold block mb-1">
                                                {action.field.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                            <p style={{ color: isDarkMode ? '#d1d5db' : '#111827' }} className="text-sm wrap-break-word">{action.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Modal>

                <Modal open={showResetReligionPrompt} onClose={() => setShowResetReligionPrompt(false)} size="sm">
                    <div className="p-6 text-center">
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-xl font-bold mb-2">Change Religion?</h2>
                        <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-sm mb-6">You will be asked to select a new religious focus and all verse indices will be reset.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setShowResetReligionPrompt(false)} style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }} className="font-semibold py-2 px-5 rounded-lg transition hover:opacity-80">Cancel</button>
                            <button onClick={resetReligion} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition">Change</button>
                        </div>
                    </div>
                </Modal>

                <Modal open={showResetAllFieldsPrompt} onClose={() => setShowResetAllFieldsPrompt(false)} size="sm">
                    <div className="p-6 text-center">
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-xl font-bold mb-2">Reset All Data?</h2>
                        <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="text-sm mb-6">This will permanently delete all your entered data. This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setShowResetAllFieldsPrompt(false)} style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }} className="font-semibold py-2 px-5 rounded-lg transition hover:opacity-80">Cancel</button>
                            <button onClick={resetAllFields} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition">Reset All</button>
                        </div>
                    </div>
                </Modal>

                <footer style={{ borderTopColor: isDarkMode ? '#374151' : '#e5e7eb' }} className="mt-12 pt-8 border-t">
                    <div className="flex justify-center items-center gap-6">
                        <button onClick={() => setShowResetAllFieldsPrompt(true)} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm font-medium transition hover:text-red-600">
                            Reset All Data
                        </button>
                        <div style={{ backgroundColor: isDarkMode ? '#4b5563' : '#d1d5db' }} className="w-px h-4"></div>
                        <button onClick={() => setShowResetReligionPrompt(true)} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm font-medium transition hover:text-red-600">
                            Change Religion
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}