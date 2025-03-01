export interface GetAuthServerResponse {
  /** URL of authentication server. */
  authHost: string;
  launcher: string;
  realm: string;
}

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

export interface GetEventProgressParams {
  /** URL of relay server, with trailing slash included. */
  relayHost: string;
  eventId: number;
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
  /** I've seen this as the string "NaN", but I don't know *when* we get that value. */
  avgWattsPerKg: "NaN" | number;
  /** Not sure where this is measured. Presumably the front rider of the subgroup. */
  distanceInMeters: number;
  /** The unit seems to be seconds. */
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
  /** Not sure if this is from gun time or from the time the rider crossed the start line. */
  completionTimeInSeconds: null | number;
  /** This may be nullable for users who haven't set the country, but I'm not sure. */
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
  /** Not really useful without a mapping to the jersey image. */
  jerseyHash: number;
  lastName: string;
  liveTimeGapToLeaderInSeconds: number;
  location: Location;
  /** This is the ZID (number) but it comes in a string. */
  playerId: string;
  position: number;
  powerInWattsPerKg: number;
  powerOutputInWatts: number;
  /** Not sure what the values represent, or how do they change when the PU expires. */
  powerupUsed: number;
  rideOnsCounter: number;
  speedInKmHours: number;
}

export interface EventPlacementResponse {
  /** Might mean something different when called without subgroup ID. */
  eventStartEpoch: number;
  groups: Group[];
  /** Might mean something different when called without subgroup ID. */
  leaderCompleted: boolean;
  placement: RiderPlacement[];
  requestTimeEpoch: number;
  /** Might mean something different when called without subgroup ID. */
  started: boolean;
}

export interface EventProgressResponse {
  /** Numeric ID but it comes as a string. */
  id: string;
  subgroups: Subgroup[];
}

export interface Subgroup {
  /** Not sure what the unit is. Probably meters. */
  distance: {
    current: number;
    remaining: number;
    total: number;
  };
  id: number;
  /** These are likely the only possible values. If not, we should use a string. */
  label: "A" | "B" | "C" | "D" | "E";
  lap: {
    current: number;
    remaining: number;
    total: number;
  };
  /** Assuming UNIX epoch time in milliseconds. */
  startDate: number;
}
