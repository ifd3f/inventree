import {createContext} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";


const cookies = new Cookies();

export const LoginContext = createContext({
    token: cookies.get('loginToken'),
    user: null
});

export function initializeLoginContext(setContext) {
    axios.get('/api/session')
        .then(res => {

        })
        .catch(err => {

        });
}

export function login(setContext, username, token) {
    const [cookies, setCookie] = useCookies(['loginToken']);

    setCookie('loginToken', token);
    setContext({
        token: token
    });
}

export function logout(setContext) {
    const [cookies, setCookie, removeCookie] = useCookies(['loginToken']);
    removeCookie('loginToken');
    setContext({
        token: null
    });
}
