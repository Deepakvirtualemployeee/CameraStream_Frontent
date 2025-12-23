import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Spinner, Alert, Button } from 'react-bootstrap';
import { verifyEmail } from "../../store/actions/auth";

const VerifyEmail = () => {
  const { token } = useParams();
  console.log("Verification token:", token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(null); // null, true, or false

  useEffect(() => {
    const runVerifyEmail = async () => {
      try {
        const res = await dispatch(verifyEmail(token));
        setVerified(res?.success);
      } catch (error) {
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    runVerifyEmail();
  }, [dispatch, token]);

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
