export interface SignInRequestBody {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface SignInResponse {
  access_token: string;
  expires_in: number;
  "not-before-policy": number;
  /** What's the unit? I assume it's seconds, but prefer to confirm. */
  refresh_expires_in: number;
  scope: string;
  /** Can this be anything other than "Bearer"? */
  token_type: string;
}

export async function getZwiftToken({
  authHost,
  clientId,
  clientSecret,
}: {
  authHost: string;
  clientId: string;
  clientSecret: string;
}) {
  const url = new URL(`${authHost}realms/zwift/protocol/openid-connect/token`);

  const request = new Request(url, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    } satisfies SignInRequestBody),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const response = await fetch(request).then((res: Response) => {
    if (!res.ok) {
      throw new Error("Failed to fetch token");
    }
    return res.json() as Promise<SignInResponse>;
  });

  if (response.token_type !== "Bearer") {
    throw new Error("Invalid token type");
  }

  // TODO: return the expiration time too
  return response.access_token;
}
