import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { ExternalLink, Pencil, Trash2, Plus } from 'lucide-react';
import { getHobbyLinks, addHobbyLink, updateHobbyLink, deleteHobbyLink } from '../db';
import type { HobbyLinkRecord } from '../db';

interface HobbyLinksProps {
  categoryId: string;
  isDarkMode: boolean;
  title?: string;
}

export const HobbyLinks: FC<HobbyLinksProps> = ({
  categoryId,
  isDarkMode,
  title = 'Hobbies / Links',
}) => {
  const [links, setLinks] = useState<HobbyLinkRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const load = useCallback(async () => {
    const list = await getHobbyLinks(categoryId);
    setLinks(list);
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpen = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank');
    else window.open(`https://${url}`, '_blank');
  };

  const startEdit = (link: HobbyLinkRecord) => {
    setEditingId(link.id);
    setEditLabel(link.label);
    setEditUrl(link.url);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const url = editUrl.trim().startsWith('http') ? editUrl.trim() : `https://${editUrl.trim()}`;
    await updateHobbyLink(editingId, { label: editLabel.trim(), url });
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteHobbyLink(id);
    load();
  };

  const handleAdd = async () => {
    if (!newLabel.trim() || !newUrl.trim()) return;
    const url = newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`;
    await addHobbyLink({
      label: newLabel.trim(),
      url,
      categoryId,
      order: links.length,
    });
    setNewLabel('');
    setNewUrl('');
    setShowAdd(false);
    load();
  };

  return (
    <div className="space-y-2">
      <label style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} className="text-sm font-semibold block mb-1">
        {title}
      </label>
      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            }}
            className="flex items-center gap-2 p-2 rounded-lg border"
          >
            {editingId === link.id ? (
              <>
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Label"
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                  }}
                  className="flex-1 min-w-0 px-2 py-1 text-sm border rounded"
                />
                <input
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                  }}
                  className="flex-1 min-w-0 px-2 py-1 text-sm border rounded"
                />
                <button
                  onClick={saveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Save"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ color: isDarkMode ? '#f3f4f6' : '#111827' }} className="text-sm truncate flex-1 min-w-0">
                  {link.label}
                </span>
                <button
                  onClick={() => handleOpen(link.url)}
                  className="p-1 text-blue-500 hover:text-blue-600"
                  title="Open link"
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => startEdit(link)}
                  className="p-1 text-amber-500 hover:text-amber-600"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {showAdd ? (
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#fff',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              color: isDarkMode ? '#f3f4f6' : '#111827',
            }}
            className="px-2 py-1 text-sm border rounded flex-1 min-w-[80px]"
          />
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#fff',
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
              color: isDarkMode ? '#f3f4f6' : '#111827',
            }}
            className="px-2 py-1 text-sm border rounded flex-1 min-w-[120px]"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAdd(false); setNewLabel(''); setNewUrl(''); }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          <Plus size={14} /> Add link
        </button>
      )}
    </div>
  );
};
