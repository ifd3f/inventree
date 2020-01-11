import React, { Component } from 'react';
import axios from "axios";
import {MaybeLink} from "../util";


class StatsCard extends Component {
  constructor(props) {
    super(props);
    this.state = { dataLoaded: false };
  }

  setUnloadedState() {
    this.setState({
      dataLoaded: false,
      activeData: {
        itemCount: 0,
        containerCount: 0
      }
    });
  }

  refresh() {
    this.setUnloadedState();
    axios.get('/api/info')
      .then(res => {
        this.setState({
          dataLoaded: true,
          activeData: {
            itemCount: res.data.total_item_count,
            containerCount: res.data.container_count
          }
        })
      });
  }

  componentDidMount() {
    this.refresh();
  }

  getCardContents() {
    if (this.state.dataLoaded) {
      return (
        <p className="card-text">Tracking <strong>{this.state.activeData.itemCount}</strong> items in <strong>{this.state.activeData.containerCount}</strong> containers</p>
      );
    } else {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Stats</h5>
          {this.getCardContents()}
        </div>
      </div>
    );
  }
}

class RestockCard extends Component {
  constructor(props) {
    super(props);
    this.state = { dataLoaded: false };
  }

  setUnloadedState() {
    this.setState({
      dataLoaded: false,
      items: []
    });
  }

  refresh() {
    this.setUnloadedState();
    axios.get('/api/items', {params: {needs_restock: true}})
      .then(res => {
        this.setState({
          dataLoaded: true,
          items: res.data
        })
      });
  }

  componentDidMount() {
    this.refresh();
  }

  getCardContents() {
    if (this.state.dataLoaded) {
      let rows = this.state.items.map(item => 
        <tr key={item.id}>
          <td>{item.name}</td>
          <td><span className="font-weight-bold text-danger">{item.quantity}</span> (≤{item.alert_quantity})</td>
          <td><MaybeLink url={item.source_url}/>{item.source}</td>
        </tr>
      );

      return <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    } else {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="card p-3">
        <div className="card-body">
          <h5 className="card-title">Restock Alert</h5>
          {this.getCardContents()}
        </div>
      </div>
    )
  }
}


function Dashboard(props) {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col">
          <StatsCard />
        </div>
        <div className="col">
          <RestockCard />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
