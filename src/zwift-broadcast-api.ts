import { getAuthServer, getZwiftToken } from "./auth";
import { getEventPlacement, getEventPoints, getEventProgress } from "./event";
import {
  GetEventPlacementParams,
  GetEventPointsParams,
  GetEventProgressParams,
} from "./types";

export class ZwiftBroadcastApi {
  private authHost: string | undefined;

  constructor(
    private token: string,
    private readonly relayHost: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  setAuthHost = (authHost: string) => {
    this.authHost = authHost;
  };

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

  async getEventPoints(
    params: Omit<GetEventPointsParams, "token" | "relayHost">,
  ) {
    return getEventPoints({
      ...params,
      relayHost: this.relayHost,
      token: this.token,
    });
  }

  async renewToken() {
    if (!this.authHost) {
      const { authHost } = await getAuthServer(this.relayHost);
      this.authHost = authHost;
    }

    const tokenResponse = await getZwiftToken({
      authHost: this.authHost,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
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
    });

    const instance = new ZwiftBroadcastApi(
      tokenResponse.access_token,
      relayHost,
      clientId,
      clientSecret,
    );
    instance.setAuthHost(authHost);

    return instance;
  };
}
