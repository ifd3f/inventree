import React, {useEffect, useState} from "react";
import axios from "axios";
import "./ContainerBrowser.css"
import {ChevronBottomIcon, ChevronRightIcon} from 'react-open-iconic-svg';
import {Link} from "react-router-dom";
import {Button, ButtonToolbar, Col, Container, Nav, NavItem, Row, Spinner} from "react-bootstrap";
import {ContainerDetailLoader} from "./detail/ContainerDetail";
import {useSelectedContainerID} from "./detail/util";
import {ItemEditorModal, NewItemEditorModal} from "./detail/ItemEditor";


const NODE_COLLAPSED = 0;
const NODE_LOADING = 1;
const NODE_EXPANDED = 2;


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
    const toExpand = props.toExpand;

    if (children.length === 0) {
        return <span className="text-muted font-italic" style={{marginLeft: '1em'}}>No subcontainers.</span>
    }
    return <Nav className="flex-column" style={{marginLeft: '1em'}}>
        {children.map(child => {
            return <Node key={child.id} container={child} toExpand={toExpand}/>
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
    const toExpand = props.toExpand;
    const canCollapse = props.canCollapse !== undefined ? props.canCollapse : true;

    let initialExpandState = NODE_COLLAPSED;
    if (container.id === 0 || (toExpand && toExpand.has(container.id))) {
        initialExpandState = NODE_LOADING;
    }

    const [expandState, setExpandState] = useState(initialExpandState);
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

    useEffect(() => {
        if (expandState === NODE_LOADING && !requesting) {
            handleExpand();
        }
    });

    let linkTo = container.id ? `/browse/${container.id}` : '/browse';

    switch (expandState) {
        case NODE_COLLAPSED:
            return <NavItem>
                <CollapsedLabel container={container} to={linkTo} onExpand={handleExpand}/>
            </NavItem>;
        case NODE_LOADING:
            return <NavItem>
                <LoadingLabel container={container} to={linkTo}/>
            </NavItem>;
        case NODE_EXPANDED:
            return <NavItem>
                <ExpandedLabel container={container} to={linkTo} onCollapse={handleCollapse} canCollapse={canCollapse}/>
                <Subcontainers children={children} toExpand={toExpand}/>
            </NavItem>;
    }
}

function RootNode(props) {
    return <Node container={null} expanded={true} canCollapse={false} {...props}/>
}

function HierarchyBrowser(props) {
    const selectedContainerID = props.selectedContainerID || 0;
    const [toExpand, setToExpand] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (!loaded && !fetching) {
            if (selectedContainerID !== 0) {
                setFetching(true);
                axios.get(`/api/containers/${selectedContainerID}/parents`)
                    .then(res => {
                        setToExpand(new Set(res.data.map(parent => parent.id)));
                        setLoaded(true);
                        setFetching(false);
                    });
            } else {
                setLoaded(true);
                setFetching(false);
            }
        }
    });

    if (loaded) {
        return <RootNode toExpand={toExpand}/>;
    }
    return <Spinner animation="border"/>;
}

function ContainerBrowser(props) {
    const selectedContainerID = useSelectedContainerID();

    const [showItemModal, setShowItemModal] = useState(false);

    return <Container fluid={true}>
        <Row>
            <Col md={4} lg={3}>
                <ButtonToolbar>
                    <Button variant="info" size="sm">+ Add Container</Button>
                    <Button variant="info" size="sm" onClick={() => setShowItemModal(true)}>+ Add Item</Button>
                </ButtonToolbar>
                <HierarchyBrowser selectedContainerID={selectedContainerID}/>
            </Col>
            <Col>
                <ContainerDetailLoader containerID={selectedContainerID}/>
            </Col>
        </Row>
        <NewItemEditorModal show={showItemModal} setShow={setShowItemModal}/>
    </Container>
}


export default ContainerBrowser;
