import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { getDriverById, updateDriver } from "../../../store/actions/drivers";

export const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // driver id
  const location = useLocation();
  const { companyId } = location.state || {};
  const dispatch = useDispatch();

  const { driver, loading } = useSelector((state) => state.drivers);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPassVisibility = () =>
    setConfirmPassVisible(!confirmPassVisible);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    licenseIssuingState: "",
    licenseNumber: "",
    homeTerminal: "",
    assignVehicles: "",
    assignCoDriver: "",
    hosRules: "",
    cargoType: "",
    restart: "",
    restBreak: "",
    shortHaulException: false,
    splitSleeperBerth: false,
    personalConveyance: false,
    yardMove: false,
    manualDriver: false,
    restrictDriverFromCreation: false,
  });

  // Fetch driver by ID on mount
  useEffect(() => {
    if (id) {
      dispatch(getDriverById(id));
    }
  }, [id, dispatch]);

  // Populate formData once driver is fetched
//   useEffect(() => {
//     if (driver) {
//       setFormData({
//         ...formData,
//         ...driver,
//         confirmPassword: driver.password || "", // ensure confirmPassword matches
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [driver]);
useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        confirmPassword: driver.password || "",
      });
    }
  }, [driver]);
  
useEffect(() => {
  console.log("Fetched driver in redux:", driver);
}, [driver]);

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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(updateDriver(id, formData, navigate));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="EditDriver-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">Personal Info</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="outline-danger">Deactivate</Button>
            <Button variant="primary" type="submit" form="edit-user-form">
              Update Driver
            </Button>
          </div>
        </div>

        <div className="form-wrapper">
        <Form id="edit-user-form" onSubmit={handleSubmit}>
            <section className="personal-info bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                <Row className="g-3 gx-xl-4">
                    <Col xs={12}>
                        <Form.Group controlId="Username">
                            <Form.Label>Username<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                autoComplete='off'
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="FirstName">
                            <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
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
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                autoComplete='off'
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                autoComplete='off'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <PhoneInput
                                inputProps={{
                                    name: "phoneNumber",
                                    required: true,
                                    autoFocus: false,
                                }}
                                country={'in'}
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                countryCodeEditable={false}
                                inputClass="w-100 py-2"
                                dropdownClass="text-start"
                                inputStyle={{ height: "auto", minHeight: "44px" }}
                                placeholder="Enter phone number"
                                name="phoneNumber"
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    placeholder="Enter password"
                                    minLength={6}
                                    maxLength={24}
                                    onChange={handleChange}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                    autoComplete="new-password"
                                    required
                                />
                                <span role="button" className="position-absolute top-50 translate-middle-y text-secondary" onClick={togglePassVisibility} style={{ right: "12px" }} >
                                    {passwordVisible ? (
                                        <i className="bi bi-eye-slash-fill fs-16"></i>
                                    ) : (
                                        <i className="bi bi-eye-fill fs-16"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={confirmPassVisible ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    name="confirmPassword"
                                    placeholder="Enter confirm password"
                                    minLength={6}
                                    maxLength={24}
                                    onChange={handleChange}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                    autoComplete="new-password"
                                    required
                                />
                                <span role="button" className="position-absolute top-50 translate-middle-y text-secondary" onClick={toggleConfirmPassVisibility} style={{ right: "12px" }}>
                                    {confirmPassVisible ? (
                                        <i className="bi bi-eye-slash-fill fs-16"></i>
                                    ) : (
                                        <i className="bi bi-eye-fill fs-16"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <div className="checkverify-wrapper">
                            <div className="text-black text-opacity-75 fw-medium mb-1">Passwords must contain at least:</div>
                            <div className="fs-6 text-dark text-opacity-75"><i className="bi bi-x-circle fs-6 text-danger"></i> 6 characters, max 24 characters</div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="LicenseIssuingState">
                            <Form.Label>Driving License Issuing State<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                name="licenseIssuingState"
                                value={formData.licenseIssuingState}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select state</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Delhi">Delhi</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="LicenseNumber">
                            <Form.Label>Driver License Number<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                placeholder="Enter license number"
                                autoComplete='off'
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </section>

            <section className="carrier-section mb-4">
                <div className="main-heading mb-3">Carrier Settings</div>
                <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                    <Form.Group className="mb-3" controlId="HomeTerminal">
                        <Form.Label>Home Terminal<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="homeTerminal"
                            value={formData.homeTerminal}
                            onChange={handleChange}
                            placeholder="Enter home terminal"
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="AssignVehicles">
                        <Form.Label>Assign Vehicles</Form.Label>
                        <Form.Select name="assignVehicles" value={formData.assignVehicles} onChange={handleChange} required >
                            <option value="" disabled>Select a vehicle</option>
                            <option value="ANDROID01">ANDROID01</option>
                            <option value="ANDROID02">ANDROID02</option>
                            <option value="ANDROID03">ANDROID03</option>
                            <option value="ANDROID04">ANDROID04</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="AssignCoDriver">
                        <Form.Label>Assign Co-Driver</Form.Label>
                        <Form.Select name="assignCoDriver" value={formData.assignCoDriver} onChange={handleChange} required >
                            <option value="" disabled>Select a co-driver</option>
                            <option value="Review Driver">Review Driver</option>
                            <option value="Android Driver">Android Driver</option>
                            <option value="IOS Driver">IOS Driver</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </section>

            <section className="log-section">
                <div className="main-heading mb-3">Log Settings</div>
                <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                    <Form.Group className="mb-3" controlId="HOSRules">
                        <Form.Label>HOS Rules<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="hosRules"
                            value={formData.hosRules}
                            onChange={handleChange}
                            placeholder="Enter HOS rules"
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="CargoType">
                        <Form.Label>Cargo Type<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="cargoType"
                            value={formData.cargoType}
                            onChange={handleChange}
                            placeholder="Enter cargo type"
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Restart">
                        <Form.Label>Restart<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="restart"
                            value={formData.restart}
                            onChange={handleChange}
                            placeholder="Enter restart"
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="RestBreak">
                        <Form.Label>Rest Break<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="restBreak"
                            value={formData.restBreak}
                            onChange={handleChange}
                            placeholder="Enter rest break"
                            autoComplete='off'
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className="checks-wrapper">
                            <Form.Check type="checkbox" name="shortHaulException" checked={formData.shortHaulException} onChange={handleChange}
                                className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Short-Haul Exception</div>}
                                required
                            />
                            <Form.Check type="checkbox" name="splitSleeperBerth" checked={formData.splitSleeperBerth} onChange={handleChange}
                                className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Split-Sleeper Berth</div>}
                            />
                            <Form.Check type="checkbox" name="personalConveyance" checked={formData.personalConveyance} onChange={handleChange}
                                className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Personal Conveyance</div>}
                            />
                            <Form.Check type="checkbox" name="yardMove" checked={formData.yardMove} onChange={handleChange}
                                className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Yard Move</div>}
                            />
                            <Form.Check type="checkbox" name="manualDriver" checked={formData.manualDriver} onChange={handleChange}
                                className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Manual Driver</div>}
                            />
                            <Form.Check type="checkbox" name="restrictDriverFromCreation" checked={formData.restrictDriverFromCreation} onChange={handleChange}
                                className="fs-16" label={<div className="fs-6 text-dark text-opacity-75">Restrict Driver from Creation Date & Time</div>}
                            />
                        </div>
                    </Form.Group>
                </div>
            </section>
        </Form>
    </div>
      </div>
    </div>
  );
};
