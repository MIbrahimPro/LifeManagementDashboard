/**
 * Local DB API. Use this everywhere instead of direct Dexie/db calls.
 * Later: swap implementation to Netlify functions + MongoDB by changing
 * these functions to call fetch('/.netlify/functions/...') and same payloads.
 */
import { db } from './schema';
import type {
    UserSettingsRecord,
    TodoRecord,
    ActionRecord,
    JournalEntryRecord,
    DailySnapshotRecord,
    TrackerTemplateRecord,
    DailyTrackerLogRecord,
    HobbyLinkRecord,
    GoalRecord,
    CardSectionRecord,
    SectionEntryRecord,
    ContactWebsiteRecord,
} from './schema';

const DEFAULT_DATE = () => new Date().toISOString().slice(0, 10);

// ----- User settings -----
export async function getUserSettings(): Promise<UserSettingsRecord | undefined> {
    return db.userSettings.get('default');
}

export async function setUserSettings(partial: Partial<UserSettingsRecord>): Promise<void> {
    await db.userSettings.put({ id: 'default', religion: 'christianity', ...partial } as UserSettingsRecord);
}

// ----- Verses (store in user DB) -----
export async function getVersesForReligion(religion: string): Promise<Record<string, string[]>> {
    const rows = await db.verses.where('religion').equals(religion).toArray();
    const out: Record<string, string[]> = {};
    for (const r of rows) {
        out[r.categoryId] = r.verses;
    }
    return out;
}

export async function setVersesForReligion(religion: string, byCategory: Record<string, string[]>): Promise<void> {
    const now = Date.now();
    for (const [categoryId, verses] of Object.entries(byCategory)) {
        const id = `${religion}_${categoryId}`;
        await db.verses.put({ id, religion, categoryId, verses, updatedAt: now });
    }
}

// ----- Todos (by date) -----
export async function getTodosForDate(date: string): Promise<TodoRecord[]> {
    return db.todos.where('date').equals(date).toArray();
}

export async function addTodo(text: string, date: string = DEFAULT_DATE()): Promise<TodoRecord> {
    const rec: TodoRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        completed: false,
        date,
        createdAt: new Date().toISOString(),
    };
    await db.todos.add(rec);
    return rec;
}

export async function toggleTodo(id: string): Promise<void> {
    const t = await db.todos.get(id);
    if (t) await db.todos.update(id, { completed: !t.completed });
}

export async function deleteTodo(id: string): Promise<void> {
    await db.todos.delete(id);
}

export async function clearCompletedTodosForDate(date: string): Promise<void> {
    const list = await db.todos.where('date').equals(date).toArray();
    for (const t of list.filter((t: TodoRecord) => t.completed)) {
        await db.todos.delete(t.id);
    }
}

// ----- Actions (by date) -----
export async function getActionsForDate(date: string): Promise<ActionRecord[]> {
    return db.actions.where('date').equals(date).toArray();
}

export async function addAction(text: string, date: string = DEFAULT_DATE()): Promise<ActionRecord> {
    const rec: ActionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        completed: false,
        date,
        createdAt: new Date().toISOString(),
    };
    await db.actions.add(rec);
    return rec;
}

export async function toggleAction(id: string): Promise<void> {
    const a = await db.actions.get(id);
    if (a) await db.actions.update(id, { completed: !a.completed });
}

export async function deleteAction(id: string): Promise<void> {
    await db.actions.delete(id);
}

// ----- Journal entries -----
export async function getJournalEntriesForDate(date: string): Promise<JournalEntryRecord[]> {
    return db.journalEntries.where('date').equals(date).toArray();
}

export async function getAllJournalEntries(): Promise<JournalEntryRecord[]> {
    return db.journalEntries.orderBy('timestamp').reverse().toArray();
}

export async function addJournalEntry(text: string, category: string, date: string = DEFAULT_DATE()): Promise<JournalEntryRecord> {
    const rec: JournalEntryRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text,
        category,
        date,
        timestamp: new Date().toISOString(),
    };
    await db.journalEntries.add(rec);
    return rec;
}

// ----- Daily snapshots (end of day journal) -----
export async function getDailySnapshot(date: string, categoryId?: string): Promise<DailySnapshotRecord | undefined> {
    if (categoryId) {
        return db.dailySnapshots.where('[date+categoryId]').equals([date, categoryId]).first();
    }
    return db.dailySnapshots.where('date').equals(date).filter((s) => !s.categoryId).first();
}

export async function getDailySnapshots(): Promise<DailySnapshotRecord[]> {
    return db.dailySnapshots.orderBy('date').reverse().toArray();
}

