import { chromium } from "playwright";
import * as cheerio from "cheerio";
import fs from "fs";

const URLS: Record<string, string> = {
  QB: "https://www.nfl.com/news/fantasy-football-qb-rankings-for-2026-nfl-season-draft-tiers-and-analysis",

  RB: "",

  WR: "",

  TE: "",
};

export async function importNFLFantasy(position: string) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(URLS[position], {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

await page.waitForSelector("body", {
  timeout: 60000,
});

await page.waitForTimeout(5000);

  const html = await page.content();


fs.writeFileSync("page.html", html);
  await browser.close();

  const $ = cheerio.load(html);

  const rankings: any[] = [];

  $("body *").each((_, el) => {
    const text = $(el).text().trim();

    if (!text.startsWith("Rank")) return;

    const parts = text
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    if (parts.length < 3) return;

    const rank = Number(parts[1]);

    const player = parts[2];

    const team = parts[3] ?? "";

    if (!rank || !player) return;

    rankings.push({
      consensusRank: rank,
      player,
      team,
    });
  });

  return rankings;
}