import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { Copy, Trash2, Mail, Type, Calendar } from 'lucide-react';
import { getUserSettings, setUserSettings, getTextToolContent, setTextToolContent } from '../db';

interface TopToolsProps {
    isDarkMode: boolean;
    compact?: boolean;
}

export const TopTools: FC<TopToolsProps> = ({ isDarkMode, compact }) => {
    const [activeTab, setActiveTab] = useState<'email' | 'text' | 'calendar' | null>(null);
    const [email, setEmail] = useState('your-email@example.com');
    const [text, setText] = useState('');
    const [copyFeedback, setCopyFeedback] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        getUserSettings().then((s) => s?.userEmail && setEmail(s.userEmail));
        getTextToolContent().then(setText);
    }, []);

    const persistEmail = useCallback((value: string) => {
        setUserSettings({ userEmail: value });
    }, []);
    const persistText = useCallback((value: string) => {
        setTextToolContent(value);
    }, []);

    const parseDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const today = formatDate(new Date());
    const isToday = selectedDate === today;

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopyFeedback('Email copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyFeedback('Text copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleClearText = () => {
        setText('');
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendar = () => {
        const currentDate = parseDate(selectedDate);
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dayDateString = formatDate(dayDate);
            const isSelected = dayDateString === selectedDate;
            const isDayToday = dayDateString === today;

            days.push(
                <button
                    key={i}
                    onClick={() => {
                        setSelectedDate(dayDateString);
                    }}
                    className={`p-2 rounded text-sm font-semibold transition ${isSelected
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-200'
                        } ${isDayToday && !isSelected ? (isDarkMode ? 'border-2 border-blue-400' : 'border-2 border-blue-500') : ''}`}
                    style={isDayToday && !isSelected ? {
                        borderColor: isDarkMode ? '#60a5fa' : '#3b82f6'
                    } : undefined}
                >
                    {i}
                </button>
            );
        }

        return days;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    const compactContent = compact && (
        <>
            {[
                { id: 'email' as const, label: 'Email', icon: Mail },
                { id: 'text' as const, label: 'Text', icon: Type },
                { id: 'calendar' as const, label: 'Calendar', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
                <div key={id} className="relative">
                    <button
                        onClick={() => setActiveTab(activeTab === id ? null : id)}
                        style={{
                            backgroundColor: activeTab === id ? '#2563eb' : isDarkMode ? '#374151' : '#e5e7eb',
                            color: activeTab === id ? '#fff' : isDarkMode ? '#f3f4f6' : '#111827'
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                    {activeTab === id && (
                        <div
                            ref={containerRef}
                            style={{
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                            }}
                            className="absolute left-0 top-full mt-2 z-50 min-w-[320px] max-w-[400px] p-4 rounded-lg border shadow-xl"
                        >
                            {id === 'email' && (
                                <div>
                                    <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">Your Email</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); persistEmail(e.target.value); }}
                                            style={{ backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#f3f4f6' : '#111827' }}
                                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button onClick={handleCopyEmail} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm">
                                            <Copy size={16} /> Copy
                                        </button>
                                    </div>
                                    {copyFeedback === 'Email copied!' && <p style={{ color: '#10b981' }} className="text-xs mt-2 font-semibold">✓ {copyFeedback}</p>}
                                </div>
                            )}
                            {id === 'text' && (
                                <div>
                                    <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">Quick Text</label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onBlur={(e) => persistText(e.target.value)}
                                        placeholder="Type your text here..."
                                        style={{ backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#f3f4f6' : '#111827' }}
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleCopyText} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"><Copy size={16} /> Copy</button>
                                        <button onClick={() => { handleClearText(); persistText(''); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"><Trash2 size={16} /> Clear</button>
                                    </div>
                                    {copyFeedback === 'Text copied!' && <p style={{ color: '#10b981' }} className="text-xs mt-2 font-semibold">✓ {copyFeedback}</p>}
                                </div>
                            )}
                            {id === 'calendar' && (
                                <div>
                                    <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                                        {parseDate(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </label>
                                    {!isToday && <button onClick={() => setSelectedDate(today)} className="w-full mb-3 py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">Today</button>}
                                    <div className="grid grid-cols-7 gap-1">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-center text-xs font-semibold p-1">{d}</div>)}
                                        {renderCalendar()}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </>
    );

    if (compact) return <>{compactContent}</>;

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
        }} className="rounded-2xl shadow-sm border p-5 mb-8">
            <div className="flex gap-2 mb-4 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                {[
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'text', label: 'Text', icon: Type },
                    { id: 'calendar', label: 'Calendar', icon: Calendar }
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${(activeTab ?? 'email') === id
                            ? 'bg-blue-600 text-white'
                            : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {(activeTab ?? 'email') === 'email' && (
                    <div>
                        <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                            Your Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); persistEmail(e.target.value); }}
                                style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }}
                                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleCopyEmail}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm"
                            >
                                <Copy size={16} /> Copy
                            </button>
                        </div>
                        {copyFeedback === 'Email copied!' && (
                            <p style={{ color: '#10b981' }} className="text-xs mt-2 font-semibold">✓ {copyFeedback}</p>
                        )}
                    </div>
                )}

                {activeTab === 'text' && (
                    <div>
                        <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                            Quick Text
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onBlur={(e) => persistText(e.target.value)}
                            placeholder="Type your text here..."
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={4}
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleCopyText}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"
                            >
                                <Copy size={16} /> Copy
                            </button>
                            <button
                                onClick={() => { handleClearText(); setText(''); persistText(''); }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                        </div>
                        {copyFeedback === 'Text copied!' && (
                            <p style={{ color: '#10b981' }} className="text-xs mt-2 font-semibold">✓ {copyFeedback}</p>
                        )}
                    </div>
                )}

                {(activeTab ?? 'email') === 'calendar' && (
                    <div>
                        <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-3">
                            Selected: {parseDate(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </label>
                        {!isToday && (
                            <button
                                onClick={() => setSelectedDate(today)}
                                className={`w-full mb-4 py-2 px-3 rounded font-semibold text-sm transition ${isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                Today
                            </button>
                        )}
                        <div className="grid grid-cols-7 gap-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div
                                    key={day}
                                    style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                                    className="text-center text-xs font-semibold p-2"
                                >
                                    {day}
                                </div>
                            ))}
                            {renderCalendar()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
