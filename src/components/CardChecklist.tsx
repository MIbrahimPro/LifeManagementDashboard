import { useState, type FC } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Pencil, Trash2, ExternalLink, Phone, Check } from 'lucide-react';
import {
  db,
  addCardSection,
  updateCardSection,
  deleteCardSection,
  addSectionEntry,
  deleteSectionEntry,
  setDailyGoals,
  addContactWebsite,
  deleteContactWebsite,
  setDailyTrackerLogEntry,
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
  const sections = useLiveQuery(() => db.cardSections.where('categoryId').equals(categoryId).sortBy('order'), [categoryId]);
  const [addSectionName, setAddSectionName] = useState('');
  const [addEntrySectionId, setAddEntrySectionId] = useState<string | null>(null);
  const [addEntryName, setAddEntryName] = useState('');
  const [addEntryType, setAddEntryType] = useState<SectionEntryRecord['fieldType']>('checkbox');
  const [addEntryOptions, setAddEntryOptions] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const date = today();

  const handleAddSection = async () => {
    if (!addSectionName.trim()) return;
    await addCardSection(categoryId, addSectionName.trim(), 'custom', true);
    setAddSectionName('');
  };

  const handleEditSection = async (id: string) => {
    if (!editingSectionName.trim()) return;
    await updateCardSection(id, { name: editingSectionName.trim() });
    setEditingSectionId(null);
    setEditingSectionName('');
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

  const inputStyle = {
    backgroundColor: isDarkMode ? '#374151' : '#fff',
    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
    color: isDarkMode ? '#f3f4f6' : '#111827',
  };

  return (
    <div className="space-y-4">
      {(sections || []).map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          categoryId={categoryId}
          date={date}
          isDarkMode={isDarkMode}
          onEditSection={() => { setEditingSectionId(section.id); setEditingSectionName(section.name); }}
          onStartAddEntry={() => { setAddEntrySectionId(section.id); setAddEntryName(''); setAddEntryType('checkbox'); setAddEntryOptions(''); }}
          onDeleteSection={section.removable ? () => deleteCardSection(section.id) : undefined}
          editingSectionId={editingSectionId}
          editingSectionName={editingSectionName}
          setEditingSectionName={setEditingSectionName}
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
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <input
          value={addSectionName}
          onChange={(e) => setAddSectionName(e.target.value)}
          placeholder="New category name"
          style={inputStyle}
          className="w-full sm:flex-1 px-2 py-1.5 text-sm border rounded"
        />
        <button
          onClick={handleAddSection}
          disabled={!addSectionName.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium"
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
  onEditSection: () => void;
  onStartAddEntry: () => void;
  editingSectionId: string | null;
  editingSectionName: string;
  setEditingSectionName: (s: string) => void;
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
  onEditSection,
  onStartAddEntry,
  setEditingSectionName,
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
      />
    );
  }
  if (section.kind === 'contacts_websites') {
    return (
      <ContactsWebsitesBlock
        categoryId={categoryId}
        sectionName={section.name}
        isDarkMode={isDarkMode}
      />
    );
  }
  return (
    <CustomSectionBlock
      categoryId={categoryId}
      section={section}
      date={date}
      isDarkMode={isDarkMode}
      onEditSection={onEditSection}
      onStartAddEntry={onStartAddEntry}
      onDeleteSection={section.removable ? onDeleteSection : undefined}
      editingSectionId={editingSectionId}
      editingSectionName={editingSectionName}
      setEditingSectionName={setEditingSectionName}
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
}: {
  categoryId: string;
  date: string;
  sectionName: string;
  isDarkMode: boolean;
}) {
  const goals = useLiveQuery(() => db.dailyGoals.get(`${categoryId}_${date}`), [categoryId, date]);
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('short');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const add = async () => {
    if (!newText.trim()) return;
    const currentGoals = goals?.goals || [];
    const next = [...currentGoals, { text: newText.trim(), type: newType }];
    await setDailyGoals(categoryId, date, next);
    setNewText('');
  };

  const update = async (index: number, text: string) => {
    const currentGoals = goals?.goals || [];
    const next = [...currentGoals];
    next[index] = { ...next[index], text };
    await setDailyGoals(categoryId, date, next);
    setEditingIndex(null);
    setEditText('');
  };

  const remove = async (index: number) => {
    const currentGoals = goals?.goals || [];
    const next = currentGoals.filter((_, i) => i !== index);
    await setDailyGoals(categoryId, date, next);
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
        {(goals?.goals || []).map((g, i) => (
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
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Goal text" style={inputStyle} className="w-full sm:flex-1 px-2 py-1 text-sm border rounded" />
        <select value={newType} onChange={(e) => setNewType(e.target.value)} style={inputStyle} className="w-full sm:w-auto px-2 py-1 text-sm border rounded">
          {GOAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={add} disabled={!newText.trim()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-sm">Add</button>
      </div>
    </div>
  );
}

function ContactsWebsitesBlock({
  categoryId,
  sectionName,
  isDarkMode,
}: {
  categoryId: string;
  sectionName: string;
  isDarkMode: boolean;
}) {
  const list = useLiveQuery(() => db.contactsWebsites.where('categoryId').equals(categoryId).sortBy('order'), [categoryId]);
  const [newType, setNewType] = useState<'website' | 'contact'>('website');
  const [newLink, setNewLink] = useState('');

  const add = async () => {
    if (!newLink.trim()) return;
    await addContactWebsite(categoryId, newType, newLink.trim());
    setNewLink('');
  };

  const remove = (id: string) => {
    return deleteContactWebsite(id);
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
        {(list || []).map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm flex-1 truncate">{item.type}: {item.linkOrPhone}</span>
            <button onClick={() => open(item)} className="p-1 text-blue-500" title="Open">
              {item.type === 'contact' ? <Phone size={14} /> : <ExternalLink size={14} />}
            </button>
            <button onClick={() => remove(item.id)} className="p-1 text-red-500"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <select value={newType} onChange={(e) => setNewType(e.target.value as 'website' | 'contact')} style={inputStyle} className="w-full sm:w-auto px-2 py-1 text-sm border rounded">
          <option value="website">Website</option>
          <option value="contact">Contact</option>
        </select>
        <input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder={newType === 'contact' ? 'Phone number' : 'URL'} style={inputStyle} className="w-full sm:flex-1 px-2 py-1 text-sm border rounded" />
        <button onClick={add} disabled={!newLink.trim()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-sm">Add</button>
      </div>
    </div>
  );
}

function CustomSectionBlock({
  section,
  categoryId,
  date,
  isDarkMode,
  onEditSection,
  onStartAddEntry,
  onDeleteSection,
  editingSectionId,
  editingSectionName,
  setEditingSectionName,
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
  void categoryId;
  const entries = useLiveQuery(() => db.sectionEntries.where('sectionId').equals(section.id).sortBy('order'), [section.id]);
  const log = useLiveQuery(() => db.dailyTrackerLog.where('date').equals(date).toArray(), [date]);

  const logMap = (log || []).reduce((acc, l) => {
    acc[l.templateId] = { completed: l.completed, value: l.value };
    return acc;
  }, {} as Record<string, { completed: boolean; value?: string }>);

  const toggle = async (entryId: string, completed: boolean, value?: string) => {
    await setDailyTrackerLogEntry(date, entryId, { completed, value });
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
          <div className="flex flex-col gap-1">
            <input value={addEntryName} onChange={(e) => setAddEntryName(e.target.value)} placeholder="Name (e.g. Running)" style={inputStyle} className="w-full px-2 py-1 text-sm border rounded" />
            <select value={addEntryType} onChange={(e) => setAddEntryType(e.target.value as SectionEntryRecord['fieldType'])} style={inputStyle} className="w-full px-2 py-1 text-sm border rounded">
              {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {addEntryType === 'radio' && (
              <input value={addEntryOptions} onChange={(e) => setAddEntryOptions(e.target.value)} placeholder="Options comma-separated" style={inputStyle} className="w-full px-2 py-1 text-sm border rounded" />
            )}
            <div className="flex gap-2">
              <button onClick={onAddEntry} disabled={!addEntryName.trim()} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm">Add</button>
              <button onClick={onCancelAddEntry} className="text-gray-500 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {(entries || []).map((entry) => {
          const val = logMap[entry.id];
          const completed = val?.completed ?? false;
          let value = val?.value ?? '';

          const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            value = e.target.value;
          };

          if (entry.fieldType === 'checkbox') {
            return (
              <div key={entry.id} className="flex items-center gap-2">
                <button onClick={() => toggle(entry.id, !completed)} className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${completed ? 'bg-green-600 border-green-600' : ''}`}>
                  {completed && <Check size={12} className="text-white" />}
                </button>
                <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm">{entry.name}</span>
                <button onClick={() => deleteSectionEntry(entry.id)} className="ml-auto p-0.5 text-red-500 opacity-70 hover:opacity-100"><Trash2 size={12} /></button>
              </div>
            );
          }
          return (
            <div key={entry.id} className="flex items-center gap-2">
              <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm shrink-0 min-w-20">{entry.name}</label>
              <input
                type="text"
                defaultValue={value}
                onChange={handleValueChange}
                onBlur={(e) => toggle(entry.id, completed, e.target.value)}
                placeholder="..."
                style={inputStyle}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <button onClick={() => deleteSectionEntry(entry.id)} className="p-0.5 text-red-500 opacity-70 hover:opacity-100"><Trash2 size={12} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
