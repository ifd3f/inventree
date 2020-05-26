import Axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import qs from 'qs';
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

    public authenticate(): never {
        window.location.href = this.authEndpoint
                + "?state=" + window.location.href
                + "&client_id=" + this.id
                + "&response_type=code";
        throw new Error("The browser did not get redirected to auth endpoint!");
    }

    public async getAccessToken(): Promise<string> {
        const refresh = this.getRefreshToken();
        if (!refresh) {
            return Promise.reject("No refresh token was found");
        }

        const expiryString = this.cookies[ACCESS_TOKEN_EXPIRY_COOKIE_KEY];
        if (expiryString && new Date().getTime() < parseInt(expiryString)) {
            return Promise.resolve(this.cookies[ACCESS_TOKEN_COOKIE_KEY]);
        }

        const response = await Axios({
            method: 'post',
            url: this.accessEndpoint,
            data: qs.stringify({
                client_id: this.id,
                client_secret: this.secret,
                redirect_uri: 'http://localhost:3000/accept-token',
                refresh_token: this.getRefreshToken(),
                grant_type: 'client_credentials',
                username: 'astrid',
                password: 'robotics',
                response_type: 'token'
            }),
            auth: {
                username: this.id,
                password: this.secret
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
        const token = response.data.access_token;
        const expiresIn = parseInt(response.data.expires_in);
        const expiryTime = new Date().getTime() + expiresIn;
        this.setCookie(ACCESS_TOKEN_COOKIE_KEY, token);
        this.setCookie(ACCESS_TOKEN_EXPIRY_COOKIE_KEY, expiryTime.toString());
        return token;
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