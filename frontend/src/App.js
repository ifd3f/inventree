import React from 'react';
import './App.css';
import Navbar from "./navbar/Navbar.js";
import Dashboard from "./dashboard/Dashboard.js"
import ContainerBrowser from "./browse/ContainerBrowser"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {CookiesProvider} from "react-cookie";


function App() {
    return <Router>
        <CookiesProvider>
            <Navbar/>
            <Switch>
                <Route path="/about"></Route>
                <Route path="/browse">
                    <ContainerBrowser/>
                </Route>
                <Route exact path="/">
                    <Dashboard/>
                </Route>
            </Switch>
        </CookiesProvider>
    </Router>;
}

export default App;
  