export async function getDailySnapshotsByCategory(categoryId: string): Promise<DailySnapshotRecord[]> {
    const list = await db.dailySnapshots.where('categoryId').equals(categoryId).sortBy('date');
    return list.reverse();
}

export async function saveDailySnapshot(
    snapshot: Omit<DailySnapshotRecord, 'id' | 'createdAt'> & { categoryId?: string }
): Promise<void> {
    const id = snapshot.categoryId ? `snap_${snapshot.date}_${snapshot.categoryId}` : `snap_${snapshot.date}`;
    await db.dailySnapshots.put({
        ...snapshot,
        id,
        createdAt: new Date().toISOString(),
    });
}

// ----- Tracker templates -----
export async function getTrackerTemplates(categoryId?: string): Promise<TrackerTemplateRecord[]> {
    if (categoryId) {
        return db.trackerTemplates.where('categoryId').equals(categoryId).sortBy('order');
    }
    return db.trackerTemplates.orderBy('order').toArray();
}

export async function addTrackerTemplate(
    template: Omit<TrackerTemplateRecord, 'id'>
): Promise<TrackerTemplateRecord> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...template, id };
    await db.trackerTemplates.add(rec);
    return rec;
}

export async function updateTrackerTemplate(id: string, updates: Partial<TrackerTemplateRecord>): Promise<void> {
    await db.trackerTemplates.update(id, updates);
}

export async function deleteTrackerTemplate(id: string): Promise<void> {
    await db.trackerTemplates.delete(id);
}

// ----- Daily tracker log (checks per day) -----
export async function getDailyTrackerLog(date: string): Promise<DailyTrackerLogRecord[]> {
    return db.dailyTrackerLog.where('date').equals(date).toArray();
}

export async function setDailyTrackerLogEntry(
    date: string,
    templateId: string,
    value: { completed: boolean; value?: string }
): Promise<void> {
    const existing = await db.dailyTrackerLog.where('[date+templateId]').equals([date, templateId]).first();
    const id = existing?.id ?? `${date}_${templateId}`;
    await db.dailyTrackerLog.put({
        id,
        date,
        templateId,
        completed: value.completed,
        value: value.value,
    });
}

// ----- Hobby links -----
export async function getHobbyLinks(categoryId?: string): Promise<HobbyLinkRecord[]> {
    if (categoryId) {
        return db.hobbyLinks.where('categoryId').equals(categoryId).sortBy('order');
    }
    return db.hobbyLinks.orderBy('order').toArray();
}

export async function addHobbyLink(link: Omit<HobbyLinkRecord, 'id'>): Promise<HobbyLinkRecord> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...link, id };
    await db.hobbyLinks.add(rec);
    return rec;
}

export async function updateHobbyLink(id: string, updates: Partial<HobbyLinkRecord>): Promise<void> {
    await db.hobbyLinks.update(id, updates);
}

export async function deleteHobbyLink(id: string): Promise<void> {
    await db.hobbyLinks.delete(id);
}

// ----- Goals (by date; can add/edit/remove before day ends) -----
export async function getGoalsForDate(date: string, categoryId?: string): Promise<GoalRecord[]> {
    let q = db.goals.where('date').equals(date);
    if (categoryId) {
        const all = await q.toArray();
        return all.filter((g: GoalRecord) => g.categoryId === categoryId);
    }
    return q.toArray();
}

export async function addGoal(
    text: string,
    goalType: 'short' | 'medium' | 'long',
    date: string = DEFAULT_DATE(),
    categoryId?: string
): Promise<GoalRecord> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec: GoalRecord = {
        id,
        text,
        goalType,
        categoryId,
        date,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    await db.goals.add(rec);
    return rec;
}

export async function updateGoal(id: string, updates: Partial<GoalRecord>): Promise<void> {
    await db.goals.update(id, updates);
}

export async function deleteGoal(id: string): Promise<void> {
    await db.goals.delete(id);
}

// ----- Card sections (Goals, Vitamins, etc.) -----
export async function getCardSections(categoryId: string): Promise<CardSectionRecord[]> {
    return db.cardSections.where('categoryId').equals(categoryId).sortBy('order');
}

export async function addCardSection(
    categoryId: string,
    name: string,
    kind: CardSectionRecord['kind'] = 'custom',
    removable = true,
    group?: 'diet' | 'exercise'
): Promise<CardSectionRecord> {
    const sections = await getCardSections(categoryId);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    let order = sections.length;
    if (categoryId === 'physical' && group) {
        const groupSections = sections.filter((s) => s.group === group);
        order = groupSections.length ? Math.max(...groupSections.map((s) => s.order)) + 1 : 2;
        for (const s of sections) {
            if (s.order >= order) await db.cardSections.update(s.id, { order: s.order + 1 });
        }
    }
    const rec: CardSectionRecord = { id, categoryId, name, order, removable, kind, ...(group && { group }) };
    await db.cardSections.add(rec);
    return rec;
}

