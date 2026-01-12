import React, { useState, useEffect, useCallback, memo } from 'react';
import { Heart, Palette, DollarSign, Building2, User, Users, Flag, Book } from 'lucide-react';

const verses = {
    christianity: {
        physical: [
            "Do you not know that your bodies are temples of the Holy Spirit? - 1 Cor 6:19",
            "I can do all things through Christ who strengthens me. - Phil 4:13",
            "So whether you eat or drink, do it all for the glory of God. - 1 Cor 10:31"
        ],
        hobby: [
            "Whatever you do, work at it with all your heart. - Col 3:23",
            "Use whatever gift you have received to serve others. - 1 Pet 4:10",
            "The hand of the diligent will rule. - Prov 12:24"
        ],
        income: [
            "Commit your work to the Lord. - Prov 16:3",
            "The blessing of the Lord brings wealth. - Prov 10:22",
            "Give, and it will be given to you. - Luke 6:38"
        ],
        assets: [
            "Store up treasures in heaven. - Matt 6:19-20",
            "Honor the Lord with your wealth. - Prov 3:9",
            "The earth is the Lord's. - Ps 24:1"
        ],
        oneonone: [
            "As iron sharpens iron, so one person sharpens another. - Prov 27:17",
            "Two are better than one. - Ecc 4:9",
            "A friend loves at all times. - Prov 17:17"
        ],
        family: [
            "Honor your father and your mother. - Ex 20:12",
            "Love each other deeply. - 1 Pet 4:8",
            "We will serve the Lord. - Josh 24:15"
        ],
        politics: [
            "Let everyone be subject to the governing authorities. - Rom 13:1",
            "Blessed is the nation whose God is the Lord. - Ps 33:12",
            "Seek the peace of the city. - Jer 29:7"
        ],
        spiritual: [
            "But seek first his kingdom. - Matt 6:33",
            "Be still, and know that I am God. - Ps 46:10",
            "Draw near to God. - James 4:8"
        ]
    },
    islam: {
        physical: [
            "And eat and drink, but be not excessive. Indeed, He likes not those who commit excess. - Quran 7:31",
            "And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah]. - Quran 2:45",
            "He has created man from a sperm-drop; and behold this same (man) becomes an open disputer! - Quran 16:4"
        ],
        hobby: [
            "And that there is not for man except that [good] for which he strives. - Quran 53:39",
            "So whoever does an atom's weight of good will see it. - Quran 99:7",
            "Indeed, Allah will not change the condition of a people until they change what is in themselves. - Quran 13:11"
        ],
        income: [
            "And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah. - Quran 62:10",
            "It is He who made the earth subservient to you, so walk in its regions and eat of His provision. - Quran 67:15",
            "And give the relative his right, and the needy, and the traveler, and do not spend wastefully. - Quran 17:26"
        ],
        assets: [
            "Believe in Allah and His Messenger and spend out of that in which He has made you successors. - Quran 57:7",
            "Wealth and children are [but] adornment of the worldly life. But the enduring good deeds are better to your Lord for reward and better for [one's] hope. - Quran 18:46",
            "And in their wealth there is a right for the beggar and the destitute. - Quran 51:19"
        ],
        oneonone: [
            "And hold firmly to the rope of Allah all together and do not become divided. - Quran 3:103",
            "The believers are but brothers, so make settlement between your brothers. - Quran 49:10",
            "And speak to people good [words]. - Quran 2:83"
        ],
        family: [
            "And lower to them the wing of humility out of mercy and say, 'My Lord, have mercy upon them as they brought me up [when I was] small.' - Quran 17:24",
            "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. - Quran 30:21",
            "O you who have believed, protect yourselves and your families from a Fire whose fuel is people and stones. - Quran 66:6"
        ],
        politics: [
            "O you who have believed, obey Allah and obey the Messenger and those in authority among you. - Quran 4:59",
            "And their affair is [determined by] consultation among themselves. - Quran 42:38",
            "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice. - Quran 4:58"
        ],
        spiritual: [
            "And I did not create the jinn and mankind except to worship Me. - Quran 51:56",
            "Unquestionably, by the remembrance of Allah hearts are assured. - Quran 13:28",
            "So remember Me; I will remember you. - Quran 2:152"
        ]
    },
    judaism: {
        physical: [
            "Heal me, O Lord, and I will be healed; save me and I will be saved, for you are my praise. - Jeremiah 17:14",
            "A cheerful heart is good medicine, but a crushed spirit dries up the bones. - Proverbs 17:22",
            "Do not be wise in your own eyes; fear the Lord and shun evil. This will bring health to your body and nourishment to your bones. - Proverbs 3:7-8"
        ],
        hobby: [
            "Whatever your hand finds to do, do it with all your might. - Ecclesiastes 9:10",
            "For by the sweat of your brow you will eat your food until you return to the ground. - Genesis 3:19",
            "Commit to the Lord whatever you do, and he will establish your plans. - Proverbs 16:3"
        ],
        income: [
            "The wage of the righteous leads to life. - Proverbs 10:16",
            "A gift opens the way and ushers the giver into the presence of the great. - Proverbs 18:16",
            "Bring the whole tithe into the storehouse, that there may be food in my house. - Malachi 3:10"
        ],
        assets: [
            "Honor the Lord with your wealth, with the firstfruits of all your crops. - Proverbs 3:9",
            "The earth is the Lord's, and everything in it, the world, and all who live in it. - Psalm 24:1",
            "But remember the Lord your God, for it is he who gives you the ability to produce wealth. - Deuteronomy 8:18"
        ],
        oneonone: [
            "As iron sharpens iron, so one person sharpens another. - Proverbs 27:17",
            "Two are better than one, because they have a good return for their labor. - Ecclesiastes 4:9",
            "A friend loves at all times, and a brother is born for a time of adversity. - Proverbs 17:17"
        ],
        family: [
            "Honor your father and your mother, so that you may live long in the land the Lord your God is giving you. - Exodus 20:12",
            "How good and pleasant it is when God’s people live together in unity! - Psalm 133:1",
            "But as for me and my household, we will serve the Lord. - Joshua 24:15"
        ],
        politics: [
            "Seek the peace and prosperity of the city to which I have carried you into exile. Pray to the Lord for it, because if it prospers, you too will prosper. - Jeremiah 29:7",
            "Righteousness exalts a nation, but sin is a disgrace to any people. - Proverbs 14:34",
            "For the wicked shall be cut off; but those that wait upon the Lord, they shall inherit the earth. - Psalm 37:9"
        ],
        spiritual: [
            "Hear, O Israel: The Lord our God, the Lord is one. - Deuteronomy 6:4",
            "But seek first his kingdom and his righteousness, and all these things will be given to you as well. - Matthew 6:33 (Note: Also relevant in Christian context but sourced from Torah principles)",
            "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5"
        ]
    }
};

