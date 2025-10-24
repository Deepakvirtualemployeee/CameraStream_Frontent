import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { getDriverById, updateDriver, getCoDrivers, getDriversIssuingState, deleteDriver, deactivateDriver, activateDriver } from "../../../store/actions/drivers";
import { getAssignableVehicles } from "../../../store/actions/vehicles";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { ALPHABATES_NUMERIC } from "../../../constants";
import { getCompanyInfo } from "../../../store/actions/companies";

export const EditDriver = () => {
    const navigate = useNavigate();
    const { companyId, id } = useParams(); // driver id
    // const location = useLocation();
    // const { companyId } = location.state || {};
    const dispatch = useDispatch();

    //   const { driver, loading } = useSelector((state) => state.drivers);
    //   const { coDrivers, loading } = useSelector((state) => state.drivers);

    const { driver, loading: driverLoading } = useSelector((state) => state.drivers);
    const { coDrivers, loading: coDriversLoading } = useSelector((state) => state.drivers);
    const { issuingState, loading: issuingStateLoading } = useSelector((state) => state.drivers);
    const { assignableVehicles, loading: vehiclesLoading } = useSelector((state) => state.vehicles);
    const { company, loading, error } = useSelector((state) => state.companies);

    // console.log("Address:", company);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);
    const [showDelete, setShowDelete] = useState(false); // new
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showActivate, setShowActivate] = useState(false);
    const [vehicleOptions, setVehicleOptions] = useState([]); // merged vehicle options
    const [coDriverOptions, setCoDriverOptions] = useState([]); // merged co-driver options

    // Whenever driver or assignableVehicles change, merge them
    useEffect(() => {
        if (!driver) return;

        // Assigned vehicle from driver
        const assignedVehicle = driver.assignedVehicleId
            ? {
                _id: driver.assignedVehicleId._id,
                vehicleNumber: driver.assignedVehicleId.vehicleNumber,
            }
            : null;

        // Make sure assigned vehicle is in dropdown
        let merged = [...assignableVehicles];
        if (
            assignedVehicle &&
            !assignableVehicles.some((v) => v._id === assignedVehicle._id)
        ) {
            merged = [assignedVehicle, ...assignableVehicles];
        }

        setVehicleOptions(merged);
    }, [driver, assignableVehicles]);

    // Merge assigned co-driver with available co-drivers
    useEffect(() => {
        if (!driver) return;

        // Assigned co-driver from driver
        const assignedCoDriver = driver.coDriverId
            ? {
                _id: driver.coDriverId._id,
                firstName: driver.coDriverId.firstName,
                lastName: driver.coDriverId.lastName,
            }
            : null;

        let merged = [...coDrivers];
        if (
            assignedCoDriver &&
            !coDrivers.some((c) => c._id === assignedCoDriver._id)
        ) {
            merged = [assignedCoDriver, ...coDrivers];
        }

        setCoDriverOptions(merged);
    }, [driver, coDrivers]);

    // Get company address for home terminal
    useEffect(() => {
        dispatch(getCompanyInfo(companyId));
    }, [dispatch]);

    const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPassVisibility = () =>
        setConfirmPassVisible(!confirmPassVisible);

    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        companyId: companyId,
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        licenseState: "",
        licenseNumber: "",
        homeTerminal: "",
        // assignVehicles: "",
        assignedVehicleId: "",
        coDriverId: "",
        // assignCoDriver: "",
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

    // Fetch Assignable Vehicles
    useEffect(() => {
        if (companyId && id) {
            dispatch(getAssignableVehicles(companyId));
        }
    }, [companyId, id, dispatch]);

    // Fetch driver by ID on mount
    useEffect(() => {
        if (id) {
            dispatch(getDriverById(companyId, id));
        }
    }, [id, dispatch]);

    // Fetch Co-drivers
    useEffect(() => {
        if (companyId && id) {
            dispatch(getCoDrivers(companyId, id));
        }
    }, [companyId, id, dispatch]);

    // Fetch issuing state
    useEffect(() => {
        if (companyId && id) {
            dispatch(getDriversIssuingState(companyId));
        }
    }, [companyId, id, dispatch]);

    // Populate formData once driver is fetched
    useEffect(() => {
        if (driver) {
            setFormData({
                username: driver.userName || "",
                firstName: driver.firstName || "",
                lastName: driver.lastName || "",
                email: driver.email || "",
                phoneNumber: driver.phoneNumber || "",
                password: "",
                confirmPassword: "",
                licenseState: driver.licenseState || "",
                licenseNumber: driver.licenseNumber || "",
                homeTerminal: driver.homeTerminal || "",
                // assignVehicles: driver.assignedVehicleId?.vehicleNumber || "",
                // assignCoDriver: driver.coDriverId?.firstName || "",
                // assignCoDriver: driver.coDriverId
                //     ? [driver.coDriverId.firstName, driver.coDriverId.lastName].filter(Boolean).join(" ")
                //     : "",
                assignedVehicleId: driver.assignedVehicleId?._id || "",
                // assignedVehicleId: driver.assignedVehicleId?._id || "",
                assignVehicles: driver.assignedVehicleId?.vehicleNumber || "",
                // assignVehicles: driver.assignedVehicleId?.vehicleNumber || "",
                coDriverId: driver.coDriverId?._id || "",
                // assignCoDriver: driver.coDriverId
                //     ? `${driver.coDriverId.firstName} ${driver.coDriverId.lastName}`
                //     : "",
                hosRules: driver.hosRules || "",
                cargoType: driver.cargoType || "",
                restart: driver.restart || "",
                restBreak: driver.restBreak || "",
                shortHaulException: driver.allowShortHaulException || false,
                splitSleeperBerth: driver.allowSplitSleeperBerth || false,
                personalConveyance: driver.allowPersonalConveyance || false,
                yardMove: driver.allowYardMove || false,
                manualDriver: driver.allowManualDriver || false,
                restrictDriverFromCreation: driver.restrictDriverFromCreationDateAndTime || false,
                companyId: companyId
            });
        }
    }, [driver, companyId]);

    useEffect(() => {
        // console.log("Fetched driver in redux:", driver);
        console.log("Fetched codriver in redux:", coDrivers);

    }, [driver]);

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: type === "checkbox" ? checked : value,
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Validate license number: only letters, numbers, space and underscore
        if (name === "licenseNumber") {
            if (value === "" || ALPHABATES_NUMERIC.test(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
            return;
        }

        // Normal handling for other fields (including checkboxes)
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Delete driver
    const confirmDelete = () => {
        if (!id) return;
        dispatch(deleteDriver(companyId, id, navigate)); // delete + navigate handled in action
        setShowDelete(false);
    };

    const confirmDeactivate = () => {
        if (!id) return;
        dispatch(deactivateDriver(companyId, id, navigate));
        setShowDeactivate(false);
    };

    // Activate driver
    const confirmActivate = () => {
        if (!id) return;
        dispatch(activateDriver(companyId, id, navigate));
        setShowActivate(false);
    };

    const handlePhoneChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            phoneNumber: value,
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (formData.password !== formData.confirmPassword) {
    //         alert("Passwords do not match!");
    //         return;
    //     }

    //     dispatch(updateDriver(companyId, id, formData, navigate));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If user entered a password, check confirm password
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
        } else {
            // If left blank, don't send password fields
            delete formData.password;
            delete formData.confirmPassword;
        }

        // Prevent empty string for coDriverId and vehicleId
        // const payload = {
        //     ...formData,
        //     coDriverId: formData.coDriverId ? formData.coDriverId : null,
        //     vehicleId: formData.vehicleId ? formData.vehicleId : null,
        // };
        // Explicitly replace "" with null
        const payload = {
            ...formData,
            coDriverId: formData.coDriverId && formData.coDriverId !== "" ? formData.coDriverId : null,
            assignedVehicleId: formData.assignedVehicleId && formData.assignedVehicleId !== "" ? formData.assignedVehicleId : null,
        };

        console.log("Final Payload:", payload); // Debug log
        // dispatch(updateDriver(companyId, id, formData, navigate));
        dispatch(updateDriver(companyId, id, payload, navigate));

    };


    if (driverLoading) {
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
                        {/* <Button variant="outline-danger">Deactivate</Button> */}
                        {/* <Button
                            variant="outline-danger"
                            onClick={() => setShowDeactivate(true)} // open deactivate modal
                        >
                            Deactivate
                        </Button> */}
                        {driver?.isActive === true ? (
                            <Button
                                variant="outline-danger"
                                onClick={() => setShowDeactivate(true)}
                            >
                                Deactivate
                            </Button>
                        ) : (
                            <Button
                                variant="outline-success"
                                onClick={() => setShowActivate(true)}
                            >
                                Activate
                            </Button>
                        )}
                        <Button
                            variant="danger"
                            onClick={() => setShowDelete(true)} // delete button
                        >
                            Delete Driver
                        </Button>
                        <Button variant="primary" type="submit" form="edit-user-form">
                            Update Driver
                        </Button>
                    </div>
                </div>
                <ConfirmModal
                    show={showDelete}
                    handleClose={() => setShowDelete(false)}
                    onConfirm={confirmDelete}
                    title="Are you sure you want to permanently delete this driver?"
                    confirmText="Delete"
                    confirmVariant="danger"
                    iconClass="bi-trash"
                />

                <ConfirmModal
                    show={showDeactivate}
                    handleClose={() => setShowDeactivate(false)}
                    onConfirm={confirmDeactivate}
                    title="Are you sure you want to deactivate this driver?"
                    confirmText="Deactivate"
                    confirmVariant="outline-danger"
                    iconClass="bi-slash-circle"
                />
                <ConfirmModal
                    show={showActivate}
                    handleClose={() => setShowActivate(false)}
                    onConfirm={confirmActivate}
                    title="Are you sure you want to activate this driver?"
                    confirmText="Activate"
                    confirmVariant="success"
                    iconClass="bi-check-circle"
                />


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
                                            pattern="^[A-Za-z0-9]{4,}$"
                                            title="Username must be at least 4 characters long and contain only letters and numbers."
                                        />
                                        <div className="text-muted mt-1">
                                            Username must be at least 4 characters long and contain only letters and numbers.
                                        </div>
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
                                            countryCodeEditable={true}
                                            inputClass="w-100 py-2"
                                            dropdownClass="text-start"
                                            disableDropdown={true}
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
                                                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                                // title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                                pattern=".{6,}" // at least 6 characters
                                                title="Password must be at least 6 characters long."
                                                autoComplete="new-password"
                                            // required
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
                                                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                                // title="Must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
                                                pattern=".{6,}" // at least 6 characters
                                                title="Password must be at least 6 characters long."
                                                autoComplete="new-password"
                                            // required
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
                                            value={formData.licenseState}
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
                                {/* Working */}
                                {/* <Form.Group className="mb-3" controlId="AssignVehicles">
                                    <Form.Label>Assign Vehicles</Form.Label>
                                    <Form.Select
                                        name="assignedVehicleId"
                                        value={formData.assignedVehicleId}   // <-- bind to vehicleId, not vehicle number
                                        onChange={(e) => {
                                            const selectedVehicle = assignableVehicles.find(v => v._id === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                assignedVehicleId: e.target.value,                 // actual ID
                                                // assignVehicles: selectedVehicle?.vehicleNumber || "" // for display if you need it
                                            }));
                                        }}
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

                                {/* <Form.Group className="mb-3" controlId="AssignVehicles">
                                    <Form.Label>Assign Vehicles</Form.Label>
                                    <Form.Select
                                        name="assignedVehicleId"
                                        value={formData.assignedVehicleId}   // selected vehicle ID
                                        onChange={(e) => {
                                            const selectedVehicle = assignableVehicles.find(v => v._id === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                assignedVehicleId: e.target.value || "",               // backend expects ID
                                                assignVehicles: selectedVehicle?.vehicleNumber || ""   // store vehicle number for UI/display
                                            }));
                                        }}
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

                                <Form.Group className="mb-3" controlId="AssignVehicles">
                                    <Form.Label>Assign Vehicles</Form.Label>
                                    <Form.Select
                                        name="assignedVehicleId"
                                        value={formData.assignedVehicleId}   // <-- selected by ID
                                        onChange={(e) => {
                                            const selectedVehicle = vehicleOptions.find(v => v._id === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                assignedVehicleId: e.target.value || "",
                                                assignVehicles: selectedVehicle?.vehicleNumber || ""
                                            }));
                                        }}
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehiclesLoading && <option>Loading...</option>}
                                        {vehicleOptions?.map((v) => (
                                            <option key={v._id} value={v._id}>
                                                {v.vehicleNumber}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* <Form.Group controlId="AssignCoDriver">
                                    <Form.Label>Assign Co-Driver</Form.Label>
                                    <Form.Select name="assignCoDriver" value={formData.assignCoDriver} onChange={handleChange}
                                    >
                                        <option value="">Select Co-Driver</option>
                                        {coDriversLoading && <option>Loading...</option>}
                                        {coDrivers?.map((d) => (
                                            <option key={d._id} value={d._id}>
                                                {d.firstName} {d.lastName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group> */}
                                {/* <Form.Group controlId="AssignCoDriver">
                                    <Form.Label>Assign Co-Driver</Form.Label>
                                    <Form.Select
                                        name="coDriverId"
                                        value={formData.coDriverId}
                                        onChange={(e) => {
                                            const selectedCoDriver = coDrivers.find(d => d._id === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                coDriverId: e.target.value,  // actual ID
                                                // assignCoDriver: selectedCoDriver ? `${selectedCoDriver.firstName} ${selectedCoDriver.lastName}` : ""
                                            }));
                                        }}
                                    >
                                        <option value="">Select Co-Driver</option>
                                        {coDriversLoading && <option>Loading...</option>}
                                        {coDrivers?.map((d) => (
                                            <option key={d._id} value={d._id}>
                                                {d.firstName} {d.lastName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group> */}
                                <Form.Group controlId="AssignCoDriver">
                                    <Form.Label>Assign Co-Driver</Form.Label>
                                    <Form.Select
                                        name="coDriverId"
                                        value={formData.coDriverId}
                                        onChange={(e) => {
                                            const selectedCoDriver = coDriverOptions.find(
                                                (d) => d._id === e.target.value
                                            );
                                            setFormData((prev) => ({
                                                ...prev,
                                                coDriverId: e.target.value || "",
                                                // Optional: store name if needed for UI
                                                assignCoDriver: selectedCoDriver
                                                    ? `${selectedCoDriver.firstName} ${selectedCoDriver.lastName}`
                                                    : "",
                                            }));
                                        }}
                                    >
                                        <option value="">Select Co-Driver</option>
                                        {coDriversLoading && <option>Loading...</option>}
                                        {coDriverOptions?.map((d) => (
                                            <option key={d._id} value={d._id}>
                                                {d.firstName} {d.lastName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </section>

                        <section className="log-section">
                            <div className="main-heading mb-3">Log Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group className="mb-3" controlId="HOSRules">
                                    <Form.Label>HOS Rules
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hosRules"
                                        // value={formData.hosRules || "USA 70 Hour / 8 Day"}
                                        value={"USA 70 Hour / 8 Day"}
                                        onChange={handleChange}
                                        placeholder="Enter HOS rules"
                                        autoComplete='off'
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="CargoType">
                                    <Form.Label>Cargo Type
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cargoType"
                                        // value={formData.cargoType || "Property"}
                                        value={"Property"}
                                        onChange={handleChange}
                                        placeholder="Enter cargo type"
                                        autoComplete='off'
                                        // required
                                        disabled
                                    />
                                    {/* <Form.Select
                                        name="cargoType"
                                        value={formData.cargoType || "Property"}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Cargo Type
                                        </option>
                                        <option value="PROPERTY">PROPERTY</option>
                                        <option value="PASSENGER">PASSENGER</option>
                                    </Form.Select> */}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="Restart">
                                    <Form.Label>Restart
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restart"
                                        // value={formData.restart || "34 Hour Restart"}
                                        value={"34 Hour Restart"}
                                        onChange={handleChange}
                                        placeholder="Enter restart"
                                        autoComplete='off'
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="RestBreak">
                                    <Form.Label>Rest Break
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restBreak"
                                        // value={formData.restBreak || "30 min Break"}
                                        value={"30 min Break"}
                                        onChange={handleChange}
                                        placeholder="Enter rest break"
                                        autoComplete='off'
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <div className="checks-wrapper">
                                        {/* <Form.Check type="checkbox" name="shortHaulException" checked={formData.shortHaulException} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Short-Haul Exception</div>}
                                            required
                                        />
                                        <Form.Check type="checkbox" name="splitSleeperBerth" checked={formData.splitSleeperBerth} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Split-Sleeper Berth</div>}
                                        /> */}
                                        <Form.Check type="checkbox" name="personalConveyance" checked={formData.personalConveyance} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Personal Conveyance</div>}
                                        />
                                        <Form.Check type="checkbox" name="yardMove" checked={formData.yardMove} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Yard Move</div>}
                                        />
                                        <Form.Check type="checkbox" name="manualDriver" checked={formData.manualDriver} onChange={handleChange}
                                            className="fs-16 mb-1" label={<div className="fs-6 text-dark text-opacity-75">Allow Manual Driver</div>}
                                        />
                                        {/* <Form.Check type="checkbox" name="restrictDriverFromCreation" checked={formData.restrictDriverFromCreation} onChange={handleChange}
                                            className="fs-16" label={<div className="fs-6 text-dark text-opacity-75">Restrict Driver from Creation Date & Time</div>}
                                        /> */}
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
