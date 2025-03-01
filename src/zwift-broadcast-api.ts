import { getAuthServer, getZwiftToken } from "./auth";
import { getEventPlacement, getEventProgress } from "./event";
import { GetEventPlacementParams, GetEventProgressParams } from "./types";

export class ZwiftBroadcastApi {
  constructor(
    private token: string,
    private readonly relayHost: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async getEventPlacement(
    params: Omit<GetEventPlacementParams, "token" | "relayHost">,
  ) {
    return getEventPlacement({
      ...params,
      relayHost: this.relayHost,
      token: this.token,
    });
  }

  async getEventProgress(
    params: Omit<GetEventProgressParams, "token" | "relayHost">,
  ) {
    return getEventProgress({
      ...params,
      relayHost: this.relayHost,
      token: this.token,
    });
  }

  async renewToken() {
    const { authHost } = await getAuthServer(this.relayHost);

    const tokenResponse = await getZwiftToken({
      authHost,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      grantType: "client_credentials",
    });

    this.token = tokenResponse.access_token;
  }

  /** Fetch the token and instantiate the class. */
  static init = async ({
    relayHost,
    clientId,
    clientSecret,
  }: {
    relayHost: string;
    clientId: string;
    clientSecret: string;
  }) => {
    const { authHost } = await getAuthServer(relayHost);

    const tokenResponse = await getZwiftToken({
      authHost,
      clientId,
      clientSecret,
      grantType: "client_credentials",
    });

    return new ZwiftBroadcastApi(
      tokenResponse.access_token,
      relayHost,
      clientId,
      clientSecret,
    );
  };
}
