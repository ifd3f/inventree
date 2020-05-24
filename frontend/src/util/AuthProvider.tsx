import React, {createContext, FunctionComponent, useContext} from "react";
import {ACCESS_TOKEN_COOKIE_KEY, ACCESS_TOKEN_EXPIRY_COOKIE_KEY, Authentication, REFRESH_TOKEN_COOKIE_KEY} from "./api";
import Cookies from "universal-cookie/es6";
import {useCookies} from "react-cookie";

export interface AuthProviderContextData {
    auth: Authentication | null
}

const AuthProviderContext =
    createContext<AuthProviderContextData>({
        auth: null
    });

interface AuthProviderProps {
    cookies: Cookies
    authEndpoint: string
    accessEndpoint: string
    clientId: string
    secret: string
    children: any
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = (
    {
         authEndpoint,
         accessEndpoint,
         clientId,
         secret,
         children
    }) => {
    const [cookies, _setCookie] = useCookies([
        REFRESH_TOKEN_COOKIE_KEY,
        ACCESS_TOKEN_COOKIE_KEY,
        ACCESS_TOKEN_EXPIRY_COOKIE_KEY
    ]);
    const setCookie = (key: string, value: string) => _setCookie(key, value);

    return <AuthProviderContext.Provider
        value={{
            auth: new Authentication(
                setCookie,
                cookies,
                authEndpoint,
                accessEndpoint,
                clientId,
                secret
            )
        }}>
        {children}
        </AuthProviderContext.Provider>
};

export const useAuth = () => useContext(AuthProviderContext)
