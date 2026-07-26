const Database = require("better-sqlite3");

const db = new Database("picks.db");

const rows = db.prepare(`
SELECT
week,
away,
home,
status,
updatedAt
FROM picks
ORDER BY week
`).all();

console.table(rows);