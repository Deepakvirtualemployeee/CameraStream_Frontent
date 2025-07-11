import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const EditELDDevice = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        serialNumber: 'SN-987654321',
        mac: ['AC', '12', 'EF', '45', '78', '9B'],
        vehicle: '7002',
        firmwareVersion: 'v2.2.5',
    });

    const firmwareOptions = ['v1.0.0', 'v1.0.1', 'v2.2.5', 'v3.0.0'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMacChange = (e, index) => {
        const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '');
        if (value.length <= 2) {
            const newMac = [...formData.mac];
            newMac[index] = value;
            setFormData(prev => ({ ...prev, mac: newMac }));
        }
    };

    const handleMacFocus = (e, index) => {
        if (e.target.value.length === 2 && index < 5) {
            const nextInput = document.getElementById(`mac-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleMacKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            const prevInput = document.getElementById(`mac-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                setFormData(prev => {
                    const newMac = [...prev.mac];
                    newMac[index - 1] = '';
                    return { ...prev, mac: newMac };
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const macAddress = formData.mac.join(':');
        const finalData = {
            serialNumber: formData.serialNumber,
            macAddress,
            vehicle: formData.vehicle,
            firmwareVersion: formData.firmwareVersion,
        };
        console.log('Updated ELD Device Data:', finalData);
        alert("ELD Device updated successfully!");
    };

    return (
        <div className="AddELDDevice-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Edit ELD Device Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant='outline-danger'>Delete</Button>
                        <Button variant='outline-danger'>Deactivate</Button>
                        <Button variant='primary' type="submit" form="edit-device-form">Save Changes</Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="edit-device-form" onSubmit={handleSubmit}>
                        <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="serialNumber">
                                        <Form.Label>ELD SN (Serial Number)<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="serialNumber"
                                            value={formData.serialNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Serial Number"
                                            autoComplete="off"
                                            required
                                        />
                                        <div className="text-muted mt-1">
                                            Please make sure ELD SN was entered correctly. Once the eld record is created it cannot be changed.
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="macAddress">
                                        <Form.Label>ELD MAC Address<span className="text-danger">*</span></Form.Label>
                                        <div className="d-flex align-items-center form-control">
                                            {formData.mac.map((value, i) => (
                                                <React.Fragment key={i}>
                                                    <input
                                                        id={`mac-${i}`}
                                                        type="text"
                                                        maxLength={2}
                                                        className="form-control text-center border-0 shadow-none out p-0"
                                                        placeholder="__"
                                                        style={{ width: '20px', minHeight: 'auto' }}
                                                        value={value}
                                                        onChange={(e) => handleMacChange(e, i)}
                                                        onKeyUp={(e) => handleMacFocus(e, i)}
                                                        onKeyDown={(e) => handleMacKeyDown(e, i)}
                                                        onFocus={(e) => e.target.select()}
                                                        required
                                                    />
                                                    {i < formData.mac.length - 1 && (
                                                        <span className="fw-bold">:</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        <div className="text-muted mt-1">
                                            Please make sure ELD MAC Address was entered correctly. Once the eld record is created it cannot be changed.
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="vehicle">
                                        <Form.Label>Assign Vehicle<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="vehicle"
                                            value={formData.vehicle}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" hidden>Select Vehicle</option>
                                            <option value="7000">7000</option>
                                            <option value="7001">7001</option>
                                            <option value="7002">7002</option>
                                            <option value="7003">7003</option>
                                        </Form.Select>
                                        <div className="text-muted mt-1">Mobile app will automaticly connect to eld device during login process.</div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>

                        <section>
                            <div className="main-heading mb-3">ELD Device Firmware Update</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group controlId="vehicle">
                                    <Form.Label>Select Firmware Version<span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="firmwareVersion"
                                        value={formData.firmwareVersion}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>Select Firmware</option>
                                        {firmwareOptions.map((version, idx) => (
                                            <option key={idx} value={version}>{version}</option>
                                        ))}
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
