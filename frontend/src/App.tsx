import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {Container} from "@material-ui/core";
import {InventreeAPI} from "./util";

const api = new InventreeAPI("http://localhost:8000/api/")

function App() {
    return <Router>
        <CookiesProvider>
            <Switch>
                <Container maxWidth={"xl"}>
                    foo
                </Container>
            </Switch>
        </CookiesProvider>
    </Router>;
}

export default App;
  