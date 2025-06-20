import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export const SignupFinished = () => {
    const navigate = useNavigate();
    return (
        <div className="auth-page signup-finished-page d-flex justify-content-center align-items-center min-vh-100 py-4">
            <div className="container-xl" style={{ maxWidth: '525px' }}>
                <div className="content-wrapper bg-theme1 rounded-3 text-center shadow">
                    <div className="logo-wrapper text-center mb-4 pb-2">
                        <img src={require('../../assets/images/logo.png')} alt="Logo" className="img-fluid" style={{ width: '136px' }} />
                    </div>
                    <div className="wrapper mb-4 pb-3">
                        <div className="heading font-roboto text-dark mb-1" style={{ fontSize: '22px' }}>Email has been sent</div>
                        <div className="description">Confirmation email has been sent to user@gmail.com. Please check for an email from ELD and click on the included link to activate your account.</div>
                    </div>
                    <div className="btn-wrapper">
                        <Button variant="primary" type="submit" className="btn-custom font-roboto rounded-pill shadow w-100 py-2" onClick={()=> navigate('/login')}>Login</Button>
                    </div>
                </div>
                <div className="info fs-16 text-gray text-center">
                    <div className="version-no mt-4">Version: 1.0.0</div>
                    <div className="version-no mt-3">Ⓒ 2025 FMC. All Rights Reserved</div>
                </div>
            </div>
        </div>
    )
}
