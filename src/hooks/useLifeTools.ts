import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  addTodo as apiAddTodo,
  toggleTodo as apiToggleTodo,
  deleteTodo as apiDeleteTodo,
  addAction as apiAddAction,
  toggleAction as apiToggleAction,
  deleteAction as apiDeleteAction,
  addJournalEntry as apiAddJournalEntry,
  runEndOfDay as apiRunEndOfDay,
  setTextToolContent,
  setUserSettings,
  type TodoRecord,
  type ActionRecord,
  type JournalEntryRecord,
  type UserSettingsRecord,
} from '../db';

export const today = () => new Date().toISOString().slice(0, 10);

export type {
  TodoRecord as TodoItem,
  ActionRecord as ActionItem,
  JournalEntryRecord as JournalEntry,
};

export function useTodoList(date: string = today()) {
  const todos = useLiveQuery(() => db.todos.where('date').equals(date).toArray(), [date]);

  const addTodo = useCallback(
    (text: string) => {
      return apiAddTodo(text, date);
    },
    [date]
  );

  const toggleTodo = useCallback((id: string) => {
    return apiToggleTodo(id);
  }, []);

  const deleteTodo = useCallback((id: string) => {
    return apiDeleteTodo(id);
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    const completed = (todos || []).filter((t) => t.completed);
    for (const t of completed) {
      await apiDeleteTodo(t.id);
    }
  }, [todos]);

  const runEndOfDay = useCallback(() => {
    return apiRunEndOfDay(date);
  }, [date]);

  return {
    todos: todos || [],
    loading: todos === undefined,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
    runEndOfDay,
  };
}

export function useActionsList(date: string = today()) {
  const actions = useLiveQuery(() => db.actions.where('date').equals(date).toArray(), [date]);

  const addAction = useCallback(
    (text: string) => {
      return apiAddAction(text, date);
    },
    [date]
  );

  const toggleAction = useCallback((id: string) => {
    return apiToggleAction(id);
  }, []);

  const deleteAction = useCallback((id: string) => {
    return apiDeleteAction(id);
  }, []);

  return {
    actions: actions || [],
    loading: actions === undefined,
    addAction,
    toggleAction,
    deleteAction,
  };
}

export function useJournal() {
  const entries = useLiveQuery(() => db.journalEntries.orderBy('timestamp').reverse().toArray());

  const addEntry = useCallback((text: string, category: string, entryDate?: string) => {
    return apiAddJournalEntry(text, category, entryDate ?? today());
  }, []);

  return {
    entries: entries || [],
    loading: entries === undefined,
    addEntry,
  };
}

export function useTextTool() {
  const textTool = useLiveQuery(() => db.textTool.get('default'));

  const persist = useCallback(async (value: string) => {
    await setTextToolContent(value);
  }, []);

  return {
    text: textTool?.content ?? '',
    setText: persist,
    persist,
    loading: textTool === undefined,
  };
}

export function useEmail() {
  const userSettings = useLiveQuery(() => db.userSettings.get('default'));

  const persist = useCallback(async (value: string) => {
    const currentSettings = await db.userSettings.get('default');
    await setUserSettings({ ...currentSettings, userEmail: value } as UserSettingsRecord);
  }, []);

  return {
    email: userSettings?.userEmail ?? 'your-email@example.com',
    setEmail: persist,
    persist,
    loading: userSettings === undefined,
  };
}
