import { getAuthServer, getZwiftToken } from "./auth";
import { getEventPlacement } from "./event";
import { GetEventPlacementParams } from "./types";

export class ZwiftBroadcastApi {
  constructor(
    private readonly relayHost: string,
    private readonly token: string,
  ) {}

  async getEventPlacement(params: GetEventPlacementParams) {
    return getEventPlacement({
      ...params,
      relayHost: this.relayHost,
      token: this.token,
    });
  }

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
    return new ZwiftBroadcastApi(relayHost, tokenResponse.access_token);
  };
}
