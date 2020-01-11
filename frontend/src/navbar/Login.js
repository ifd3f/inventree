import React, {useState} from 'react';
import {Form, Modal, Button, Dropdown} from "react-bootstrap";
import {useCookies} from "react-cookie";
import axios from "axios";
import {BrowserRouter as Router} from "react-router-dom";
import DjangoCSRFToken from 'django-react-csrftoken'
import DropdownMenu from "react-bootstrap/DropdownMenu";

export function LoginModal(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const show = props.show;
    const setShow = props.setShow;
    const [cookies, setCookie, removeCookie] = useCookies(['loginToken']);

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
                    url: "/auth/rest-auth/auth/",
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
                setCookie('loginToken', res.data.key);
                setShow(false);
            }).catch(err => {
            console.error(err);
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

function NavbarLoggedInUser(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['loginToken']);

    return <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item onClick={() => removeCookie('loginToken')}>Logout</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
}

function UserDropdownOrLogin(props) {
    if (props.token) {
        return <NavbarLoggedInUser/>
    } else {
        return <Button onClick={props.handleClickLogin}>Login</Button>
    }
}

export function NavbarUserInfo(props) {
    const [show, setShow] = useState(false);
    const [cookies] = useCookies(['loginToken']);

    const handleClickLogin = () => {
        setShow(true);
    };

    return <>
        <UserDropdownOrLogin token={cookies.loginToken} handleClickLogin={handleClickLogin} />
        <LoginModal show={show} setShow={setShow}/>
    </>

}
