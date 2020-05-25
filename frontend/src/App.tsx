import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {MainToolbar} from "./toolbar/MainToolbar";
import {InventoryBrowser} from "./browse/InventoryBrowser";


function App() {
    return <BrowserRouter>
        <CookiesProvider>
            <MainToolbar/>
            <Switch>
                <Route path="/about">ffff</Route>
                <Route path="/browse">
                    <InventoryBrowser/>
                </Route>
                <Route exact path="/">

                </Route>
            </Switch>
        </CookiesProvider>
    </BrowserRouter>;
}

export default App;
  