export async function updateCardSection(id: string, updates: Partial<CardSectionRecord>): Promise<void> {
    await db.cardSections.update(id, updates);
}

export async function deleteCardSection(id: string): Promise<void> {
    const entries = await db.sectionEntries.where('sectionId').equals(id).toArray();
    for (const e of entries) await db.sectionEntries.delete(e.id);
    await db.cardSections.delete(id);
}

// ----- Section entries (e.g. Running under Exercise) -----
export async function getSectionEntries(sectionId: string): Promise<SectionEntryRecord[]> {
    return db.sectionEntries.where('sectionId').equals(sectionId).sortBy('order');
}

export async function addSectionEntry(
    sectionId: string,
    name: string,
    fieldType: SectionEntryRecord['fieldType'],
    options?: string[]
): Promise<SectionEntryRecord> {
    const entries = await getSectionEntries(sectionId);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec: SectionEntryRecord = { id, sectionId, name, fieldType, options, order: entries.length };
    await db.sectionEntries.add(rec);
    return rec;
}

export async function updateSectionEntry(id: string, updates: Partial<SectionEntryRecord>): Promise<void> {
    await db.sectionEntries.update(id, updates);
}

export async function deleteSectionEntry(id: string): Promise<void> {
    await db.sectionEntries.delete(id);
}

// ----- Daily goals per category (array of {text, type}) -----
export async function getDailyGoals(categoryId: string, date: string): Promise<{ text: string; type: string }[]> {
    const id = `${categoryId}_${date}`;
    const row = await db.dailyGoals.get(id);
    return row?.goals ?? [];
}

export async function setDailyGoals(categoryId: string, date: string, goals: { text: string; type: string }[]): Promise<void> {
    const id = `${categoryId}_${date}`;
    await db.dailyGoals.put({ id, categoryId, date, goals });
}

// ----- Contacts/Websites (permanent, not reset) -----
export async function getContactsWebsites(categoryId: string): Promise<ContactWebsiteRecord[]> {
    return db.contactsWebsites.where('categoryId').equals(categoryId).sortBy('order');
}

export async function addContactWebsite(
    categoryId: string,
    type: 'website' | 'contact',
    linkOrPhone: string
): Promise<ContactWebsiteRecord> {
    const list = await getContactsWebsites(categoryId);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec: ContactWebsiteRecord = { id, categoryId, type, linkOrPhone, order: list.length };
    await db.contactsWebsites.add(rec);
    return rec;
}

export async function updateContactWebsite(id: string, updates: Partial<ContactWebsiteRecord>): Promise<void> {
    await db.contactsWebsites.update(id, updates);
}

export async function deleteContactWebsite(id: string): Promise<void> {
    await db.contactsWebsites.delete(id);
}

// ----- Category data (blob per category - replaces localStorage category_${id}) -----
export async function getCategoryData(categoryId: string): Promise<Record<string, unknown>> {
    const row = await db.categoryData.get(categoryId);
    return (row?.data as Record<string, unknown>) ?? {};
}

export async function setCategoryData(categoryId: string, data: Record<string, unknown>): Promise<void> {
    await db.categoryData.put({ id: categoryId, data, updatedAt: Date.now() });
}

// ----- Family & Friends grid (name, birthdate, contact no) -----
export interface FamilyFriendRecord {
    id: string;
    name: string;
    birthdate: string; // YYYY-MM-DD
    contactNo: string;
}

export async function getFamilyPeople(): Promise<FamilyFriendRecord[]> {
    const data = await getCategoryData('family');
    const people = (data.people as FamilyFriendRecord[] | undefined) ?? [];
    return people;
}

export async function setFamilyPeople(people: FamilyFriendRecord[]): Promise<void> {
    const data = await getCategoryData('family');
    await setCategoryData('family', { ...data, people });
}

export async function addFamilyPerson(person: Omit<FamilyFriendRecord, 'id'>): Promise<FamilyFriendRecord> {
    const people = await getFamilyPeople();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...person, id };
    await setFamilyPeople([...people, rec]);
    return rec;
}

