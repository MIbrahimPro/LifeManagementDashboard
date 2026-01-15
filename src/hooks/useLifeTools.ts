import { useState, useCallback, useEffect } from 'react';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    timestamp?: string;
}

export interface ActionItem {
    id: string;
    text: string;
    completed: boolean;
    timestamp?: string;
}

export interface JournalEntry {
    id: string;
    text: string;
    timestamp: string;
    category: string;
}

// To-Do List Hook
export const useTodoList = () => {
    const [todos, setTodos] = useState<TodoItem[]>(() => {
        try {
            const stored = localStorage.getItem('todoList');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('todoList', JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving todos', error);
        }
    }, [todos]);

    const addTodo = useCallback((text: string) => {
        setTodos(prev => [...prev, {
            id: Date.now().toString(),
            text,
            completed: false,
            timestamp: new Date().toLocaleString()
        }]);
    }, []);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    const clearCompletedTodos = useCallback(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
    }, []);

    return { todos, addTodo, toggleTodo, deleteTodo, clearCompletedTodos };
};

// Actions List Hook
export const useActionsList = () => {
    const [actions, setActions] = useState<ActionItem[]>(() => {
        try {
            const stored = localStorage.getItem('actionsList');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('actionsList', JSON.stringify(actions));
        } catch (error) {
            console.error('Error saving actions', error);
        }
    }, [actions]);

    const addAction = useCallback((text: string) => {
        setActions(prev => [...prev, {
            id: Date.now().toString(),
            text,
            completed: false,
            timestamp: new Date().toLocaleString()
        }]);
    }, []);

    const toggleAction = useCallback((id: string) => {
        setActions(prev =>
            prev.map(action =>
                action.id === id ? { ...action, completed: !action.completed } : action
            )
        );
    }, []);

    const deleteAction = useCallback((id: string) => {
        setActions(prev => prev.filter(action => action.id !== id));
    }, []);

    return { actions, addAction, toggleAction, deleteAction };
};

// Journal Hook
export const useJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>(() => {
        try {
            const stored = localStorage.getItem('journalEntries');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('journalEntries', JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving journal entries', error);
        }
    }, [entries]);

    const addEntry = useCallback((text: string, category: string) => {
        setEntries(prev => [...prev, {
            id: Date.now().toString(),
            text,
            timestamp: new Date().toLocaleString(),
            category
        }]);
    }, []);

    const deleteEntry = useCallback((id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    }, []);

    return { entries, addEntry, deleteEntry };
};

// Text Tool Hook
export const useTextTool = () => {
    const [text, setText] = useState(() => {
        try {
            return localStorage.getItem('textTool') || '';
        } catch {
            return '';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('textTool', text);
        } catch (error) {
            console.error('Error saving text', error);
        }
    }, [text]);

    const clearText = useCallback(() => {
        setText('');
    }, []);

    const copyText = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }, [text]);

    return { text, setText, clearText, copyText };
};

// Email Hook
export const useEmail = () => {
    const [email, setEmail] = useState(() => {
        try {
            return localStorage.getItem('userEmail') || 'your-email@example.com';
        } catch {
            return 'your-email@example.com';
        }
    });

    const copyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(email);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }, [email]);

    return { email, setEmail, copyEmail };
};
