import Form from "react-bootstrap/Form";
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {applyCSRFToken, setupCSRFToken} from "../../auth";
import {ContainerSearch} from "../../util/ContainerSearch";
import {AsyncTypeahead} from "react-bootstrap-typeahead";


function TagSearch(props) {
    const name = props.name;
    const onChange = props.onChange;
    const defaultValue = props.defaultValue;
    const [wasChanged, setWasChanged] = useState(false);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query) => {
        setIsLoading(true);
        axios.get("/api/item-tags/suggest", {
            params: {
                'name__contains': query
            }
        }).then(res => {
            setOptions(res.data.map(x => x.name));
            setIsLoading(false);
        });
    };

    const handleChange = (options) => {
        onChange({name, options});
    };

    const handleInputChange = (query) => {
        setWasChanged(true);
    };

    const selected = (wasChanged || !defaultValue) ? null : defaultValue;

    return <AsyncTypeahead
        id="item-tag-search-bar"
        labelKey="search"
        placeholder="Enter tags here..."
        onSearch={handleSearch}
        options={options}
        isLoading={isLoading}
        onChange={handleChange}
        onInputChange={handleInputChange}
        selected={selected}
        multiple={true}
        allowNew={true}
    />
}

function createFormChangeCallback(key, {getItem, setItem, onChange}) {
    return (ev) => {
        const to = ev.value;
        console.log(getItem(), setItem)
        setItem({...getItem(), [key]: to});
        onChange(key, to);
    }
}


function ItemEditorForm({
    onChange,
    item,
    setItem
    }) {

    const onChangeContainer = (ev) => {
        const to = ev.option ? ev.option.id : null
        setItem({...item, container: to});
        onChange("container", to);
    };
    const getItem= () => item;

    const context = {
        getItem: () => item,
        setItem: setItem,
        onChange
    };

    const onChangeName = createFormChangeCallback("name", context);
    const onChangeSource = createFormChangeCallback("source", context);
    const onChangeSourceURL = createFormChangeCallback("source_url", context);
    const onChangeQuantity = createFormChangeCallback("quantity", context);
    const onChangeDescription = createFormChangeCallback("description", context);
    const onChangeAlertQuantity = createFormChangeCallback("alert_quantity", context);
    const onChangeTags = createFormChangeCallback("tags", context);
    const onChangeImage = createFormChangeCallback("image", context);

    return <Form>
        <Row>
            <Col>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={onChangeName} value={item.name}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label>Parent</Form.Label>
                    <ContainerSearch name="parent" onChange={onChangeContainer} value={item.container}/>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={onChangeQuantity}
                                  value={item.quantity}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="alert_quantity">
                    <Form.Label>Alert Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={onChangeAlertQuantity}
                                  value={item.alert_quantity}/>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group controlId="source">
                    <Form.Label>Source Name</Form.Label>
                    <Form.Control type="text" min="0" onChange={onChangeSource} value={item.source}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="source_url">
                    <Form.Label>Source URL</Form.Label>
                    <Form.Control type="url" min="0" onChange={onChangeSourceURL} value={item.source_url}/>
                </Form.Group>
            </Col>
        </Row>
        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <input type="file" className="form-control-file" onChange={onChangeImage}/>
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" onChange={onChangeDescription} defaultValue={item.description}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Tags</Form.Label>
            <TagSearch name="tags" onChange={onChangeTags}/>
        </Form.Group>
    </Form>;
}

const DEFAULT_ITEM = {
    name: '',
    description: '',
    parent: null,
    quantity: 0,
    alert_quantity: -1,
    source: '',
    source_url: '',
    tags: [],
    image: null
};

export function NewItemEditorModal({
    show,
    setShow: _setShow,
    parentContainer,
    handleClose = null
    }) {

    const [item, setItem] = useState(DEFAULT_ITEM);
    const [existingID, setExistingID] = useState(null);

    const setShow = (ns) => {
        _setShow(ns);
        if (ns) {
            setItem(DEFAULT_ITEM);
            console.log(DEFAULT_ITEM)
        }
    }

    return <ItemEditorModal
        show={show}
        setShow={setShow}
        parentContainer={parentContainer}
        handleClose={handleClose}
        existingID={null}
        setExistingID={setExistingID}
        item={item}
        setItem={setItem}/>

}

export function ItemEditorModal({
    show,
    setShow,
    parentContainer,
    handleClose = null,
    existingID,
    setExistingID,
    item,
    setItem
    }) {

    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (item.parent === null && parentContainer) {
            setItem(prev => ({
                ...prev,
                parent: parentContainer.id
            }));
        }
    });

    const doClose = () => {
        setShow(false);
        if (handleClose) {
            handleClose();
        }
    };

    const handleSave = () => {
        console.log('Sending request to create item', item);
        setupCSRFToken()
            .then(csrf => {
                applyCSRFToken(csrf);
                return axios.put(`/api/items/${existingID}`, item)
            })
            .then(res => {
                doClose();
            })
            .catch(err => {
                console.error(err);
                setErrorMsg(err.toLocaleString());
            });
    };

    const handleCreate = () => {
        console.log('Sending request to save item', item);
        setupCSRFToken()
            .then(csrf => {
                applyCSRFToken(csrf);
                return axios.post(`/api/items/`, item)
            })
            .then(res => {
                doClose();
            })
            .catch(err => {
                console.error(err);
                setErrorMsg(err.toLocaleString());
            });
    };

    return <Modal show={show} onHide={doClose}>
        <Modal.Header closeButton>
            <Modal.Title>Create new item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ItemEditorForm item={{item}} setItem={{setItem}}/>
        </Modal.Body>
        <Modal.Footer>
            <p className="text-danger">{errorMsg}</p>
            <Button variant="secondary" onClick={doClose}>
                Cancel
            </Button>
            {
                existingID ?
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button> :
                    <Button variant="primary" onClick={handleCreate}>
                        Create
                    </Button>
            }
        </Modal.Footer>
    </Modal>;
}