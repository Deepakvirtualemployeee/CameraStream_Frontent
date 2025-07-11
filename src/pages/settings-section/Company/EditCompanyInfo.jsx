import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const EditCompanyInfo = () => {
    const navigate = useNavigate();
    // Prefilled vehicle data (simulating props or API response)
    const companyData = {
        companyName: 'ABC Trans Inc',
        dotNumber: '0000000',
        timeZone: 'Eastern Standard Time',
        address: '1 Cristina Ln, Oxford PA, 19363',
    };

    const [formData, setFormData] = useState({
        companyName: '',
        dotNumber: '',
        timeZone: '',
        address: '',
    });

    useEffect(() => {
        setFormData({ ...companyData });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Company Data:', formData);
        alert('Company details updated successfully!');
        // Add PUT/PATCH API call here if needed
    };

    return (
        <div className="EditCompanyInfo-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
                    <div className="main-heading">General Settings</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant="primary" type="submit" form="edit-company-form">Save Changes</Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="edit-company-form" onSubmit={handleSubmit}>
                        <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="companyName">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="dotNumber">
                                        <Form.Label>Dot Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="dotNumber"
                                            value={formData.dotNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="timeZone">
                                        <Form.Label>Time Zone</Form.Label>
                                        <Form.Select name="timeZone" value={formData.timeZone} onChange={handleChange} required >
                                            <option value="" hidden>Select Time zone</option>
                                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                                            <option value="IST">IST – India Standard Time</option>
                                            <option value="EST">EST – Eastern Standard Time</option>
                                            <option value="EDT">EDT – Eastern Daylight Time (USA)</option>
                                            <option value="CST">CST – Central Standard Time</option>
                                            <option value="CDT">CDT – Central Daylight Time (USA)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>

                        <section>
                            <div className="main-heading mb-3">ELD Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">

                            </div>
                        </section>
                    </Form>
                </div>
            </div>
        </div>
    );
};
