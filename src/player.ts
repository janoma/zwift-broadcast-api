import { GetPlayerDataParams, PlayerDataResponse } from "./types";

/**
 * Fetch live player data and some static profile data.
 * @param {GetPlayerDataParams}
 * @returns {PlayerDataResponse}
 */
export async function getPlayerData({
  world,
  playerId,
  token,
  relayHost,
}: GetPlayerDataParams): Promise<PlayerDataResponse> {
  const url = new URL(
    `${relayHost}relay/race/worlds/${world.toString()}/players/${playerId.toString()}`,
  );

  const request = new Request(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const response = await fetch(request).then((res: Response) => {
    if (!res.ok) {
      throw new Error("Failed to fetch player data");
    }
    return res.json() as Promise<PlayerDataResponse>;
  });

  return response;
}
