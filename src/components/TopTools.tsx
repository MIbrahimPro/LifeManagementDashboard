import { useState } from 'react';
import type { FC } from 'react';
import { Copy, Trash2, Mail, Type, Calendar } from 'lucide-react';

interface TopToolsProps {
    isDarkMode: boolean;
}

export const TopTools: FC<TopToolsProps> = ({ isDarkMode }) => {
    const [activeTab, setActiveTab] = useState<'email' | 'text' | 'calendar'>('email');
    const [email, setEmail] = useState('your-email@example.com');
    const [text, setText] = useState('');
    const [copyFeedback, setCopyFeedback] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
        const date = new Date(selectedDate);
        const daysInMonth = getDaysInMonth(date);
        const firstDay = getFirstDayOfMonth(date);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = new Date(selectedDate).getDate() === i &&
                new Date(selectedDate).getMonth() === date.getMonth() &&
                new Date(selectedDate).getFullYear() === date.getFullYear();

            days.push(
                <button
                    key={i}
                    onClick={() => {
                        const newDate = new Date(date.getFullYear(), date.getMonth(), i);
                        setSelectedDate(newDate.toISOString().split('T')[0]);
                    }}
                    className={`p-2 rounded text-sm font-semibold transition ${isSelected
                            ? 'bg-blue-600 text-white'
                            : isDarkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return days;
    };

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
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${activeTab === id
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
                {activeTab === 'email' && (
                    <div>
                        <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                            Your Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                onClick={handleClearText}
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

                {activeTab === 'calendar' && (
                    <div>
                        <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-3">
                            Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </label>
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
