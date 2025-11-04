import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const AddUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        accessToAllCompanies: false,
        group: '',
    });

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        accessToAllCompanies,
        group,
    } = formData;

    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const renderCheck = (condition) => (
        <span className={`lh-1 ${condition ? 'text-primary' : 'text-gray'}`}>
            <i className="bi bi-check-lg fs-4"></i>
        </span>
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!Object.values(requirements).every(Boolean)) {
            alert('Password does not meet all requirements!');
            return;
        }

        console.log('Submitted data:', formData);
        alert('User added successfully!');
    };

    return (
        <div className="addUser-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Add New User</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant='primary' type="submit" form="add-user-form">
                            <i className="bi bi-plus-lg fs-16"></i> Add User
                        </Button>
                    </div>
                </div>

                <div className="form-wrapper bg-white w-100 border rounded-4 px-3 px-md-4 py-4">
                    <Form id="add-user-form" onSubmit={handleSubmit}>
                        <div className="detail-wrapper mb-4">
                            <Row className="g-3 g-xl-4">
                                <Col sm={6}>
                                    <Form.Group controlId="FirstName">
                                        <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={firstName}
                                            onChange={handleChange}
                                            placeholder="Enter name"
                                            autoComplete='off'
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="LastName">
                                        <Form.Label>Last Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={lastName}
                                            onChange={handleChange}
                                            placeholder="Enter name"
                                            autoComplete='off'
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="UserEmail">
                                        <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            autoComplete='off'
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="NewPassword">
                                        <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
                                            placeholder="New Password"
                                            isInvalid={password && !Object.values(requirements).every(Boolean)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="ConfirmPassword">
                                        <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm New Password"
                                            isInvalid={confirmPassword && password !== confirmPassword}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <div className="checkverify-wrapper mt-n2">
                                        <div className="text-muted fw-medium">Passwords must contain:</div>
                                        <ul className="list-unstyled d-flex flex-wrap gap-3 mt-2 mb-0">
                                            <li className="d-flex align-items-center gap-1">
                                                {renderCheck(requirements.length)} <span className={requirements.length ? 'text-primary' : 'text-gray'}>At least 8 characters</span>
                                            </li>
                                            <li className="d-flex align-items-center gap-1">
                                                {renderCheck(requirements.uppercase)} <span className={requirements.uppercase ? 'text-primary' : 'text-gray'}>At least 1 uppercase</span>
                                            </li>
                                            <li className="d-flex align-items-center gap-1">
                                                {renderCheck(requirements.lowercase)} <span className={requirements.lowercase ? 'text-primary' : 'text-gray'}>At least 1 lowercase</span>
                                            </li>
                                            <li className="d-flex align-items-center gap-1">
                                                {renderCheck(requirements.digit)} <span className={requirements.digit ? 'text-primary' : 'text-gray'}>At least 1 digit</span>
                                            </li>
                                            <li className="d-flex align-items-center gap-1">
                                                {renderCheck(requirements.special)} <span className={requirements.special ? 'text-primary' : 'text-gray'}>At least 1 special character</span>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="UserRole">
                                        <Form.Label>Role<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={role}
                                            onChange={handleChange}
                                            required
                                        >
                                             <option value="" disabled hidden>Select Role</option>
                                            <option value="Broker">Broker</option>
                                            <option value="System Administrator">System Administrator</option>
                                            <option value="Fleet Manager">Fleet Manager</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="AccessToCompaniesCheck">
                                        <Form.Label>Access to Companies<span className="text-danger">*</span></Form.Label>
                                        <div className="checks-wrapper">
                                            <Form.Check
                                                inline
                                                type="checkbox"
                                                name="accessToAllCompanies"
                                                checked={accessToAllCompanies}
                                                onChange={handleChange}
                                                className="fs-16 mb-1"
                                                label={<div className="fs-6 text-dark text-opacity-75">Allow Access to ALL Companies</div>}
                                                required
                                            />
                                            <div className="text-gray fw-normal">
                                                Check the box to allow the user to access to ALL companies.
                                                System will discard the “Assign Group” form field below.
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="AssignGroup">
                                        <Form.Label>Assign Group<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="group"
                                            value={group}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled hidden>Select Group</option>
                                            <option value="Super Team">Super Team</option>
                                            <option value="All Companies">All Companies</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
