import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createCompany } from '../../store/actions';

const PHONE_REGEX = /^\d{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateCompany = ({ createCompany }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        timeZoneId: '',
        dotNumber: '',
        address: '',
        phoneNumber: '',
        email: '',
        terminalAddress: '',
    });

    const { companyName, timeZoneId, dotNumber, address, phoneNumber, email, terminalAddress } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextValue =
            name === 'phoneNumber'
                ? value.replace(/\D/g, '').slice(0, 15)
                : value;

        if (submitError) {
            setSubmitError('');
        }

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!companyName || !timeZoneId || !dotNumber || !address || !phoneNumber || !email || !terminalAddress) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            toast.error('Phone number must contain 10 to 15 digits.');
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setSubmitError('');
        setLoading(true);

        const payload = {
            companyName,
            dotNumber,
            timeZoneId,
            address,
            phoneNumber,
            email,
            terminals: [
                {
                    timeZone: timeZoneId,
                    address: terminalAddress,
                },
            ],
        };

        createCompany(payload)
            .then(() => {
                // toast.success('Company created successfully!');
                navigate('/companies-list');
            })
            .catch((error) => {
                const errorMessage =
                    typeof error === 'string'
                        ? error
                        : error?.response?.data?.message || error?.message || 'Something went wrong.';

                setSubmitError(errorMessage);
                toast.error(errorMessage);
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
                    {submitError && (
                        <div className="alert alert-danger mb-4" role="alert">
                            {submitError}
                        </div>
                    )}

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
                            <Col sm={6}>
                                <Form.Group controlId="PhoneNumber">
                                    <Form.Label>
                                        Phone Number<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="Email">
                                    <Form.Label>
                                        Email<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="Enter company email"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group controlId="TerminalAddress">
                                    <Form.Label>
                                        Terminal Address<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="terminalAddress"
                                        value={terminalAddress}
                                        onChange={handleChange}
                                        placeholder="Enter terminal address"
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
    createCompany: (data) => dispatch(createCompany(data))
});

export default connect(null, mapDispatchToProps)(CreateCompany);
