import { db } from './schema';
import type { TrackerTemplateRecord, CardSectionRecord } from './schema';

const PHYSICAL_TRACKER_TEMPLATES: Omit<TrackerTemplateRecord, 'id'>[] = [
  { categoryId: 'physical', type: 'meal_plan', label: 'Meal plan', fieldType: 'text', order: 0 },
  { categoryId: 'physical', type: 'vitamins', label: 'Vitamins & Supplements', fieldType: 'checkbox', order: 1 },
  { categoryId: 'physical', type: 'medication', label: 'Medication', fieldType: 'checkbox', order: 2 },
  { categoryId: 'physical', type: 'exercise', label: 'Running', fieldType: 'checkbox', order: 3 },
  { categoryId: 'physical', type: 'exercise', label: 'Walking', fieldType: 'checkbox', order: 4 },
  { categoryId: 'physical', type: 'exercise', label: 'Weights / Gym', fieldType: 'checkbox', order: 5 },
];

const DEFAULT_SECTION_NAMES: { name: string; kind: CardSectionRecord['kind']; removable: boolean }[] = [
  { name: 'Goals', kind: 'goals', removable: false },
  { name: 'Vitamins', kind: 'custom', removable: true },
  { name: 'Medication', kind: 'custom', removable: true },
  { name: 'Food', kind: 'custom', removable: true },
  { name: 'Doctors', kind: 'custom', removable: true },
  { name: 'Exercise', kind: 'custom', removable: true },
  { name: 'Good habit', kind: 'custom', removable: true },
  { name: 'Bad habit', kind: 'custom', removable: true },
  { name: 'Contacts & Websites', kind: 'contacts_websites', removable: false },
];

const CATEGORY_IDS = ['physical', 'hobby', 'income', 'assets', 'family', 'oneonone', 'politics', 'spiritual'];

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

  const sectionCount = await db.cardSections.count();
  if (sectionCount === 0) {
    for (const catId of CATEGORY_IDS) {
      for (let i = 0; i < DEFAULT_SECTION_NAMES.length; i++) {
        const { name, kind, removable } = DEFAULT_SECTION_NAMES[i];
        await db.cardSections.add({
          id: generateId(),
          categoryId: catId,
          name,
          order: i,
          removable,
          kind,
        });
      }
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
