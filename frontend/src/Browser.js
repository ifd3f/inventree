import React, { Component } from "react";
import axios from "axios";
import "./Browser.css"
import { ChevronRightIcon, ChevronBottomIcon } from 'react-open-iconic-svg';


const NODE_COLLAPSED = 0
const NODE_LOADING = 1
const NODE_EXPANDED = 2


class Node extends Component {
  constructor(props) {
    super(props);
    this.container = props.container.container;
    console.log(this.container);
    this.state = {
      collapse: NODE_COLLAPSED,
      children: []
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleExpand() {
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
      if (this.state.children.length == 0) {
        return <li className="text-muted"><em>No subcontainers.</em></li>
      }
      return this.state.children.map(container =>
        <Node container={{container}}/>
      )
    }
    return <></>
  }

  render() {
    return <li key="{this.container.id}">
      <div>{this.getArrow()} {this.container.name}</div>
      <ul className="container-tree">
        {this.getChildrenView()}
      </ul>
    </li>
  }
}


class ObjectBrowser extends Component {
  constructor(props) {
    super(props);
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
        {this.state.rootContainers.map(container => <Node container={{container}}/>)}
      </ul>
    } else {
      return <div>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    }
  }
}


class Browser extends Component {
  render() {
    return <div className="container-fluid">
      <ObjectBrowser/>
    </div>
  }
}


export default Browser;