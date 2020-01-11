import React, {useState} from 'react';
import {Form, Modal, Button} from "react-bootstrap";
import {useCookies} from "react-cookie";
import axios from "axios";
import {BrowserRouter as Router} from "react-router-dom";
import DjangoCSRFToken from 'django-react-csrftoken'

export function LoginModal(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const show = props.show;
    const setShow = props.setShow;
    const [token, setToken, removeToken] = useCookies(['login-token']);

    const handleClose = () => {
        setShow(false);
    };
    const handleChangeUsername = ev => {
        setUsername(ev.target.value);
    };
    const handleChangePassword = ev => {
        setPassword(ev.target.value);
    };

    const handleLogin = () => {
        axios.get("/auth/csrf")
            .then(res => {
                return axios({
                    method: 'post',
                    url: "/api/rest-auth/login/",
                    data: {
                        username: username,
                        password: password,
                    },
                    headers: {
                        'X-CSRFToken': res.data.csrfToken
                    },
                    xsrfHeaderName: "X-CSRFToken",
                    csrfCookieName: res.data.csrfToken
                })
            })
            .then(res => {
                setToken(res.data.token);
                setShow(false);
            }).catch(err => {
                console.error(err.response);
            });
    };

    return <Modal show={show} onHide={handleClose}>
        <Form>
            <Modal.Header closeButton>
                <Modal.Title>Create new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DjangoCSRFToken/>
                <Form.Group controlId="name">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" onChange={handleChangeUsername}/>
                </Form.Group>
                <Form.Group controlId="parent">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={handleChangePassword}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleLogin}>
                    Login
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
}

export function NavbarUser(props) {
    const [show, setShow] = useState(false);
    const [token, setToken, removeToken] = useCookies(['login-token']);

    const handleBtnLogin = () => {
        setShow(true);
    };

    return <>
        <Button onClick={handleBtnLogin}>Login</Button>
        <LoginModal show={show} setShow={setShow}/>
    </>

}
