import {
  GetAuthServerResponse,
  GetZwiftTokenParams,
  SignInResponse,
  SignInRequestBody,
} from "./types";

/**
 * Fetch the authentication server URL.
 * @param {string} relayHost - URL of relay server, with trailing slash included.
 * @returns {GetAuthServerResponse}
 */
export async function getAuthServer(
  relayHost: string,
): Promise<GetAuthServerResponse> {
  const url = new URL(`${relayHost}api/auth`);

  const request = new Request(url, {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });

  const response = fetch(request).then((res: Response) => {
    if (!res.ok) {
      throw new Error("Failed to fetch auth server");
    }
    return res.json() as Promise<GetAuthServerResponse>;
  });

  return response;
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
