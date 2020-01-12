import React, {useEffect, useState} from "react";
import {HoverArea, MaybeNotProvided, Reveal} from "../../util"
import axios from "axios";
import {Contents} from "./container/Contents";
import Button from "react-bootstrap/Button";
import {Col, Image, Row, Spinner} from "react-bootstrap";
import {ItemEditorModal} from "./ItemEditor";
import {PencilIcon} from "react-open-iconic-svg";


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
    const setDirty = props.setDirty ? props.setDirty : () => {
    };
    const [showItemModal, setShowItemModal] = useState(false);

    const handleAddItem = () => {
        setShowItemModal(true);
    };

    const handleCloseModal = () => {
        setDirty(true);
    };

    const [revealEditDescription, setRevealEditDescription] = useState(false);

    return <>
        <div>
            <div className="row flex-xl-nowrap">
                <div className="col-sm col-md-3">
                    <h2>{container.name}</h2>
                    {
                        container.image ? <Image src={container.image} fluid thumbnail/> : null
                    }
                    <HoverArea setHover={setRevealEditDescription}>
                        <Row>
                            <Col>
                                <h4>Description</h4>
                            </Col>
                            <Col md="auto"/>
                            <Col>
                                <Reveal show={revealEditDescription}>
                                    <Button variant="none" size="sm"><PencilIcon/></Button>
                                </Reveal>
                            </Col>
                        </Row>
                        <p>{container.description}</p>
                    </HoverArea>
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
        <ItemEditorModal container={container} show={showItemModal} setShow={setShowItemModal}
                         handleClose={handleCloseModal}/>
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
    const [dirty, setDirty] = useState(true);

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
                setDirty(false);
            });
    };

    useEffect(() => {
        if (loadedID !== containerID) {
            setDirty(true);
        }
    });

    useEffect(() => {
        if (dirty && !loading) {
            setLoadedID(containerID);
            reload();
        }
    });

    if (loading) {
        return <Spinner animation="grow"/>
    }
    if (container) {
        return <ContainerDetail container={container} contents={contents} setDirty={setDirty}/>
    }
    return <RootDetail contents={contents}/>
}
