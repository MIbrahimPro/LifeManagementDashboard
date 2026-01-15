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
    versesRefreshKey
}) => {
    return (
        <>
            {categories.map(category => (
                <div key={category.id}>
                    <CategoryCard
                        category={category}
                        religion={religion}
                        verseIndex={verseIndices[category.id] || 0}
                        cycleVerse={cycleVerse}
                        isDarkMode={isDarkMode}
                        versesRefreshKey={versesRefreshKey}
                    />
                </div>
            ))}
        </>
    );
};
