import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {Button, Container} from "@material-ui/core";
import {InventreeAPI} from "./util";
import Cookies from "universal-cookie/es6";
import {Authentication} from "./util/api";

const api = new InventreeAPI("http://localhost:8000/api/")

const cookies = new Cookies();
const auth = new Authentication(
    cookies,
    "http://localhost:8000/oauth2/authorize",
    "http://localhost:8000/oauth2/token",
    "wdAjMnKhK3w2BeZlRC1BDekbN8rqJEXg9bCb7XRb",
    "puAuEQIKJWnAl46d9rn9toojA6bXfSCLyOwgDOxIrz5ZIQ6G5A9TCFKWfSrPQtsCQE0cth12uiHzpzMIMyQpcsp3QlEpCyoGCEsfjFS8GSgcm7aV0aIG8pJwWXKB9rkO",
)

function App() {
    return <Router>
        <CookiesProvider>
            <Switch>
                <Container maxWidth={"xl"}>
                    <Button onClick={() => auth.authenticate()}>ff</Button>
                </Container>
            </Switch>
        </CookiesProvider>
    </Router>;
}

export default App;
  