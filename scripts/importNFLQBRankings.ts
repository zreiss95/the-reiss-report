import { chromium } from "playwright";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.nfl.com/news/fantasy-football-qb-rankings-for-2026-nfl-season-draft-tiers-and-analysis",
    {
      waitUntil: "domcontentloaded",
    }
  );

  await page.waitForTimeout(8000);

  const text = await page.locator("body").innerText();

  fs.writeFileSync("page.txt", text);

  await browser.close();
}

run();