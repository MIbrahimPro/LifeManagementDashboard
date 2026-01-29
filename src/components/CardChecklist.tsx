import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Phone, Check } from 'lucide-react';
import {
  getCardSections,
  addCardSection,
  updateCardSection,
  deleteCardSection,
  getSectionEntries,
  addSectionEntry,
  updateSectionEntry,
  deleteSectionEntry,
  getDailyGoals,
  setDailyGoals,
  getContactsWebsites,
  addContactWebsite,
  updateContactWebsite,
  deleteContactWebsite,
  getDailyTrackerLog,
  setDailyTrackerLogEntry,
  deleteSectionEntry,
  deleteCardSection,
} from '../db';
import type { CardSectionRecord, SectionEntryRecord, ContactWebsiteRecord } from '../db';

const today = () => new Date().toISOString().slice(0, 10);
const FIELD_TYPES = ['text', 'checkbox', 'radio', 'array', 'texts'] as const;
const GOAL_TYPES = ['short', 'medium', 'long'];

interface CardChecklistProps {
  categoryId: string;
  isDarkMode: boolean;
}

export const CardChecklist: FC<CardChecklistProps> = ({ categoryId, isDarkMode }) => {
  const [sections, setSections] = useState<CardSectionRecord[]>([]);
  const [addSectionName, setAddSectionName] = useState('');
  const [addEntrySectionId, setAddEntrySectionId] = useState<string | null>(null);
  const [addEntryName, setAddEntryName] = useState('');
  const [addEntryType, setAddEntryType] = useState<SectionEntryRecord['fieldType']>('checkbox');
  const [addEntryOptions, setAddEntryOptions] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const date = today();

  const loadSections = useCallback(async () => {
    const list = await getCardSections(categoryId);
    setSections(list);
  }, [categoryId]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleAddSection = async () => {
    if (!addSectionName.trim()) return;
    await addCardSection(categoryId, addSectionName.trim(), 'custom', true);
    setAddSectionName('');
    loadSections();
  };

  const handleEditSection = async (id: string) => {
    if (!editingSectionName.trim()) return;
    await updateCardSection(id, { name: editingSectionName.trim() });
    setEditingSectionId(null);
    setEditingSectionName('');
    loadSections();
  };

  const handleAddEntry = async (sectionId: string) => {
    if (!addEntryName.trim()) return;
    const options = addEntryType === 'radio' && addEntryOptions.trim()
      ? addEntryOptions.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;
    await addSectionEntry(sectionId, addEntryName.trim(), addEntryType, options);
    setAddEntrySectionId(null);
    setAddEntryName('');
    setAddEntryOptions('');
    setAddEntryType('checkbox');
  };

  const style = (bg: string, border: string, text: string) => ({ backgroundColor: bg, borderColor: border, color: text });
  const inputStyle = {
    backgroundColor: isDarkMode ? '#374151' : '#fff',
    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    color: isDarkMode ? '#f3f4f6' : '#111827',
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          categoryId={categoryId}
          date={date}
          isDarkMode={isDarkMode}
          onRefresh={loadSections}
          onEditSection={() => { setEditingSectionId(section.id); setEditingSectionName(section.name); }}
          onStartAddEntry={() => { setAddEntrySectionId(section.id); setAddEntryName(''); setAddEntryType('checkbox'); setAddEntryOptions(''); }}
          onDeleteSection={section.removable ? () => deleteCardSection(section.id).then(loadSections) : undefined}
          editingSectionId={editingSectionId}
          editingSectionName={editingSectionName}
          onSaveEditSection={() => handleEditSection(section.id)}
          onCancelEditSection={() => { setEditingSectionId(null); setEditingSectionName(''); }}
          addEntrySectionId={addEntrySectionId}
          addEntryName={addEntryName}
          setAddEntryName={setAddEntryName}
          addEntryType={addEntryType}
          setAddEntryType={setAddEntryType}
          addEntryOptions={addEntryOptions}
          setAddEntryOptions={setAddEntryOptions}
          onAddEntry={() => handleAddEntry(section.id)}
          onCancelAddEntry={() => setAddEntrySectionId(null)}
        />
      ))}

      <div className="flex gap-2 items-center">
        <input
          value={addSectionName}
          onChange={(e) => setAddSectionName(e.target.value)}
          placeholder="New category name"
          style={inputStyle}
          className="flex-1 px-2 py-1.5 text-sm border rounded"
        />
        <button
          onClick={handleAddSection}
          disabled={!addSectionName.trim()}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          <Plus size={14} /> Add category
        </button>
      </div>
    </div>
  );
};

