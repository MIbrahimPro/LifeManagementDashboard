import Dexie, { type Table, type Transaction } from 'dexie';

// Types for DB entities (same shape we can send to Netlify/MongoDB later)
export interface UserSettingsRecord {
    id: string;
    religion: string;
    isDarkMode?: boolean;
    userEmail?: string;
    lastEndOfDayDate?: string; // YYYY-MM-DD, last date we ran end-of-day
}

export interface VerseRecord {
    id: string;
    religion: string;
    categoryId: string;
    verses: string[]; // formatted "text\n— reference"
    updatedAt: number;
}

export interface TodoRecord {
    id: string;
    text: string;
    completed: boolean;
    date: string; // YYYY-MM-DD
    createdAt: string;
    timestamp?: string;
}

export interface ActionRecord {
    id: string;
    text: string;
    completed: boolean;
    date: string;
    createdAt: string;
    timestamp?: string;
}

export interface JournalEntryRecord {
    id: string;
    text: string;
    category: string;
    date: string; // YYYY-MM-DD
    timestamp: string;
}

export interface DailySnapshotRecord {
    id: string;
    date: string;
    categoryId?: string; // when set, snapshot is for this category only (goals + tracker)
    todosDone: { text: string; completed: boolean }[];
    todosNotDone: { text: string }[];
    trackerLog: { label: string; completed: boolean; value?: string }[];
    goalsLog: { text: string; type: string; completed: boolean }[];
    journalExtra: string[];
    createdAt: string;
}

export interface TrackerTemplateRecord {
    id: string;
    categoryId: string;
    type: string; // 'meal_plan' | 'vitamins' | 'medication' | 'exercise' | 'custom'
    label: string;
    fieldType: 'checkbox' | 'text' | 'dropdown';
    options?: string[];
    order: number;
}

export interface DailyTrackerLogRecord {
    id: string;
    date: string;
    templateId: string; // sectionEntryId
    value?: string;
    completed: boolean;
}

// Card sections (Goals, Vitamins, Medication, etc.) - structure, not reset at midnight
export interface CardSectionRecord {
    id: string;
    categoryId: string;
    name: string;
    order: number;
    removable: boolean;
    kind: 'custom' | 'goals' | 'contacts_websites';
    group?: 'diet' | 'exercise'; // For physical category: Diet or Exercise heading
}

// Entries under a section (e.g. "Running" under Exercise) - structure, not reset
export interface SectionEntryRecord {
    id: string;
    sectionId: string;
    name: string;
    fieldType: 'text' | 'checkbox' | 'radio' | 'array' | 'texts';
    options?: string[]; // for radio
    order: number;
}

// Daily goals per category (reset at midnight after save)
export interface DailyGoalsRecord {
    id: string; // categoryId_date
    categoryId: string;
    date: string;
    goals: { text: string; type: string }[];
}

// Contacts/Websites - permanent, not reset
export interface ContactWebsiteRecord {
    id: string;
    categoryId: string;
    type: 'website' | 'contact';
    linkOrPhone: string;
    order: number;
}

export interface HobbyLinkRecord {
    id: string;
    label: string;
    url: string;
    categoryId?: string;
    order: number;
}

export interface GoalRecord {
    id: string;
    text: string;
    goalType: 'short' | 'medium' | 'long';
    categoryId?: string;
    date: string;
    completed: boolean;
    createdAt: string;
}

export interface CategoryDataRecord {
    id: string; // categoryId
    data: Record<string, unknown>;
    updatedAt: number;
}

export interface TextToolRecord {
    id: string;
    content: string;
    updatedAt: number;
}

export const DB_VERSION = 4;

export class AppDatabase extends Dexie {
    userSettings!: Table<UserSettingsRecord, string>;
    verses!: Table<VerseRecord, string>;
    todos!: Table<TodoRecord, string>;
    actions!: Table<ActionRecord, string>;
    journalEntries!: Table<JournalEntryRecord, string>;
    dailySnapshots!: Table<DailySnapshotRecord, string>;
    trackerTemplates!: Table<TrackerTemplateRecord, string>;
    dailyTrackerLog!: Table<DailyTrackerLogRecord, string>;
    hobbyLinks!: Table<HobbyLinkRecord, string>;
    goals!: Table<GoalRecord, string>;
    categoryData!: Table<CategoryDataRecord, string>;
    textTool!: Table<TextToolRecord, string>;
    cardSections!: Table<CardSectionRecord, string>;
    sectionEntries!: Table<SectionEntryRecord, string>;
    dailyGoals!: Table<DailyGoalsRecord, string>;
    contactsWebsites!: Table<ContactWebsiteRecord, string>;

