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
export async function getDailySnapshot(date: string): Promise<DailySnapshotRecord | undefined> {
  return db.dailySnapshots.where('date').equals(date).first();
}

export async function getDailySnapshots(): Promise<DailySnapshotRecord[]> {
  return db.dailySnapshots.orderBy('date').reverse().toArray();
}

export async function saveDailySnapshot(snapshot: Omit<DailySnapshotRecord, 'id' | 'createdAt'>): Promise<void> {
  const id = `snap_${snapshot.date}`;
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

// ----- Category data (blob per category - replaces localStorage category_${id}) -----
export async function getCategoryData(categoryId: string): Promise<Record<string, unknown>> {
  const row = await db.categoryData.get(categoryId);
  return (row?.data as Record<string, unknown>) ?? {};
}

export async function setCategoryData(categoryId: string, data: Record<string, unknown>): Promise<void> {
  await db.categoryData.put({ id: categoryId, data, updatedAt: Date.now() });
}

// ----- Text tool (TopTools quick text) -----
export async function getTextToolContent(): Promise<string> {
  const row = await db.textTool.get('default');
  return row?.content ?? '';
}

export async function setTextToolContent(content: string): Promise<void> {
  await db.textTool.put({ id: 'default', content, updatedAt: Date.now() });
}

// ----- End of day: snapshot to journal, remove completed todos -----
export async function runEndOfDay(date: string): Promise<void> {
  const [todos, trackerLogs, goals] = await Promise.all([
    db.todos.where('date').equals(date).toArray(),
    db.dailyTrackerLog.where('date').equals(date).toArray(),
    db.goals.where('date').equals(date).toArray(),
  ]);

  const templates = await db.trackerTemplates.toArray();
  const templateMap = new Map(templates.map((t: TrackerTemplateRecord) => [t.id, t]));

  const todosDone = todos.filter((t: TodoRecord) => t.completed).map((t: TodoRecord) => ({ text: t.text, completed: true }));
  const todosNotDone = todos.filter((t: TodoRecord) => !t.completed).map((t: TodoRecord) => ({ text: t.text }));

  const trackerLog = trackerLogs.map((l: DailyTrackerLogRecord) => {
    const t = templateMap.get(l.templateId);
    return { label: (t as TrackerTemplateRecord | undefined)?.label ?? l.templateId, completed: l.completed, value: l.value };
  });

  const goalsLog = goals.map((g: GoalRecord) => ({ text: g.text, type: g.goalType, completed: g.completed }));

  await saveDailySnapshot({
    date,
    todosDone,
    todosNotDone,
    trackerLog,
    goalsLog,
    journalExtra: [],
  });

  for (const t of todos) {
    const line = (t as TodoRecord).completed ? `[DONE] ${(t as TodoRecord).text}` : `[NOT DONE] ${(t as TodoRecord).text}`;
    await addJournalEntry(line, 'todos', date);
  }
  for (const t of todos.filter((x: TodoRecord) => x.completed)) {
    await db.todos.delete(t.id);
  }
}
