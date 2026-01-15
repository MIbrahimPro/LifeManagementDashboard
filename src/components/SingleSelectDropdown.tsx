import { useState } from 'react';
import type { FC } from 'react';
import { ChevronDown } from 'lucide-react';

interface SingleSelectDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    isDarkMode: boolean;
}

export const SingleSelectDropdown: FC<SingleSelectDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    isDarkMode
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                {label}
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                    color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
                className="w-full p-2.5 border rounded-lg flex items-center justify-between hover:opacity-80 transition text-sm"
            >
                <span>{value || 'Select an option'}</span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div
                    style={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                    }}
                    className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            style={{
                                backgroundColor:
                                    value === option
                                        ? isDarkMode
                                            ? '#374151'
                                            : '#e5e7eb'
                                        : 'transparent',
                                color: isDarkMode ? '#f3f4f6' : '#111827'
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-blue-500 hover:text-white transition first:rounded-t-lg last:rounded-b-lg"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
