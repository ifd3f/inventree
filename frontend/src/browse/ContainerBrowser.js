import React, {Component, useState} from "react";
import axios from "axios";
import "./ContainerBrowser.css"
import {ChevronBottomIcon, ChevronRightIcon} from 'react-open-iconic-svg';
import {Link} from "react-router-dom";
import {Button, ButtonToolbar, Col, Container, Nav, Navbar, NavItem, Row, Spinner} from "react-bootstrap";


const NODE_COLLAPSED = 0;
const NODE_LOADING = 1;
const NODE_EXPANDED = 2;

const ContainerBrowserContext = React.createContext({
    selected: null,
});

function CollapsedLabel(props) {
    return <Row>
        <Button variant="light" size="sm" onClick={props.onExpand}><ChevronRightIcon/></Button>
        <Link to={props.to}>
            <span onClick={props.onExpand}>{props.container.name}</span>
        </Link>
    </Row>;
}

function LoadingLabel(props) {
    return <Row>
        <Spinner animation="border"/>
        <Link to={props.to}>
            <span onClick={props.onExpand}>{props.container.name}</span>
        </Link>
    </Row>;
}

function ExpandedLabel(props) {
    return <Row>
        <Button variant="light" size="sm" onClick={props.onCollapse}><ChevronBottomIcon/></Button>
        <Link to={props.to}>
            <span onClick={props.onExpand}>{props.container.name}</span>
        </Link>
    </Row>;
}

function Subcontainers(props) {
    const children = props.children;
    if (children.length === 0) {
        return <span className="text-muted font-italic" style={{marginLeft: '1em'}}>No subcontainers.</span>
    }
    return <Nav className="flex-column" style={{marginLeft: '1em'}}>
        {children.map(child => <Node container={child}/>)}
    </Nav>;
}

function Node(props) {
    let container = props.container;
    if (!container) {
        container = {
            id: 0,
            name: <span className="font-weight-bold">/</span>
        }
    }

    const [expandState, setExpandState] = useState(NODE_COLLAPSED);
    const [children, setChildren] = useState([]);
    const [requesting, setRequesting] = useState(false);

    const refresh = () => {
        setExpandState(NODE_LOADING);
        if (!requesting) {
            setRequesting(true);
            axios
                .get('/api/containers', {
                    params: {
                        parent: container.id
                    }
                })
                .then(res => {
                    setExpandState(NODE_EXPANDED);
                    setChildren(res.data || []);
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    setRequesting(false);
                });
        }
    };

    const handleCollapse = () => {
        setExpandState(NODE_COLLAPSED);
    };

    if (expandState === NODE_LOADING && !requesting) {
        refresh();
    }

    let linkTo = container.id ? `/browse/${container.id}` : '/browse';

    switch (expandState) {
        case NODE_COLLAPSED:
            return <NavItem key={container.id}>
                <CollapsedLabel container={container} to={linkTo} onExpand={refresh}/>
            </NavItem>;
        case NODE_LOADING:
            return <NavItem key={container.id}>
                <LoadingLabel container={container} to={linkTo}/>
            </NavItem>;
        case NODE_EXPANDED:
            return <NavItem key={container.id}>
                <ExpandedLabel container={container} to={linkTo} onCollapse={handleCollapse}/>
                <Subcontainers children={children}/>
            </NavItem>;
    }
}

function HierarchyBrowser(props) {
    return <Node container={null}/>
}

function ContainerBrowser(props) {
    return <ContainerBrowserContext.Provider>
        <Container fluid={true}>
            <Col>
                <ButtonToolbar>
                    <Button variant="info" size="sm">+ Add Container</Button>
                    <Button variant="info" size="sm">+ Add Item</Button>
                </ButtonToolbar>
                <HierarchyBrowser/>
            </Col>
            <Col>

            </Col>
        </Container>
    </ContainerBrowserContext.Provider>
}


export default ContainerBrowser;
