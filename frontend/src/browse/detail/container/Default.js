import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonToolbar} from "react-bootstrap";
import {PencilIcon, XIcon} from "react-open-iconic-svg";
import {ItemEditorModal} from "../ItemEditor";

function ItemRow({item}) {
    const [showItemModal, setShowItemModal] = useState(false);

    const onEdit = () => {
        console.log(item)
        setShowItemModal(true);
    };

    const onDelete = () => {

    };

    return <tr key={`i-${item.id}`}>
        <td>{`${item.name} x ${item.quantity}`}</td>
        <td>Item</td>
        <td>{item.location}</td>
        <td>{item.description}</td>
        <td>
            <ButtonToolbar>
                <Button size="sm" variant="success" onClick={onEdit}>
                    <PencilIcon style={{fill: 'white'}}/>
                </Button>
                <Button size="sm" variant="danger" onClick={onDelete}>
                    <XIcon style={{fill: 'white'}}/>
                </Button>
            </ButtonToolbar>
        </td>
        <ItemEditorModal
            show={showItemModal}
            setShow={setShowItemModal}
            container={item.container}
            existingID={item.id}
            defaultItem={item}/>
    </tr>
}

function ContainerRow({container}) {
    const [showItemModal, setShowItemModal] = useState(false);

    const onEdit = () => {
        setShowItemModal(true);
    };

    const onDelete = () => {

    };

    return <tr key={`c-${container.id}`}>
        <td><Link to={`/browse/${container.id}`}>{container.name}</Link></td>
        <td>Container</td>
        <td>{container.location}</td>
        <td>{container.description}</td>
        <td>
            <ButtonToolbar>
                <Button size="sm" variant="success" onClick={onEdit}>
                    <PencilIcon style={{fill: 'white'}}/>
                </Button>
                <Button size="sm" variant="danger" onClick={onDelete}>
                    <XIcon style={{fill: 'white'}}/>
                </Button>
            </ButtonToolbar>
        </td>
    </tr>
}

export function DefaultContents(props) {
    let contents = props.contents;
    let body;
    if (contents) {
        let containers = contents.containers.map(container => <ContainerRow key={`c${container.id}`}
                                                                            container={container}/>);
        let items = contents.items.map(item => <ItemRow key={`i${item.id}`} item={item}/>);
        body = [containers, items];
    }
    if (!body) {
        body = <p className="text-muted">This container is empty.</p>;
    }

    return <table className="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {body}
        </tbody>
    </table>
}