const Database = require("better-sqlite3");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const db = new Database("picks.db");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


async function migrateTable(table) {

  console.log(`Migrating ${table}...`);

  const rows = db
    .prepare(`SELECT * FROM ${table}`)
    .all();

  console.log(`${rows.length} rows found`);

  if (!rows.length) return;


  const { error } = await supabase
    .from(table)
    .insert(rows);


  if (error) {
    console.error(
      `ERROR ${table}:`,
      error.message
    );
  } else {
    console.log(
      `SUCCESS ${table}`
    );
  }
}


async function run(){

 const tables = [
   "picks",
   "player_rankings",
   "fantasy_adp",
   "team_rankings",
   "survivor",
   "survivor_remaining",
   "loser_survivor",
   "loser_survivor_remaining",
   "players",
   "admin_login_attempts"
 ];

 for (const table of tables){
   await migrateTable(table);
 }

 console.log("Migration complete");
}


run();