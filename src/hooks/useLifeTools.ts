import { useState, useCallback, useEffect } from 'react';
import {
  getTodosForDate,
  addTodo as apiAddTodo,
  toggleTodo as apiToggleTodo,
  deleteTodo as apiDeleteTodo,
  getActionsForDate,
  addAction as apiAddAction,
  toggleAction as apiToggleAction,
  deleteAction as apiDeleteAction,
  getAllJournalEntries,
  addJournalEntry as apiAddJournalEntry,
  runEndOfDay as apiRunEndOfDay,
} from '../db';

export const today = () => new Date().toISOString().slice(0, 10);

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp?: string;
  date: string;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp?: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
  category: string;
  date: string;
}

export function useTodoList(date: string = today()) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getTodosForDate(date);
    setTodos(list.map((t) => ({ ...t, timestamp: t.createdAt })) as TodoItem[]);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTodo = useCallback(
    async (text: string) => {
      await apiAddTodo(text, date);
      await refresh();
    },
    [date, refresh]
  );

  const toggleTodo = useCallback(async (id: string) => {
    await apiToggleTodo(id);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback(
    async (id: string) => {
      await apiDeleteTodo(id);
      await refresh();
    },
    [refresh]
  );

  const clearCompletedTodos = useCallback(
    async () => {
      const completed = todos.filter((t) => t.completed);
      for (const t of completed) {
        await apiDeleteTodo(t.id);
      }
      await refresh();
    },
    [todos, refresh]
  );

  const runEndOfDay = useCallback(async () => {
    await apiRunEndOfDay(date);
    await refresh();
  }, [date, refresh]);

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
    runEndOfDay,
    refresh,
  };
}

export function useActionsList(date: string = today()) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getActionsForDate(date);
    setActions(list.map((a) => ({ ...a, timestamp: a.createdAt })) as ActionItem[]);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAction = useCallback(
    async (text: string) => {
      await apiAddAction(text, date);
      await refresh();
    },
    [date, refresh]
  );

  const toggleAction = useCallback(async (id: string) => {
    await apiToggleAction(id);
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }, []);

  const deleteAction = useCallback(
    async (id: string) => {
      await apiDeleteAction(id);
      await refresh();
    },
    [refresh]
  );

  return { actions, loading, addAction, toggleAction, deleteAction, refresh };
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getAllJournalEntries();
    setEntries(list as JournalEntry[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = useCallback(
    async (text: string, category: string, entryDate?: string) => {
      await apiAddJournalEntry(text, category, entryDate ?? today());
      await refresh();
    },
    [refresh]
  );

  return { entries, loading, addEntry, refresh };
}

// Re-export for components that only need text/email from TopTools (will use db in TopTools)
export function useTextTool() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { getTextToolContent } = await import('../db');
      const content = await getTextToolContent();
      setText(content);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (value: string) => {
    const { setTextToolContent } = await import('../db');
    await setTextToolContent(value);
  }, []);

  return { text, setText, persist, loading };
}

export function useEmail() {
  const [email, setEmail] = useState('your-email@example.com');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { getUserSettings } = await import('../db');
      const settings = await getUserSettings();
      if (settings?.userEmail) setEmail(settings.userEmail);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(
    async (value: string) => {
      const { setUserSettings } = await import('../db');
      await setUserSettings({ userEmail: value });
    },
    []
  );

  return { email, setEmail, persist, loading };
}
