import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const LogIn = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="auth-page login-page d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="container-xl" style={{ maxWidth: '525px' }}>
                <div className="content-wrapper bg-theme1 rounded-3 shadow">
                    <div className="logo-wrapper text-center mb-4 pb-3 pb-xl-4">
                        <img src={require('../../assets/images/logo.png')} alt="Logo" className="img-fluid" style={{ width: '136px' }} />
                    </div>
                    <div className="heading-wrapper text-dark mb-4 pb-md-2">
                        <div className="fs-1 fw-bold lh-sm">Welcome!</div>
                        <div className="subtitle fs-16">Enter your login details below!</div>
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId="userEmailId">
                            <Form.Label>Email ID<span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" placeholder="Enter email" autoComplete='off' required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control type={passwordVisible ? 'text' : 'password'} className='pe-5'
                                    placeholder="Enter password" minlength="8"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                    autoComplete='new-password'
                                    required
                                />
                                <span role="button" className="position-absolute top-50 translate-middle-y text-secondary" onClick={togglePasswordVisibility} style={{ right: '10px' }}>
                                    {passwordVisible ? <i className="bi bi-eye-slash-fill fs-16"></i> : <i className="bi bi-eye-fill fs-16"></i>}
                                </span>
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-between mb-4 pt-1">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input fs-16 border-primary border-opacity-75" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe" style={{ paddingTop: '2px' }}>Remember me</label>
                            </div>
                            <Link to={'/forgot-password'} className="btn-link text-decoration-none">Forgot Password</Link>
                        </div>

                        <div className="btn-wrapper">
                            <Button variant="primary" type="submit" className="btn-custom rounded-pill w-100 py-2">Login</Button>
                        </div>

                        <div className="text-center fs-12 text-gray mt-4">
                            Don't have an account? <Link to={'/signup'} className='btn-link fw-medium text-decoration-none'>Signup</Link>
                        </div>
                    </Form>
                </div>
                <div className="info fs-16 text-gray text-center">
                    <div className="version-no mt-4">Version: 1.0.0</div>
                    <div className="version-no mt-3">Ⓒ 2025 FMC. All Rights Reserved</div>
                </div>
            </div>
        </div>
    )
}
