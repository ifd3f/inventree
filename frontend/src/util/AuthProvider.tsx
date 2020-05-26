import React, {createContext, FunctionComponent, useContext} from "react";
import {ACCESS_TOKEN_COOKIE_KEY, ACCESS_TOKEN_EXPIRY_COOKIE_KEY, Authentication, REFRESH_TOKEN_COOKIE_KEY} from "./api";
import {useCookies} from "react-cookie";
import {Redirect} from "react-router-dom";

export interface AuthProviderContextData {
    auth: Authentication | null
}

const AuthProviderContext =
    createContext<AuthProviderContextData>({
        auth: null
    });

interface AuthProviderProps {
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
    const [cookies, _setCookie, _] = useCookies([
        REFRESH_TOKEN_COOKIE_KEY,
        ACCESS_TOKEN_COOKIE_KEY,
        ACCESS_TOKEN_EXPIRY_COOKIE_KEY,
        'foo'
    ]);

    const getCookie = (key: string) => cookies[key];
    const setCookie = (key: string, value: string) => _setCookie(key, value, {path: '/'});

    return <AuthProviderContext.Provider
        value={{
            auth: new Authentication(
                setCookie,
                getCookie,
                authEndpoint,
                accessEndpoint,
                clientId,
                secret
            )
        }}>
        {children}
        </AuthProviderContext.Provider>
};

export const useAuth = () => useContext(AuthProviderContext).auth!

interface AcceptRefreshTokenProps {
    location: any
}

export const AcceptRefreshToken: FunctionComponent<AcceptRefreshTokenProps> = ({location}) => {
    const auth = useAuth();
    const params = new URLSearchParams(location.search);

    const redirect = params.get("state");
    auth.authorize(params.get("code") as string).then(response => {
        if (redirect != null) {
            window.location.href = redirect;
        }
    })
    return <Redirect to="/"/>;
}
