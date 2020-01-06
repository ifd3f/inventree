import React, {Component} from "react";
import {MaybeNotProvided} from "../util.js"
import axios from "axios";
import {useParams} from "react-router-dom";
import {FetchedContainerContentsTable} from "./ContentsTable";


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
