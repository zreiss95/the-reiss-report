const Database = require("better-sqlite3");

const db = new Database("picks.db");

const tables = db
  .prepare("SELECT name, sql FROM sqlite_master WHERE type='table'")
  .all();

for (const table of tables) {
  console.log("\n==============================");
  console.log(table.name);
  console.log("==============================");
  console.log(table.sql);
}