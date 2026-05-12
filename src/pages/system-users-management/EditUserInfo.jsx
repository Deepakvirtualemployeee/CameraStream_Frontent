import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export const EditUserInfo = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        role: 'System Administrator',
        accessToAllCompanies: true,
        group: 'Super Team'
    });

    const { password, confirmPassword } = userData;

    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        const isPasswordValid = Object.values(requirements).every(Boolean);
        if (!isPasswordValid) {
            toast.error('Password does not meet the required criteria.');
            return;
        }

        // Simulate save
        console.log('Saved user data:', userData);
        toast.success('User info updated successfully!');
    };

    const renderCheck = (condition) => (
        <span className={`lh-1 ${condition ? 'text-primary' : 'text-gray'}`}>
            <i className="bi bi-check-lg fs-4"></i>
        </span>
    );

    return (
        <div className="EditUserInfo-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Edit User Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={()=> navigate(-1)}>Cancel</Button>
                        <Button variant='outline-danger'>Deactivate</Button>
                        <Button variant='primary' type="submit" form="edit-user-form">Save Changes</Button>
                    </div>
                </div>
                <div className="form-wrapper bg-white w-100 border rounded-4 px-3 px-md-4 py-4">
                    <Form id="edit-user-form" onSubmit={handleSubmit}>
                        <div className="detail-wrapper mb-4">
                            <Row className="g-3 g-xl-4">
                                <Col sm={6}>
                                    <Form.Group controlId="FirstName">
                                        <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            value={userData.firstName}
                                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
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
                                            placeholder="Enter name"
                                            value={userData.lastName}
                                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
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
                                            placeholder="Enter email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
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
                                            value={userData.role}
                                            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
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
                                                id="AccessCheck"
                                                className="fs-16 mb-1"
                                                checked={userData.accessToAllCompanies}
                                                onChange={(e) => setUserData({ ...userData, accessToAllCompanies: e.target.checked })}
                                                label={<div className="fs-6 text-dark text-opacity-75">Allow Access to ALL Companies</div>}
                                                required
                                            />
                                            <div className="text-gray fw-normal">Check the box to allow the user to access ALL companies. System will discard the “Assign Group” field below.</div>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="AssignGroup">
                                        <Form.Label>Assign Group<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={userData.group}
                                            onChange={(e) => setUserData({ ...userData, group: e.target.value })}
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
