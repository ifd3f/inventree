import Form from "react-bootstrap/Form";
import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
            <input type="file" className="form-control-file" />
        </Form.Group>
        <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" onChange={props.onChange}/>
        </Form.Group>
    </Form>;
}

export class ItemEditorModal extends Component {

    state = {
        name: "",
        description: "",
        quantity: 0,
        alert_quantity: 0,
        image: null
    };

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        this.setState({
            [ev.target.id]: ev.target.value
        });
    }

    handleClose() {
        this.props.handleClose();
    }

    handleSave() {
        axios.post(`/api/items/`, {
            name: this.state.name,
            description: this.state.description,
            quantity: this.state.quantity,
            alert_quantity: this.state.alert_quantity,
            image: this.state.image
        }).then(res => {
            console.log(res);
            this.handleClose();
        })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ItemEditorForm onChange={this.onChange} container={this.props.container}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}