import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { LucideProps } from 'lucide-react';
import type { Religion } from '../data/verses';
import { versesCache } from '../data/verses';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { SingleSelectDropdown } from './SingleSelectDropdown';
import { goalOptions } from '../data/dropdownOptions';

interface Category {
    id: string;
    name: string;
    icon: FC<LucideProps>;
    color: string;
}

interface CategoryCardProps {
    category: Category;
    religion: Religion | null;
    verseIndex: number;
    cycleVerse: (categoryId: string) => void;
    isDarkMode: boolean;
    versesRefreshKey: number;
}

export const CategoryCard: FC<CategoryCardProps> = ({
    category,
    religion,
    verseIndex,
    cycleVerse,
    isDarkMode,
    versesRefreshKey
}) => {
    const Icon = category.icon;
    const [currentVerse, setCurrentVerse] = useState<string>("Loading...");
    const [data, setData] = useState<{ [key: string]: string | string[] }>(() => {
        try {
            const stored = localStorage.getItem(`category_${category.id}`);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    // Load verse
    useEffect(() => {
        if (!religion) {
            setCurrentVerse("Loading...");
            return;
        }

        if (versesCache[religion] && versesCache[religion][category.id]) {
            const verseList = versesCache[religion][category.id];
            const index = verseIndex % verseList.length;
            setCurrentVerse(verseList[index] || "Stay strong and keep moving forward.");
        } else {
            setCurrentVerse("Verse not available.");
        }
    }, [religion, category.id, verseIndex, versesRefreshKey]);

    // Save data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(`category_${category.id}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving category data', error);
        }
    }, [data, category.id]);

    const updateField = (field: string, value: string | string[]) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addTextField = (field: string, placeholder: string) => (
        <div>
            <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">
                {placeholder}
            </label>
            <textarea
                value={data[field] as string || ''}
                onChange={(e) => updateField(field, e.target.value)}
                placeholder={placeholder}
                style={{
                    backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                    color: isDarkMode ? '#f3f4f6' : '#111827'
                }}
                className="w-full text-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
            />
        </div>
    );

    return (
        <div style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
        }} className="rounded-2xl shadow-sm border p-5 flex flex-col h-full hover:shadow-md transition">
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${category.color}`}>
                    <Icon size={20} className="text-white" />
                </div>
                <h2 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-base font-bold">
                    {category.name}
                </h2>
            </div>

            {/* Verse */}
            <div
                style={{
                    backgroundColor: isDarkMode ? 'rgba(92, 51, 0, 0.15)' : '#fffbeb',
                    borderLeftColor: isDarkMode ? '#b45309' : '#fcd34d',
                    color: isDarkMode ? '#fef3c7' : '#78350f'
                }}
                className="border-l-4 p-3 rounded-lg mb-4 text-xs italic cursor-pointer transition hover:opacity-80"
                onClick={() => cycleVerse(category.id)}
            >
                {currentVerse}
            </div>

            {/* Content - Specific per category */}
            <div className="space-y-3 grow overflow-y-auto">
                {/* Goals Dropdown - Single Select */}
                <SingleSelectDropdown
                    label="Goals"
                    options={goalOptions}
                    value={typeof data.goals === 'string' ? data.goals : ''}
                    onChange={(value) => updateField('goals', value)}
                    isDarkMode={isDarkMode}
                />

                {/* Category-specific fields */}
                {category.id === 'physical' && (
                    <>
                        {addTextField('doctors', 'Doctors')}
                        {addTextField('food', 'Food - What to Eat')}
                        {addTextField('vitamins', 'Vitamins & Supplements')}
                        {addTextField('medications', 'Medications')}
                        {addTextField('motion', 'Motion: Walk, Run, Yoga')}
                        <MultiSelectDropdown
                            label="Contacts / Websites"
                            options={['Doctor', 'Gym', 'Pharmacy', 'Health Coach']}
                            value={Array.isArray(data.contacts) ? data.contacts : []}
                            onChange={(value) => updateField('contacts', value)}
                            isDarkMode={isDarkMode}
                        />
                    </>
                )}

                {category.id === 'hobby' && (
                    <>
                        {addTextField('hobbies', 'Hobbies & Skills')}
                        {addTextField('hobbyGoalsText', 'Goals Details')}
                        <MultiSelectDropdown
                            label="Contacts / Websites"
                            options={['Community', 'Tutorial', 'Supplier', 'Mentor']}
                            value={Array.isArray(data.hobbyContacts) ? data.hobbyContacts : []}
                            onChange={(value) => updateField('hobbyContacts', value)}
                            isDarkMode={isDarkMode}
                        />
                    </>
                )}

                {category.id === 'income' && (
                    <>
                        {addTextField('contacts', 'Contacts')}
                        {addTextField('banking', 'Banking')}
                        {addTextField('expenses', 'Expenses')}
                        <MultiSelectDropdown
                            label="Income Sources"
                            options={['Salary', 'Side Business', 'Investments', 'Rental Income']}
                            value={Array.isArray(data.incomeSources) ? data.incomeSources : []}
                            onChange={(value) => updateField('incomeSources', value)}
                            isDarkMode={isDarkMode}
                        />
                        <MultiSelectDropdown
                            label="Contacts / Websites"
                            options={['Bank', 'Accountant', 'Investor', 'Advisor']}
                            value={Array.isArray(data.incomeContacts) ? data.incomeContacts : []}
                            onChange={(value) => updateField('incomeContacts', value)}
                            isDarkMode={isDarkMode}
                        />
                    </>
                )}

                {category.id === 'assets' && (
                    <>
                        {addTextField('liabilities', 'Liabilities')}
                    </>
                )}

                {category.id === 'family' && (
                    <>
                        {addTextField('birthdays', 'Birthday List (DOB + Age)')}
                        {addTextField('familyContacts', 'Contact Info')}
                    </>
                )}

                {category.id === 'oneonone' && (
                    <>
                        {addTextField('argumentTopics', 'Identify 3 Main Topics of Argument & Fix')}
                    </>
                )}

                {category.id === 'politics' && (
                    <>
                        {addTextField('federalLaws', 'Federal Laws')}
                        {addTextField('stateLaws', 'State Laws')}
                        {addTextField('localLaws', 'Local Laws')}
                        <MultiSelectDropdown
                            label="Contacts / Websites"
                            options={['Government', 'Advocacy', 'Representative', 'Community']}
                            value={Array.isArray(data.politicsContacts) ? data.politicsContacts : []}
                            onChange={(value) => updateField('politicsContacts', value)}
                            isDarkMode={isDarkMode}
                        />
                    </>
                )}

                {category.id === 'spiritual' && (
                    <>
                        <MultiSelectDropdown
                            label="Contacts / Websites"
                            options={['Pastor', 'Spiritual Guide', 'Church', 'Retreat Center', 'Meditation App']}
                            value={Array.isArray(data.spiritualContacts) ? data.spiritualContacts : []}
                            onChange={(value) => updateField('spiritualContacts', value)}
                            isDarkMode={isDarkMode}
                        />
                    </>
                )}

                {/* Habit Fields (all categories) */}
                {category.id !== 'assets' && (
                    <>
                        {addTextField('goodHabit', 'Gain a Good Habit')}
                        {addTextField('badHabit', 'Lose a Bad Habit')}
                    </>
                )}
            </div>
        </div>
    );
};
