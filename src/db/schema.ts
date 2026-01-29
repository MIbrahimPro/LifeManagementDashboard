import Dexie, { type Table } from 'dexie';

// Types for DB entities (same shape we can send to Netlify/MongoDB later)
export interface UserSettingsRecord {
  id: string;
  religion: string;
  isDarkMode?: boolean;
  userEmail?: string;
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
}

export interface ActionRecord {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
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
  todosDone: { text: string; completed: boolean }[];
  todosNotDone: { text: string }[];
  trackerLog: { label: string; completed: boolean; value?: string }[];
  goalsLog: { text: string; type: string; completed: boolean }[];
  journalExtra: string[]; // "what's on your mind" etc.
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
  templateId: string;
  value?: string; // for text/dropdown
  completed: boolean;
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

  constructor() {
    super('FaithfulLifeDashboard');
    this.version(1).stores({
      userSettings: 'id',
      verses: 'id, [religion+categoryId], religion',
      todos: 'id, date, [date+completed]',
      actions: 'id, date',
      journalEntries: 'id, date, [date+category]',
      dailySnapshots: 'id, date',
      trackerTemplates: 'id, categoryId, [categoryId+order]',
      dailyTrackerLog: 'id, [date+templateId], date',
      hobbyLinks: 'id, categoryId, order',
      goals: 'id, date, categoryId, goalType',
      categoryData: 'id',
      textTool: 'id',
    });
  }
}

export const db = new AppDatabase();
