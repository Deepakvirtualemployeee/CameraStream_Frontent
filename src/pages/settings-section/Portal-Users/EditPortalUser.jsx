import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getPortalUserById, updatePortalUser, deactivatePortalUser, activatePortalUser, deletePortalUser } from "../../../store/actions/portalUsers";
import { ConfirmModal } from "../../../components/common/ConfirmModal";

export const EditPortalUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companyId, id } = useParams(); // userId from URL
    // const location = useLocation();
    // const { companyId } = location.state || {}; // reading state

    const { portalUser, loading } = useSelector((state) => state.portalUsers);

    console.log("Edit user:", portalUser);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);

    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showActivate, setShowActivate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const togglePassVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPassVisibility = () => setConfirmPassVisible(!confirmPassVisible);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    // Fetch user details
    useEffect(() => {
        dispatch(getPortalUserById(companyId, id));
    }, [dispatch, id]);

    // Pre-fill when user data is loaded
    useEffect(() => {
        if (portalUser) {
            setFormData((prev) => ({
                ...prev,
                firstName: portalUser.firstName || "",
                lastName: portalUser.lastName || "",
                email: portalUser.email || "",
                phoneNumber: portalUser.phoneNumber || "",
                role: portalUser.role || "",
                password: "",
                confirmPassword: "",
            }));
        }
    }, [portalUser]);

    const { firstName, lastName, email, phoneNumber, password, confirmPassword, role } = formData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Deactivate user
    const confirmDeactivate = () => {
        if (!id) return;
        dispatch(deactivatePortalUser(companyId, id, navigate));
        setShowDeactivate(false);
    };

    // Activate user
    const confirmActivate = () => {
        if (!id) return;
        dispatch(activatePortalUser(companyId, id, navigate));
        setShowActivate(false);
    };

    // Delete user
    const confirmDelete = () => {
        if (!id) return;
        dispatch(deletePortalUser(companyId, id, navigate)); // delete + navigate handled in action
        setShowDelete(false);
    };

    const handlePhoneChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            phoneNumber: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const payload = {
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            companyId: companyId,
            ...(password ? { password } : {}), // only send if provided
        };

        dispatch(updatePortalUser(companyId, id, payload, navigate));
    };

    return (
        <div className="EditPortalUser-page py-3">
            <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">User Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        {/* <Button variant="outline-danger">Deactivate</Button> */}
                        {portalUser?.isActive === true ? (
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
                            Delete User
                        </Button>
                        <Button variant="primary" type="submit" form="edit-user-form" disabled={loading}>
                            <i className="bi bi-plus-lg fs-16"></i> Edit User
                        </Button>
                    </div>
                </div>

                {/* Confirm Modals */}
                <ConfirmModal
                    show={showDeactivate}
                    handleClose={() => setShowDeactivate(false)}
                    onConfirm={confirmDeactivate}
                    title="Are you sure you want to deactivate this user?"
                    confirmText="Deactivate"
                    confirmVariant="danger"
                    iconClass="bi-exclamation-triangle"
                />

                <ConfirmModal
                    show={showActivate}
                    handleClose={() => setShowActivate(false)}
                    onConfirm={confirmActivate}
                    title="Are you sure you want to activate this user?"
                    confirmText="Activate"
                    confirmVariant="success"
                    iconClass="bi-check-circle"
                />

                <ConfirmModal
                    show={showDelete}
                    handleClose={() => setShowDelete(false)}
                    onConfirm={confirmDelete}
                    title="Are you sure you want to permanently delete this user?"
                    confirmText="Delete"
                    confirmVariant="danger"
                    iconClass="bi-trash"
                />

                <div className="form-wrapper">
                    <Form id="edit-user-form" onSubmit={handleSubmit}>
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
                                            enableSearch
                                            countryCodeEditable={true}
                                            inputClass="w-100 py-2"
                                            dropdownClass="text-start"
                                            disableDropdown={true}
                                            inputStyle={{ height: "auto", minHeight: "44px", width: "100%" }}
                                            placeholder="Enter phone number"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Password */}
                                <Col sm={6}>
                                    <Form.Group controlId="Password">
                                        <Form.Label>Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={passwordVisible ? "text" : "password"}
                                                name="password"
                                                value={password}
                                                placeholder="Enter password (leave blank to keep old)"
                                                minLength={6}
                                                maxLength={24}
                                                onChange={handleChange}
                                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,24}$"
                                                title="Must be 6–24 characters, include uppercase, lowercase, number, and special character."
                                                autoComplete="new-password"
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
                                        <Form.Label>Confirm Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={confirmPassVisible ? "text" : "password"}
                                                value={confirmPassword}
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                minLength={6}
                                                maxLength={24}
                                                onChange={handleChange}
                                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,24}$"
                                                autoComplete="new-password"
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
                                        <div className="text-black text-opacity-75 fw-medium mb-1">Passwords must contain at least:</div>
                                        <div className="fs-6 text-dark text-opacity-75"><i className="bi bi-x-circle fs-6 text-danger"></i> 6 characters, max 24 characters</div>
                                    </div>
                                </Col>

                                {/* Role */}
                                <Col xs={12}>
                                    <Form.Group controlId="role">
                                        <Form.Label>
                                            Role<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select name="role" value={role} onChange={handleChange} required>
                                            <option value="" disabled>
                                                Select role
                                            </option>
                                            <option value="company administrator">
                                                Company Administrator
                                            </option>
                                             
                                            <option value="Broker">
                                            Broker
                                            </option>
                                            <option value="Fleet Manager">
                                            Fleet Manager
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
