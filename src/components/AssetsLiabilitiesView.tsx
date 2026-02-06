import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
    getAssets,
    getLiabilities,
    addAsset,
    addLiability,
    updateAsset,
    updateLiability,
    deleteAsset,
    deleteLiability,
    type AssetRecord,
    type LiabilityRecord,
} from '../db';

interface AssetsLiabilitiesViewProps {
    isDarkMode: boolean;
}

function parseNum(val: string): number {
    const n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
}

export const AssetsLiabilitiesView: FC<AssetsLiabilitiesViewProps> = ({ isDarkMode }) => {
    const [assets, setAssets] = useState<AssetRecord[]>([]);
    const [liabilities, setLiabilities] = useState<LiabilityRecord[]>([]);

    const load = useCallback(async () => {
        const [a, l] = await Promise.all([getAssets(), getLiabilities()]);
        setAssets(a);
        setLiabilities(l);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const grossProfit = assets.reduce((sum, a) => sum + (a.profitPerYear || 0), 0);
    const grossCost = liabilities.reduce((sum, l) => sum + (l.costPerYear || 0), 0);
    const grossOutcome = grossProfit - grossCost;

    const inputStyle = {
        backgroundColor: isDarkMode ? '#374151' : '#fff',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        color: isDarkMode ? '#f3f4f6' : '#111827',
    };

    const handleAddAsset = async () => {
        await addAsset({ name: '', profitPerYear: 0 });
        await load();
    };

    const handleAddLiability = async () => {
        await addLiability({ name: '', costPerYear: 0 });
        await load();
    };

    return (
        <div
            style={{
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            }}
            className="rounded-lg border overflow-hidden space-y-4"
        >
            <div>
                <h4 style={{ color: isDarkMode ? '#f3f4f6' : '#111827', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="text-sm font-bold p-3 border-b">
                    Assets & Liabilities
                </h4>

                <div className="flex flex-col gap-4 p-3">
                    {/* Assets */}
                    <div style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="border rounded-lg p-3">
                        <h5 style={{ color: isDarkMode ? '#22c55e' : '#15803d' }} className="text-sm font-bold mb-2">Assets (Profit / Year)</h5>
                        <div className="space-y-2">
                            {assets.map((a) => (
                                <div key={a.id} className="flex flex-col gap-1 p-2 rounded border" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                                    <input
                                        value={a.name}
                                        onChange={(e) => { setAssets(prev => prev.map(x => x.id === a.id ? { ...x, name: e.target.value } : x)); }}
                                        onBlur={(e) => updateAsset(a.id, { name: e.target.value })}
                                        placeholder="Asset name"
                                        style={inputStyle}
                                        className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={a.profitPerYear || ''}
                                            onChange={(e) => { const v = parseNum(e.target.value); setAssets(prev => prev.map(x => x.id === a.id ? { ...x, profitPerYear: v } : x)); }}
                                            onBlur={(e) => updateAsset(a.id, { profitPerYear: parseNum(e.target.value) })}
                                            placeholder="Profit"
                                            style={inputStyle}
                                            className="flex-1 min-w-0 px-2 py-1 text-sm border rounded text-right"
                                        />
                                        <button onClick={() => deleteAsset(a.id)} className="p-1 text-red-500 shrink-0"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddAsset} className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus size={14} /> Add asset
                        </button>
                    </div>

                    {/* Liabilities */}
                    <div style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="border rounded-lg p-3">
                        <h5 style={{ color: isDarkMode ? '#ef4444' : '#b91c1c' }} className="text-sm font-bold mb-2">Liabilities (Cost / Year)</h5>
                        <div className="space-y-2">
                            {liabilities.map((l) => (
                                <div key={l.id} className="flex flex-col gap-1 p-2 rounded border" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                                    <input
                                        value={l.name}
                                        onChange={(e) => { setLiabilities(prev => prev.map(x => x.id === l.id ? { ...x, name: e.target.value } : x)); }}
                                        onBlur={(e) => updateLiability(l.id, { name: e.target.value })}
                                        placeholder="Liability name"
                                        style={inputStyle}
                                        className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={l.costPerYear || ''}
                                            onChange={(e) => { const v = parseNum(e.target.value); setLiabilities(prev => prev.map(x => x.id === l.id ? { ...x, costPerYear: v } : x)); }}
                                            onBlur={(e) => updateLiability(l.id, { costPerYear: parseNum(e.target.value) })}
                                            placeholder="Cost"
                                            style={inputStyle}
                                            className="flex-1 min-w-0 px-2 py-1 text-sm border rounded text-right"
                                        />
                                        <button onClick={() => deleteLiability(l.id)} className="p-1 text-red-500 shrink-0"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddLiability} className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus size={14} /> Add liability
                        </button>
                    </div>
                </div>

                {/* Gross Outcome */}
                <div
                    style={{
                        backgroundColor: grossOutcome >= 0 ? (isDarkMode ? '#14532d' : '#dcfce7') : (isDarkMode ? '#7f1d1d' : '#fee2e2'),
                        color: grossOutcome >= 0 ? (isDarkMode ? '#86efac' : '#166534') : (isDarkMode ? '#fca5a5' : '#b91c1c'),
                    }}
                    className="p-3 font-bold text-center"
                >
                    Gross Outcome: {grossOutcome >= 0 ? '+' : ''}{grossOutcome.toLocaleString()} / year
                </div>
            </div>
        </div>
    );
};
