export async function getOdds(gameId: string) {
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return data.pickcenter?.[0];
}