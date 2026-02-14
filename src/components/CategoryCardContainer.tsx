import type { FC } from 'react';
import { Heart, Palette, DollarSign, Building2, User, Users, Flag, Book } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { Religion } from '../data/verses';
import { CategoryCard } from './CategoryCard';

interface Category {
    id: string;
    name: string;
    icon: FC<LucideProps>;
    color: string;
}

interface CategoryCardContainerProps {
    religion: Religion | null;
    verseIndices: { [key: string]: number };
    cycleVerse: (categoryId: string) => void;
    isDarkMode: boolean;
    versesRefreshKey: number;
    expandedCategoryId: string | null;
    onToggleCategory: (id: string) => void;
}

const categories: Category[] = [
    { id: 'physical', name: 'PHYSICAL', icon: Heart, color: 'bg-red-600' },
    { id: 'hobby', name: 'HOBBY', icon: Palette, color: 'bg-purple-600' },
    { id: 'income', name: 'INCOME & EXPENSES', icon: DollarSign, color: 'bg-green-600' },
    { id: 'assets', name: 'ASSETS & LIABILITIES', icon: Building2, color: 'bg-blue-600' },
    { id: 'family', name: 'FAMILY & FRIENDS', icon: Users, color: 'bg-orange-600' },
    { id: 'oneonone', name: 'ONE-ON-ONE', icon: User, color: 'bg-yellow-600' },
    { id: 'politics', name: 'POLITICS', icon: Flag, color: 'bg-indigo-600' },
    { id: 'spiritual', name: 'SPIRITUAL', icon: Book, color: 'bg-amber-600' }
];

export const CategoryCardContainer: FC<CategoryCardContainerProps> = ({
    religion,
    verseIndices,
    cycleVerse,
    isDarkMode,
    versesRefreshKey,
    expandedCategoryId,
    onToggleCategory
}) => {
    return (
        <div className="flex gap-3 items-start">
            {[0, 1, 2, 3].map(colIndex => (
                <div key={colIndex} className="flex-1 flex flex-col gap-3 min-w-0">
                    <CategoryCard
                        key={categories[colIndex].id}
                        category={categories[colIndex]}
                        religion={religion}
                        verseIndex={verseIndices[categories[colIndex].id] || 0}
                        cycleVerse={cycleVerse}
                        isDarkMode={isDarkMode}
                        versesRefreshKey={versesRefreshKey}
                        isExpanded={expandedCategoryId === categories[colIndex].id}
                        onHeaderClick={() => onToggleCategory(categories[colIndex].id)}
                    />
                    <CategoryCard
                        key={categories[colIndex + 4].id}
                        category={categories[colIndex + 4]}
                        religion={religion}
                        verseIndex={verseIndices[categories[colIndex + 4].id] || 0}
                        cycleVerse={cycleVerse}
                        isDarkMode={isDarkMode}
                        versesRefreshKey={versesRefreshKey}
                        isExpanded={expandedCategoryId === categories[colIndex + 4].id}
                        onHeaderClick={() => onToggleCategory(categories[colIndex + 4].id)}
                    />
                </div>
            ))}
        </div>
    );
};
