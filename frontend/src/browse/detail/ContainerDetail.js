import React, {Component} from "react";
import {MaybeNotProvided} from "../../util.js"
import axios from "axios";
import {useParams} from "react-router-dom";
import {FetchedContents} from "./container/Fetcher";
import Button from "react-bootstrap/Button";
import {createItemEditorModal, ItemEditorModal} from "./ItemEditor";


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
        imageSection = <img class="card-img" src={container.image} alt={"Image of " + container.name}/>
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


const SHOW_NO_MODAL = 0;
const SHOW_ITEM_MODAL = 1;
const SHOW_CONTAINER_MODAL = 2;

export class ContainerDetail extends Component {

    state = {
        containersFetched: false,
        containers: [],
        itemsFetched: false,
        items: [],
        shownModal: SHOW_NO_MODAL
    };

    constructor(props) {
        super(props);
        this.showItemEditorModal = this.showItemEditorModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        this.loadContainers();
        this.loadItems();
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

    showItemEditorModal() {
        if (this.state.shownModal === SHOW_NO_MODAL) {
            this.setState({
                shownModal: SHOW_ITEM_MODAL
            });
        }
    }

    hideModal() {
        this.setState({
            shownModal: SHOW_NO_MODAL
        })
    }

    render() {
        let container = this.props.container;
        if (container == null) {
            return <div>
                <h1 className="text-muted">Select a container on the left.</h1>
            </div>
        }

        return <>
            <div>
                <div className="row flex-xl-nowrap">
                    <div className="col-sm col-md-3">
                        <ContainerInfoCard container={container}/>
                    </div>
                    <div className="col-md">
                        <h2>Contents</h2>
                        <div>
                            <Button className="mr-1" variant="success">+ Add Container</Button>
                            <Button variant="success" onClick={this.showItemEditorModal}>+ Add Item</Button>
                        </div>
                        <FetchedContents container={container}/>
                    </div>
                </div>
            </div>
            <ItemEditorModal show={this.state.shownModal === SHOW_ITEM_MODAL} handleClose={this.hideModal} container={container}/>
        </>
    }
}
