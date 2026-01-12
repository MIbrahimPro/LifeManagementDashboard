export type Religion = string;

// Cache for dynamically fetched verses
export const versesCache: Record<string, Record<string, string[]>> = {};

