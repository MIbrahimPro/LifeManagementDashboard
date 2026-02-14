import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
    isExpanded: boolean;
    onHeaderClick: () => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({
    category,
    religion,
    verseIndex,
    cycleVerse,
    isDarkMode,
    versesRefreshKey,
    isExpanded,
    onHeaderClick
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
        }} className="rounded-2xl shadow-sm border flex flex-col overflow-hidden shrink-0">
            {/* Header - always visible, clickable */}
            <button
                type="button"
                onClick={onHeaderClick}
                className="flex items-center gap-3 p-4 w-full text-left hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-2xl"
            >
                <div className={`p-2.5 rounded-xl shrink-0 ${category.color}`}>
                    <Icon size={20} className="text-white" />
                </div>
                <h2 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-base font-bold flex-1">
                    {category.name}
                </h2>
                {isExpanded ? (
                    <ChevronUp size={20} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="shrink-0" />
                ) : (
                    <ChevronDown size={20} style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="shrink-0" />
                )}
            </button>

            {/* Body - verse + checklist, only when expanded */}
            {isExpanded && (
                <div
                    style={{ borderTopColor: isDarkMode ? '#374151' : '#e5e7eb' }}
                    className="overflow-y-auto max-h-[calc(100vh-16rem)] px-4 pb-4 space-y-3 shrink-0 border-t"
                >
                    {/* Verse */}
                    <div
                        style={{
                            backgroundColor: isDarkMode ? 'rgba(92, 51, 0, 0.15)' : '#fffbeb',
                            borderLeftColor: isDarkMode ? '#b45309' : '#fcd34d',
                            color: isDarkMode ? '#fef3c7' : '#78350f'
                        }}
                        className="border-l-4 p-3 rounded-lg mt-4 text-xs italic cursor-pointer transition hover:opacity-80"
                        onClick={() => cycleVerse(category.id)}
                    >
                        {currentVerse}
                    </div>

                    {/* Checklist */}
                    <CardChecklist categoryId={category.id} isDarkMode={isDarkMode} />
                </div>
            )}
        </div>
    );
};
