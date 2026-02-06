import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getFamilyPeople, addFamilyPerson, updateFamilyPerson, deleteFamilyPerson, type FamilyFriendRecord } from '../db';

interface FamilyFriendsGridProps {
    isDarkMode: boolean;
}

export const FamilyFriendsGrid: FC<FamilyFriendsGridProps> = ({ isDarkMode }) => {
    const [people, setPeople] = useState<FamilyFriendRecord[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        const list = await getFamilyPeople();
        setPeople(list);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async () => {
        await addFamilyPerson({ name: '', birthdate: '', contactNo: '' });
        await load();
    };

    const handleUpdate = async (id: string, field: keyof Omit<FamilyFriendRecord, 'id'>, value: string) => {
        await updateFamilyPerson(id, { [field]: value });
        await load();
    };

    const handleDelete = async (id: string) => {
        await deleteFamilyPerson(id);
        await load();
        if (editingId === id) setEditingId(null);
    };

    const inputStyle = {
        backgroundColor: isDarkMode ? '#374151' : '#fff',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        color: isDarkMode ? '#f3f4f6' : '#111827',
    };

    return (
        <div
            style={{
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            }}
            className="rounded-lg border overflow-hidden"
        >
            <h4 style={{ color: isDarkMode ? '#f3f4f6' : '#111827', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="text-sm font-bold p-3 border-b">
                Family & Friends
            </h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' }}>
                            <th style={{ color: isDarkMode ? '#f3f4f6' : '#111827', padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}` }}>
                                Name
                            </th>
                            <th style={{ color: isDarkMode ? '#f3f4f6' : '#111827', padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}` }}>
                                Birthdate
                            </th>
                            <th style={{ color: isDarkMode ? '#f3f4f6' : '#111827', padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}` }}>
                                Contact No
                            </th>
                            <th style={{ width: 40 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {people.map((p) => (
                            <tr
                                key={p.id}
                                style={{ borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}` }}
                                onDoubleClick={() => setEditingId(p.id)}
                            >
                                <td style={{ padding: '0.35rem 0.75rem' }}>
                                    <input
                                        value={p.name}
                                        onChange={(e) => { const v = e.target.value; setPeople(prev => prev.map(x => x.id === p.id ? { ...x, name: v } : x)); }}
                                        onBlur={(e) => { handleUpdate(p.id, 'name', e.target.value); setEditingId(null); }}
                                        placeholder="Name"
                                        style={inputStyle}
                                        className="w-full min-w-[100px] px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td style={{ padding: '0.35rem 0.75rem' }}>
                                    <input
                                        type="date"
                                        value={p.birthdate}
                                        onChange={(e) => { const v = e.target.value; setPeople(prev => prev.map(x => x.id === p.id ? { ...x, birthdate: v } : x)); }}
                                        onBlur={(e) => { handleUpdate(p.id, 'birthdate', e.target.value); setEditingId(null); }}
                                        placeholder="YYYY-MM-DD"
                                        style={inputStyle}
                                        className="w-full min-w-[120px] px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td style={{ padding: '0.35rem 0.75rem' }}>
                                    <input
                                        value={p.contactNo}
                                        onChange={(e) => { const v = e.target.value; setPeople(prev => prev.map(x => x.id === p.id ? { ...x, contactNo: v } : x)); }}
                                        onBlur={(e) => { handleUpdate(p.id, 'contactNo', e.target.value); setEditingId(null); }}
                                        placeholder="Phone / Contact"
                                        style={inputStyle}
                                        className="w-full min-w-[120px] px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td style={{ padding: '0.35rem' }}>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                                        title="Delete row"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-2 border-t" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    <Plus size={14} /> Add person
                </button>
            </div>
        </div>
    );
};
