import { useState } from 'react';
import type { FC } from 'react';
import type { Religion } from '../data/verses';

interface ReligionPopupProps {
    isDarkMode: boolean;
    onSelect: (religion: Religion) => void;
    onClose: () => void;
}

export const ReligionPopup: FC<ReligionPopupProps> = ({ isDarkMode, onSelect }) => {
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customReligion, setCustomReligion] = useState('');

    const handleCustomSubmit = () => {
        if (customReligion.trim()) {
            onSelect(customReligion as Religion);
            setCustomReligion('');
            setShowCustomForm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderRadius: '1rem',
                overflow: 'hidden'
            }} className="max-w-md w-full text-center p-8 shadow-2xl">
                {!showCustomForm ? (
                    <>
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-3xl font-bold mb-3">
                            Choose Your Path
                        </h2>
                        <p style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} className="mb-8">
                            Please select a religious focus to personalize your verses and experience.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {['christianity', 'islam', 'judaism', 'buddhism', 'hinduism', 'Atheism'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => onSelect(r as Religion)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowCustomForm(true)}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="w-full py-3 px-4 rounded-lg font-semibold transition hover:opacity-80"
                        >
                            ✨ Other Religion
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="text-2xl font-bold mb-4">
                            Enter Your Spiritual Tradition
                        </h2>
                        <input
                            type="text"
                            value={customReligion}
                            onChange={(e) => setCustomReligion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                            placeholder="e.g., Zoroastrianism, Wicca, Taoism..."
                            autoFocus
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowCustomForm(false);
                                    setCustomReligion('');
                                }}
                                style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }}
                                className="flex-1 py-3 px-4 rounded-lg font-semibold transition hover:opacity-80"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCustomSubmit}
                                disabled={!customReligion.trim()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
