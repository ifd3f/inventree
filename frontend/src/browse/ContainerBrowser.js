import React, {Component, useContext, useState} from "react";
import axios from "axios";
import "./ContainerBrowser.css"
import {ChevronBottomIcon, ChevronRightIcon} from 'react-open-iconic-svg';
import {Link, useRouteMatch} from "react-router-dom";
import {Button, ButtonToolbar, Col, Container, Nav, Navbar, NavItem, Row, Spinner} from "react-bootstrap";
import {ContainerDetail, ContainerDetailLoader} from "./detail/ContainerDetail";


const NODE_COLLAPSED = 0;
const NODE_LOADING = 1;
const NODE_EXPANDED = 2;

const ContainerBrowserContext = React.createContext({
    selected: null,
    toOpen: new Set(),
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
        <Button variant="light" size="sm" onClick={props.onCollapse} disabled={!props.canCollapse}>
            <ChevronBottomIcon/>
        </Button>
        <Link to={props.to}>
            <span onClick={props.onExpand}>{props.container.name}</span>
        </Link>
    </Row>;
}

function Subcontainers(props) {
    const children = props.children;
    const shouldExpand = props.shouldExpand;

    if (children.length === 0) {
        return <span className="text-muted font-italic" style={{marginLeft: '1em'}}>No subcontainers.</span>
    }
    return <Nav className="flex-column" style={{marginLeft: '1em'}}>
        {children.map(child => {
            const expanded = shouldExpand ? shouldExpand.has(child.id) : false;
            return <Node container={child} shouldExpand={expanded ? shouldExpand : null} expanded={expanded}/>
        })}
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
    const shouldExpand = props.shouldExpand;
    const expanded = props.expanded;
    const canCollapse = !!props.canCollapse;

    const context = useContext(ContainerBrowserContext);
    const [expandState, setExpandState] = useState(expanded ? NODE_LOADING : NODE_COLLAPSED);
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

    const handleExpand = () => {
        refresh();
    };

    const handleCollapse = () => {
        setExpandState(NODE_COLLAPSED);
    };

    if (expandState === NODE_LOADING && !requesting) {
        handleExpand();
    }

    let linkTo = container.id ? `/browse/${container.id}` : '/browse';

    switch (expandState) {
        case NODE_COLLAPSED:
            return <NavItem key={container.id}>
                <CollapsedLabel container={container} to={linkTo} onExpand={handleExpand}/>
            </NavItem>;
        case NODE_LOADING:
            return <NavItem key={container.id}>
                <LoadingLabel container={container} to={linkTo}/>
            </NavItem>;
        case NODE_EXPANDED:
            return <NavItem key={container.id}>
                <ExpandedLabel container={container} to={linkTo} onCollapse={handleCollapse} canCollapse={canCollapse}/>
                <Subcontainers children={children} shouldExpand={shouldExpand}/>
            </NavItem>;
    }
}

function HierarchyBrowser(props) {
    const containerID = props.containerID || 0;
    const [shouldExpand, setShouldExpand] = useState(null);

    if (containerID) {
        axios.get(`/api/containers/${containerID}/parents`)
            .then(res => {
                setShouldExpand(new Set(res.data.map(parent => parent.id)));
            });
    }

    return <Node container={null} shouldExpand={shouldExpand} expanded={true} canCollapse={false}/>
}

function ContainerBrowser(props) {
    const match = useRouteMatch('/browse/:containerID');
    const containerID = match ? match.params.containerID : 0;
    return <ContainerBrowserContext.Provider>
        <Container fluid={true}>
            <Row>
                <Col lg={2}>
                    <ButtonToolbar>
                        <Button variant="info" size="sm">+ Add Container</Button>
                        <Button variant="info" size="sm">+ Add Item</Button>
                    </ButtonToolbar>
                    <HierarchyBrowser containerID={containerID}/>
                </Col>
                <Col>
                    <ContainerDetailLoader containerID={containerID}/>
                </Col>
            </Row>
        </Container>
    </ContainerBrowserContext.Provider>
}


export default ContainerBrowser;
