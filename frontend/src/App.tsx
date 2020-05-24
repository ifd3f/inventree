import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {Container} from "@material-ui/core";
import {InventreeAPI} from "./util";
import Cookies from "universal-cookie/es6";
import {Authentication} from "./util/api";

const api = new InventreeAPI("http://localhost:8000/api/")

const cookies = new Cookies();

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
  