export async function updateFamilyPerson(id: string, updates: Partial<Omit<FamilyFriendRecord, 'id'>>): Promise<void> {
    const people = await getFamilyPeople();
    const idx = people.findIndex((p) => p.id === id);
    if (idx >= 0) {
        people[idx] = { ...people[idx], ...updates };
        await setFamilyPeople(people);
    }
}

export async function deleteFamilyPerson(id: string): Promise<void> {
    const people = await getFamilyPeople().then((list) => list.filter((p) => p.id !== id));
    await setFamilyPeople(people);
}

// ----- Assets & Liabilities (name + cost/profit per year, gross outcome) -----
export interface AssetRecord {
    id: string;
    name: string;
    profitPerYear: number;
}

export interface LiabilityRecord {
    id: string;
    name: string;
    costPerYear: number;
}

export async function getAssets(): Promise<AssetRecord[]> {
    const data = await getCategoryData('assets');
    const assets = (data.assets as AssetRecord[] | undefined) ?? [];
    return assets;
}

export async function getLiabilities(): Promise<LiabilityRecord[]> {
    const data = await getCategoryData('assets');
    const liabilities = (data.liabilities as LiabilityRecord[] | undefined) ?? [];
    return liabilities;
}

export async function setAssets(assets: AssetRecord[]): Promise<void> {
    const data = await getCategoryData('assets');
    await setCategoryData('assets', { ...data, assets });
}

export async function setLiabilities(liabilities: LiabilityRecord[]): Promise<void> {
    const data = await getCategoryData('assets');
    await setCategoryData('assets', { ...data, liabilities });
}

export async function addAsset(asset: Omit<AssetRecord, 'id'>): Promise<AssetRecord> {
    const assets = await getAssets();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...asset, id };
    await setAssets([...assets, rec]);
    return rec;
}

export async function updateAsset(id: string, updates: Partial<Omit<AssetRecord, 'id'>>): Promise<void> {
    const assets = await getAssets();
    const idx = assets.findIndex((a) => a.id === id);
    if (idx >= 0) {
        assets[idx] = { ...assets[idx], ...updates };
        await setAssets(assets);
    }
}

export async function deleteAsset(id: string): Promise<void> {
    const assets = await getAssets().then((list) => list.filter((a) => a.id !== id));
    await setAssets(assets);
}

export async function addLiability(liability: Omit<LiabilityRecord, 'id'>): Promise<LiabilityRecord> {
    const liabilities = await getLiabilities();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...liability, id };
    await setLiabilities([...liabilities, rec]);
    return rec;
}

export async function updateLiability(id: string, updates: Partial<Omit<LiabilityRecord, 'id'>>): Promise<void> {
    const liabilities = await getLiabilities();
    const idx = liabilities.findIndex((l) => l.id === id);
    if (idx >= 0) {
        liabilities[idx] = { ...liabilities[idx], ...updates };
        await setLiabilities(liabilities);
    }
}

export async function deleteLiability(id: string): Promise<void> {
    const liabilities = await getLiabilities().then((list) => list.filter((l) => l.id !== id));
    await setLiabilities(liabilities);
}

// ----- Income & Expenses (name + amount per year, net outcome) -----
export interface IncomeRecord {
    id: string;
    name: string;
    amountPerYear: number;
}

export interface ExpenseRecord {
    id: string;
    name: string;
    amountPerYear: number;
}

export async function getIncome(): Promise<IncomeRecord[]> {
    const data = await getCategoryData('income');
    const income = (data.income as IncomeRecord[] | undefined) ?? [];
    return income;
}

export async function getExpenses(): Promise<ExpenseRecord[]> {
    const data = await getCategoryData('income');
    const expenses = (data.expenses as ExpenseRecord[] | undefined) ?? [];
    return expenses;
}

export async function setIncome(income: IncomeRecord[]): Promise<void> {
    const data = await getCategoryData('income');
    await setCategoryData('income', { ...data, income });
}

export async function setExpenses(expenses: ExpenseRecord[]): Promise<void> {
    const data = await getCategoryData('income');
    await setCategoryData('income', { ...data, expenses });
}

export async function addIncomeRecord(record: Omit<IncomeRecord, 'id'>): Promise<IncomeRecord> {
    const income = await getIncome();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...record, id };
    await setIncome([...income, rec]);
    return rec;
}

export async function updateIncomeRecord(id: string, updates: Partial<Omit<IncomeRecord, 'id'>>): Promise<void> {
    const income = await getIncome();
    const idx = income.findIndex((i) => i.id === id);
    if (idx >= 0) {
        income[idx] = { ...income[idx], ...updates };
        await setIncome(income);
    }
}

