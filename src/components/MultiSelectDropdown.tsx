import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface DropdownProps {
    label: string;
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    isDarkMode: boolean;
    allowCustom?: boolean;
    onCustomAdd?: (value: string) => void;
    placeholder?: string;
}

export const MultiSelectDropdown: FC<DropdownProps> = ({
    label,
    options,
    value,
    onChange,
    isDarkMode,
    allowCustom = true,
    onCustomAdd,
    placeholder = 'Select...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customValue, setCustomValue] = useState('');

    const toggleOption = useCallback((option: string) => {
        onChange(
            value.includes(option)
                ? value.filter(v => v !== option)
                : [...value, option]
        );
    }, [value, onChange]);

    const handleCustomAdd = useCallback(() => {
        if (customValue.trim()) {
            onChange([...value, customValue.trim()]);
            onCustomAdd?.(customValue.trim());
            setCustomValue('');
        }
    }, [customValue, value, onChange, onCustomAdd]);

    return (
        <div className="relative">
            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-2">
                {label}
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                    color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
                className="w-full px-3 py-2 border rounded-lg flex items-center justify-between text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span>{value.length > 0 ? `${value.length} selected` : placeholder}</span>
                <ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                }} className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50">
                    <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                        {options.map(option => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                <input
                                    type="checkbox"
                                    checked={value.includes(option)}
                                    onChange={() => toggleOption(option)}
                                    className="w-4 h-4 rounded"
                                />
                                <span style={{ color: isDarkMode ? '#d1d5db' : '#111827' }} className="text-sm">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>

                    {allowCustom && (
                        <div style={{ borderTopColor: isDarkMode ? '#374151' : '#e5e7eb' }} className="border-t p-2 flex gap-1">
                            <input
                                type="text"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomAdd()}
                                placeholder="Add custom..."
                                style={{
                                    backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                                    color: isDarkMode ? '#f3f4f6' : '#111827'
                                }}
                                className="flex-1 px-2 py-1 border rounded text-xs focus:outline-none"
                            />
                            <button
                                onClick={handleCustomAdd}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            )}

            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {value.map(item => (
                        <span
                            key={item}
                            style={{
                                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#d1d5db' : '#111827'
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                        >
                            {item}
                            <button
                                onClick={() => onChange(value.filter(v => v !== item))}
                                className="hover:opacity-70"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