const categories = [
    { id: 'physical', name: 'PHYSICAL', icon: Heart, color: 'bg-red-500' },
    { id: 'hobby', name: 'HOBBY', icon: Palette, color: 'bg-purple-500' },
    { id: 'income', name: 'INCOME & EXPENSES', icon: DollarSign, color: 'bg-green-500' },
    { id: 'assets', name: 'ASSETS & LIABILITIES', icon: Building2, color: 'bg-blue-500' },
    { id: 'oneonone', name: 'ONE-ON-ONE', icon: User, color: 'bg-pink-500' },
    { id: 'family', name: 'FAMILY & FRIENDS', icon: Users, color: 'bg-orange-500' },
    { id: 'politics', name: 'POLITICS', icon: Flag, color: 'bg-indigo-500' },
    { id: 'spiritual', name: 'SPIRITUAL', icon: Book, color: 'bg-yellow-600' }
];

const CategoryCard = memo(({
    category,
    data,
    religion,
    verseIndices,
    cycleVerse,
    updateField,
    addTimestamp,
    setShowConstitution,
    setShowResetReligionPrompt,
    showResetReligionPrompt,
    resetReligion
}) => {
    const Icon = category.icon;

    return (
        <div className="bg-white rounded-lg shadow-md p-2">
            <div className={`${category.color} text-white p-1 rounded mb-1 flex items-center justify-center gap-1`}>
                <Icon size={14} />
                <h2 className="text-xs font-bold">{category.name}</h2>
            </div>

            <div
                className="bg-yellow-50 p-1 rounded border-l-2 border-yellow-400 mb-2 text-xs italic cursor-pointer hover:bg-yellow-100"
                onClick={() => cycleVerse(category.id)}
            >
                {religion ? verses[religion][category.id][verseIndices[category.id]] : "Loading..."}
            </div>

            {category.id === 'physical' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Goals (S/M/L)</label>
                        <textarea
                            placeholder="Short, Medium, Long..."
                            value={data.physical_goals || ''}
                            onChange={(e) => updateField(category.id, 'physical_goals', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Actions</label>
                        <textarea
                            placeholder="Actions..."
                            value={data.physical_actions || ''}
                            onChange={(e) => updateField(category.id, 'physical_actions', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'physical_journal')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.physical_journal || ''}
                            onChange={(e) => updateField(category.id, 'physical_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'hobby' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Hobbies</label>
                        <textarea
                            placeholder="List..."
                            value={data.hobbies_list || ''}
                            onChange={(e) => updateField(category.id, 'hobbies_list', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Goals</label>
                        <textarea
                            placeholder="Goals..."
                            value={data.hobby_goals || ''}
                            onChange={(e) => updateField(category.id, 'hobby_goals', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'hobby_journal')}
                            className="bg-purple-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.hobby_journal || ''}
                            onChange={(e) => updateField(category.id, 'hobby_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'income' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Income Sources</label>
                        <textarea
                            placeholder="Sources..."
                            value={data.income_sources || ''}
                            onChange={(e) => updateField(category.id, 'income_sources', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'income_journal')}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.income_journal || ''}
                            onChange={(e) => updateField(category.id, 'income_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'assets' && (
                <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-1 mb-1">
                        <div className="bg-gray-100 text-center py-1 rounded text-xs font-bold">Goals</div>
                        <div className="bg-gray-100 text-center py-1 rounded text-xs font-bold">Actions</div>
                        <div className="bg-gray-100 text-center py-1 rounded text-xs font-bold">Research</div>
                    </div>
                    {[1, 2, 3].map(n => (
                        <div key={n} className="grid grid-cols-3 gap-1 mb-1">
                            <input
                                type="text"
                                placeholder={`Goal ${n}`}
                                value={data[`goal${n}`] || ''}
                                onChange={(e) => updateField(category.id, `goal${n}`, e.target.value)}
                                className="text-xs p-1 border rounded"
                            />
                            <input
                                type="text"
                                placeholder={`Action ${n}`}
                                value={data[`action${n}`] || ''}
                                onChange={(e) => updateField(category.id, `action${n}`, e.target.value)}
                                className="text-xs p-1 border rounded"
                            />
                            <input
                                type="text"
                                placeholder={`Research ${n}`}
                                value={data[`resource${n}`] || ''}
                                onChange={(e) => updateField(category.id, `resource${n}`, e.target.value)}
                                className="text-xs p-1 border rounded"
                            />
                        </div>
                    ))}
                </div>
            )}

            {category.id === 'oneonone' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Relationship Goals</label>
                        <textarea
                            placeholder="Goals..."
                            value={data.oneonone_goals || ''}
                            onChange={(e) => updateField(category.id, 'oneonone_goals', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'oneonone_journal')}
                            className="bg-pink-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.oneonone_journal || ''}
                            onChange={(e) => updateField(category.id, 'oneonone_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'family' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Contacts</label>
                        <textarea
                            placeholder="Contacts..."
                            value={data.family_contacts || ''}
                            onChange={(e) => updateField(category.id, 'family_contacts', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'family_journal')}
                            className="bg-orange-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.family_journal || ''}
                            onChange={(e) => updateField(category.id, 'family_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'politics' && (
                <div className="space-y-1">
                    <button
                        onClick={() => setShowConstitution(true)}
                        className="w-full bg-indigo-600 text-white py-1 px-2 rounded text-xs font-bold"
                    >
                        📜 Constitution
                    </button>
                    <div>
                        <label className="text-xs font-bold block">Research</label>
                        <textarea
                            placeholder="Topics..."
                            value={data.politics_research || ''}
                            onChange={(e) => updateField(category.id, 'politics_research', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'politics_journal')}
                            className="bg-indigo-500 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.politics_journal || ''}
                            onChange={(e) => updateField(category.id, 'politics_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {category.id === 'spiritual' && (
                <div className="space-y-1">
                    <div>
                        <label className="text-xs font-bold block">Practices</label>
                        <textarea
                            placeholder="Daily/weekly..."
                            value={data.spiritual_practices || ''}
                            onChange={(e) => updateField(category.id, 'spiritual_practices', e.target.value)}
                            className="w-full text-xs p-1 border rounded"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block">Journal</label>
                        <button
                            onClick={() => addTimestamp(category.id, 'spiritual_journal')}
                            className="bg-yellow-600 text-white px-2 py-1 rounded text-xs mb-1"
                        >
                            +Date
                        </button>
                        <textarea
                            value={data.spiritual_journal || ''}
                            onChange={(e) => updateField(category.id, 'spiritual_journal', e.target.value)}
                            placeholder="Journal..."
                            className="w-full text-xs p-1 border rounded"
                            rows="3"
                        />
                    </div>
                </div>
            )}

            {showResetReligionPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-sm w-full text-center p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Religion?</h2>
                        <p className="text-gray-600 mb-8">Are you sure you want to reset your selected religion? You will be asked to choose again.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowResetReligionPrompt(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetReligion}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
});

export default function BiblicalLifeDashboard() {
    const [religion, setReligion] = useState(null);
    const [showReligionPopup, setShowReligionPopup] = useState(false);
    const [categoryData, setCategoryData] = useState(() => {
        try {
            const storedData = localStorage.getItem('categoryData');
            return storedData ? JSON.parse(storedData) : {};
        } catch (error) {
            console.error("Error parsing categoryData from localStorage", error);
            return {};
        }
    });
    const [showConstitution, setShowConstitution] = useState(false);
    const [verseIndices, setVerseIndices] = useState(() => {
        // Initialize verse indices based on category length for initial load
        const initialIndices = {};
        categories.forEach(cat => {
            initialIndices[cat.id] = 0;
        });
        return initialIndices;
    });
    const [quickAdd, setQuickAdd] = useState('');
    const [quickResult, setQuickResult] = useState('');
    const [showAllJournals, setShowAllJournals] = useState(false);
    const [showCrossActions, setShowCrossActions] = useState(false);
    const [showResetReligionPrompt, setShowResetReligionPrompt] = useState(false);
    const [showResetAllFieldsPrompt, setShowResetAllFieldsPrompt] = useState(false);

    useEffect(() => {
        const storedReligion = localStorage.getItem('userReligion');
        if (storedReligion) {
            setReligion(storedReligion);
        } else {
            setShowReligionPopup(true);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('categoryData', JSON.stringify(categoryData));
        } catch (error) {
            console.error("Error saving categoryData to localStorage", error);
        }
    }, [categoryData]);

    const handleReligionSelect = useCallback((selectedReligion) => {
        localStorage.setItem('userReligion', selectedReligion);
        setReligion(selectedReligion);
        // Reset verse indices for the new religion
        const newVerseIndices = {};
        categories.forEach(cat => {
            newVerseIndices[cat.id] = 0;
        });
        setVerseIndices(newVerseIndices);
        setShowReligionPopup(false);
    }, []);

    const resetReligion = useCallback(() => {
        localStorage.removeItem('userReligion');
        setReligion(null);
        setShowReligionPopup(true);
        setShowResetReligionPrompt(false);
    }, []);

    const resetAllFields = useCallback(() => {
        localStorage.removeItem('categoryData');
        setCategoryData({});
        // Re-initialize verse indices
        const newVerseIndices = {};
        categories.forEach(cat => {
            newVerseIndices[cat.id] = 0;
        });
        setVerseIndices(newVerseIndices);
        setShowResetAllFieldsPrompt(false);
    }, []);

    const cycleVerse = useCallback((categoryId) => {
        if (!religion) return;
        setVerseIndices(prev => ({
            ...prev,
            [categoryId]: (prev[categoryId] + 1) % verses[religion][categoryId].length
        }));
    }, [religion, verses]);

    const updateField = useCallback((categoryId, field, value) => {
        setCategoryData(prev => ({
            ...prev,
            [categoryId]: { ...prev[categoryId], [field]: value }
        }));
    }, []);

    const addTimestamp = useCallback((categoryId, field) => {
        const data = categoryData[categoryId] || {};
        const current = data[field] || '';
        const timestamp = new Date().toLocaleString();
        const updated = current + `\n\n--- ${timestamp} ---\n`;
        updateField(categoryId, field, updated);
    }, [categoryData, updateField]);

    const processQuickAdd = useCallback(() => {
        if (!quickAdd.trim()) {
            alert('Please enter something!');
            return;
        }
        setQuickResult(`✓ Added: ${quickAdd}`);
        setQuickAdd('');
        setTimeout(() => setQuickResult(''), 3000);
    }, [quickAdd]);

    const getAllJournalEntries = useCallback(() => {
        const entries = [];
        categories.forEach(cat => {
            const journalField = `${cat.id}_journal`;
            const data = categoryData[cat.id] || {};
            const journal = data[journalField];
            if (journal) {
                const lines = journal.split('\n');
                lines.forEach(line => {
                    if (line.includes('---') && line.includes(':')) {
                        entries.push({ category: cat.name, text: line, color: cat.color });
                    } else if (line.trim()) {
                        if (entries.length > 0) {
                            entries[entries.length - 1].content = (entries[entries.length - 1].content || '') + '\n' + line;
                        }
                    }
                });
            }
        });
        return entries.sort((a, b) => {
            const dateA = a.text.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            const dateB = b.text.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (dateA && dateB) return new Date(dateB[0]) - new Date(dateA[0]);
            return 0;
        });
    }, [categoryData]);

    const getAllActions = useCallback(() => {
        const actions = [];
        categories.forEach(cat => {
            const data = categoryData[cat.id] || {};
            Object.keys(data).forEach(key => {
                if (key.includes('action') || key.includes('goal')) {
                    const value = data[key];
                    if (value && value.trim()) {
                        actions.push({ category: cat.name, field: key, text: value, color: cat.color });
                    }
                }
            });
        });
        return actions;
    }, [categoryData]);

    const ReligionPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full text-center p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Path</h2>
                <p className="text-gray-600 mb-8">Please select your religion to personalize your experience.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleReligionSelect('christianity')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ✝️ Christianity
                    </button>
                    <button
                        onClick={() => handleReligionSelect('islam')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ☪️ Islam
                    </button>
                    <button
                        onClick={() => handleReligionSelect('judaism')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        ✡️ Judaism
                    </button>
                </div>
            </div>
        </div>
    );

    if (showReligionPopup) {
        return <ReligionPopup />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-3">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white text-center mb-3">📊 Life Management Dashboard</h1>

                <div className="bg-white rounded-lg shadow-lg p-2 mb-3">
                    <div className="flex gap-2 items-center mb-2">
                        <span className="text-xl">⚡</span>
                        <input
                            type="text"
                            value={quickAdd}
                            onChange={(e) => setQuickAdd(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && processQuickAdd()}
                            placeholder="Quick add: 'gym workout' or 'pay electric bill'..."
                            className="flex-1 p-2 text-sm border-2 border-purple-500 rounded-lg"
                        />
                        <button
                            onClick={processQuickAdd}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90"
                        >
                            Add
                        </button>
                    </div>
                    {quickResult && (
                        <div className="p-2 bg-green-100 text-green-800 rounded text-xs">
                            {quickResult}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-2 mb-3">
                    <div className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setShowAllJournals(true)}
                            className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:opacity-90"
                        >
                            📔 All Journals
                        </button>
                        <button
                            onClick={() => setShowCrossActions(true)}
                            className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:opacity-90"
                        >
                            📋 All Actions
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <CategoryCard
                        category={categories[0]}
                        data={categoryData[categories[0].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                    <CategoryCard
                        category={categories[1]}
                        data={categoryData[categories[1].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <CategoryCard
                        category={categories[2]}
                        data={categoryData[categories[2].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                    <CategoryCard
                        category={categories[3]}
                        data={categoryData[categories[3].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <CategoryCard
                        category={categories[4]}
                        data={categoryData[categories[4].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                    <CategoryCard
                        category={categories[5]}
                        data={categoryData[categories[5].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <CategoryCard
                        category={categories[6]}
                        data={categoryData[categories[6].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                    <CategoryCard
                        category={categories[7]}
                        data={categoryData[categories[7].id] || {}}
                        religion={religion}
                        verseIndices={verseIndices}
                        cycleVerse={cycleVerse}
                        updateField={updateField}
                        addTimestamp={addTimestamp}
                        setShowConstitution={setShowConstitution}
                        setShowResetReligionPrompt={setShowResetReligionPrompt}
                        showResetReligionPrompt={showResetReligionPrompt}
                        resetReligion={resetReligion}
                    />
                </div>
            </div>

            {showConstitution && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 flex flex-col">
                        <div className="bg-indigo-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-lg font-bold">📜 Constitution</h2>
                            <button onClick={() => setShowConstitution(false)} className="text-2xl">×</button>
                        </div>
                        <div className="p-4 overflow-y-auto text-sm">
                            <p className="mb-2">View the full Constitution at:</p>
                            <a href="https://constitution.congress.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                constitution.congress.gov
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {showAllJournals && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
                        <div className="bg-purple-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-lg font-bold">📔 All Journal Entries</h2>
                            <button onClick={() => setShowAllJournals(false)} className="text-2xl">×</button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {getAllJournalEntries().length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No journal entries yet. Start journaling!</p>
                            ) : (
                                <div className="space-y-3">
                                    {getAllJournalEntries().map((entry, idx) => (
                                        <div key={idx} className="border-l-4 pl-3 py-2 border-purple-400">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`${entry.color} text-white px-2 py-1 rounded text-xs font-bold`}>
                                                    {entry.category}
                                                </span>
                                                <span className="text-xs text-gray-600">{entry.text}</span>
                                            </div>
                                            {entry.content && <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.content}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showCrossActions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
                        <div className="bg-indigo-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-lg font-bold">📋 All Goals & Actions</h2>
                            <button onClick={() => setShowCrossActions(false)} className="text-2xl">×</button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {getAllActions().length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No goals or actions yet. Start adding them!</p>
                            ) : (
                                <div className="space-y-2">
                                    {getAllActions().map((action, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                                            <span className={`${action.color} text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap`}>
                                                {action.category}
                                            </span>
                                            <div className="flex-1">
                                                <span className="text-xs text-gray-500 block mb-1">
                                                    {action.field.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                                <p className="text-sm text-gray-700">{action.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showResetReligionPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-sm w-full text-center p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Religion?</h2>
                        <p className="text-gray-600 mb-8">Are you sure you want to reset your selected religion? You will be asked to choose again.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowResetReligionPrompt(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetReligion}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetAllFieldsPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-sm w-full text-center p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset All Fields?</h2>
                        <p className="text-gray-600 mb-8">Are you sure you want to clear all your input data? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowResetAllFieldsPrompt(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetAllFields}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className=" p-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setShowResetAllFieldsPrompt(true)}
                        className="text-sm text-white hover:text-red-500 transition-colors duration-200"
                    >
                        Reset All Fields
                    </button>
                    <button
                        onClick={() => setShowResetReligionPrompt(true)}
                        className="text-sm text-white hover:text-red-500 transition-colors duration-200"
                    >
                        Reset Religion
                    </button>
                </div>
            </div>
        </div>
    );
}