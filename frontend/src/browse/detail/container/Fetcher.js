import React, {Component} from "react";
import axios from "axios";
import {DefaultContents} from "./Default";


const CONTAINER_TYPE_DEFAULT = 0;
const CONTAINER_TYPE_GRID = 1;
const CONTAINER_TYPE_FREEFORM = 2;


function Contents(props) {
    let container = props.container;
    let contents = props.contents;
    switch (container.container_type) {
        case CONTAINER_TYPE_DEFAULT:
            return <DefaultContents contents={contents}/>;
    }
    throw `unsupported container_type ${container.container_type}`;
}


/**
 * Props:
 * - container: the container whose contents you want to render
 */
export class FetchedContents extends Component {
    state = {
        containersFetched: false,
        containers: [],
        itemsFetched: false,
        items: []
    };

    componentDidMount() {
        this.loadContainers()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.containersFetched) {
            this.loadContainers();
        }
        if (!this.state.itemsFetched) {
            this.loadItems();
        }
    }

    loadContainers() {
        axios.get(`/api/containers/${this.props.container.id}/children`)
            .then(res => {
                this.setState({
                    containersFetched: true,
                    containers: res.data
                })
            });
    }

    loadItems() {
        axios.get(`/api/containers/${this.props.container.id}/items`)
            .then(res => {
                this.setState({
                    itemsFetched: true,
                    items: res.data
                })
            });
    }

    render() {
        let container = this.props.container;
        if (this.state.containersFetched && this.state.itemsFetched) {
            return <Contents contents={{items: this.state.items, containers: this.state.containers}} container={container}/>
        } else {
            return <div className="spinner-border text-primary m-5" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        }
    }

}