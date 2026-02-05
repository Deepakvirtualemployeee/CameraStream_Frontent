import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { withSnackbar } from 'react-simple-snackbar';
import * as actions from '../../store/actions/index';

const LogIn = ({ login, openSnackbar }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Safely extract companyId from a JWT token
    const extractCompanyId = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1] || ''));
            return payload?.companyId || null;
        } catch (err) {
            console.error('Failed to parse token for companyId', err);
            return null;
        }
    };

    useEffect(() => {
        // Check if token exists
        const token = localStorage.getItem('token');
        const companyId = token ? extractCompanyId(token) : null;

        if (token && companyId) {
            navigate(`/companies-list`);
        }

        // Load saved credentials if "Remember me" was checked before
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const savedRemember = localStorage.getItem('rememberMe') === 'true';

        if (savedRemember && savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            openSnackbar("Please fill all required fields.");
            return;
        }

        // Save credentials if "Remember me" is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            // Clear if not checked
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.setItem('rememberMe', 'false');
        }

        const payload = { email, password };
        login(payload, navigate);
    };

    return (
        <div className="auth-page login-page d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="container-xl" style={{ maxWidth: '525px' }}>
                <div className="content-wrapper bg-theme1 rounded-3 shadow">
                    <div className="logo-wrapper text-center mb-4 pb-2">
                        <img
                            src={require('../../assets/images/sidebar-logo.png')}
                            alt="Logo"
                            className="img-fluid"
                            style={{ width: '100px' }}
                        />
                    </div>
                    <div className="heading-wrapper text-dark mb-4 pb-md-2">
                        <div className="fs-1 fw-bold lh-sm">Welcome!</div>
                        <div className="subtitle fs-16">Enter your login details below!</div>
                    </div>

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="userEmailId">
                            <Form.Label>Email ID<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                autoComplete="off"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pe-5"
                                    placeholder="Enter password"
                                    
                                    // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    // title="Must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                    autoComplete="new-password"
                                    required
                                />
                                <span
                                    role="button"
                                    className="position-absolute top-50 translate-middle-y text-secondary"
                                    onClick={togglePasswordVisibility}
                                    style={{ right: '10px' }}
                                >
                                    {passwordVisible ? (
                                        <i className="bi bi-eye-slash-fill fs-16"></i>
                                    ) : (
                                        <i className="bi bi-eye-fill fs-16"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-between mb-4 pt-1">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input fs-16 border-primary border-opacity-75"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="rememberMe" style={{ paddingTop: '2px' }}>
                                    Remember me
                                </label>
                            </div>
                            <Link to={'/forgot-password'} className="btn-link text-decoration-none">
                                Forgot Password
                            </Link>
                        </div>

                        <div className="btn-wrapper">
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 btn-custom font-roboto rounded-pill shadow-sm py-2"
                            >
                                Login
                            </Button>
                        </div>

                        {/* <div className="text-center fs-12 text-gray mt-4">
                            Don't have an account?{' '}
                            <Link to={'/signup'} className="btn-link fw-medium text-decoration-none">
                                Signup
                            </Link>
                        </div> */}
                    </Form>
                </div>
                <div className="info fs-14 text-gray text-center">
                    <div className="version-no mt-4">Version: 1.0.0</div>
                    <div className="version-no mt-1">Ⓒ 2025 FMC. All Rights Reserved</div>
                </div>
            </div>
        </div>
    );
};

// Connect Redux
const mapDispatchToProps = (dispatch) => ({
    login: (data, navigate) => dispatch(actions.login(data, navigate)),
});

export default connect(null, mapDispatchToProps)(withSnackbar(LogIn));
