import React, {useState} from 'react';
import {Button, Dropdown, Form, Modal, Spinner} from "react-bootstrap";
import {useCookies} from "react-cookie";
import DjangoCSRFToken from 'django-react-csrftoken'
import {useLoginContext} from "../auth";

export function LoginModal(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const show = props.show;
    const setShow = props.setShow;

    const {login} = useLoginContext();

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
        login(username, password)
            .then(() => {
                setShow(false);
            });
    };

    return <Modal show={show} onHide={handleClose}>
        <Form>
            <Modal.Header closeButton>
                <Modal.Title>Create new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
    const {userData, logout} = useLoginContext();

    const handleClickedLogout = () => {
        logout().catch(err => {
            console.log(err)
        })
    };

    if (!userData) {
        return <Spinner animation="border"/>
    }
    return <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            {userData.username}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item onClick={handleClickedLogout}>Logout</Dropdown.Item>
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
        <UserDropdownOrLogin token={cookies.loginToken} handleClickLogin={handleClickLogin}/>
        <LoginModal show={show} setShow={setShow}/>
    </>

}
