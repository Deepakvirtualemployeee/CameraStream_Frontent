import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { addDriver, getDriversIssuingState } from "../../../store/actions/drivers";
import { getVehicles } from "../../../store/actions/vehicles";
import { ALPHABATES_NUMERIC } from "../../../constants"; // Import regex
import { getCompanyInfo } from "../../../store/actions/companies";
import { toast } from "react-toastify";

export const AddDriver = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companyId } = useParams(); // Company id

    // const location = useLocation();
    // const { companyId } = location.state || {};  // reading state


    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassVisible, setconfirmPassVisible] = useState(false);

    const { loading, success } = useSelector((state) => state.driverAdd || {});
    const { vehicles, loading: vehiclesLoading } = useSelector((state) => state.vehicles);


    const { issuingState, loading: issuingStateLoading } = useSelector((state) => state.drivers);
    const { company } = useSelector((state) => state.companies);

    const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPassVisibility = () => setconfirmPassVisible(!confirmPassVisible);

    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        companyId: companyId,
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        licenseState: '',
        licenseNumber: '',
        homeTerminal: '',
        // assignVehicles: '',
        assignedVehicleId: null,
        hosRules: '',
        cargoType: '',
        restart: '',
        restBreak: '',
        allowShortHaulException: false,
        allowSplitSleeperBerth: false,
        allowPersonalConveyance: false,
        allowYardMove: false,
        allowManualDriver: false,
        restrictDriverFromCreationDateAndTime: true,
    });

    const {
        userName,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        licenseState,
        licenseNumber,
        homeTerminal,
        // assignVehicles,
        hosRules,
        cargoType,
        restart,
        restBreak,
        allowShortHaulException,
        allowSplitSleeperBerth,
        allowPersonalConveyance,
        allowYardMove,
        allowManualDriver,
        restrictDriverFromCreationDateAndTime,
    } = formData;

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: type === 'checkbox' ? checked : value,
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "licenseNumber") {
            if (value === "" || ALPHABATES_NUMERIC.test(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
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
            toast.error('Passwords do not match!');
            return;
        }
        console.log("Add driver data:", formData);
        dispatch(addDriver(companyId, formData, navigate));
    };

    // Get company address for home terminal
    useEffect(() => {
        dispatch(getCompanyInfo(companyId));
    }, [dispatch]);

    // Fetch issuing state
    useEffect(() => {
        if (companyId) {
            dispatch(getDriversIssuingState(companyId));
        }
    }, [companyId, dispatch]);

    // Fetch Vehicles from the vehicle list API
    useEffect(() => {
        if (companyId) {
            dispatch(getVehicles(companyId));
        }
    }, [companyId, dispatch]);

    useEffect(() => {
        if (success) {
            // navigate("/settings/drivers-list") already handled in action
        }
    }, [success, navigate]);

    return (
        <div className="AddDriver-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Personal Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant='primary' type="submit" form="add-user-form" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : <><i className="bi bi-plus-lg fs-16"></i> Add Driver</>}
                        </Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="add-user-form" onSubmit={handleSubmit}>
                        <section className="personal-info bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 gx-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="Username">
                                        <Form.Label>Username<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="userName"
                                            value={userName}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                            autoComplete='off'
                                            required
                                            pattern="^[A-Za-z0-9]{4,}$"
                                            title="Username must be at least 4 characters long and contain only letters and numbers."
                                        />
                                        <div className="text-muted mt-1">
                                            Username must be at least 4 characters long and contain only letters and numbers.
                                        </div>
                                    </Form.Group>
                                </Col>
                                {/* <Col sm={6}>
                                    <Form.Group controlId="FirstName">
                                        <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={firstName}
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
                                            value={lastName}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                            autoComplete='off'
                                            required
                                        />
                                    </Form.Group>
                                </Col> */}
                                <Col sm={6}>
                                    <Form.Group controlId="FirstName">
                                        <Form.Label>First Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={firstName}
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                            autoComplete='off'
                                            required
                                            pattern="^[A-Za-z]{2,30}$"
                                            title="First name must be between 2 and 30 letters only."
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="LastName">
                                        <Form.Label>Last Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={lastName}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                            autoComplete='off'
                                            required
                                            pattern="^[A-Za-z]{2,30}$"
                                            title="Last name must be between 2 and 30 letters only."
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="UserEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            autoComplete='off'
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="PhoneNumber">
                                        <Form.Label>Phone</Form.Label>
                                        <PhoneInput
                                            inputProps={{
                                                name: "phoneNumber",
                                                required: true,
                                                autoFocus: false,
                                            }}
                                            country={"in"}
                                            // value={phone}
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneChange}
                                            // enableSearch={true}
                                            countryCodeEditable={true}
                                            disableDropdown={true}
                                            inputClass="w-100 py-2"
                                            dropdownClass="text-start"
                                            inputStyle={{ height: "auto", minHeight: "44px" }}
                                            placeholder="Enter phone number"
                                            name="phoneNumber"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="Password">
                                        <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={passwordVisible ? "text" : "password"}
                                                name="password"
                                                value={password}
                                                placeholder="Enter password"
                                                minLength={6}
                                                maxLength={24}
                                                onChange={handleChange}
                                                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                                // title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                                pattern=".{6,}" // at least 6 characters
                                                title="Password must be at least 6 characters long."
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
                                    <Form.Group controlId="ConfirmPassword">
                                        <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={confirmPassVisible ? "text" : "password"}
                                                value={confirmPassword}
                                                name="confirmPassword"
                                                placeholder="Enter confirm password"
                                                minLength={6}
                                                maxLength={24}
                                                onChange={handleChange}
                                                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                                // title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                                pattern=".{6,}" // at least 6 characters
                                                title="Confirm password must be at least 6 characters long."
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
                                    <Form.Group controlId="licenseState">
                                        <Form.Label>Driving License Issuing State<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="licenseState"
                                            value={licenseState}
                                            onChange={handleChange}
                                            required
                                        >
                                            {/* <option value="" disabled>Select state</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Bihar">Bihar</option>
                                            <option value="Delhi">Delhi</option> */}
                                            <option value="">Select state</option>
                                            {issuingStateLoading && <option>Loading...</option>}
                                            {issuingState?.map((d) => (
                                                <option key={d.state} value={d.state}>
                                                    {d.state}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="licenseNumber">
                                        <Form.Label>Driver License Number<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="licenseNumber"
                                            value={licenseNumber}
                                            onChange={handleChange}
                                            placeholder="Enter license number"
                                            autoComplete='off'
                                            required
                                        />
                                        <div className="text-muted mt-1">
                                            Only letters, numbers, spaces, and underscores are allowed.
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>
                        <section className="carrier-section mb-4">
                            <div className="main-heading mb-3">Carrier Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group className="mb-3" controlId="HomeTerminal">
                                    <Form.Label>Home Terminal
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="homeTerminal"
                                        value={company?.address || formData.homeTerminal || "New York US"}
                                        onChange={handleChange}
                                        placeholder="Enter home terminal"
                                        autoComplete='off'
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                {/* <Form.Group className="mb-3" controlId="AssignVehicles">
                                    <Form.Label>Assign Vehicles</Form.Label>
                                    <Form.Select
                                        name="assignVehicles"
                                        value={formData.assignVehicles}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehiclesLoading && <option>Loading...</option>}
                                        {assignableVehicles?.map((v) => (
                                            <option key={v._id} value={v._id}>
                                                {v.vehicleNumber}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group> */}
                                <Form.Group className="mb-3" controlId="assignedVehicleId">
                                    <Form.Label>Assign Vehicles</Form.Label>
<Form.Select
  name="assignedVehicleId"
  value={formData.assignedVehicleId ?? ""}
  onChange={(e) => {
    const selectedId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      assignedVehicleId: selectedId === "" ? null : selectedId,
    }));
  }}
>
  <option value="">Select a vehicle</option>
  {vehiclesLoading && <option disabled>Loading...</option>}
  {vehicles?.map((v) => (
    <option key={v._id} value={v._id}>
      {v.vehicleNumber}
    </option>
  ))}
</Form.Select>


                                </Form.Group>

                            </div>
                        </section>
                     
                    </Form>
                </div>
            </div>
        </div>
    );
};
