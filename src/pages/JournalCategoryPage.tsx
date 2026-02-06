import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDailySnapshotsByCategory, getUserSettings } from '../db';
import type { DailySnapshotRecord } from '../db';

const CATEGORY_NAMES: Record<string, string> = {
    physical: 'Physical',
    hobby: 'Hobby',
    income: 'Income & Expenses',
    assets: 'Assets & Liabilities',
    family: 'Family & Friends',
    oneonone: 'One-on-One',
    politics: 'Politics',
    spiritual: 'Spiritual',
};

export default function JournalCategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [snapshots, setSnapshots] = useState<DailySnapshotRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        getUserSettings().then((s) => {
            const dark = s?.isDarkMode !== undefined
                ? s.isDarkMode
                : (document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches);
            setIsDarkMode(dark);
        });
    }, []);

    useEffect(() => {
        if (!categoryId) return;
        getDailySnapshotsByCategory(categoryId).then(setSnapshots).finally(() => setLoading(false));
    }, [categoryId]);

    const formatDate = (d: string) => {
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!categoryId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Link to="/journal" className="text-blue-500">← Back to Journal</Link>
            </div>
        );
    }

    const name = CATEGORY_NAMES[categoryId] ?? categoryId;

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#111827',
            }}
        >
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">📖 {name} – History</h1>
                    <Link to="/journal" className="text-blue-500 hover:text-blue-600 font-medium">
                        ← All categories
                    </Link>
                </div>

                {loading ? (
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Loading...</p>
                ) : snapshots.length === 0 ? (
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="italic">
                        No history yet for this category. Data is saved at midnight each day.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {snapshots.map((snap) => (
                            <div
                                key={snap.id}
                                style={{
                                    backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                                }}
                                className="rounded-xl border p-4"
                            >
                                <h3 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="font-bold mb-3">
                                    {formatDate(snap.date)}
                                </h3>
                                {snap.goalsLog.length > 0 && (
                                    <div className="mb-3">
                                        <span className="text-sm font-semibold" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>Goals:</span>
                                        <ul className="list-disc list-inside text-sm mt-1" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>
                                            {snap.goalsLog.map((g, i) => (
                                                <li key={i}>{g.text} ({g.type})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {snap.trackerLog.length > 0 && (
                                    <div>
                                        <span className="text-sm font-semibold" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>Checklist:</span>
                                        <ul className="list-disc list-inside text-sm mt-1" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}>
                                            {snap.trackerLog.map((l, i) => (
                                                <li key={i}>{l.label}{l.completed ? ' ✓' : ''}{l.value ? ` – ${l.value}` : ''}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
