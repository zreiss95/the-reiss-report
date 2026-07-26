import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "picks.db");

const db = new Database(dbPath);


// =====================
// SQLITE HARDENING
// =====================

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");



// =====================
// MIGRATION TRACKING
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  appliedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`);



// =====================
// MIGRATION HELPER
// =====================

function addColumn(
  table: string,
  column: string
) {
  try {

    db.exec(`
      ALTER TABLE ${table}
      ADD COLUMN ${column};
    `);

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "";

    if (!message.includes("duplicate column")) {
      console.error(
        `Migration error ${table}.${column}:`,
        err
      );
    }

  }
}



// =====================
// PICKS
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS picks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  gameId TEXT UNIQUE,

  week INTEGER,

  away TEXT,
  home TEXT,

  featuredMoneyline INTEGER DEFAULT 0,
  featuredATS INTEGER DEFAULT 0,
  featuredTotal INTEGER DEFAULT 0,

  awayLogo TEXT,
  homeLogo TEXT,

  moneylinePick TEXT,
  atsPick TEXT,
  totalPick TEXT,

  spread REAL,
  totalLine REAL,

  confidence INTEGER,

  analysis TEXT,

  kickoff TEXT,

  status TEXT DEFAULT 'draft',

  atsResult TEXT,
  moneylineResult TEXT,
  totalResult TEXT,

  homeScore INTEGER,
  awayScore INTEGER,

  gradedAt TEXT,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`);


[
  "awayLogo TEXT",
  "homeLogo TEXT",
  "featuredMoneyline INTEGER DEFAULT 0",
  "featuredATS INTEGER DEFAULT 0",
  "featuredTotal INTEGER DEFAULT 0",
  "atsResult TEXT",
  "moneylineResult TEXT",
  "totalResult TEXT",
  "homeScore INTEGER",
  "awayScore INTEGER",
  "totalLine REAL DEFAULT 0",
  "totalPick TEXT",
  "gradedAt TEXT"
].forEach(column =>
  addColumn("picks", column)
);



// =====================
// PLAYER RANKINGS
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS player_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  playerId TEXT,

  player TEXT NOT NULL,
  position TEXT,
  team TEXT,

  consensusRank INTEGER,
  myRank INTEGER,

  analysis TEXT,

  locked INTEGER DEFAULT 0,
  lockedAt TEXT,

  favorite INTEGER DEFAULT 0,

  tier INTEGER DEFAULT 3,

  season INTEGER DEFAULT 2025,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(player, season)
);
`);


[
  "playerId TEXT",
  "locked INTEGER DEFAULT 0",
  "lockedAt TEXT",
  "favorite INTEGER DEFAULT 0",
  "tier INTEGER DEFAULT 3"
].forEach(column =>
  addColumn("player_rankings", column)
);



// =====================
// SURVIVOR
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS survivor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  week INTEGER NOT NULL,
  rank INTEGER NOT NULL,

  gameId TEXT,
  team TEXT,
  opponent TEXT,

  confidence INTEGER,

  analysis TEXT,

  kickoff TEXT,

  status TEXT DEFAULT 'draft',

  result TEXT,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(week, rank)
);
`);


db.exec(`
CREATE TABLE IF NOT EXISTS survivor_remaining (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  week INTEGER NOT NULL,
  rank INTEGER NOT NULL,

  gameId TEXT,
  team TEXT,
  opponent TEXT,

  confidence INTEGER,

  analysis TEXT,

  kickoff TEXT,

  status TEXT DEFAULT 'draft',

  result TEXT,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(week, rank)
);
`);



// =====================
// FANTASY ADP
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS fantasy_adp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  player TEXT NOT NULL,

  position TEXT,
  team TEXT,

  adp REAL,
  adpRank INTEGER,

  myRank INTEGER,

  favorite INTEGER DEFAULT 0,

  tier INTEGER DEFAULT 3,

  analysis TEXT,

  locked INTEGER DEFAULT 0,
  lockedAt TEXT,

  season INTEGER DEFAULT 2025,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(player, season)
);
`);



// =====================
// TEAM RANKINGS
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS team_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  team TEXT NOT NULL,

  consensusRank INTEGER,
  myRank INTEGER,

  tier INTEGER DEFAULT 3,

  analysis TEXT,

  favorite INTEGER DEFAULT 0,

  locked INTEGER DEFAULT 0,
  lockedAt TEXT,

  season INTEGER DEFAULT 2025,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(team, season)
);
`);



// =====================
// LOSER SURVIVOR
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS loser_survivor (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  week INTEGER NOT NULL,
  rank INTEGER NOT NULL,

  gameId TEXT,
  team TEXT,
  opponent TEXT,

  confidence INTEGER,

  analysis TEXT,

  kickoff TEXT,

  status TEXT DEFAULT 'draft',

  result TEXT,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(week, rank)
);
`);


db.exec(`
CREATE TABLE IF NOT EXISTS loser_survivor_remaining (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  week INTEGER NOT NULL,
  rank INTEGER NOT NULL,

  gameId TEXT,
  team TEXT,
  opponent TEXT,

  confidence INTEGER,

  analysis TEXT,

  kickoff TEXT,

  status TEXT DEFAULT 'draft',

  result TEXT,

  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(week, rank)
);
`);



// =====================
// PLAYERS MASTER DATABASE
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  playerId TEXT UNIQUE,

  name TEXT,
  team TEXT,
  position TEXT,

  headshot TEXT,

  active INTEGER DEFAULT 1
);
`);



// =====================
// INDEXES
// =====================

db.exec(`
CREATE INDEX IF NOT EXISTS idx_picks_week
ON picks(week);

CREATE INDEX IF NOT EXISTS idx_player_rankings_season
ON player_rankings(season);

CREATE INDEX IF NOT EXISTS idx_fantasy_adp_season
ON fantasy_adp(season);

CREATE INDEX IF NOT EXISTS idx_team_rankings_season
ON team_rankings(season);

CREATE INDEX IF NOT EXISTS idx_survivor_week
ON survivor(week);

CREATE INDEX IF NOT EXISTS idx_loser_survivor_week
ON loser_survivor(week);

CREATE INDEX IF NOT EXISTS idx_players_team
ON players(team);
`);

// =====================
// ADMIN LOGIN SECURITY
// =====================

db.exec(`
CREATE TABLE IF NOT EXISTS admin_login_attempts (

  ip TEXT PRIMARY KEY,

  attempts INTEGER DEFAULT 0,

  lockedUntil TEXT,

  updatedAt TEXT

);
`);

// =====================
// EXPORT
// =====================

export default db;