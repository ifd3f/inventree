import React, { Component } from "react";
import {MaybeNameURL, MaybeNotProvided} from "./snippets.js";
import axios from "axios";

function ContainerContentsRow(props) {
  let key = `item-row-${props.item.id}`;
  return <tr key={key}>
    <td key={key}>{props.item.name}</td>
  </tr>
}


export class ContainerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: props.container,
      items: null
    }
  }

  componentWillReceiveProps(props) {
    this.setState({container: props.container})
  }

  loadContents() {
    axios.get('/api/items')
      .then(res => {
        this.setState({
          items: res.data
        })
      })
  }

  render() {
    let container = this.state.container;
    if (container == null) {
      return <div>
        <h1 className="text-muted">Select a container on the left.</h1>
      </div>
    }

    let imageSection = <></>;
    if (container.image) {
      imageSection = <img class="card-img" src={container.image} alt={"Image of " + container.name} />
    }

    return <div>
      <div className="card float-right" style={{ width: "18rem" }}>
        {imageSection}
        <div className="card-body">
          <table className="table">
            <tr>
              <th>Type</th>
              <td>{container.container_type}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td><MaybeNotProvided value={container.location} type="location" /></td>
            </tr>
          </table>
        </div>
      </div>

      <h1>{container.name}</h1>

      <p><MaybeNotProvided value={container.description} type="description" /></p>

      <h2>Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Tags</th>
          </tr>
        </thead>
      </table>
      
    </div>
  }
}
