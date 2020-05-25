import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {Container} from "@material-ui/core";


function App() {
    return <Router>
        <CookiesProvider>
            <Switch>
                <Container maxWidth={"xl"}>
                </Container>
            </Switch>
        </CookiesProvider>
    </Router>;
}

export default App;
  