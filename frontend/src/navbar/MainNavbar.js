import React from 'react';
import {Link} from "react-router-dom";

import Button from "react-bootstrap/Button";
import {NavbarUserInfo} from "./Login";
import {ButtonGroup, Dropdown, Form, FormControl, InputGroup, Nav, Navbar} from "react-bootstrap";

function MiniSearch(props) {
    return <InputGroup>
        <FormControl
            placeholder="Items, containers, tags"
            aria-label="Search"
        />

        <InputGroup.Append>
            <Dropdown as={ButtonGroup}>
                <Button variant="info">Search</Button>

                <Dropdown.Toggle split variant="info" id="dropdown-split-basic"/>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Advanced...</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </InputGroup.Append>
    </InputGroup>;
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
