import React, { Component } from "react";
import axios from "axios";
import "./Browser.css"
import { ChevronRightIcon, ChevronBottomIcon } from 'react-open-iconic-svg';


const NODE_COLLAPSED = 0
const NODE_LOADING = 1
const NODE_EXPANDED = 2


class ContainerViewer extends Component {
  constructor(props) {
    super(props);
    this.container = props.container;
  }

  componentWillReceiveProps(props) {
    this.container = props.container;
  }

  render() {
    if (this.container == null) {
      return <div>
        <h1 className="text-muted">Select a container on the left.</h1>
      </div>
    }
    return <div>
      <h1>{this.container.name}</h1>
    </div>
  }
}


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
    this.setState({ collapse: NODE_LOADING });
    axios.get("/api/containers", { params: { parent: this.container.id } })
      .then(res => {
        this.setState({ 
          collapse: NODE_EXPANDED,
          children: res.data
        });
      });
  }

  handleCollapse() {
    this.setState({ collapse: NODE_COLLAPSED });
  }

  getArrow() {
    switch (this.state.collapse) {
      case NODE_COLLAPSED:
        return <span role="button" onClick={this.handleExpand}><ChevronRightIcon /></span>
      case NODE_LOADING:
        return <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      case NODE_EXPANDED:
        return <span role="button" onClick={this.handleCollapse}><ChevronBottomIcon /></span>
      default:
        break;
    }
  }

  getChildrenView() {
    if (this.state.collapse === NODE_EXPANDED) {
      if (this.state.children.length === 0) {
        return <li className="text-muted"><em>No subcontainers.</em></li>
      }
      return this.state.children.map(container =>
        <Node container={container} onSelectContainer={this.onSelectContainer}/>
      )
    }
    return <></>
  }

  handleNameClick() {
    this.handleExpand()
    this.onSelectContainer(this.container);
  }

  render() {
    return <li key="{this.container.id}">
      <div>{this.getArrow()} <button className="btn btn-sm btn-link" onClick={this.handleNameClick}>{this.container.name}</button></div>
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
        {this.state.rootContainers.map(container => <Node container={container} onSelectContainer={this.onSelectContainer}/>)}
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


class Browser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedContainer: null
    }

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
          <ContainerViewer container={this.state.selectedContainer} />
        </main>
      </div>
    </div>
  }
}


export default Browser;