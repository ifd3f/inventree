import Axios, {AxiosResponse} from "axios";
import {RetrieveContainer} from "./data";
import Cookies from "universal-cookie/es6";
import {randomString} from "./funcs";


export const REFRESH_TOKEN_COOKIE_KEY = "inventree-oauth-refresh-token";
export const ACCESS_TOKEN_COOKIE_KEY = "inventree-oauth-access-token";
export const ACCESS_TOKEN_EXPIRY_COOKIE_KEY = "inventree-oauth-access-token-expiry";

export class Authentication {

    constructor(
        private setCookie: (key: string, value: string) => void,
        private cookies: any,
        private authEndpoint: string,
        private accessEndpoint: string,
        private id: string,
        private secret: string) {

    }

    public getRefreshToken(): string {
        const refreshToken = this.cookies[REFRESH_TOKEN_COOKIE_KEY];
        if (refreshToken) {
            return refreshToken
        }
        return "";
    }

    public setRefreshToken(token: string) {
        this.setCookie(REFRESH_TOKEN_COOKIE_KEY, token);
    }

    public authenticate() {
        window.location.href = this.authEndpoint
                + "/?state=" + randomString(32)
                + "&client_id=" + this.id
                + "&response_type=code";
    }

    public getAccessToken(): Promise<string> {
        const refresh = this.getRefreshToken();
        if (!refresh) {
            return Promise.reject("No refresh token was found");
        }

        const expiryString = this.cookies[ACCESS_TOKEN_EXPIRY_COOKIE_KEY];
        if (expiryString && new Date().getTime() < parseInt(expiryString)) {
            return Promise.resolve(this.cookies[ACCESS_TOKEN_COOKIE_KEY]);
        }

        return Axios.post(
            this.accessEndpoint,
            {},
            {
                auth: {
                    username: this.id,
                    password: this.secret
                }
            }
        ).then((response) => {
            const token = response.data.access_token;
            const expiresIn = parseInt(response.data.expires_in);
            const expiryTime = new Date().getTime() + expiresIn;
            this.setCookie(ACCESS_TOKEN_COOKIE_KEY, token);
            this.setCookie(ACCESS_TOKEN_EXPIRY_COOKIE_KEY, expiryTime.toString());
            return token;
        })
    }

}

export class InventreeAPI {
    constructor(private auth: Authentication, private root: string) {

    }

    protected path(resource: string): string {
        return this.root + resource
    }

    getRootContainers(): Promise<Array<RetrieveContainer>> {
        return Axios.get(
            this.root + "v1/containers",
            {
                params: {
                    parent: 0
                }
            }
        ).then((res: AxiosResponse<Array<RetrieveContainer>>) => {
            return res.data
        });
    }
}