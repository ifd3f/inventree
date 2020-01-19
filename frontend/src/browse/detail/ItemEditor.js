import Form from "react-bootstrap/Form";
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {setupCSRFToken} from "../../auth";
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
        onChange({
            name: name,
            option: options.map(x => x.search)
        });
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


function ItemEditorForm(props) {
    const onChange = props.onChange;
    const defaultContainer = props.defaultContainer;

    const onChangeContainer = (ev) => {
        onChange(ev.name, ev.option ? ev.option.id : null);
    };

    const onChangeForm = (ev) => {
        onChange(ev.target.id, ev.target.value);
    };

    const onChangeTags = (ev) => {
        onChange(ev.name, ev.option);
    };

    return <Form>
        <Row>
            <Col>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={onChangeForm}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label>Parent</Form.Label>
                    <ContainerSearch name="parent" onChange={onChangeContainer} defaultValue={defaultContainer}/>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={onChangeForm} defaultValue={0}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="alert_quantity">
                    <Form.Label>Alert Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={onChangeForm} defaultValue={0}/>
                </Form.Group>
            </Col>
        </Row>
        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <input type="file" className="form-control-file"/>
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" onChange={onChangeForm}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Tags</Form.Label>
            <TagSearch name="tags" onChange={onChangeTags}/>
        </Form.Group>
    </Form>;
}

const INITIAL_FORM_STATE = {
    name: '',
    parent: null,
    quantity: 0
};

export function ItemEditorModal(props) {
    const show = props.show;
    const setShow = props.setShow;
    const container = props.container;

    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (formData.parent === null && container) {
            setFormData(prev => ({
                ...prev,
                parent: container.id
            }));
        }
    });

    const onChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setShow(false);
        setFormData(INITIAL_FORM_STATE);
        if (props.handleClose) {
            props.handleClose();
        }
    };

    const handleSave = () => {
        console.log('save', formData);
        setupCSRFToken()
            .then(() => axios.post(`/api/items/`, formData))
            .then(res => {
                handleClose();
            })
            .catch(err => {
                console.error(err);
                setErrorMsg(err.toLocaleString());
            });
    };

    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Create new item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ItemEditorForm onChange={onChange} defaultContainer={container}/>
        </Modal.Body>
        <Modal.Footer>
            <p className="text-danger">{errorMsg}</p>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>;
}