interface SectionBlockProps {
  section: CardSectionRecord;
  categoryId: string;
  date: string;
  isDarkMode: boolean;
  onRefresh: () => void;
  onEditSection: () => void;
  onStartAddEntry: () => void;
  editingSectionId: string | null;
  editingSectionName: string;
  onSaveEditSection: () => void;
  onCancelEditSection: () => void;
  addEntrySectionId: string | null;
  addEntryName: string;
  setAddEntryName: (s: string) => void;
  addEntryType: SectionEntryRecord['fieldType'];
  setAddEntryType: (t: SectionEntryRecord['fieldType']) => void;
  addEntryOptions: string;
  setAddEntryOptions: (s: string) => void;
  onAddEntry: () => void;
  onCancelAddEntry: () => void;
  onDeleteSection?: () => void;
}

interface CustomSectionBlockProps extends Omit<SectionBlockProps, 'onDeleteSection'> {
  onDeleteSection?: () => void;
}

function SectionBlock({
  section,
  categoryId,
  date,
  isDarkMode,
  onRefresh,
  onEditSection,
  onStartAddEntry,
  editingSectionId,
  editingSectionName,
  onSaveEditSection,
  onCancelEditSection,
  addEntrySectionId,
  addEntryName,
  setAddEntryName,
  addEntryType,
  setAddEntryType,
  addEntryOptions,
  setAddEntryOptions,
  onAddEntry,
  onCancelAddEntry,
  onDeleteSection,
}: SectionBlockProps) {
  if (section.kind === 'goals') {
    return (
      <GoalsBlock
        categoryId={categoryId}
        date={date}
        sectionName={section.name}
        isDarkMode={isDarkMode}
        onRefresh={onRefresh}
      />
    );
  }
  if (section.kind === 'contacts_websites') {
    return (
      <ContactsWebsitesBlock
        categoryId={categoryId}
        sectionName={section.name}
        isDarkMode={isDarkMode}
        onRefresh={onRefresh}
      />
    );
  }
  return (
    <CustomSectionBlock
        section={section}
        date={date}
        isDarkMode={isDarkMode}
        onRefresh={onRefresh}
        onEditSection={onEditSection}
        onStartAddEntry={onStartAddEntry}
        onDeleteSection={section.removable ? onDeleteSection : undefined}
        editingSectionId={editingSectionId}
        editingSectionName={editingSectionName}
        onSaveEditSection={onSaveEditSection}
        onCancelEditSection={onCancelEditSection}
        addEntrySectionId={addEntrySectionId}
        addEntryName={addEntryName}
        setAddEntryName={setAddEntryName}
        addEntryType={addEntryType}
        setAddEntryType={setAddEntryType}
        addEntryOptions={addEntryOptions}
        setAddEntryOptions={setAddEntryOptions}
        onAddEntry={onAddEntry}
        onCancelAddEntry={onCancelAddEntry}
      />
  );
}

