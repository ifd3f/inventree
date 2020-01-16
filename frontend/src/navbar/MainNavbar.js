import React from 'react';
import {Link, useHistory} from "react-router-dom";
import {NavbarUserInfo} from "./Login";
import {Form, Nav, Navbar} from "react-bootstrap";
import {SearchBar} from "./SearchBar";

function MiniSearch(props) {
    const history = useHistory();
    const onChange = (ev) => {
        //history.push(`/browse/${ev.}`)
        console.log(ev);
    };
    return <SearchBar onChange={onChange}/>
}


function MainNavbar(props) {
    return <>
        <Navbar bg="dark" variant="dark" expand="md">
            <Link to="/">
                <Navbar.Brand>
                    Unrefined Stockpile
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link>
                        <Link to="/">
                            Home
                        </Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/browse">
                            Browse
                        </Link>
                    </Nav.Link>
                </Nav>
                <Form inline className="mr-sm-2">
                    <MiniSearch/>
                </Form>
                <NavbarUserInfo/>
            </Navbar.Collapse>
        </Navbar>
    </>;
}

export default MainNavbar;
