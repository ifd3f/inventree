import React from 'react';
import './App.css';
import MainNavbar from "./navbar/MainNavbar.js";
import Dashboard from "./dashboard/Dashboard.js"
import ContainerBrowser from "./browse/ContainerBrowser"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {LoginProvider} from "./auth";


function App() {
    return <Router>
        <CookiesProvider>
            <LoginProvider>
                <MainNavbar/>
                <Switch>
                    <Route path="/about"></Route>
                    <Route path="/browse">
                        <ContainerBrowser/>
                    </Route>
                    <Route exact path="/">
                        <Dashboard/>
                    </Route>
                </Switch>
            </LoginProvider>
        </CookiesProvider>
    </Router>;
}

export default App;
  