function GoalsBlock({
  categoryId,
  date,
  sectionName,
  isDarkMode,
  onRefresh,
}: {
  categoryId: string;
  date: string;
  sectionName: string;
  isDarkMode: boolean;
  onRefresh: () => void;
}) {
  const [goals, setGoals] = useState<{ text: string; type: string }[]>([]);
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('short');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    getDailyGoals(categoryId, date).then(setGoals);
  }, [categoryId, date]);

  const add = async () => {
    if (!newText.trim()) return;
    const next = [...goals, { text: newText.trim(), type: newType }];
    await setDailyGoals(categoryId, date, next);
    setGoals(next);
    setNewText('');
    onRefresh();
  };

  const update = async (index: number, text: string) => {
    const next = [...goals];
    next[index] = { ...next[index], text };
    await setDailyGoals(categoryId, date, next);
    setGoals(next);
    setEditingIndex(null);
    setEditText('');
    onRefresh();
  };

  const remove = async (index: number) => {
    const next = goals.filter((_, i) => i !== index);
    await setDailyGoals(categoryId, date, next);
    setGoals(next);
    onRefresh();
  };

  const inputStyle = {
    backgroundColor: isDarkMode ? '#374151' : '#fff',
    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    color: isDarkMode ? '#f3f4f6' : '#111827',
  };

  return (
    <div style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="p-3 rounded-lg border">
      <h4 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm font-bold mb-2">{sectionName}</h4>
      <div className="space-y-1">
        {goals.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            {editingIndex === i ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} style={inputStyle} className="flex-1 px-2 py-1 text-sm border rounded" />
                <button onClick={() => update(i, editText)} className="text-green-600 text-xs">Save</button>
                <button onClick={() => { setEditingIndex(null); setEditText(''); }} className="text-gray-500 text-xs">Cancel</button>
              </>
            ) : (
              <>
                <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm flex-1">{g.text}</span>
                <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-xs capitalize">{g.type}</span>
                <button onClick={() => { setEditingIndex(i); setEditText(g.text); }} className="text-amber-500 p-0.5"><Pencil size={12} /></button>
                <button onClick={() => remove(i)} className="text-red-500 p-0.5"><Trash2 size={12} /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Goal text" style={inputStyle} className="flex-1 px-2 py-1 text-sm border rounded" />
        <select value={newType} onChange={(e) => setNewType(e.target.value)} style={inputStyle} className="px-2 py-1 text-sm border rounded">
          {GOAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={add} disabled={!newText.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-sm">Add</button>
      </div>
    </div>
  );
}

function ContactsWebsitesBlock({
  categoryId,
  sectionName,
  isDarkMode,
  onRefresh,
}: {
  categoryId: string;
  sectionName: string;
  isDarkMode: boolean;
  onRefresh: () => void;
}) {
  const [list, setList] = useState<ContactWebsiteRecord[]>([]);
  const [newType, setNewType] = useState<'website' | 'contact'>('website');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    getContactsWebsites(categoryId).then(setList);
  }, [categoryId, onRefresh]);

  const add = async () => {
    if (!newLink.trim()) return;
    await addContactWebsite(categoryId, newType, newLink.trim());
    setList(await getContactsWebsites(categoryId));
    setNewLink('');
    onRefresh();
  };

  const remove = async (id: string) => {
    await deleteContactWebsite(id);
    setList(await getContactsWebsites(categoryId));
    onRefresh();
  };

  const open = (item: ContactWebsiteRecord) => {
    if (item.type === 'contact') {
      const tel = item.linkOrPhone.replace(/\D/g, '');
      window.location.href = `tel:${tel}`;
    } else {
      const url = item.linkOrPhone.startsWith('http') ? item.linkOrPhone : `https://${item.linkOrPhone}`;
      window.open(url, '_blank');
    }
  };

  const inputStyle = { backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#f3f4f6' : '#111827' };

  return (
    <div style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="p-3 rounded-lg border">
      <h4 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm font-bold mb-2">{sectionName}</h4>
      <div className="space-y-1">
        {list.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm flex-1 truncate">{item.type}: {item.linkOrPhone}</span>
            <button onClick={() => open(item)} className="p-1 text-blue-500" title="Open">
              {item.type === 'contact' ? <Phone size={14} /> : <ExternalLink size={14} />}
            </button>
            <button onClick={() => remove(item.id)} className="p-1 text-red-500"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <select value={newType} onChange={(e) => setNewType(e.target.value as 'website' | 'contact')} style={inputStyle} className="px-2 py-1 text-sm border rounded">
          <option value="website">Website</option>
          <option value="contact">Contact</option>
        </select>
        <input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder={newType === 'contact' ? 'Phone number' : 'URL'} style={inputStyle} className="flex-1 px-2 py-1 text-sm border rounded" />
        <button onClick={add} disabled={!newLink.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-sm">Add</button>
      </div>
    </div>
  );
}

function CustomSectionBlock({
  section,
  date,
  isDarkMode,
  onRefresh,
  onEditSection,
  onStartAddEntry,
  onDeleteSection,
  editingSectionId,
  editingSectionName,
  onSaveEditSection,
  onCancelEditSection,
  addEntrySectionId,
  addEntryName,
  setAddEntryName,
  addEntryType,
  setAddEntryType,
  addEntryOptions,
  setAddEntryOptions,
  onAddEntry,
  onCancelAddEntry,
}: CustomSectionBlockProps) {
  const [entries, setEntries] = useState<SectionEntryRecord[]>([]);
  const [log, setLog] = useState<Record<string, { completed: boolean; value?: string }>>({});

  useEffect(() => {
    getSectionEntries(section.id).then(setEntries);
  }, [section.id]);
  useEffect(() => {
    getDailyTrackerLog(date).then((logs) => {
      const map: Record<string, { completed: boolean; value?: string }> = {};
      logs.forEach((l) => { map[l.templateId] = { completed: l.completed, value: l.value }; });
      setLog(map);
    });
  }, [date, entries.length]);

  const toggle = async (entryId: string, completed: boolean, value?: string) => {
    await setDailyTrackerLogEntry(date, entryId, { completed, value });
    setLog((prev) => ({ ...prev, [entryId]: { completed, value } }));
  };

  const inputStyle = { backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#f3f4f6' : '#111827' };

  return (
    <div style={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }} className="p-3 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        {editingSectionId === section.id ? (
          <>
            <input value={editingSectionName} onChange={(e) => setEditingSectionName(e.target.value)} style={inputStyle} className="flex-1 px-2 py-1 text-sm border rounded" />
            <button onClick={onSaveEditSection} className="text-green-600 text-xs">Save</button>
            <button onClick={onCancelEditSection} className="text-gray-500 text-xs">Cancel</button>
          </>
        ) : (
          <>
            <h4 style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm font-bold flex-1">{section.name}</h4>
            {section.removable && (
              <>
                <button onClick={onEditSection} className="p-0.5 text-amber-500" title="Edit name"><Pencil size={12} /></button>
                {onDeleteSection && <button onClick={onDeleteSection} className="p-0.5 text-red-500" title="Remove category"><Trash2 size={12} /></button>}
              </>
            )}
            <button onClick={onStartAddEntry} className="p-0.5 text-blue-500" title="Add entry"><Plus size={14} /></button>
          </>
        )}
      </div>

      {addEntrySectionId === section.id && (
        <div className="mb-2 p-2 rounded border" style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
          <input value={addEntryName} onChange={(e) => setAddEntryName(e.target.value)} placeholder="Name (e.g. Running)" style={inputStyle} className="w-full mb-1 px-2 py-1 text-sm border rounded" />
          <select value={addEntryType} onChange={(e) => setAddEntryType(e.target.value as SectionEntryRecord['fieldType'])} style={inputStyle} className="w-full mb-1 px-2 py-1 text-sm border rounded">
            {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {addEntryType === 'radio' && (
            <input value={addEntryOptions} onChange={(e) => setAddEntryOptions(e.target.value)} placeholder="Options comma-separated" style={inputStyle} className="w-full mb-1 px-2 py-1 text-sm border rounded" />
          )}
          <div className="flex gap-2">
            <button onClick={onAddEntry} disabled={!addEntryName.trim()} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm">Add</button>
            <button onClick={onCancelAddEntry} className="text-gray-500 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {entries.map((entry) => {
          const val = log[entry.id];
          const completed = val?.completed ?? false;
          const value = val?.value ?? '';
          if (entry.fieldType === 'checkbox') {
            return (
              <div key={entry.id} className="flex items-center gap-2">
                <button onClick={() => toggle(entry.id, !completed)} className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${completed ? 'bg-green-600 border-green-600' : ''}`}>
                  {completed && <Check size={12} className="text-white" />}
                </button>
                <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm">{entry.name}</span>
                <button onClick={() => deleteSectionEntry(entry.id).then(onRefresh)} className="ml-auto p-0.5 text-red-500 opacity-70 hover:opacity-100"><Trash2 size={12} /></button>
              </div>
            );
          }
          return (
            <div key={entry.id} className="flex items-center gap-2">
              <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm shrink-0 min-w-[80px]">{entry.name}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setLog((p) => ({ ...p, [entry.id]: { completed, value: e.target.value } }))}
                onBlur={(e) => toggle(entry.id, completed, e.target.value)}
                placeholder="..."
                style={inputStyle}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <button onClick={() => deleteSectionEntry(entry.id).then(onRefresh)} className="p-0.5 text-red-500 opacity-70 hover:opacity-100"><Trash2 size={12} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
