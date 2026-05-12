import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'; // Adjust path as needed
import './authentication.scss';

const ForgotPassword = ({ forgotPassword, verifyOtp, resetPasswordAfterOtp }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);

    const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPassVisibility = () => setConfirmPassVisible(!confirmPassVisible);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        forgotPassword(cleanEmail)
            .then(() => setStep(2))
            .catch((err) => {
                console.warn(err?.response?.data?.message || "Failed to send OTP");
            });
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        verifyOtp(cleanEmail, otp)
            .then(() => setStep(3))
            .catch((err) => {
                console.warn(err?.response?.data?.message || "Invalid or expired OTP");
            });
    };

    const handleNewPasswordSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            console.warn("Passwords do not match");
            return;
        }

        const cleanEmail = email.trim().toLowerCase();
        resetPasswordAfterOtp(cleanEmail, newPassword, confirmPassword)
            .then(() => {
                console.warn("Password has been reset!");
                navigate('/login');
            })
            .catch((err) => {
                console.warn(err?.response?.data?.message || "Failed to reset password");
            });
    };

    return (
        <div className='auth-page forgotPassword-page d-flex justify-content-center align-items-center min-vh-100 py-4'>
            <div className="container-xl" style={{ maxWidth: '525px' }}>
                <div className="content-wrapper bg-theme1 rounded-3 shadow">
                    {step === 1 && (
                        <Form onSubmit={handleEmailSubmit}>
                            <div className="heading-wrapper text-dark mb-4 pb-2">
                                <div className="fs-3 fw-bold mb-1">Forgot Password</div>
                                <div className="small text-gray">Enter your email to receive an OTP</div>
                            </div>
                            <Form.Group className="mb-4" controlId="formEmail">
                                <Form.Label>Email address<span className="text-danger">*</span></Form.Label>
                                <Form.Control type="email" placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off" required
                                />
                            </Form.Group>
                            <div className="btn-wrapper">
                                <Row className="g-2 gx-md-3">
                                    <Col>
                                        <Button type="button" variant="outline-primary" className="w-100 btn-custom rounded-pill d-flex align-items-center justify-content-center" onClick={() => navigate('/login')}>
                                            <i className="bi bi-arrow-left-short fs-3 lh-1"></i> Back to login
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button type="submit" variant="primary" className="w-100 btn-custom rounded-pill d-flex align-items-center justify-content-center">
                                            Send OTP <i className="bi bi-arrow-right-short fs-3 lh-1"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    )}

                    {step === 2 && (
                        <Form onSubmit={handleOtpSubmit}>
                            <div className="heading-wrapper text-dark mb-4 pb-2">
                                <div className="fs-3 fw-bold lh-sm mb-1">Enter OTP</div>
                                <div className="small text-gray">OTP sent to <span className="text-primary fw-semibold">{email}</span></div>
                            </div>
                            <Form.Group className="mb-4" controlId="formOtp">
                                <Form.Label>Enter OTP<span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Enter OTP" maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    autoComplete="off" required
                                />
                            </Form.Group>
                            <div className="btn-wrapper">
                                <Button variant="primary" type="submit" className="w-100 btn-custom rounded-pill py-2">Verify OTP</Button>
                            </div>
                        </Form>
                    )}

                    {step === 3 && (
                        <Form onSubmit={handleNewPasswordSubmit}>
                            <div className="heading-wrapper text-dark mb-4 pb-2">
                                <div className="fs-3 fw-bold lh-sm">Reset Password</div>
                            </div>
                            <Form.Group className="mb-4" controlId="formNewPassword">
                                <Form.Label>New Password<span className="text-danger">*</span></Form.Label>
                                <div className="position-relative">
                                    <Form.Control type={passwordVisible ? 'text' : 'password'} placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete='new-password' required
                                    />
                                    <span role="button" className="position-absolute top-50 translate-middle-y text-secondary" onClick={togglePassVisibility} style={{ right: '10px' }}>
                                        {passwordVisible ? <i className="bi bi-eye-slash-fill fs-16"></i> : <i className="bi bi-eye-fill fs-16"></i>}
                                    </span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formConfirmPassword">
                                <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                                <div className="position-relative">
                                    <Form.Control type={confirmPassVisible ? 'text' : 'password'} placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete='new-password' required
                                    />
                                    <span role="button" className="position-absolute top-50 translate-middle-y text-secondary" onClick={toggleConfirmPassVisibility} style={{ right: '10px' }}>
                                        {confirmPassVisible ? <i className="bi bi-eye-slash-fill fs-16"></i> : <i className="bi bi-eye-fill fs-16"></i>}
                                    </span>
                                </div>
                            </Form.Group>
                            <div className="btn-wrapper">
                                <Button variant="primary" type="submit" className="w-100 btn-custom rounded-pill py-2">Submit</Button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

// Connect Redux actions
const mapDispatchToProps = (dispatch) => ({
    forgotPassword: (email) =>
        new Promise((resolve, reject) =>
            dispatch(actions.forgotPassword(email)).then(resolve).catch(reject)
        ),
    verifyOtp: (email, otp) =>
        new Promise((resolve, reject) =>
            dispatch(actions.verifyOtp(email, otp)).then(resolve).catch(reject)
        ),
    resetPasswordAfterOtp: (email, password, confirmPassword) =>
        new Promise((resolve, reject) =>
            dispatch(actions.resetPasswordAfterOtp(email, password, confirmPassword))
                .then(resolve)
                .catch(reject)
        ),
});

export default connect(null, mapDispatchToProps)(ForgotPassword);

