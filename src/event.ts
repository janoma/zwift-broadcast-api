import {
  EventPlacementResponse,
  EventProgressResponse,
  GetEventPlacementParams,
  GetEventPointsParams,
  GetEventProgressParams,
  PointsResponse,
} from "./types";

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

/**
 * Get the current distance and lap progress for all the subgroups in an event.
 * @param {GetEventProgressParams}
 * @returns {EventProgressResponse}
 */
export async function getEventProgress({
  eventId,
  token,
  relayHost,
}: GetEventProgressParams): Promise<EventProgressResponse> {
  const url = new URL(
    `${relayHost}relay/race/events/${eventId.toString()}/progress`,
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
      throw new Error("Failed to fetch event progress");
    }
    return res.json() as Promise<EventProgressResponse>;
  });

  return response;
}

/**
 * Get the FAL-style points in an event.
 *
 * @param {GetEventPointsParams}
 * @returns {PointsResponse}
 */
export async function getEventPoints({
  eventId,
  token,
  relayHost,
}: GetEventPointsParams): Promise<PointsResponse> {
  const url = new URL(
    `${relayHost}relay/race/events/${eventId.toString()}/points`,
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
      throw new Error("Failed to fetch event points");
    }
    return res.json() as Promise<PointsResponse>;
  });

  return response;
}
