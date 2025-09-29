import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCompanyInfo, updateCompanyById } from "../../../store/actions/companies";

export const EditCompanyInfo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    // const { companyId } = location.state || {};
    const { companyId } = useParams(); // company id from URL

    // Redux state
    const { company, loading } = useSelector((state) => state.companies);

    // Local state
    const [formData, setFormData] = useState({
        companyName: "",
        dotNumber: "",
        timeZoneId: "",
        address: "",
        complianceMode: "",
        hosRules: "",
        cargoType: "",
        restartHours: "",
        restBreak: "",
        allowShortHaul: false,
        allowSplitSleeper: false,
        allowPersonalConveyance: false,
        allowYardMove: false,
        allowManualDriver: false,
        restrictDriverFromCreationDate: false,
        terminals: [],
    });

    // Fetch company on mount
    useEffect(() => {
        dispatch(getCompanyInfo(companyId));
    }, [dispatch]);

    // Prefill form when company loads
    useEffect(() => {
        if (company) {
            setFormData({ ...formData, ...company });
        }
        // eslint-disable-next-line
    }, [company]);

    // Populate terminals from API
    useEffect(() => {
        if (company) {
            setFormData((prev) => ({
                ...prev,
                ...company,
                terminals: company.terminals || [],
            }));
        }
    }, [company]);

    // Handle terminal field changes
    const handleTerminalChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTerminals = [...formData.terminals];
        updatedTerminals[index][name] = value;
        setFormData((prev) => ({
            ...prev,
            terminals: updatedTerminals,
        }));
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCompanyById(companyId, formData, navigate));
    };

    return (
        <div className="EditCompanyInfo-page py-3">
            <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
                <div className="heading-wrapper d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div className="main-heading">General Settings</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button
                            variant="white"
                            className="bg-white border-gray"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            form="edit-company-form"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                <div className="form-wrapper">
                    <Form id="edit-company-form" onSubmit={handleSubmit}>
                        {/* General Settings */}
                        <section className="general-settings-section bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="companyName">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Enter company name"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="dotNumber">
                                        <Form.Label>Dot Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="dotNumber"
                                            value={formData.dotNumber}
                                            placeholder="Enter dot number"
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="timeZoneId">
                                        <Form.Label>Time Zone</Form.Label>
                                        <Form.Select
                                            name="timeZoneId"
                                            value={formData.timeZoneId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" hidden>
                                                Select Time zone
                                            </option>
                                            <option value="America/New_York">Eastern Standard Time</option>
                                            <option value="America/Chicago">Central Standard Time</option>
                                            <option value="America/Denver">Mountain Standard Time</option>
                                            <option value="America/Los_Angeles">Pacific Standard Time</option>
                                            {/* <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                                            <option value="America/Los_Angeles">America/Los_Angeles</option>
                                            <option value="Coordinated Universal Time">UTC</option>
                                            <option value="Greenwich Mean Time">GMT</option>
                                            <option value="India Standard Time">IST</option>
                                            <option value="Eastern Standard Time">EST</option>
                                            <option value="Eastern Daylight Time">EDT (USA)</option>
                                            <option value="Central Standard Time">CST</option>
                                            <option value="Central Daylight Time">CDT (USA)</option> */}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter address"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>

                        {/* Terminal Section */}
                        <section className="terminal-section mb-4">
                            {formData.terminals.length > 0 ? (
                                formData.terminals.map((terminal, index) => (
                                    <div
                                        key={terminal._id || index}
                                        className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4 mb-3"
                                    >
                                        <div className="main-heading mb-3">Terminal {index + 1}</div>
                                        {/* Time Zone */}
                                        <Form.Group className="mb-3" controlId={`terminalTimeZone-${index}`}>
                                            <Form.Label>Time Zone</Form.Label>
                                            <Form.Select
                                                name="timeZone"
                                                value={terminal.timeZoneId}
                                                onChange={(e) => handleTerminalChange(index, e)}
                                                required
                                            >
                                                <option value="" disabled>Select Time zone</option>
                                                <option value="America/New_York">Eastern Standard Time</option>
                                                <option value="America/Chicago">Central Standard Time</option>
                                                <option value="America/Denver">Mountain Standard Time</option>
                                                <option value="America/Los_Angeles">Pacific Standard Time</option>
                                                {/* <option value="Coordinated Universal Time">UTC</option>
                                                <option value="Greenwich Mean Time">GMT</option>
                                                <option value="India Standard Time">IST</option>
                                                <option value="Eastern Standard Time">EST</option>
                                                <option value="Eastern Daylight Time">EDT (USA)</option>
                                                <option value="Central Standard Time">CST</option>
                                                <option value="Central Daylight Time">CDT (USA)</option>
                                                <option value="America/Los_Angeles">America/Los_Angeles</option> */}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Address */}
                                        <Form.Group controlId={`terminalAddress-${index}`}>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                value={terminal.address}
                                                onChange={(e) => handleTerminalChange(index, e)}
                                                placeholder="Enter address"
                                                autoComplete="off"
                                                required
                                            />
                                        </Form.Group>
                                    </div>
                                ))
                            ) : (
                                // <p className="text-muted">No terminals found.</p>
                                <p className="text-muted"></p>
                            )}
                        </section>

                        {/* Compliance */}
                        <section className="compliance-settings-section mb-4">
                            <div className="main-heading mb-3">Compliance Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group controlId="ComplianceMode">
                                    <Form.Label>Compliance Mode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="complianceMode"
                                        value={formData.complianceMode || "ELD"}
                                        onChange={handleChange}
                                        placeholder="Enter compliance mode"
                                        //   required
                                        disabled
                                    />
                                </Form.Group>
                            </div>
                        </section>

                        {/* Log Settings */}
                        <section className="log-settings-section mb-4">
                            <div className="main-heading mb-3">Default Driver Log Settings</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group className="mb-3" controlId="HOSRules">
                                    <Form.Label>
                                        HOS Rules
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hosRules"
                                        value={formData.hosRules || "USA 70 Hour / 8 Day"} // will remove the default values later for all
                                        onChange={handleChange}
                                        placeholder="Enter HOS rules"
                                        autoComplete="off"
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="CargoType">
                                    <Form.Label>
                                        Cargo Type
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cargoType"
                                        value={formData.cargoType || "Property"}
                                        onChange={handleChange}
                                        placeholder="Enter cargo type"
                                        autoComplete="off"
                                        // required
                                        disabled
                                    />
                                    {/* <Form.Select
                                        name="cargoType"
                                        value={formData.cargoType}
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
                                <Form.Group className="mb-3" controlId="restartHours">
                                    <Form.Label>
                                        Restart
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restartHours"
                                        value={formData.restartHours || "34 Hour Restart"}
                                        onChange={handleChange}
                                        placeholder="Enter restart"
                                        autoComplete="off"
                                        // required
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="RestBreak">
                                    <Form.Label>
                                        Rest Break
                                        {/* <span className="text-danger">*</span> */}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="restBreak"
                                        value={formData.restBreak || "30 min Break"}
                                        onChange={handleChange}
                                        placeholder="Enter rest break"
                                        autoComplete="off"
                                        // required
                                        disabled
                                    />
                                </Form.Group>

                                {/* Checkboxes */}
                                <Form.Group>
                                    <div className="checks-wrapper">
                                        {/* <Form.Check
                                            type="checkbox"
                                            name="allowShortHaul"
                                            checked={formData.allowShortHaul}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Allow Short-Haul Exception
                                                </div>
                                            }
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name="allowSplitSleeper"
                                            checked={formData.allowSplitSleeper}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Allow Split-Sleeper Berth
                                                </div>
                                            }
                                        /> */}
                                        <Form.Check
                                            type="checkbox"
                                            name="allowPersonalConveyance"
                                            checked={formData.allowPersonalConveyance}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Allow Personal Conveyance
                                                </div>
                                            }
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name="allowYardMove"
                                            checked={formData.allowYardMove}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Allow Yard Move
                                                </div>
                                            }
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name="allowManualDriver"
                                            checked={formData.allowManualDriver}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Allow Manual Driver
                                                </div>
                                            }
                                        />
                                        {/* <Form.Check
                                            type="checkbox"
                                            name="restrictDriverFromCreationDate"
                                            checked={formData.restrictDriverFromCreationDate}
                                            onChange={handleChange}
                                            className="fs-16"
                                            label={
                                                <div className="fs-6 text-dark text-opacity-75">
                                                    Restrict Driver from Creation Date & Time
                                                </div>
                                            }
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
