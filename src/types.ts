namespace Zwift {
  interface AuthServerResponse {
    launcher: string;
    realm: string;
    url: string;
  }

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
}
