import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const CreateCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        timeZone: '',
        usdotNumber: '',
        companyAddress: '',
    });

    const {
        companyName,
        timeZone,
        usdotNumber,
        companyAddress,
    } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!companyName || !timeZone || !usdotNumber || !companyAddress) {
            alert('Please fill in all required fields.');
            return;
        }

        console.log('Submitted Company Data:', formData);
        alert('Company added successfully!');
    };

    const handleCancel = () => {
        if (window.confirm('Clear all form data?')) {
            setFormData({
                companyName: '',
                timeZone: '',
                usdotNumber: '',
                companyAddress: '',
            });
        }
    };

    return (
        <div className="CreateCompany-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Create Company</div>
                </div>

                <div className="form-wrapper bg-white w-100 border rounded-4 px-3 px-md-4 py-4">
                    <Form id="add-company-form" onSubmit={handleSubmit}>
                        <Row className="g-3 g-xl-4 mb-4">
                            <Col sm={6}>
                                <Form.Group controlId="CompanyName">
                                    <Form.Label>
                                        Company Name<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyName"
                                        value={companyName}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                        autoComplete="off"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group controlId="TimeZoneSelect">
                                    <Form.Label>
                                        Time Zone<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="timeZone"
                                        value={timeZone}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select the Time zone</option>
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

                            <Col sm={12}>
                                <Form.Group controlId="USDOTNumber">
                                    <Form.Label>USDOT Number<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="usdotNumber"
                                        value={usdotNumber}
                                        onChange={handleChange}
                                        placeholder="Enter USDOT Number"
                                        autoComplete="off"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="CompanyAddress">
                                    <Form.Label>
                                        Company Address<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyAddress"
                                        value={companyAddress}
                                        onChange={handleChange}
                                        placeholder="Enter company address"
                                        autoComplete="off"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="btn-wrapper d-flex flex-wrap justify-content-end gap-2">
                            <Button variant='white' className="bg-white border-gray" onClick={handleCancel}>Cancel</Button>
                            <Button variant='primary' type="submit" form="add-company-form">Confirm</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
