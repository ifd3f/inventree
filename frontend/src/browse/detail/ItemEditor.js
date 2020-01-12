import Form from "react-bootstrap/Form";
import React, {Component, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {setupCSRFToken, useLoginContext} from "../../auth";

function ItemEditorForm(props) {
    return <Form>
        <Row>
            <Col>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" onChange={props.onChange}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="parent">
                    <Form.Label>Parent</Form.Label>
                    <Form.Control disabled defaultValue={props.container.name}/>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={props.onChange} defaultValue={0}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="alert_quantity">
                    <Form.Label>Alert Quantity</Form.Label>
                    <Form.Control type="number" min="0" onChange={props.onChange} defaultValue={0}/>
                </Form.Group>
            </Col>
        </Row>
        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <input type="file" className="form-control-file"/>
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" onChange={props.onChange}/>
        </Form.Group>
    </Form>;
}

export function ItemEditorModal(props) {
    const show = props.show;
    const setShow = props.setShow;
    const container = props.container;
    const {token} = useLoginContext();

    const [formData, setFormData] = useState({
        name: '',
        parent: container.id,
        quantity: 0
    });

    const onChange = (ev) => {
        const target = ev.target;
        setFormData(prev => ({
            ...prev,
            [target.id]: target.value
        }));
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleSave = () => {
        setupCSRFToken()
            .then(() =>
                axios.post(`/api/items/`, formData)
            )
            .then(res => {
                handleClose();
            })
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ItemEditorForm onChange={onChange} container={container}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}