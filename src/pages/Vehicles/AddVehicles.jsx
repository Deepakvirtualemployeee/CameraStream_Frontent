import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const AddVehicles = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        fuelType: '',
        issuingState: '',
        licenseNumber: '',
        assignEld: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Vehicle added successfully!');
    };

    return (
        <div className="AddVehicles-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
                    <div className="main-heading">Vehicle Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={()=> navigate(-1)}>Cancel</Button>{' '}
                        <Button variant="primary" type="submit" form="add-vehicle-form">
                            <i className="bi bi-plus-lg"></i> Add Vehicle
                        </Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="add-vehicle-form" onSubmit={handleSubmit}>
                        <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="vehicleNumber">
                                        <Form.Label>Vehicle Number</Form.Label>
                                        <Form.Control type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="vehicleMake">
                                        <Form.Label>Make</Form.Label>
                                        <Form.Control type="text" name="make" value={formData.make} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="vehicleModel">
                                        <Form.Label>Model</Form.Label>
                                        <Form.Control type="text" name="model" value={formData.model} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="vehicleYear">
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control type="text" name="year" value={formData.year} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="vehicleVin">
                                        <Form.Label>VIN</Form.Label>
                                        <Form.Control type="text" name="vin" value={formData.vin} onChange={handleChange} required />
                                        <div className="text-muted mt-1">Please make sure your VIN was entered correctly. Once the vehicle record is created its VIN cannot be changed.</div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="fuelType">
                                        <Form.Label>Fuel Type</Form.Label>
                                        <Form.Control type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="issuingState">
                                        <Form.Label>Issuing State</Form.Label>
                                        <Form.Control type="text" name="issuingState" value={formData.issuingState} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="licenseNumber">
                                        <Form.Label>License Number</Form.Label>
                                        <Form.Control type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>
                        <section>
                            <div className="main-heading mb-3">ELD Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group controlId="vehicle">
                                    <Form.Label>Assign ELD</Form.Label>
                                    <Form.Select name="assignEld" value={formData.assignEld} onChange={handleChange} required >
                                        <option value="" hidden>Select ELD Device</option>
                                        <option value="7000">7000</option>
                                        <option value="7001">7001</option>
                                        <option value="7002">7002</option>
                                        <option value="7003">7003</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </section>
                    </Form>
                </div>
            </div>
        </div>
    );
};
