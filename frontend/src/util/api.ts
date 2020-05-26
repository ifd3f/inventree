import Axios, {AxiosResponse} from "axios";
import qs from 'qs';
import {RetrieveContainer} from "./data";


export const REFRESH_TOKEN_COOKIE_KEY = "inventree-oauth-refresh-token";
export const ACCESS_TOKEN_COOKIE_KEY = "inventree-oauth-access-token";
export const ACCESS_TOKEN_EXPIRY_COOKIE_KEY = "inventree-oauth-access-token-expiry";

interface AccessTokenResponse {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    refresh_token: string
}

export class Authentication {
    private getCookie: OmitThisParameter<(key: string) => string>;
    private setCookie: OmitThisParameter<(key: string, value: string) => void>;

    constructor(
        setCookie: (key: string, value: string) => void,
        getCookie: (key: string) => string,
        private authEndpoint: string,
        private accessEndpoint: string,
        private id: string,
        private secret: string) {

        this.getCookie = getCookie.bind(null);
        this.setCookie = setCookie.bind(null);
    }

    private onAccessTokenReceived(response: AccessTokenResponse) {
        this.setCookie(REFRESH_TOKEN_COOKIE_KEY, response.refresh_token);
        this.setCookie(ACCESS_TOKEN_COOKIE_KEY, response.access_token);
        const expiryTime = Math.max(0, new Date().getTime() + response.expires_in - 10);
        this.setCookie(ACCESS_TOKEN_EXPIRY_COOKIE_KEY, String(expiryTime));
        return response.access_token;
    }

    public getRefreshToken(): string | undefined {
        return this.getCookie(REFRESH_TOKEN_COOKIE_KEY);
    }

    public redirectAuthenticate(): never {
        window.location.href = this.authEndpoint
                + "?state=" + window.location.href
                + "&client_id=" + this.id
                + "&redirect_uri=" + encodeURI("http://localhost:3000/accept-token")
                + "&response_type=code";
        throw new Error("The browser is being redirected");
    }

    public authorize(code: string) {
        return Axios({
            method: 'post',
            url: this.accessEndpoint,
            data: qs.stringify({
                code: code,
                redirect_uri: 'http://localhost:3000/accept-token',
                grant_type: 'authorization_code',
            }),
            auth: {
                username: this.id,
                password: this.secret
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then(response => {
            this.onAccessTokenReceived(response.data);
        })
    }

    private async refreshAccessToken(): Promise<string> {
        const refresh = this.getRefreshToken();
        if (refresh == null) {
            throw new Error("No refresh token was found");
        }
        console.log('refresh with', refresh)
        const response = await Axios({
            method: 'post',
            url: this.accessEndpoint,
            data: qs.stringify({
                client_id: this.id,
                client_secret: this.secret,
                refresh_token: refresh,
                grant_type: 'refresh_token',
                redirect_uri: 'http://localhost:3000/accept-token'
            }),
            auth: {
                username: this.id,
                password: this.secret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return this.onAccessTokenReceived(response.data);
    }

    public async getAccessToken(): Promise<string> {
        const expiryString = this.getCookie(ACCESS_TOKEN_EXPIRY_COOKIE_KEY);
        if (expiryString && new Date().getTime() < parseInt(expiryString)) {
            console.log("token")
            return this.getCookie(ACCESS_TOKEN_COOKIE_KEY);
        }
        console.warn("Access token has expired, getting a new one");
        return this.refreshAccessToken();
    }

}

export class InventreeAPI {
    constructor(private auth: Authentication, private root: string) {

    }

    protected path(resource: string): string {
        return this.root + resource
    }

    private getHeaders(): Promise<any> {
        return this.auth.getAccessToken().then(token => ({
            Authorization: 'Bearer ' + token
        }))
    }

    async getContainer(id: number): Promise<RetrieveContainer> {
        const response: AxiosResponse<RetrieveContainer> = await Axios.get(
            this.root + 'v1/containers/' + id,
            {
                headers: await this.getHeaders()
            }
        )
        return response.data;
    }

    async getRootContainers(): Promise<Array<RetrieveContainer>> {
        const response: AxiosResponse<Array<RetrieveContainer>> = await Axios.get(
            this.root + "v1/containers",
            {
                params: {
                    parent: 0
                },
                headers: this.getHeaders()
            }
        )
        return response.data
    }
}