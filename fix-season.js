const db = require("./lib/db/db.ts").default;

console.log("Before:");

console.log(
  db.prepare(`
    SELECT season, COUNT(*) as count
    FROM team_rankings
    GROUP BY season
  `).all()
);


db.prepare(`
  UPDATE team_rankings
  SET season = 2026
  WHERE season = 2025
`).run();


console.log("After:");

console.log(
  db.prepare(`
    SELECT season, COUNT(*) as count
    FROM team_rankings
    GROUP BY season
  `).all()
);