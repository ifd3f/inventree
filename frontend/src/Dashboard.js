import React, { Component } from 'react';
import axios from "axios";


function getItemSource(item) {
  /*
                          {% if not item.source and not item.source_url %}
                            <span class="text-muted">N/A</span>
                        {% elif item.source and not item.source_url %}
                            {{ item.source }}
                        {% elif not item.source and item.source_url %}
                            <a href="{{ item.url }}">{{ item.url|truncatechars:50 }}</a>
                        {% else %}
                            <a href="{{ item.url }}">{{ item.source }}</a>
                        {% endif %}
*/
  if (item.source && item.source_url) {
    
  }
}


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
      return <>
        <p className="card-text">Tracking <strong>{this.state.activeData.itemCount}</strong> items in <strong>{this.state.activeData.containerCount}</strong> containers</p>
      </>
    } else {
      return <>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
    }
  }

  render() {
    return (
      <div className="card-columns">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Stats</h5>
            {this.getCardContents()}
          </div>
        </div>
      </div>
    )
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
    axios.get('/api/items', {'needs_restock': true})
      .then(res => {
        console.log(res.data)
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
        <tr key="{item.id}">
          <td>{item.name}</td>
          <td><span className="font-weight-bold text-danger">{item.quantity}</span> (≤{item.alert_quantity})</td>
          <td>{item.source}</td>
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
      return <>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
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
      <div className="card-columns">
        <StatsCard />
        <RestockCard />
      </div>
    </div>
  )
}

export default Dashboard;