    constructor() {
        super('FaithfulLifeDashboard');
        this.version(3).stores({
            userSettings: 'id',
            verses: 'id, [religion+categoryId], religion',
            todos: 'id, date, [date+completed]',
            actions: 'id, date',
            journalEntries: 'id, date, timestamp, [date+category]',
            dailySnapshots: 'id, date, categoryId',
            trackerTemplates: 'id, categoryId, [categoryId+order]',
            dailyTrackerLog: 'id, [date+templateId], date',
            hobbyLinks: 'id, categoryId, order',
            goals: 'id, date, categoryId, goalType',
            categoryData: 'id',
            textTool: 'id',
            cardSections: 'id, categoryId, [categoryId+order]',
            sectionEntries: 'id, sectionId, [sectionId+order]',
            dailyGoals: 'id, categoryId, date',
            contactsWebsites: 'id, categoryId, order',
        });
        // v4: Migration for physical (Goals, To-Do List, Diet, Exercise), income/expenses, assets/liabilities
        this.version(4).stores({
            userSettings: 'id',
            verses: 'id, [religion+categoryId], religion',
            todos: 'id, date, [date+completed]',
            actions: 'id, date',
            journalEntries: 'id, date, timestamp, [date+category]',
            dailySnapshots: 'id, date, categoryId',
            trackerTemplates: 'id, categoryId, [categoryId+order]',
            dailyTrackerLog: 'id, [date+templateId], date',
            hobbyLinks: 'id, categoryId, order',
            goals: 'id, date, categoryId, goalType',
            categoryData: 'id',
            textTool: 'id',
            cardSections: 'id, categoryId, [categoryId+order]',
            sectionEntries: 'id, sectionId, [sectionId+order]',
            dailyGoals: 'id, categoryId, date',
            contactsWebsites: 'id, categoryId, order',
        }).upgrade(tx => migrateV3ToV4(tx));
    }
}

async function migrateV3ToV4(tx: Transaction): Promise<void> {
    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const physicalSections = await tx.table('cardSections').where('categoryId').equals('physical').sortBy('order');
    const hasGoals = physicalSections.some((s: { kind: string }) => s.kind === 'goals');
    const hasToDoList = physicalSections.some((s: { name: string }) => (s.name || '').toLowerCase().includes('to do') || (s.name || '').toLowerCase().includes('todo'));
    const hasDietSections = physicalSections.some((s: { group?: string }) => s.group === 'diet');
    const hasExerciseSections = physicalSections.some((s: { group?: string }) => s.group === 'exercise');
    const hasContacts = physicalSections.some((s: { kind: string }) => s.kind === 'contacts_websites');

    let nextOrder = physicalSections.length;
    if (!hasGoals) {
        await tx.table('cardSections').add({
            id: generateId(), categoryId: 'physical', name: 'Goals', order: nextOrder++,
            removable: false, kind: 'goals',
        });
    }
    if (!hasToDoList) {
        await tx.table('cardSections').add({
            id: generateId(), categoryId: 'physical', name: 'To-Do List', order: nextOrder++,
            removable: true, kind: 'custom',
        });
    }
    if (!hasDietSections) {
        for (const name of ['Meal planning', 'Vitamins', 'Pharmaceuticals']) {
            await tx.table('cardSections').add({
                id: generateId(), categoryId: 'physical', name, order: nextOrder++,
                removable: true, kind: 'custom', group: 'diet',
            });
        }
    }
    if (!hasExerciseSections) {
        for (const name of ['Walking', 'Running', 'Yoga', 'Weight lifting']) {
            await tx.table('cardSections').add({
                id: generateId(), categoryId: 'physical', name, order: nextOrder++,
                removable: true, kind: 'custom', group: 'exercise',
            });
        }
    }
    if (!hasContacts) {
        await tx.table('cardSections').add({
            id: generateId(), categoryId: 'physical', name: 'Contacts / websites', order: nextOrder++,
            removable: false, kind: 'contacts_websites',
        });
    }

    const allPhysical = await tx.table('cardSections').where('categoryId').equals('physical').sortBy('order');
    const goals = allPhysical.filter((s: { kind: string }) => s.kind === 'goals');
    const toDo = allPhysical.filter((s: { name: string }) => (s.name || '').toLowerCase().includes('to do') || (s.name || '').toLowerCase().includes('todo'));
    const diet = allPhysical.filter((s: { group?: string }) => s.group === 'diet');
    const exercise = allPhysical.filter((s: { group?: string }) => s.group === 'exercise');
    const contacts = allPhysical.filter((s: { kind: string }) => s.kind === 'contacts_websites');
    const other = allPhysical.filter((s: { kind: string; group?: string; name?: string }) =>
        s.kind !== 'goals' && s.kind !== 'contacts_websites' && !s.group &&
        !((s.name || '').toLowerCase().includes('to do') || (s.name || '').toLowerCase().includes('todo')));
    const ordered = [...goals, ...toDo, ...diet, ...exercise, ...contacts, ...other];
    for (let i = 0; i < ordered.length; i++) {
        await tx.table('cardSections').update((ordered[i] as { id: string }).id, { order: i });
    }

    // Income/Assets: remove old template sections, ensure minimal (Goals, Contacts, habits)
    const incomeSections = await tx.table('cardSections').where('categoryId').equals('income').toArray() as { id: string; name: string; kind: string }[];
    const incomeToRemove = incomeSections.filter((s) =>
        s.kind === 'custom' && (s.name?.startsWith('Income -') || s.name?.startsWith('Expenses -') || s.name?.includes('Banking')));
    for (const s of incomeToRemove) await tx.table('cardSections').delete(s.id);

    const assetsSections = await tx.table('cardSections').where('categoryId').equals('assets').toArray() as { id: string; name: string; kind: string }[];
    const assetsToRemove = assetsSections.filter((s) =>
        s.kind === 'custom' && (s.name?.startsWith('Assets -') || s.name?.startsWith('Liabilities -') || s.name?.includes('Net Worth')));
    for (const s of assetsToRemove) await tx.table('cardSections').delete(s.id);
}

export const db = new AppDatabase();
