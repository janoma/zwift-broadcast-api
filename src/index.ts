/** @module zwift-api */

export interface GetZwiftTokenParams {
  /** URL of uthentication server, with trailing slash included. */
  authHost: string;
  /** Client ID, provided by Zwift. */
  clientId: string;
  /** Client secret, provided by Zwift. DO NOT store in checked-in code! */
  clientSecret: string;
  /** @default client_credentials */
  grantType: string;
}

export interface GetEventPlacementParams {
  /**
   * Minimum position to fetch.
   * @default 1
   */
  from: number;
  /**
   * Maximum position to fetch.
   * @default 40
   */
  to: number;
  /** URL of relay server, with trailing slash included. */
  relayHost: string;
  eventId: number;
  /** If present, fetch placement for this subgroup only. Strongly recommended. */
  subgroupId?: number;
  token: string;
}

export interface SignInRequestBody {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface SignInResponse {
  access_token: string;
  /** Expiration time since the time the response is received, in seconds. */
  expires_in: number;
  "not-before-policy": number;
  refresh_expires_in: number;
  scope: string;
  /** Will be "Bearer" for most cases. */
  token_type: string;
}

export interface Group {
  avgSpeedKmHour: number;
  /** I've seen this as the string "NaN". When do we get that value? */
  avgWattsPerKg: "NaN" | number;
  /** Is this taken from the front rider in the group, or some average? */
  distanceInMeters: number;
  /** What's the unit? Assuming it's seconds at the moment. */
  gapToNextGroup: number;
  number: number;
}

export interface Location {
  x: number;
  y: number;
  z: number;
}

export interface RiderPlacement {
  arrivalAtInSeconds: null | number;
  /** Is this from gun time or from the rider crossing the start line? */
  completionTimeInSeconds: null | number;
  /** Can this be null? What do we get for users who haven't set the country? */
  countryCodeAlpha2Code: string;
  /** I've only seen this as null so far, not sure what it is. */
  crossingStartingLineGap: null;
  /**
   * Distance from where? I can think of 3 options:
   *   1. Starting position in the pens (which could be way behind other riders)
   *   2. The pen banner
   *   3. The start line
   */
  distanceInMeters: number;
  firstName: string;
  groupNumber: number;
  /** For riders without HR monitor, do we get 0 or null? */
  heartRateInBpm: number;
  /** Can we get the list of jerseys so that we can display the image? */
  jerseyHash: number;
  lastName: string;
  liveTimeGapToLeaderInSeconds: number;
  location: Location;
  /** I assume this is ZID but it comes in a string. Any chance it could be a number instead? */
  playerId: string;
  position: number;
  powerInWattsPerKg: number;
  powerOutputInWatts: number;
  /** Where are these values defined? How does it change after the PU expires? */
  powerupUsed: number;
  rideOnsCounter: number;
  speedInKmHours: number;
}

export interface EventPlacementResponse {
  /** What does this mean when it's called without subgroup ID? */
  eventStartEpoch: number;
  groups: Group[];
  /** What does this mean when it's called without subgroup ID? */
  leaderCompleted: boolean;
  placement: RiderPlacement[];
  requestTimeEpoch: number;
  /** What does this mean when it's called without subgroup ID? */
  started: boolean;
}

/**
 * Fetch the token required to access Zwift APIs.
 * @param {GetZwiftTokenParams}
 * @returns {SignInResponse}
 */
export async function getZwiftToken({
  authHost,
  clientId,
  clientSecret,
  grantType = "client_credentials",
}: GetZwiftTokenParams): Promise<SignInResponse> {
  const url = new URL(`${authHost}realms/zwift/protocol/openid-connect/token`);

  const request = new Request(url, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
    } satisfies SignInRequestBody),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const response = fetch(request).then((res: Response) => {
    if (!res.ok) {
      throw new Error("Failed to fetch token");
    }
    return res.json() as Promise<SignInResponse>;
  });

  return response;
}

/**
 * Get the placement of riders in an event.
 * @param {GetEventPlacementParams}
 * @returns {EventPlacementResponse}
 */
export async function getEventPlacement({
  from = 1,
  to = 40,
  eventId,
  subgroupId,
  token,
  relayHost,
}: GetEventPlacementParams): Promise<EventPlacementResponse> {
  const url = new URL(
    `${relayHost}relay/race/events/${eventId.toString()}/placement`,
  );
  url.searchParams.append("from", from.toString());
  url.searchParams.append("to", to.toString());
  if (subgroupId !== undefined) {
    url.searchParams.append("subgroupId", subgroupId.toString());
  }

  const request = new Request(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const response = await fetch(request).then((res: Response) => {
    if (!res.ok) {
      throw new Error("Failed to fetch event placement");
    }
    return res.json() as Promise<EventPlacementResponse>;
  });

  return response;
}
