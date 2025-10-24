import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./authentication.scss";
import { connect } from 'react-redux';
import { withSnackbar } from 'react-simple-snackbar';
import * as actions from '../../store/actions/index'; // adjust path based on your folder structure

// Stepper Component
const Stepper = ({ register, currentStep }) => {
  const steps = [1, 2, 3];
  return (
    <div className="stepper-wrapper position-relative mb-4">
      <div className="stepper-line position-absolute start-0 end-0 top-50 translate-y-middle z-0" />
      {/* Progress line */}
      <div
        className="stepper-line stepper-line-progress position-absolute top-50 translate-middle-y bg-primary z-1"
        style={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
          transition: "width 0.3s ease",
        }}
      />
      <div className="stepper d-flex justify-content-between position-relative z-1">
        {steps.map((label, index) => (
          <div
            key={index}
            className={`step text-center ${index === currentStep ? "active" : "bg-white"
              } ${index < currentStep ? "completed" : ""}`}
          >
            <div className="step-number d-flex align-items-center justify-content-center shadow">
              {index + 1}
            </div>
            {/* <div className="step-label">{label}</div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

const SignUp = (props) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setconfirmPassVisible] = useState(false);

  const [phone, setPhone] = useState("");

  const togglePassVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPassVisibility = () => {
    setconfirmPassVisible(!confirmPassVisible);
  };

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      form.phoneNumber = form.phoneNumber.replace(/\D/g, "").slice(-10);
      props.register(form, navigate); // Call Redux action

    }
  };

  const handleBack = () => setStep(step - 1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    usdot: "",
    companyAddress: "",
    timeZoneId: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false
  });
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleOnChange = (value) => {
    setPhone(value);
    setForm((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  return (
    <div className="auth-page SignUp-page d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="container-xl" style={{ maxWidth: "525px" }}>
        <div className="content-wrapper bg-theme1 rounded-3 shadow">
          <div className="logo-wrapper text-center mb-4">
            <img
              src={require("../../assets/images/sidebar-logo.png")}
              alt="Logo"
              className="img-fluid"
              style={{ width: "136px" }}
            />
            <div
              className="heading font-roboto text-dark mt-1"
              style={{ fontSize: "22px" }}
            >
              Create an account
            </div>
          </div>
          <div className="wrapper pb-1">
            <Stepper currentStep={step} />
          </div>
          <Form onSubmit={(e) => e.preventDefault()}>
            {step === 0 && (
              <>
                <Form.Group className="mb-3" controlId="FirstName">
                  <Form.Label>
                    First Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Please enter your first name"
                    autoComplete="off"
                    required
                    value={form.firstName}
                    onChange={handleChange}

                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="LastName">
                  <Form.Label>
                    Last Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Please enter your last name"
                    autoComplete="off"
                    required
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}

                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="EmailID">
                  <Form.Label>
                    Email<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Please enter your email"
                    autoComplete="off"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {step === 1 && (
              <>
                <Form.Group className="mb-3" controlId="CompanyName">
                  <Form.Label>
                    Company Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    placeholder="Please enter the company name"
                    autoComplete="off"
                    required
                    value={form.companyName}

                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="USDOT">
                  <Form.Label>
                    USDOT<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Please enter the USDOT"
                    autoComplete="off"
                    required
                    onChange={handleChange}
                    value={form.usdot}
                    name="usdot"

                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="CompanyAddress">
                  <Form.Label>
                    Company Address<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Please enter the company address"
                    autoComplete="off"
                    required
                    onChange={handleChange}
                    value={form.companyAddress}
                    name="companyAddress"

                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="timeZoneId*">
                  <Form.Label>
                    Time Zone <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleChange}
                    required
                    value={form.timeZoneId}
                    name="timeZoneId"

                  >
                    <option value="">Select the Time zone</option>
                    {/* <option value="UTC (Coordinated Universal Time)">
                      UTC (Coordinated Universal Time)
                    </option>
                    <option value="GMT (Greenwich Mean Time)">
                      GMT (Greenwich Mean Time)
                    </option>
                    <option value="IST – India Standard Time">
                      IST – India Standard Time
                    </option>
                    <option value="EST – Eastern Standard Time">
                      EST – Eastern Standard Time
                    </option>
                    <option value="EDT – Eastern Daylight Time (USA)">
                      EDT – Eastern Daylight Time (USA)
                    </option>
                    <option value="CST – Central Standard Time">
                      CST – Central Standard Time
                    </option>
                    <option value="CDT – Central Daylight Time (USA)">
                      CDT – Central Daylight Time (USA)
                    </option> */}
                    <option value="America/New_York">Eastern Standard Time</option>
                    <option value="America/Chicago">Central Standard Time</option>
                    <option value="America/Denver">Mountain Standard Time</option>
                    <option value="America/Los_Angeles">Pacific Standard Time</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Group className="mb-3" controlId="PhoneNumber">
                  <Form.Label>
                    Phone Number<span className="text-danger">*</span>
                  </Form.Label>
                  <PhoneInput
                    inputProps={{
                      name: "phoneNumber",
                      required: true,
                      autoFocus: false,
                    }}
                    country={"in"}
                    // value={phone}
                    value={form.phoneNumber}
                    onChange={handleOnChange}
                    // enableSearch={true}
                    countryCodeEditable={true}
                    disableDropdown={true}
                    inputClass="w-100 py-2"
                    dropdownClass="text-start"
                    inputStyle={{ height: "auto", minHeight: "54px" }}
                    placeholder="Please enter the phone number"
                    name="phoneNumber"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>
                    Password<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      value={form.password}
                      name="password"
                      //   onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Please enter the 8 digit password"
                      minlength={8}
                      maxLength={8}
                      onChange={handleChange}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      title="Must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                      autoComplete="new-password"
                      required
                    />
                    <span
                      role="button"
                      className="position-absolute top-50 translate-middle-y text-secondary"
                      onClick={togglePassVisibility}
                      style={{ right: "10px" }}
                    >
                      {passwordVisible ? (
                        <i className="bi bi-eye-slash-fill fs-16"></i>
                      ) : (
                        <i className="bi bi-eye-fill fs-16"></i>
                      )}
                    </span>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="ConfirmPassword">
                  <Form.Label>
                    Confirm Password<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={confirmPassVisible ? "text" : "password"}
                      value={form.confirmPassword}
                      name="confirmPassword"
                      //   onChange={(e) => setconfirmPassword(e.target.value)}
                      placeholder="Please enter the 8 digit password"
                      minlength={8}
                      maxLength={8}
                      onChange={handleChange}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      title="Must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                      autoComplete="new-password"
                      required
                    />
                    <span
                      role="button"
                      className="position-absolute top-50 translate-middle-y text-secondary"
                      onClick={toggleConfirmPassVisibility}
                      style={{ right: "10px" }}
                    >
                      {confirmPassVisible ? (
                        <i className="bi bi-eye-slash-fill fs-16"></i>
                      ) : (
                        <i className="bi bi-eye-fill fs-16"></i>
                      )}
                    </span>
                  </div>
                </Form.Group>
                <div className="form-check fs-6 mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input fs-16 border-primary border-opacity-75"
                    id="conditionAgreement"
                    required
                    name="agreedToTerms"
                    onChange={handleChange}

                  />
                  <label
                    className="form-check-label text-body"
                    htmlFor="conditionAgreement"
                    style={{ paddingTop: "2px" }}
                  >
                    Agree to the{" "}
                    <Link to={"/"} className="text-decoration-none">
                      Terms and Privacy
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div className="btn-wrapper mt-4">
              <Row className="g-2 gx-md-3">
                <Col>
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="w-100 fs-12 fw-semibold font-roboto text-dark d-flex align-items-center justify-content-center rounded-pill shadow px-3"
                      onClick={handleBack}
                    >
                      <i className="bi bi-arrow-left-short fs-3 lh-1"></i> Back
                    </Button>
                  )}
                </Col>
                <Col>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 fs-12 fw-semibold font-roboto rounded-pill shadow px-3"
                    onClick={handleNext}
                  >
                    {step === 2 ? (
                      <span className="d-flex align-items-center justify-content-center">
                        Create{" "}
                        <i className="bi bi-arrow-right-short fs-3 lh-1"></i>
                      </span>
                    ) : (
                      <span className="d-flex align-items-center justify-content-center">
                        Next{" "}
                        <i className="bi bi-arrow-right-short fs-3 lh-1"></i>
                      </span>
                    )}
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="text-center fs-12 text-gray border-top mt-4 pt-4">
              Already registered?{" "}
              <Link
                to={"/login"}
                className="btn-link fw-medium text-decoration-none"
              >
                Sign In
              </Link>
            </div>
          </Form>
        </div>
        <div className="info fs-16 text-gray text-center">
          <div className="version-no mt-4">Version: 1.0.0</div>
          <div className="version-no mt-3">Ⓒ 2025 FMC. All Rights Reserved</div>
        </div>
      </div>
    </div>
  );
};

// Connect Redux
const mapDispatchToProps = (dispatch) => ({
  register: (data, navigate) => dispatch(actions.register(data, navigate)),
});

export default connect(null, mapDispatchToProps)(withSnackbar(SignUp));
