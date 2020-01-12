import React, {useState} from "react";
import {MaybeNotProvided} from "../../util.js"
import axios from "axios";
import {Contents} from "./container/Contents";
import Button from "react-bootstrap/Button";
import {Spinner} from "react-bootstrap";


function ContainerInfoCard(props) {
    let container = props.container;
    let imageSection = null;
    if (container.image) {
        imageSection = <img className="card-img" src={container.image} alt={"Image of " + container.name}/>
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


export function ContainerDetail(props) {
    const container = props.container;
    const contents = props.contents;
    const [showItemModal, setShowItemModal] = useState(false);

    const handleAddItem = () => {
        setShowItemModal(true);
    };

    return <>
        <div>
            <div className="row flex-xl-nowrap">
                <div className="col-sm col-md-3">
                    <h1>{container.name}</h1>
                </div>
                <div className="col-md">
                    <h2>Contents</h2>
                    <div>
                        <Button className="mr-1" variant="success">+ Add Container</Button>
                        <Button variant="success" onClick={handleAddItem}>+ Add Item</Button>
                    </div>
                    <Contents container={container} contents={contents}/>
                </div>
            </div>
        </div>
    </>

}

export function RootDetail(props) {
    return <></>
}

export function ContainerDetailLoader(props) {
    const containerID = props.containerID;

    const [loadedID, setLoadedID] = useState(-1);
    const [container, setContainer] = useState(null);
    const [contents, setContents] = useState(null);
    const [loading, setLoading] = useState(false);

    const reload = () => {
        setLoading(true);

        const fetchChildren = axios.get('/api/containers/', {
            params: {
                parent: containerID
            }
        });

        const fetchItems = axios.get('/api/items/', {
            params: {
                parent: containerID
            }
        });

        const fetchContainer = containerID ?
            axios.get(`/api/containers/${containerID}`) :
            Promise.resolve(null);

        Promise.all([fetchContainer, fetchChildren, fetchItems])
            .then(([container, children, items]) => {
                console.log(container);
                setLoading(false);
                setContents({
                    containers: children.data,
                    items: items.data
                });
                if (container) {
                    setContainer(container.data);
                } else {
                    setContainer(null);
                }
            });
    };

    if (!loading && loadedID !== containerID) {
        setLoadedID(containerID);
        reload();
    }

    if (loading) {
        return <Spinner animation="grow"/>
    }
    if (container) {
        return <ContainerDetail container={container} contents={contents}/>
    }
    return <RootDetail contents={contents}/>
}
