import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
    getIncome,
    getExpenses,
    addIncomeRecord,
    addExpenseRecord,
    updateIncomeRecord,
    updateExpenseRecord,
    deleteIncomeRecord,
    deleteExpenseRecord,
    type IncomeRecord,
    type ExpenseRecord,
} from '../db';

interface IncomeExpensesViewProps {
    isDarkMode: boolean;
}

function parseNum(val: string): number {
    const n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? 0 : n;
}

export const IncomeExpensesView: FC<IncomeExpensesViewProps> = ({ isDarkMode }) => {
    const [income, setIncome] = useState<IncomeRecord[]>([]);
    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

    const load = useCallback(async () => {
        const [i, e] = await Promise.all([getIncome(), getExpenses()]);
        setIncome(i);
        setExpenses(e);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const totalIncome = income.reduce((sum, i) => sum + (i.amountPerYear || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amountPerYear || 0), 0);
    const netOutcome = totalIncome - totalExpenses;

    const inputStyle = {
        backgroundColor: isDarkMode ? '#374151' : '#fff',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        color: isDarkMode ? '#f3f4f6' : '#111827',
    };

    const handleAddIncome = async () => {
        await addIncomeRecord({ name: '', amountPerYear: 0 });
        await load();
    };

    const handleAddExpense = async () => {
        await addExpenseRecord({ name: '', amountPerYear: 0 });
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
                    Income & Expenses
                </h4>

                <div className="flex flex-col gap-4 p-3">
                    {/* Income */}
                    <div style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="border rounded-lg p-3">
                        <h5 style={{ color: isDarkMode ? '#22c55e' : '#15803d' }} className="text-sm font-bold mb-2">Income (Amount / Year)</h5>
                        <div className="space-y-2">
                            {income.map((i) => (
                                <div key={i.id} className="flex flex-col gap-1 p-2 rounded border" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                                    <input
                                        value={i.name}
                                        onChange={(e) => { setIncome(prev => prev.map(x => x.id === i.id ? { ...x, name: e.target.value } : x)); }}
                                        onBlur={(e) => updateIncomeRecord(i.id, { name: e.target.value })}
                                        placeholder="Income source"
                                        style={inputStyle}
                                        className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={i.amountPerYear || ''}
                                            onChange={(e) => { const v = parseNum(e.target.value); setIncome(prev => prev.map(x => x.id === i.id ? { ...x, amountPerYear: v } : x)); }}
                                            onBlur={(e) => updateIncomeRecord(i.id, { amountPerYear: parseNum(e.target.value) })}
                                            placeholder="Amount"
                                            style={inputStyle}
                                            className="flex-1 min-w-0 px-2 py-1 text-sm border rounded text-right"
                                        />
                                        <button onClick={() => deleteIncomeRecord(i.id)} className="p-1 text-red-500 shrink-0"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddIncome} className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus size={14} /> Add income
                        </button>
                    </div>

                    {/* Expenses */}
                    <div style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="border rounded-lg p-3">
                        <h5 style={{ color: isDarkMode ? '#ef4444' : '#b91c1c' }} className="text-sm font-bold mb-2">Expenses (Amount / Year)</h5>
                        <div className="space-y-2">
                            {expenses.map((e) => (
                                <div key={e.id} className="flex flex-col gap-1 p-2 rounded border" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                                    <input
                                        value={e.name}
                                        onChange={(ev) => { setExpenses(prev => prev.map(x => x.id === e.id ? { ...x, name: ev.target.value } : x)); }}
                                        onBlur={(ev) => updateExpenseRecord(e.id, { name: ev.target.value })}
                                        placeholder="Expense name"
                                        style={inputStyle}
                                        className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={e.amountPerYear || ''}
                                            onChange={(ev) => { const v = parseNum(ev.target.value); setExpenses(prev => prev.map(x => x.id === e.id ? { ...x, amountPerYear: v } : x)); }}
                                            onBlur={(ev) => updateExpenseRecord(e.id, { amountPerYear: parseNum(ev.target.value) })}
                                            placeholder="Amount"
                                            style={inputStyle}
                                            className="flex-1 min-w-0 px-2 py-1 text-sm border rounded text-right"
                                        />
                                        <button onClick={() => deleteExpenseRecord(e.id)} className="p-1 text-red-500 shrink-0"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddExpense} className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Plus size={14} /> Add expense
                        </button>
                    </div>
                </div>

                {/* Net Outcome */}
                <div
                    style={{
                        backgroundColor: netOutcome >= 0 ? (isDarkMode ? '#14532d' : '#dcfce7') : (isDarkMode ? '#7f1d1d' : '#fee2e2'),
                        color: netOutcome >= 0 ? (isDarkMode ? '#86efac' : '#166534') : (isDarkMode ? '#fca5a5' : '#b91c1c'),
                    }}
                    className="p-3 font-bold text-center"
                >
                    Net Outcome: {netOutcome >= 0 ? '+' : ''}{netOutcome.toLocaleString()} / year
                </div>
            </div>
        </div>
    );
};
