import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getCameraDeviceById,
    updateCameraDevice,
    deleteCameraDevice,
    deactivateCameraDevice,
    activateCameraDevice,
} from "../../../store/actions/cameraDevices";
import { getVehicles } from "../../../store/actions/vehicles";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { VALIDATE_MAC_ADDRESS, SERIAL_NUMBER_REGEX } from "../../../constants";
import { toast } from "react-toastify";
import { ROLES } from '../../../constants';

const getAssignedVehicle = (deviceData = {}) => {
    const device = deviceData || {};
    const assignedVehicle =
        device.vehicleId ||
        device.vehcileId ||
        device.vehicleID ||
        device.assignedVehicleId ||
        device.vehicle;

    if (assignedVehicle && typeof assignedVehicle === "object") {
        return assignedVehicle;
    }

    return assignedVehicle
        ? {
            _id: assignedVehicle,
            vehicleNumber: device.vehicleNumber || "Assigned Vehicle",
        }
        : null;
};

export const EditCameraDevice = () => {
    const { companyId, id } = useParams(); // camera device id from URL
    const navigate = useNavigate();
    // const location = useLocation();
    // const { companyId } = location.state || {};
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.auth);
    const userRole = userDetails?.role;

    const { cameraDevice, loading } = useSelector((state) => state.cameraDevices);
    const { vehicles = [], loading: vehiclesLoading } = useSelector((state) => state.vehicles || {});
    const [vehicleOptions, setVehicleOptions] = useState([]); // merged vehicles for camera device

    const [formData, setFormData] = useState({
        deviceId: "",
        deviceName: "",
        deviceType: "ME41-04",
        audioVideoChannelQty: "4",
        channelNames: [
            { enabled: true, name: "" },
            { enabled: true, name: "" },
            { enabled: true, name: "" },
            { enabled: true, name: "" },
        ],
        serialNumber: "",
        mac: ["", "", "", "", "", ""],
        eldModel: "",
        vehicle: "",
        firmwareVersion: "",
        fleetId: "",
        nodeGuid: "",
        ioName: "",
        chassisNo: "",
    });

    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showActivate, setShowActivate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const firmwareOptions = ["v1.0.0", "v1.0.1", "v2.2.5", "v3.0.0"];

    // Fetch device + vehicles
    useEffect(() => {
        if (id && companyId) {
            dispatch(getCameraDeviceById(companyId, id));
            dispatch(getVehicles(companyId));
        }
    }, [dispatch, id, companyId]);

    // Prefill form
    useEffect(() => {
        if (cameraDevice) {
            const assignedVehicle = getAssignedVehicle(cameraDevice);

            setFormData({
                deviceId: cameraDevice.deviceId || "",
                deviceName: cameraDevice.deviceName || "",
                deviceType: cameraDevice.deviceType || "ME41-04",
                audioVideoChannelQty: String(cameraDevice.audioVideoChannelQty || 4),
                channelNames:
                    (cameraDevice.channels || cameraDevice.channelNames)?.length
                        ? (cameraDevice.channels || cameraDevice.channelNames).map((channel, index) => ({
                            key: channel.key || `CH${index + 1}`,
                            enabled: channel.enabled ?? true,
                            name: channel.name || "",
                        }))
                        : [
                            { enabled: true, name: "" },
                            { enabled: true, name: "" },
                            { enabled: true, name: "" },
                            { enabled: true, name: "" },
                        ],
                serialNumber: cameraDevice.serialNumber || "",
                mac: cameraDevice.macAddress ? cameraDevice.macAddress.split(":") : ["", "", "", "", "", ""],
                eldModel: cameraDevice.eldModel || "",
                vehicle: assignedVehicle?._id || "",   // extract ID from object
                firmwareVersion: cameraDevice.firmwareVersion || "",
                fleetId: cameraDevice.fleetId || "",
                nodeGuid: cameraDevice.nodeGuid || "0",
                ioName: cameraDevice.ioName || "",
                chassisNo: cameraDevice.chassisNo || cameraDevice.vinNumber || "",
            });
        }
    }, [cameraDevice]);

    // Keep the currently assigned vehicle visible while also allowing selection from the full vehicle list.
    useEffect(() => {
        const assignedVehicle = getAssignedVehicle(cameraDevice);
        const mergedVehicles = [...vehicles];

        if (
            assignedVehicle?._id &&
            !mergedVehicles.some((vehicle) => vehicle._id === assignedVehicle._id)
        ) {
            mergedVehicles.unshift({
                _id: assignedVehicle._id,
                vehicleNumber: assignedVehicle.vehicleNumber || "Assigned Vehicle",
            });
        }

        setVehicleOptions(mergedVehicles);
    }, [cameraDevice, vehicles]);


    console.log("cameraDevice:", cameraDevice);
    console.log("vehicleOptions:", vehicleOptions);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "audioVideoChannelQty") {
            const qty = Number(value);
            setFormData((prev) => {
                const nextChannels = Array.from({ length: qty }, (_, index) => ({
                    enabled: prev.channelNames[index]?.enabled ?? true,
                    name: prev.channelNames[index]?.name ?? "",
                }));
                return {
                    ...prev,
                    [name]: value,
                    channelNames: nextChannels,
                };
            });
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChannelToggle = (index) => {
        setFormData((prev) => ({
            ...prev,
            channelNames: prev.channelNames.map((channel, channelIndex) =>
                channelIndex === index
                    ? { ...channel, enabled: !channel.enabled }
                    : channel
            ),
        }));
    };

    const handleChannelNameChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            channelNames: prev.channelNames.map((channel, channelIndex) =>
                channelIndex === index ? { ...channel, name: value } : channel
            ),
        }));
    };

    // Handle MAC Address
    const handleMacChange = (e, index) => {
        const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");
        if (value.length <= 2) {
            const newMac = [...formData.mac];
            newMac[index] = value;
            setFormData((prev) => ({ ...prev, mac: newMac }));
        }
    };
    const handleMacFocus = (e, index) => {
        if (e.target.value.length === 2 && index < 5) {
            const nextInput = document.getElementById(`mac-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    const handleMacKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            const prevInput = document.getElementById(`mac-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                setFormData((prev) => {
                    const newMac = [...prev.mac];
                    newMac[index - 1] = "";
                    return { ...prev, mac: newMac };
                });
            }
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const macAddress = formData.mac.join(":");
    //     const finalData = {
    //         serialNumber: formData.serialNumber,
    //         macAddress,
    //         eldModel: formData.eldModel,
    //         vehicle: formData.vehicle,
    //         assignedVehicleId: formData.vehicle || null,  // vehicle _id
    //         firmwareVersion: formData.firmwareVersion,
    //         companyId: companyId,
    //     };
    //     dispatch(updateEldDevice(companyId, id, finalData, navigate));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        const macAddress = formData.mac.join(":");

       
        const finalData = {
            deviceName: formData.deviceName,
            deviceType: formData.deviceType,
            audioVideoChannelQty: Number(formData.audioVideoChannelQty),
            channelNames: formData.channelNames,
            channels: formData.channelNames,
            channelName: formData.channelNames.find((channel) => channel.enabled)?.name || "",
            serialNumber: formData.serialNumber,
            macAddress,
            eldModel: formData.eldModel,
            vehicle: formData.vehicle,
            vehicleId: formData.vehicle,
            firmwareVersion: formData.firmwareVersion,
            fleetId: formData.fleetId,
            nodeGuid: formData.nodeGuid,
            ioName: formData.ioName,
            chassisNo: formData.chassisNo,
            companyId: companyId,
        };

        dispatch(updateCameraDevice(companyId, id, finalData, navigate));
    };

    const confirmDelete = () => {
        dispatch(deleteCameraDevice(companyId, id, navigate));
        setShowDelete(false);
    };

    const confirmDeactivate = () => {
        const deviceId = cameraDevice?.deviceId || formData.deviceId;
        dispatch(deactivateCameraDevice(companyId, deviceId, navigate));
        setShowDeactivate(false);
    };

    const confirmActivate = () => {
        const deviceId = cameraDevice?.deviceId || formData.deviceId;
        dispatch(activateCameraDevice(companyId, deviceId, navigate));
        setShowActivate(false);
    };

    if (loading) return <div className="p-3">Loading...</div>;

    return (
        <div className="EditCameraDevice-page py-3">
            <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Edit Camera Device Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        {cameraDevice?.status === "Active" ? (
                            <Button
                                variant="outline-danger"
                                onClick={() => setShowDeactivate(true)}
                                disabled={!formData.deviceId}
                            >
                                Deactivate
                            </Button>
                        ) : (
                            <Button
                                variant="outline-success"
                                onClick={() => setShowActivate(true)}
                                disabled={!formData.deviceId}
                            >
                                Activate
                            </Button>
                        )}
                        {userRole !== ROLES.Company_Safety_Personal && (
                        <Button variant="danger" onClick={() => setShowDelete(true)}>
                            Delete Device
                        </Button>
                        )}
                        <Button variant="primary" type="submit" form="edit-device-form">
                            Save Changes
                        </Button>
                    </div>
                </div>

                <ConfirmModal
                    show={showDelete}
                    handleClose={() => setShowDelete(false)}
                    onConfirm={confirmDelete}
                    title="Are you sure you want to permanently delete this camera device?"
                    confirmText="Delete"
                    confirmVariant="danger"
                    iconClass="bi-trash"
                />
                <ConfirmModal
                    show={showDeactivate}
                    handleClose={() => setShowDeactivate(false)}
                    onConfirm={confirmDeactivate}
                    title="Are you sure you want to deactivate this camera device?"
                    confirmText="Deactivate"
                    confirmVariant="danger"
                    iconClass="bi-exclamation-triangle"
                />
                <ConfirmModal
                    show={showActivate}
                    handleClose={() => setShowActivate(false)}
                    onConfirm={confirmActivate}
                    title="Are you sure you want to activate this camera device?"
                    confirmText="Activate"
                    confirmVariant="success"
                    iconClass="bi-check-circle"
                />

                <div className="form-wrapper">
                    <Form id="edit-device-form" onSubmit={handleSubmit}>
                        <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="deviceId">
                                        <Form.Label>
                                            Device ID<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="deviceId"
                                            value={formData.deviceId}
                                            onChange={handleChange}
                                            placeholder="Enter device ID"
                                            autoComplete="off"
                                            disabled
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="deviceName">
                                        <Form.Label>
                                            Device Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="deviceName"
                                            value={formData.deviceName}
                                            onChange={handleChange}
                                            placeholder="Enter device name"
                                            autoComplete="off"
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="deviceType">
                                        <Form.Label>
                                            Device Type<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="deviceType"
                                            value={formData.deviceType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="ME41-04">ME41-04</option>
                                            <option value="ME41-08">ME41-08</option>
                                            <option value="ME41-16">ME41-16</option>
                                            <option value="MC30-01">MC30-01</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="audioVideoChannelQty">
                                        <Form.Label>
                                            Audio-Video Channel Qty.<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="audioVideoChannelQty"
                                            value={formData.audioVideoChannelQty}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="4">4</option>
                                            <option value="8">8</option>
                                            <option value="16">16</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="channelNames">
                                        <Form.Label>
                                            Channel Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Row className="g-3">
                                            {formData.channelNames.map((channel, index) => (
                                                <Col md={6} xl={3} key={`channel-${index}`}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`edit-channel-enabled-${index}`}
                                                            checked={channel.enabled}
                                                            onChange={() => handleChannelToggle(index)}
                                                            label={`CH${index + 1}`}
                                                        />
                                                        <Form.Control
                                                            type="text"
                                                            value={channel.name}
                                                            onChange={(e) => handleChannelNameChange(index, e.target.value)}
                                                            placeholder={`Channel ${index + 1} name`}
                                                            disabled={!channel.enabled}
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Form.Group>
                                </Col>

                                {/* <Col xs={12}>
                                    <Form.Group controlId="serialNumber">
                                        <Form.Label>
                                            Camera Device SN (Serial Number)<span className="text-danger">*</span>
                                        </Form.Label> */}
                                        {/* <Form.Control
                                            type="text"
                                            name="serialNumber"
                                            value={formData.serialNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Serial Number"
                                            autoComplete="off"
                                            required
                                        /> */}
                                        {/* <Form.Control
                                            type="text"
                                            name="serialNumber"
                                            value={formData.serialNumber}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // Allow only alphanumeric characters
                                                value = value.replace(/[^A-Za-z0-9]/g, "");

                                                // Limit to 12 characters
                                                if (value.length <= 12) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        serialNumber: value,
                                                    }));
                                                }
                                            }}
                                            placeholder="Enter Serial Number"
                                            autoComplete="off"
                                            required
                                        />
                                        <div className="text-muted mt-1">
                                            Serial Number must be alphanumeric and less than 12 characters.
                                        </div>
                                        <div className="text-muted mt-1">
                                            Please make sure the camera serial number was entered correctly. Once created it cannot be changed.
                                        </div>
                                    </Form.Group>
                                </Col> */}

                                {/* <Col xs={12}>
                                    <Form.Group controlId="macAddress">
                                        <Form.Label>
                                            Camera MAC Address<span className="text-danger">*</span>
                                        </Form.Label>
                                        <div className="d-flex align-items-center form-control">
                                            {formData.mac.map((value, i) => (
                                                <React.Fragment key={i}>
                                                    <input
                                                        id={`mac-${i}`}
                                                        type="text"
                                                        maxLength={2}
                                                        className="form-control text-center border-0 shadow-none p-0"
                                                        placeholder="__"
                                                        style={{ width: "20px", minHeight: "auto" }}
                                                        value={value}
                                                        onChange={(e) => handleMacChange(e, i)}
                                                        onKeyUp={(e) => handleMacFocus(e, i)}
                                                        onKeyDown={(e) => handleMacKeyDown(e, i)}
                                                        onFocus={(e) => e.target.select()}
                                                        required
                                                    />
                                                    {i < formData.mac.length - 1 && <span className="fw-bold">:</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col> */}

                                {/* <Col xs={12}>
                                    <Form.Group controlId="eldModel">
                                        <Form.Label>
                                            Camera Model<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select name="eldModel" value={formData.eldModel} onChange={handleChange} required>
                                            <option value="" hidden>
                                                Select Camera Model
                                            </option>
                                            <option value="PT30">PT30</option> */}
                                            {/* <option value="PT30U">PT30U</option> */}
                                        {/* </Form.Select>
                                    </Form.Group>
                                </Col> */}

                                <Col xs={12}>
                                    <Form.Group controlId="vehicle">
                                        <Form.Label>
                                            Assign Vehicle<span className="text-danger"></span>
                                        </Form.Label>
                                        <Form.Select
                                            name="vehicle"
                                            value={formData.vehicle}
                                            onChange={(e) => {
                                                const selectedVehicle = vehicleOptions.find(
                                                    (v) => v._id === e.target.value
                                                );
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    vehicle: e.target.value || "",
                                                    vehicleNumber: selectedVehicle?.vehicleNumber || "",
                                                }));
                                            }}
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicleOptions?.map((v) => (
                                                <option key={v._id} value={v._id}>
                                                    {v.vehicleNumber}
                                                </option>
                                            ))}
                                            {vehiclesLoading && <option disabled>Loading vehicles...</option>}
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
