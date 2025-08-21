import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CancelIcon from '../../../assets/images/icons/cancel.svg';

export const EditCompanyInfo = () => {
    const navigate = useNavigate();

    // Pre-filled company data simulating API response
    const companyData = {
        companyName: 'ABC Trans Inc',
        dotNumber: '0000000',
        timeZone: 'Eastern Standard Time',
        address: '1 Cristina Ln, Oxford PA, 19363',
        complianceMode: 'ELD',
        hosRules: 'USA 70 Hour / 8 Day',
        cargoType: 'Property',
        restart: '34 Hour Restart',
        restBreak: '30 Min Break',
        shortHaulException: false,
        splitSleeperBerth: false,
        personalConveyance: false,
        yardMove: false,
        manualDriver: false,
        restrictDriverFromCreation: true,
    };

    const [formData, setFormData] = useState({
        companyName: '',
        dotNumber: '',
        timeZone: '',
        address: '',
        complianceMode: '',
        hosRules: '',
        cargoType: '',
        restart: '',
        restBreak: '',
        shortHaulException: false,
        splitSleeperBerth: false,
        personalConveyance: false,
        yardMove: false,
        manualDriver: false,
        restrictDriverFromCreation: false,
    });

    useEffect(() => {
        setFormData({ ...companyData });
    }, []);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Company Data:', formData);
        alert('Company details updated successfully!');
        // API call can go here
    };

    return (
        <div className="EditCompanyInfo-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div className="main-heading">General Settings</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant="primary" type="submit" form="edit-company-form">Save Changes</Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="edit-company-form" onSubmit={handleSubmit}>
                        {/* General Settings */}
                        <section className="general-settings-section bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
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
                                        <Form.Select
                                            name="timeZone"
                                            value={formData.timeZone}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" hidden>Select Time zone</option>
                                            <option value="Coordinated Universal Time">UTC</option>
                                            <option value="Greenwich Mean Time">GMT</option>
                                            <option value="India Standard Time">IST</option>
                                            <option value="Eastern Standard Time">EST</option>
                                            <option value="Eastern Daylight Time">EDT (USA)</option>
                                            <option value="Central Standard Time">CST</option>
                                            <option value="Central Daylight Time">CDT (USA)</option>
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

                        {/* Terminal */}
                        <section className="terminal-section mb-4">
                            <div className="main-heading mb-3">Terminal</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group className="mb-3" controlId="terminalTimeZone">
                                    <Form.Label>Time Zone</Form.Label>
                                    <Form.Select
                                        name="timeZone"
                                        value={formData.timeZone}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Time zone</option>
                                        <option value="Coordinated Universal Time">UTC</option>
                                        <option value="Greenwich Mean Time">GMT</option>
                                        <option value="India Standard Time">IST</option>
                                        <option value="Eastern Standard Time">EST</option>
                                        <option value="Eastern Daylight Time">EDT (USA)</option>
                                        <option value="Central Standard Time">CST</option>
                                        <option value="Central Daylight Time">CDT (USA)</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="terminalAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder='Enter address'
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </section>

                        {/* Compliance */}
                        <section className="compliance-settings-section mb-4">
                            <div className="main-heading mb-3">Compliance Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group controlId="ComplianceMode">
                                    <Form.Label>Compliance Mode</Form.Label>
                                    <Form.Select
                                        name="complianceMode"
                                        value={formData.complianceMode}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select compliance mode</option>
                                        <option value="ELD">ELD</option>
                                        <option value="ELD1">ELD1</option>
                                        <option value="ELD2">ELD2</option>
                                        <option value="ELD3">ELD3</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </section>

                        {/* Log Settings */}
                        <section className="log-settings-section mb-4">
                            <div className="main-heading mb-3">Default Driver Log Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group className="mb-3" controlId="HOSRules">
                                    <Form.Label>HOS Rules<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hosRules"
                                        value={formData.hosRules}
                                        onChange={handleChange}
                                        placeholder="Enter HOS rules"
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="CargoType">
                                    <Form.Label>Cargo Type<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cargoType"
                                        value={formData.cargoType}
                                        onChange={handleChange}
                                        placeholder="Enter cargo type"
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="Restart">
                                    <Form.Label>Restart<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restart"
                                        value={formData.restart}
                                        onChange={handleChange}
                                        placeholder="Enter restart"
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="RestBreak">
                                    <Form.Label>Rest Break<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restBreak"
                                        value={formData.restBreak}
                                        onChange={handleChange}
                                        placeholder="Enter rest break"
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <div className="checks-wrapper">
                                        <Form.Check type="checkbox" name="shortHaulException" checked={formData.shortHaulException} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Short-Haul Exception</div>}
                                            required
                                        />
                                        <Form.Check type="checkbox" name="splitSleeperBerth" checked={formData.splitSleeperBerth} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Split-Sleeper Berth</div>}
                                        />
                                        <Form.Check type="checkbox" name="personalConveyance" checked={formData.personalConveyance} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Personal Conveyance</div>}
                                        />
                                        <Form.Check type="checkbox" name="yardMove" checked={formData.yardMove} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Yard Move</div>}
                                        />
                                        <Form.Check type="checkbox" name="manualDriver" checked={formData.manualDriver} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Manual Driver</div>}
                                        />
                                        <Form.Check type="checkbox" name="restrictDriverFromCreation" checked={formData.restrictDriverFromCreation} onChange={handleChange}
                                            className="fs-16" label={<div className="fs-6 text-dark text-opacity-75">Restrict Driver from Creation Date & Time</div>}
                                        />
                                    </div>
                                </Form.Group>
                            </div>
                        </section>
                    </Form>
                </div>
            </div>
        </div>
    );
};
