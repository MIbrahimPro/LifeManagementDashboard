import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Check } from 'lucide-react';
import {
  getTrackerTemplates,
  getDailyTrackerLog,
  setDailyTrackerLogEntry,
} from '../db';
import type { TrackerTemplateRecord } from '../db';

const today = () => new Date().toISOString().slice(0, 10);

interface DailyTrackerProps {
  categoryId: string;
  isDarkMode: boolean;
  title?: string;
}

export const DailyTracker: FC<DailyTrackerProps> = ({
  categoryId,
  isDarkMode,
  title = "Today's checklist",
}) => {
  const [templates, setTemplates] = useState<TrackerTemplateRecord[]>([]);
  const [log, setLog] = useState<Record<string, { completed: boolean; value?: string }>>({});
  const date = today();

  const load = useCallback(async () => {
    const [tpls, logs] = await Promise.all([
      getTrackerTemplates(categoryId),
      getDailyTrackerLog(date),
    ]);
    setTemplates(tpls);
    const map: Record<string, { completed: boolean; value?: string }> = {};
    for (const l of logs) {
      map[l.templateId] = { completed: l.completed, value: l.value };
    }
    setLog(map);
  }, [categoryId, date]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (templateId: string, completed: boolean, value?: string) => {
    await setDailyTrackerLogEntry(date, templateId, { completed, value });
    setLog((prev) => ({ ...prev, [templateId]: { completed, value: value ?? prev[templateId]?.value } }));
  };

  const setTextValue = (templateId: string, value: string) => {
    setLog((prev) => ({
      ...prev,
      [templateId]: { completed: prev[templateId]?.completed ?? false, value },
    }));
  };

  const persistText = async (templateId: string, completed: boolean, value: string) => {
    await setDailyTrackerLogEntry(date, templateId, { completed, value });
  };

  return (
    <div className="space-y-2">
      <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">
        {title}
      </label>
      <div className="space-y-2">
        {templates.map((t) => {
          const entry = log[t.id];
          const completed = entry?.completed ?? false;
          const value = entry?.value ?? '';

          if (t.fieldType === 'checkbox') {
            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                  borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                }}
                className="flex items-center gap-2 p-2 rounded-lg border"
              >
                <button
                  onClick={() => toggle(t.id, !completed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    completed
                      ? 'bg-green-600 border-green-600'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-green-600'
                        : 'border-gray-400 hover:border-green-600'
                  }`}
                >
                  {completed && <Check size={12} className="text-white" />}
                </button>
                <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm">
                  {t.label}
                </span>
              </div>
            );
          }

          return (
            <div
              key={t.id}
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              }}
              className="p-2 rounded-lg border"
            >
              <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-medium block mb-1">
                {t.label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setTextValue(t.id, e.target.value)}
                onBlur={(e) => persistText(t.id, completed, e.target.value)}
                placeholder="Notes..."
                style={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                }}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
