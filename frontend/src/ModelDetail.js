import React, { Component } from "react";


export class ContainerDetail extends Component {
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
      <table className="table">
        <tr>
          <th>asdf</th>
        </tr>
      </table>
    </div>
  }
}
