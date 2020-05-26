import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {MainToolbar} from "./toolbar/MainToolbar";
import {InventoryBrowser} from "./browse/InventoryBrowser";
import {AcceptRefreshToken, AuthProvider, InventreeAPIProvider} from "./util";


function App() {
    return <BrowserRouter>
        <CookiesProvider>
            <AuthProvider
                authEndpoint="http://localhost:8000/o/authorize/"
                accessEndpoint="http://localhost:8000/o/token/"
                clientId="wdAjMnKhK3w2BeZlRC1BDekbN8rqJEXg9bCb7XRb"
                secret="puAuEQIKJWnAl46d9rn9toojA6bXfSCLyOwgDOxIrz5ZIQ6G5A9TCFKWfSrPQtsCQE0cth12uiHzpzMIMyQpcsp3QlEpCyoGCEsfjFS8GSgcm7aV0aIG8pJwWXKB9rkO">
                <InventreeAPIProvider
                    root="http://localhost:8000/api/">
                    <MainToolbar/>
                    <Switch>
                        <Route path="/accept-token" component={AcceptRefreshToken}/>
                        <Route path="/about">ffff</Route>
                        <Route path="/browse">
                            <InventoryBrowser/>
                        </Route>
                        <Route exact path="/">

                        </Route>
                    </Switch>
                </InventreeAPIProvider>
            </AuthProvider>
        </CookiesProvider>
    </BrowserRouter>;
}

export default App;
  