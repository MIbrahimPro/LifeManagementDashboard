import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { LucideProps } from 'lucide-react';
import type { Religion } from '../data/verses';
import { versesCache } from '../data/verses';
import { CardChecklist } from './CardChecklist';

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

    // Load verse (from cache populated by dashboard; verses stored in db via verseUtils)
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

            {/* Content - Checklist (Goals, Vitamins, Medication, etc. + Contacts & Websites) */}
            <div className="space-y-3 grow overflow-y-auto">
                <CardChecklist categoryId={category.id} isDarkMode={isDarkMode} />
            </div>
        </div>
    );
};
