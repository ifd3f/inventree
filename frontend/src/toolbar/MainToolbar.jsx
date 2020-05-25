import React, {useState} from "react";
import {Link} from "react-router-dom";
import {
    Navbar,
    Collapse,
    Nav,
    NavItem,
    UncontrolledDropdown,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    NavbarBrand,
    NavbarToggler,
    DropdownItem, NavbarText, NavLink, Button
} from "reactstrap";
import {useAuth} from "../util";



export const MainToolbar = () => {
      const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const auth = useAuth()

    auth.getAccessToken().then(console.log)

    return <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/">Inventree</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/browse/">Browse</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/projects/">Projects</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>
              <Button onClick={() => auth.authenticate()}>authen</Button>
              </NavbarText>
        </Collapse>
      </Navbar>
}