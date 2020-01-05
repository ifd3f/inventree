import React, { Component } from "react";
import {MaybeNameURL, MaybeNotProvided} from "./util.js"
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { Container } from "reactstrap";


export function RoutedContainerDetail(props) {
  let {containerId} = useParams();
  return <DynamicallyLoadedContainerDetail id={containerId}/>
}


export class DynamicallyLoadedContainerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      loaded: false,
      container: null
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!prevState || props.id !== prevState.id) {
      return {
        id: props.id,
        loaded: false,
        container: null
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.id && !this.state.loaded) {
      this.fetchData();
    }
  }

  fetchData() {
    if (!this.state.id) {
      this.setState({
        loaded: true, 
        container: null
      });
      return;
    }

    axios.get(`/api/containers/${this.state.id}`)
      .then(res => {
        this.setState({
          loaded: true,
          container: res.data
        })
      })
  }

  render() {
    if (this.state.loaded) {
      return <ContainerDetail container={this.state.container}/>
    } else {
      return null;
    }
  }
}


function ItemRow(props) {
  let item = props.item
  return <tr key={`i-${item.id}`}>
    <td>{`${props.item.name} x ${props.item.quantity}`}</td>
    <td>Item</td>
    <td>{props.item.description}</td>
  </tr>
}

function ContainerRow(props) {
  let container = props.container
  return <tr key={`c-${container.id}`}>
    <td><Link to={`/browse/${container.id}`}>{container.name}</Link></td>
    <td>Container</td>
    <td>{container.description}</td>
  </tr>
}


function ContainerInfoCard(props) {
  let container = props.container;
  let imageSection = null;
  if (container.image) {
    imageSection = <img class="card-img" src={container.image} alt={"Image of " + container.name} />
  }

  return (
    <div className="card w-100">
      <h3 className="card-title">{container.name}</h3>
      {imageSection}
      <div className="card-body">
        <table className="table">
          <tbody>
            <tr>
              <th>Type</th>
              <td>{container.container_type}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td><MaybeNotProvided type="location">{container.location}</MaybeNotProvided></td>
            </tr>
          </tbody>
        </table>
        <p><MaybeNotProvided type="description">{container.description}</MaybeNotProvided></p>
      </div>
    </div>
  );
}


function StatelessContainerContentsTable(props) {
  let body;
  if (props.contents) {
    let containers = props.contents.containers.map(container => <ContainerRow container={container} />);
    let items = props.contents.items.map(item => <ItemRow item={item} />);
    body = <>
      {containers}
      {items}
    </>;
  }
  if (!body) {
    body = <p className="text-muted">This container is empty.</p>;
  }

  return <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {body}
    </tbody>
  </table>
}

class FetchedContainerContentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      containersFetched: false,
      containers: [],
      itemsFetched: false,
      items: []      
    }
  }
  static getDerivedStateFromProps(props, prevState) {
    if (!prevState || props.id !== prevState.id) {
      return {
        id: props.id,
        containersFetched: false,
        containers: [],
        itemsFetched: false,
        items: []
      }
    }
    return null;
  }

  componentDidMount() {
    this.loadContainers();
    this.loadItems();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state)
    if (!this.state.containersFetched) {
      this.loadContainers();
    }
    if (!this.state.itemsFetched) {
      this.loadItems();
    }
  }

  loadContainers() {
    axios.get(`/api/containers/${this.state.id}/children`)
      .then(res => {
        this.setState({
          containersFetched: true,
          containers: res.data
        })
      });
  }

  loadItems() {
    axios.get(`/api/containers/${this.state.id}/items`)
      .then(res => {
        this.setState({
          itemsFetched: true,
          items: res.data
        })
      });
  }

  render() {
    if (this.state.containersFetched && this.state.itemsFetched) {
      return <StatelessContainerContentsTable contents={{items: this.state.items, containers: this.state.containers}} />
    } else {
      return <div className="spinner-border text-primary m-5" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    }
  }

}


export class ContainerDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      container: props.container,
      containersFetched: false,
      containers: [],
      itemsFetched: true,
      items: []
    }
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!prevState || props.container !== prevState.container) {
      return {
        container: props.container,
        containersFetched: false,
        containers: [],
        itemsFetched: false,
        items: []
      }
    }
    return null;
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.containersFetched) {
      this.loadContainers();
    }
    if (!this.state.itemsFetched) {
      this.loadItems();
    }
  }

  loadContainers() {
    axios.get(`/api/containers/${this.state.container.id}/children`)
      .then(res => {
        this.setState({
          containersFetched: true,
          containers: res.data
        })
      });
  }

  loadItems() {
    axios.get(`/api/items/${this.state.container.id}/items`)
      .then(res => {
        this.setState({
          itemsFetched: true,
          items: res.data
        })
      });
  }

  render() {
    let container = this.state.container;
    if (container == null) {
      return <div>
        <h1 className="text-muted">Select a container on the left.</h1>
      </div>
    }

    return (
      <div>
        <div className="row flex-xl-nowrap">

          <div className="col-sm col-md-3">
            <ContainerInfoCard container={this.state.container}/>
          </div>
          <div className="col-md">
            <h2>Contents</h2>
            <FetchedContainerContentsTable id={this.state.container.id}/>
          </div>
        </div>
      </div>
    )
  }
}