export async function deleteIncomeRecord(id: string): Promise<void> {
    const income = await getIncome().then((list) => list.filter((i) => i.id !== id));
    await setIncome(income);
}

export async function addExpenseRecord(record: Omit<ExpenseRecord, 'id'>): Promise<ExpenseRecord> {
    const expenses = await getExpenses();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const rec = { ...record, id };
    await setExpenses([...expenses, rec]);
    return rec;
}

export async function updateExpenseRecord(id: string, updates: Partial<Omit<ExpenseRecord, 'id'>>): Promise<void> {
    const expenses = await getExpenses();
    const idx = expenses.findIndex((e) => e.id === id);
    if (idx >= 0) {
        expenses[idx] = { ...expenses[idx], ...updates };
        await setExpenses(expenses);
    }
}

export async function deleteExpenseRecord(id: string): Promise<void> {
    const expenses = await getExpenses().then((list) => list.filter((e) => e.id !== id));
    await setExpenses(expenses);
}

// ----- Text tool (TopTools quick text) -----
export async function getTextToolContent(): Promise<string> {
    const row = await db.textTool.get('default');
    return row?.content ?? '';
}

export async function setTextToolContent(content: string): Promise<void> {
    await db.textTool.put({ id: 'default', content, updatedAt: Date.now() });
}

// ----- End of day: snapshot to journal, remove completed todos (called at midnight) -----
export async function runEndOfDay(date: string): Promise<void> {
    const [todos, trackerLogs] = await Promise.all([
        db.todos.where('date').equals(date).toArray(),
        db.dailyTrackerLog.where('date').equals(date).toArray(),
    ]);

    const entryMap = new Map<string, SectionEntryRecord>();
    try {
        const entries = await db.sectionEntries.toArray();
        entries.forEach((e: SectionEntryRecord) => entryMap.set(e.id, e));
    } catch {
        const templates = await db.trackerTemplates.toArray();
        templates.forEach((t: TrackerTemplateRecord) => entryMap.set(t.id, { id: t.id, sectionId: '', name: t.label, fieldType: t.fieldType as SectionEntryRecord['fieldType'], order: 0 }));
    }

    const todosDone = todos.filter((t: TodoRecord) => t.completed).map((t: TodoRecord) => ({ text: t.text, completed: true }));
    const todosNotDone = todos.filter((t: TodoRecord) => !t.completed).map((t: TodoRecord) => ({ text: t.text }));

    const trackerLog = trackerLogs.map((l: DailyTrackerLogRecord) => {
        const e = entryMap.get(l.templateId);
        return { label: e?.name ?? l.templateId, completed: l.completed, value: l.value };
    });

    const categoryIds = ['physical', 'hobby', 'income', 'assets', 'family', 'oneonone', 'politics', 'spiritual'];
    const goalsLog: { text: string; type: string; completed: boolean }[] = [];
    for (const cid of categoryIds) {
        const gs = await getDailyGoals(cid, date);
        gs.forEach((g) => goalsLog.push({ text: g.text, type: g.type, completed: false }));
    }

    await saveDailySnapshot({
        date,
        todosDone,
        todosNotDone,
        trackerLog,
        goalsLog,
        journalExtra: [],
    });

    for (const cid of categoryIds) {
        const gs = await getDailyGoals(cid, date);
        const sections = await getCardSections(cid);
        const sectionIds = new Set(sections.map((s) => s.id));
        const entries = await db.sectionEntries.where('sectionId').anyOf(Array.from(sectionIds)).toArray();
        const entryIds = new Set(entries.map((e: SectionEntryRecord) => e.id));
        const catTrackerLog = trackerLogs
            .filter((l: DailyTrackerLogRecord) => entryIds.has(l.templateId))
            .map((l: DailyTrackerLogRecord) => {
                const e = entryMap.get(l.templateId);
                return { label: e?.name ?? l.templateId, completed: l.completed, value: l.value };
            });
        const catGoalsLog = gs.map((g) => ({ text: g.text, type: g.type, completed: false }));
        await saveDailySnapshot({
            date,
            categoryId: cid,
            todosDone: [],
            todosNotDone: [],
            trackerLog: catTrackerLog,
            goalsLog: catGoalsLog,
            journalExtra: [],
        });
    }

    for (const t of todos) {
        const line = (t as TodoRecord).completed ? `[DONE] ${(t as TodoRecord).text}` : `[NOT DONE] ${(t as TodoRecord).text}`;
        await addJournalEntry(line, 'todos', date);
    }
    for (const t of todos.filter((x: TodoRecord) => x.completed)) {
        await db.todos.delete(t.id);
    }
}
