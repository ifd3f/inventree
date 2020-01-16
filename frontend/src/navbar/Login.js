import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, NavDropdown, Spinner} from "react-bootstrap";
import {useCookies} from "react-cookie";
import {useLoginContext} from "../auth";


function LoginModalFooter(props) {
    const isLoading = props.isLoading;
    const errorMsg = props.errorMsg;

    return <Modal.Footer>
        {
            isLoading ? <Spinner animation="border"/> : <p className="text-danger">{errorMsg}</p>
        }
        <Button variant="primary" type="submit" disabled={isLoading}>
            Login
        </Button>
    </Modal.Footer>;
}

function LoginModal(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const show = props.show;
    const setShow = props.setShow;

    const {userData, login} = useLoginContext();

    const handleClose = () => {
        setShow(false);
    };
    const handleChangeUsername = ev => {
        setUsername(ev.target.value);
    };
    const handleChangePassword = ev => {
        setPassword(ev.target.value);
    };

    const handleLogin = (ev) => {
        ev.preventDefault();
        setLoading(true);
        login(username, password)
            .then(() => {
                setShow(false);
            })
            .catch(err => {
                setErrorMsg(err.toLocaleString());
            })
            .finally(() => {
                setLoading(false);
            })
    };

    useEffect(() => {
        if (userData) {
            setErrorMsg(null);
        }
    });

    return <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleLogin}>
            <Modal.Header closeButton>
                <Modal.Title>Create new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="name">
                    <Form.Label column={false}>Username</Form.Label>
                    <Form.Control type="text" onChange={handleChangeUsername}/>
                </Form.Group>
                <Form.Group controlId="parent">
                    <Form.Label column={false}>Password</Form.Label>
                    <Form.Control type="password" onChange={handleChangePassword}/>
                </Form.Group>
            </Modal.Body>
            <LoginModalFooter isLoading={isLoading} errorMsg={errorMsg}/>
        </Form>
    </Modal>
}

function NavbarLoggedInUser(props) {
    const {userData, logout} = useLoginContext();

    const handleClickedLogout = () => {
        logout().catch(err => {
            console.error(err)
        })
    };

    if (!userData) {
        return <Spinner animation="border"/>
    }
    return <NavDropdown title={userData.username} id="basic-nav-dropdown">
        <NavDropdown.Item onClick={handleClickedLogout}>
            Logout
        </NavDropdown.Item>
    </NavDropdown>
}

function UserDropdownOrLogin(props) {
    if (props.isLoggedIn) {
        return <NavbarLoggedInUser/>
    } else {
        return <Button onClick={props.handleClickLogin}>Login</Button>
    }
}

export function NavbarUserInfo(props) {
    const [show, setShow] = useState(false);
    const {userData} = useLoginContext();

    const handleClickLogin = () => {
        setShow(true);
    };

    return <>
        <UserDropdownOrLogin isLoggedIn={userData} handleClickLogin={handleClickLogin}/>
        <LoginModal show={show} setShow={setShow}/>
    </>

}
