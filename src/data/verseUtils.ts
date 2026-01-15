// Verse fetching utilities

interface VerseData {
    text: string;
    reference: string;
}

const getCacheKey = (religion: string) => `verses_${religion}`;
const getCacheTimeKey = (religion: string) => `verses_time_${religion}`;

const isCacheValid = (religion: string): boolean => {
    const timeKey = getCacheTimeKey(religion);
    const cachedTime = localStorage.getItem(timeKey);
    if (!cachedTime) return false;

    const timestamp = parseInt(cachedTime, 10);
    const now = Date.now();
    const oneHourInMs = 60 * 60 * 1000;

    return (now - timestamp) < oneHourInMs;
};

const formatVerses = (apiVerses: Record<string, VerseData[]>): Record<string, string[]> => {
    const formatted: Record<string, string[]> = {};

    Object.keys(apiVerses).forEach(category => {
        formatted[category] = apiVerses[category].map(v => `${v.text}\n— ${v.reference}`);
    });

    return formatted;
};

export async function getAiVerses(religion: string): Promise<Record<string, string[]>> {
    try {
        const cacheKey = getCacheKey(religion);
        const cacheTimeKey = getCacheTimeKey(religion);

        if (isCacheValid(religion)) {
            console.log(`Using cached verses for ${religion}`);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }

        console.log(`Fetching fresh verses for ${religion}`);
        const response = await fetch('/.netlify/functions/get-verse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ religion })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", response.status, data);
            return {};
        }

        const apiVerses = data.verses || {};
        const formattedVerses = formatVerses(apiVerses);

        localStorage.setItem(cacheKey, JSON.stringify(formattedVerses));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        return formattedVerses;
    } catch (error) {
        console.error("AI fetch failed:", error);

        const cacheKey = getCacheKey(religion);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            console.log(`Using expired cache as fallback for ${religion}`);
            return JSON.parse(cached);
        }

        return {};
    }
}
