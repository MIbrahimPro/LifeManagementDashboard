import { getVersesForReligion, setVersesForReligion } from '../db';

interface VerseData {
  text: string;
  reference: string;
}

const getCacheTimeKey = (religion: string) => `verses_time_${religion}`;

const isCacheValid = (religion: string): boolean => {
  const cachedTime = localStorage.getItem(getCacheTimeKey(religion));
  if (!cachedTime) return false;
  const timestamp = parseInt(cachedTime, 10);
  const now = Date.now();
  const oneHourInMs = 60 * 60 * 1000;
  return (now - timestamp) < oneHourInMs;
};

const formatVerses = (apiVerses: Record<string, VerseData[]>): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};
  Object.keys(apiVerses).forEach((category) => {
    formatted[category] = apiVerses[category].map((v) => `${v.text}\n— ${v.reference}`);
  });
  return formatted;
};

export async function getAiVerses(religion: string): Promise<Record<string, string[]>> {
  try {
    const fromDb = await getVersesForReligion(religion);
    const hasDb = Object.keys(fromDb).length > 0;
    if (hasDb && isCacheValid(religion)) {
      return fromDb;
    }

    const response = await fetch('/.netlify/functions/get-verse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ religion }),
    });
    const data = await response.json();

    if (!response.ok) {
      if (hasDb) return fromDb;
      console.error('API Error:', response.status, data);
      return {};
    }

    const apiVerses = data.verses || {};
    const formattedVerses = formatVerses(apiVerses);
    await setVersesForReligion(religion, formattedVerses);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getCacheTimeKey(religion), Date.now().toString());
    }
    return formattedVerses;
  } catch (error) {
    console.error('AI fetch failed:', error);
    const fromDb = await getVersesForReligion(religion);
    if (Object.keys(fromDb).length > 0) return fromDb;
    return {};
  }
}
