# Faithful Life Dashboard

A daily life dashboard with physical tracking, hobbies, goals, journal, and verses. Data is stored locally in IndexedDB via [Dexie](https://dexie.org/) and is structured so you can later add user management and MongoDB (e.g. Netlify functions) without changing app logic.

## Setup

```bash
npm install
npm run dev
```

If `npm install` fails (e.g. cache/offline), ensure `dexie` is installed so the project builds:

```bash
npm install dexie
```

## Features

- **Physical**: Meal plan, vitamins & supplements, medication, exercise checklist (running, walking, weights/gym). Daily tracker with checkboxes/text.
- **Hobbies**: Add/edit/remove links; open in new tab.
- **Income & Expenses / Assets & Liabilities**: Personal (Profit & Loss / Balance Sheet); structure allows a future “business” upgrade.
- **Daily dashboard**: Resets per day; todos and actions are date-scoped. **End of day** saves a snapshot to the journal, writes all todos (done/not done) to the journal, and removes completed todos from the list.
- **To-do list**: Add items for today; mark done. At end of day, completed items are journaled and removed; incomplete stay on the list.
- **Journal**: Dedicated page at `/journal`. View by date, add “What’s on your mind,” see end-of-day snapshots.
- **Goals**: Short/medium/long term; add/edit/remove for the day.
- **Verses**: Fetched from Netlify function and stored in the local DB (per religion).

## Data layer

- **Local DB**: Dexie (IndexedDB). All persistence goes through `src/db/api.ts`. Same API can later be backed by Netlify functions + MongoDB.
- **Seed**: On first load, default tracker templates (physical checklist), user settings, and text tool are seeded if tables are empty.
- **No localStorage**: Replaced with Dexie; verses, settings, todos, actions, journal, goals, hobby links, category data, and text tool all use the DB.

## Routes

- `/` – Dashboard
- `/journal` – Journal by date, add entry, view snapshots
