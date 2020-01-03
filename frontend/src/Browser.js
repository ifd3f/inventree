import React, { Component } from "react";
import axios from "axios";
import "./Browser.css"


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
        return <span className="caret" onClick={this.handleExpand}/>
      case NODE_LOADING:
        return <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      case NODE_EXPANDED:
        return <span className="caret caret-down" onClick={this.handleCollapse}/>
      default:
        break;
    }
  }

  getChildrenView() {
    if (this.state.collapse === NODE_EXPANDED) {
      return this.state.children.map(container =>
        <Node container={{container}}/>
      )
    }
    return <></>
  }

  render() {
    return <div key="{this.container.id}">
      {this.getArrow()} {this.container.name}
      <div style={{marginLeft: "1em"}}>
        {this.getChildrenView()}
      </div>
    </div>
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
      return <div>
        {this.state.rootContainers.map(container => <Node container={{container}}/>)}
      </div>
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