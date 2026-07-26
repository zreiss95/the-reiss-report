"use server";

import { savePick } from "@/lib/db/picks";

export async function savePickAction(data: {
  gameId: string;
  week: number;
  away: string;
  home: string;
  atsPick: string;
  moneylinePick: string;
  confidence: number;
  analysis: string;
}) {
  savePick(data);

  return {
    success: true,
  };
}