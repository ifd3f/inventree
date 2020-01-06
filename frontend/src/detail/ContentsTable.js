import {Link} from "react-router-dom";
import React, {Component} from "react";
import axios from "axios";

function ItemRow(props) {
    let item = props.item;
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

function StatelessContainerContentsTable(props) {
    let body;
    if (props.contents) {
        let containers = props.contents.containers.map(container => <ContainerRow container={container}/>);
        let items = props.contents.items.map(item => <ItemRow item={item}/>);
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

export class FetchedContainerContentsTable extends Component {
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
        console.log(this.state);
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
            return <StatelessContainerContentsTable
                contents={{items: this.state.items, containers: this.state.containers}}/>
        } else {
            return <div className="spinner-border text-primary m-5" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        }
    }

}