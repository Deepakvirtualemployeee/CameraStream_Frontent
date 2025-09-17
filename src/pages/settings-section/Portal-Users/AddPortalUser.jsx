import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createPortalUser } from "../../../store/actions/portalUsers"; // import action

export const AddPortalUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams(); // companyId from route

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPassVisibility = () =>
    setConfirmPassVisible(!confirmPassVisible);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const { firstName, lastName, email, phoneNumber, password, confirmPassword, role } =
    formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare payload (include companyId from params)
    const payload = {
      ...formData,
      companyId: companyId,
    };
    console.log("Payload:", payload);
    // Dispatch action
    dispatch(createPortalUser(companyId, payload, navigate));
  };

  return (
    <div className="AddPortalUser-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">User Info</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="add-user-form">
              <i className="bi bi-plus-lg fs-16"></i> Add User
            </Button>
          </div>
        </div>

        <div className="form-wrapper">
          <Form id="add-user-form" onSubmit={handleSubmit}>
            <section className="personal-info bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3 gx-xl-4">
                {/* First Name */}
                <Col sm={6}>
                  <Form.Group controlId="FirstName">
                    <Form.Label>
                      First Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Last Name */}
                <Col sm={6}>
                  <Form.Group controlId="LastName">
                    <Form.Label>
                      Last Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Email */}
                <Col xs={12}>
                  <Form.Group controlId="UserEmail">
                    <Form.Label>
                      Email<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      autoComplete="off"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Phone */}
                <Col xs={12}>
                  <Form.Group controlId="PhoneNumber">
                    <Form.Label>
                      Phone<span className="text-danger">*</span>
                    </Form.Label>
                    <PhoneInput
                      country="in"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: "phoneNumber",
                        required: true,
                      }}
                      enableSearch={true}
                      countryCodeEditable={false}
                      inputClass="w-100 py-2"
                      dropdownClass="text-start"
                      inputStyle={{
                        height: "auto",
                        minHeight: "44px",
                        width: "100%",
                      }}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>

                {/* Password */}
                <Col sm={6}>
                  <Form.Group controlId="Password">
                    <Form.Label>
                      Password<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={password}
                        placeholder="Enter password"
                        minLength={6}
                        maxLength={24}
                        onChange={handleChange}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,24}$"
                        title="Must be 6–24 characters, include uppercase, lowercase, number, and special character."
                        autoComplete="new-password"
                        required
                      />
                      <span
                        role="button"
                        className="position-absolute top-50 translate-middle-y text-secondary"
                        onClick={togglePassVisibility}
                        style={{ right: "12px" }}
                      >
                        {passwordVisible ? (
                          <i className="bi bi-eye-slash-fill fs-16"></i>
                        ) : (
                          <i className="bi bi-eye-fill fs-16"></i>
                        )}
                      </span>
                    </div>
                  </Form.Group>
                </Col>

                {/* Confirm Password */}
                <Col sm={6}>
                  <Form.Group controlId="ConfirmPassword">
                    <Form.Label>
                      Confirm Password<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={confirmPassVisible ? "text" : "password"}
                        value={confirmPassword}
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        minLength={6}
                        maxLength={24}
                        onChange={handleChange}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,24}$"
                        title="Must be 6–24 characters, include uppercase, lowercase, number, and special character."
                        autoComplete="new-password"
                        required
                      />
                      <span
                        role="button"
                        className="position-absolute top-50 translate-middle-y text-secondary"
                        onClick={toggleConfirmPassVisibility}
                        style={{ right: "12px" }}
                      >
                        {confirmPassVisible ? (
                          <i className="bi bi-eye-slash-fill fs-16"></i>
                        ) : (
                          <i className="bi bi-eye-fill fs-16"></i>
                        )}
                      </span>
                    </div>
                  </Form.Group>
                </Col>

                {/* Password Info */}
                <Col xs={12}>
                  <div className="checkverify-wrapper">
                    <div className="text-black text-opacity-75 fw-medium mb-1">
                      Passwords must contain at least:
                    </div>
                    <div className="fs-6 text-dark text-opacity-75">
                      <i className="bi bi-x-circle fs-6 text-danger"></i> 6
                      characters, max 24 characters
                    </div>
                  </div>
                </Col>

                {/* Role */}
                <Col xs={12}>
                  <Form.Group controlId="role">
                    <Form.Label>
                      Role<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="role"
                      value={role}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      <option value="company administrator">
                        Company Administrator
                      </option>
                      {/* <option value="system super-admin">
                        System Super-Admin
                      </option>
                      <option value="system administrator">
                        System Administrator
                      </option>
                      <option value="system technician">
                        System Technician
                      </option>
                      <option value="system sales">
                        System Sales
                      </option>
                      <option value="company support-user">
                        Company Support-User
                      </option>
                      <option value="company fleet-manager">
                      Company Fleet Manager
                      </option>
                      <option value="company portal-user">
                      Company Portal-User
                      </option>
                      <option value="driver">
                        Driver
                      </option> */}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
