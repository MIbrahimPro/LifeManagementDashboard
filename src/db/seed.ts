import { db } from './schema';
import type { TrackerTemplateRecord } from './schema';

const PHYSICAL_TRACKER_TEMPLATES: Omit<TrackerTemplateRecord, 'id'>[] = [
  { categoryId: 'physical', type: 'meal_plan', label: 'Meal plan', fieldType: 'text', order: 0 },
  { categoryId: 'physical', type: 'vitamins', label: 'Vitamins & Supplements', fieldType: 'checkbox', order: 1 },
  { categoryId: 'physical', type: 'medication', label: 'Medication', fieldType: 'checkbox', order: 2 },
  { categoryId: 'physical', type: 'exercise', label: 'Running', fieldType: 'checkbox', order: 3 },
  { categoryId: 'physical', type: 'exercise', label: 'Walking', fieldType: 'checkbox', order: 4 },
  { categoryId: 'physical', type: 'exercise', label: 'Weights / Gym', fieldType: 'checkbox', order: 5 },
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function seedIfNeeded(): Promise<void> {
  const templateCount = await db.trackerTemplates.count();
  if (templateCount === 0) {
    for (const t of PHYSICAL_TRACKER_TEMPLATES) {
      await db.trackerTemplates.add({ ...t, id: generateId() });
    }
  }

  const settings = await db.userSettings.get('default');
  if (!settings) {
    await db.userSettings.add({
      id: 'default',
      religion: 'christianity',
      isDarkMode: false,
      userEmail: 'your-email@example.com',
    });
  }

  const textTool = await db.textTool.get('default');
  if (!textTool) {
    await db.textTool.add({ id: 'default', content: '', updatedAt: Date.now() });
  }
}

export function generateIdPublic(): string {
  return generateId();
}
