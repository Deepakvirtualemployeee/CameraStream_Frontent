import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createCompany } from '../../store/actions';

const CreateCompany = ({ createCompany }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        timeZoneId: '',
        dotNumber: '',
        address: '',
        phoneNumber: '5555555555'
    });

    const { companyName, timeZoneId, dotNumber, address, phoneNumber } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!companyName || !timeZoneId || !dotNumber || !address) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        const payload = {
            companyName,
            address,
            dotNumber,
            status: "Active",
            subscriptionStatus: "Paid",
            phoneNumber,
            timeZoneId
        };

        createCompany(payload)
            .then(() => {
                // toast.success('Company created successfully!');
                navigate('/companies-list');
            })
            .catch((error) => {
                toast.error(error || 'Something went wrong.');
            })
            .finally(() => {
                setLoading(false);
            });
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
                                        name="timeZoneId"
                                        value={timeZoneId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select the Time zone</option>
                                        {/* <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                                        <option value="UTC">UTC</option>
                                        <option value="GMT">GMT</option>
                                        <option value="IST">IST</option> */}
                                        <option value="America/New_York">Eastern Standard Time</option>
                                        <option value="America/Chicago">Central Standard Time</option>
                                        <option value="America/Denver">Mountain Standard Time</option>
                                        <option value="America/Los_Angeles">Pacific Standard Time</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col sm={12}>
                                <Form.Group controlId="USDOTNumber">
                                    <Form.Label>USDOT Number<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dotNumber"
                                        value={dotNumber}
                                        onChange={handleChange}
                                        placeholder="Enter USDOT Number"
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
                                        name="address"
                                        value={address}
                                        onChange={handleChange}
                                        placeholder="Enter company address"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="btn-wrapper d-flex flex-wrap justify-content-end gap-2">
                            <Button
                                variant='white'
                                className="bg-white border-gray"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='primary'
                                type="submit"
                                form="add-company-form"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Confirm'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    createCompany: (data) => new Promise((resolve, reject) => {
        dispatch(createCompany(data, (err) => {
            if (err) reject(err);
            else resolve();
        }));
    })
});

export default connect(null, mapDispatchToProps)(CreateCompany);
