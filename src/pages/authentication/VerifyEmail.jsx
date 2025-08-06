import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert, Button } from 'react-bootstrap';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null); // null, true, or false

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://a56af6c3afc3c40dbac0bcdefcb0981c-2a093a3ce85fd9ff.elb.us-east-1.amazonaws.com/api/auth/verify-email/${token}`);
        setVerified(true);
      } catch (error) {
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-3">
      {loading ? (
        <>
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Verifying your email...</div>
        </>
      ) : verified ? (
        <>
          <Alert variant="success" className="text-center">
            Your email has been successfully verified!
          </Alert>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <Alert variant="danger" className="text-center">
            Invalid or expired verification link.
          </Alert>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
