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

export interface GetEventPointsParams {
  /** URL of relay server, with trailing slash included. */
  relayHost: string;
  eventId: number;
  token: string;
}

export interface GetPlayerDataParams {
  /** URL of relay server, with trailing slash included. */
  relayHost: string;
  /** Not entirely sure if this changes the outcome. If in doubt, use 1. */
  world: number;
  playerId: number;
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

export interface SegmentRank {
  avgHeartRate: number;
  avgWatts: number;
  durationInMs: number;
  /** Not sure what this value is. */
  endWorldTime: number;
  eventSubgroupId: number;
  firstName: string;
  jerseyHash: number;
  lap: number;
  lastName: string;
  playerId: number;
  /** Seem to be hardcoded from 10 to 1. */
  points: number;
  rank: number;
  segmentId: number;
}

export interface SegmentPoints {
  /** It seems we only get the first 10 riders, and no more. */
  ranks: SegmentRank[];
  segmentFemaleName: string;
  segmentId: number;
  segmentName: string;
  segmentType: "KOM" | "SPRINT";
}

export interface PointsResponse {
  [key: string]: SegmentPoints[];
}

export interface PlayerState {
  /** Not sure about the unit for this. */
  acceleration: number;
  /** No idea what this is. */
  animState: number;
  /** No idea what this is. */
  asOf: number;
  /** Not sure what the aux values are. */
  aux1: number;
  aux2: number;
  aux3: number;
  aux4: number;
  /**
   * I've seen either 0 or absurdly large numbers here (thousands).
   * Not sure if I need to calculate something to obtain the actual value.
   * It might work in a reasonable range for some riders.
   */
  cadence: number;
  currentEventSubgroupId: number;
  currentSport: "CYCLING" | "RUNNING";
  distanceCovered: number;
  /** Not sure what the unit is or the possible range for this value. */
  draftSavings: number;
  elevationClimbedInMeters: number;
  eventPosition: null | number;
  /** Total what? */
  eventTotal: null | number;
  focusedPlayerId: number;
  /** Not sure what the possible values are. */
  heading: number;
  heartRateInBpm: number;
  /** Don't really know what this is */
  lane: number;
  lap: number;
  /** Not sure what this is. */
  lurking: false;
  playerId: number;
  /** Assuming Watts here. */
  powerOutput: number;
  /** Not sure what the possible values are. */
  powerupUsed: number;
  /** Not sure what this is. I've seen the value 0 so I don't know if it's a timestamp. */
  profileUpdatedAt: number;
  rideDurationInSeconds: number;
  /** This value seems to cap at 256. */
  rideOnsCounter: number;
  /** Is this a property of the route or the rider? What's the unit? */
  routeDistance: number;
  speedInMillimetersPerHour: number;
  /** Assuming event only. */
  timeGap: 0;
  totalDistanceInMeters: number;
  totalMilliwattHours: number;
  x: number;
  y: number;
  yaw: number;
  z: number;
}

export interface PlayerProfile {
  countryAlpha2Code: string;
  jerseyHash: number;
  bikeHash: number;
  frontWheelHash: number;
  rearWheelHash: number;
  maxHr: number;
  ftp: number;
  weightInKg: number;
  heightInCm: number;
  /** Only values I've seen are "Male" and "Female", but normalize casing for safety. */
  gender: string;
  name: string;
}

export interface PlayerDataResponse {
  playerState: PlayerState;
  profile: PlayerProfile;
  rideOnsCounter: number;
}
