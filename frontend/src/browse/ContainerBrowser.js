import React, {Component, useState} from "react";
import axios from "axios";
import "./ContainerBrowser.css"
import {ChevronBottomIcon, ChevronRightIcon} from 'react-open-iconic-svg';
import {Link} from "react-router-dom";
import {Button, ButtonToolbar, Col, Container, Nav, Navbar, NavItem, Spinner} from "react-bootstrap";


const NODE_COLLAPSED = 0;
const NODE_LOADING = 1;
const NODE_EXPANDED = 2;

const ContainerBrowserContext = React.createContext({
    selected: null,
});


/*
class Node extends Component {
    constructor(props) {
        super(props);
        this.container = props.container;
        this.onSelectContainer = props.onSelectContainer;

        this.state = {
            collapse: NODE_COLLAPSED,
            children: []
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.handleNameClick = this.handleNameClick.bind(this);
    }

    handleExpand() {
        if (this.state === NODE_EXPANDED) {
            return;
        }
        this.setState({collapse: NODE_LOADING});
        axios.get("/api/containers", {params: {parent: this.container.id}})
            .then(res => {
                this.setState({
                    collapse: NODE_EXPANDED,
                    children: res.data
                });
            });
    }

    handleCollapse() {
        this.setState({collapse: NODE_COLLAPSED});
    }

    getArrow() {
        switch (this.state.collapse) {
            case NODE_COLLAPSED:
                return <span role="button" onClick={this.handleExpand}><ChevronRightIcon/></span>
            case NODE_LOADING:
                return <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>;
            case NODE_EXPANDED:
                return <span role="button" onClick={this.handleCollapse}><ChevronBottomIcon/></span>
            default:
                break;
        }
    }

    getChildrenView() {
        if (this.state.collapse === NODE_EXPANDED) {
            if (this.state.children.length === 0) {
                return <li className="text-muted" key={this.container.id}><em>No subcontainers.</em></li>
            }
            return this.state.children.map(container =>
                <Node container={container} onSelectContainer={this.onSelectContainer}/>
            )
        }
        return <></>
    }

    handleNameClick() {
        this.handleExpand()
        //this.onSelectContainer(this.container);
    }

    render() {
        return <li key={this.container.id}>
            <div>
                {this.getArrow()}
                <Link to={"/browse/" + this.container.id} onClick={this.handleNameClick}>
                    {this.container.name}
                </Link>
            </div>
            <ul className="container-tree">
                {this.getChildrenView()}
            </ul>
        </li>
    }
}


class ContainerHiearchyBrowser extends Component {
    constructor(props) {
        super(props);
        this.onSelectContainer = props.onSelectContainer;
        this.state = {
            dataActive: false,
            rootContainers: []
        };
    }

    componentDidMount() {
        this.setState({dataActive: false});
        axios.get('/api/containers', {params: {parent: -1}})
            .then(res => {
                this.setState({
                    dataActive: true,
                    rootContainers: res.data
                })
            })
    }

    render() {
        if (this.state.dataActive) {
            return <ul className="container-tree">
                {this.state.rootContainers.map(container => <Node container={container}
                                                                  onSelectContainer={this.onSelectContainer}/>)}
            </ul>
        }
        return <div>
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary m-5" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    }
}

/*
class ContainerBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedContainer: null
    };

    this.onSelectContainer = this.onSelectContainer.bind(this);
  }

  onSelectContainer(container) {
    this.setState({
      selectedContainer: container
    });
  }

  render() {
    return <div className="container-fluid">
      <div className="row flex-xl-nowrap">
        <div className="col-12 col-md-3 col-xl-2 bd-sidebar">
          <ContainerHiearchyBrowser onSelectContainer={this.onSelectContainer} />
        </div>
        <main className="col-12 col-md-9 col-xl-flex bd-content">
          <Route path="/browse/:containerId" component={RoutedContainerDetail}>
          </Route>
        </main>
      </div>
    </div>
  }
}
*/

function LoadingNode(props) {
    return <Spinner/>
}

function CollapsedNode(props) {

}

function ExpandedNode(props) {
    return <Nav className="flex-column">
        <NavItem href="#">Link 1</NavItem>
        <NavItem href="#">Link 2</NavItem>
        <NavItem href="#">Link 3</NavItem>
        <NavItem href="#">Link 4</NavItem>
    </Nav>

}

function NormalNode(props) {
    let container = props.container;
    if (!container) {
        container = {
            name: <span className="font-weight-bold">/</span>,
            id: 0
        }
    }
    const [expandState, setExpandState] = useState(NODE_COLLAPSED);
    return <div></div>;
}

function RootNode(props) {
    const [expandState, setExpandState] = useState(NODE_LOADING);
    const [children, setChildren] = useState([]);
    const [requesting, setRequesting] = useState(false);

    const refresh = () => {
        if (!requesting) {
            setExpandState(NODE_LOADING);
            setRequesting(true);
            axios.get('/api/containers?parent=0')
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

    if (expandState === NODE_LOADING && !requesting) {
        refresh();
    }

    if (NODE_EXPANDED) {
        return <Nav className="flex-column">
            <NavItem><span className="font-weight-bold">/</span></NavItem>
            {
                children.map(child => <NormalNode
                    container={child}
                />)
            }
        </Nav>
    } else {
        return <LoadingNode/>
    }
}

function ContainerHierarchyBrowser(props) {
    return <RootNode/>
}

function ContainerBrowser(props) {
    return <ContainerBrowserContext.Provider>
        <Container fluid={true}>
            <Col>
                <ButtonToolbar>
                    <Button variant="info" size="sm">+ Add Container</Button>
                    <Button variant="info" size="sm">+ Add Item</Button>
                </ButtonToolbar>
                <ContainerHierarchyBrowser/>
            </Col>
            <Col>

            </Col>
        </Container>
    </ContainerBrowserContext.Provider>
}


export default ContainerBrowser;
