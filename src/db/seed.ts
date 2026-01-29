import { db } from './schema';
import type { TrackerTemplateRecord, CardSectionRecord } from './schema';

const PHYSICAL_TRACKER_TEMPLATES: Omit<TrackerTemplateRecord, 'id'>[] = [
    { categoryId: 'physical', type: 'meal_plan', label: 'Meal plan', fieldType: 'text', order: 0 },
    { categoryId: 'physical', type: 'vitamins', label: 'Vitamins & Supplements', fieldType: 'checkbox', order: 1 },
    { categoryId: 'physical', type: 'medication', label: 'Medication', fieldType: 'checkbox', order: 2 },
    { categoryId: 'physical', type: 'exercise', label: 'Running', fieldType: 'checkbox', order: 3 },
    { categoryId: 'physical', type: 'exercise', label: 'Walking', fieldType: 'checkbox', order: 4 },
    { categoryId: 'physical', type: 'exercise', label: 'Yoga', fieldType: 'checkbox', order: 5 },
    { categoryId: 'physical', type: 'exercise', label: 'Weights / Gym', fieldType: 'checkbox', order: 6 },
];

const SECTIONS_BY_CATEGORY: Record<string, { name: string; kind: CardSectionRecord['kind']; removable: boolean }[]> = {
    physical: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'To Do List', kind: 'custom', removable: true },
        { name: "Doctor's", kind: 'custom', removable: true },
        { name: 'Food - what to eat', kind: 'custom', removable: true },
        { name: 'Vitamins / Supplements', kind: 'custom', removable: true },
        { name: 'Medications', kind: 'custom', removable: true },
        { name: 'Motion (Walk, Run, Yoga)', kind: 'custom', removable: true },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    hobby: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Projects (Hands help to make)', kind: 'custom', removable: true },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    income: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Contacts', kind: 'custom', removable: true },
        { name: 'Banking', kind: 'custom', removable: true },
        { name: 'Expenses', kind: 'custom', removable: true },
        { name: 'List', kind: 'custom', removable: true },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    assets: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Liabilities', kind: 'custom', removable: true },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    family: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Birthday list (DofB & Age)', kind: 'custom', removable: true },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    oneonone: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Topics of argument & fix', kind: 'custom', removable: true },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    politics: [
        { name: 'Constitution Ai', kind: 'custom', removable: true },
        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Federal Laws', kind: 'custom', removable: true },
        { name: 'State Laws', kind: 'custom', removable: true },
        { name: 'Local Laws', kind: 'custom', removable: true },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
    spiritual: [

        { name: 'Goals', kind: 'goals', removable: false },
        { name: 'Contacts / websites', kind: 'contacts_websites', removable: false },
        { name: 'Gain a good habit', kind: 'custom', removable: true },
        { name: 'Lose a bad habit', kind: 'custom', removable: true },
    ],
};

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
            const sections = SECTIONS_BY_CATEGORY[catId] || [];
            for (let i = 0; i < sections.length; i++) {
                const { name, kind, removable } = sections[i];
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