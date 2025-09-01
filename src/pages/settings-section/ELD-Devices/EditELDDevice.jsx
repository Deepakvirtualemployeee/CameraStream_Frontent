import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getEldDeviceById,
    updateEldDevice,
    deactivateEld,
    deleteEld,
    unassignVehicleFromEld,
} from "../../../store/actions/eldDevices";
import { getAssignableVehicles } from "../../../store/actions/vehicles";
import { ConfirmModal } from "../../../components/common/ConfirmModal";

export const EditELDDevice = () => {
    const { id } = useParams(); // eld id from URL
    const navigate = useNavigate();
    const location = useLocation();
    const { companyId } = location.state || {};
    const dispatch = useDispatch();

    const { eldDevice, loading } = useSelector((state) => state.eldDevices);
    const { unassignedVehicles, loadings } = useSelector((state) => state.vehicles);
    const [vehicleOptions, setVehicleOptions] = useState([]); // merged vehicles for ELD
    console.log(vehicleOptions);

    const [formData, setFormData] = useState({
        serialNumber: "",
        mac: ["", "", "", "", "", ""],
        eldModel: "",
        vehicle: "",
        firmwareVersion: "",
    });

    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showUnassign, setShowUnassign] = useState(false);
    const [isUnassigned, setIsUnassigned] = useState(false);

    const firmwareOptions = ["v1.0.0", "v1.0.1", "v2.2.5", "v3.0.0"];

    // Fetch device + unassigned vehicles
    useEffect(() => {
        if (id) {
            dispatch(getEldDeviceById(companyId, id));
        }
        dispatch(getAssignableVehicles(companyId));
    }, [dispatch, id, companyId]);

    // Prefill form
    useEffect(() => {
        if (eldDevice) {
            setFormData({
                serialNumber: eldDevice.serialNumber || "",
                mac: eldDevice.macAddress ? eldDevice.macAddress.split(":") : ["", "", "", "", "", ""],
                eldModel: eldDevice.eldModel || "",
                // vehicle: eldDevice.assignedVehicle?.vehicleNumber || "",
                vehicle: eldDevice.assignedVehicle?._id || "",
                firmwareVersion: eldDevice.firmwareVersion || "",
            });
            setIsUnassigned(!eldDevice.assignedVehicle);
        }
    }, [eldDevice]);

    // Merge assigned assign vehicle for dropdown
    //     useEffect(() => {
    //     if (!eldDevice) return;

    //     // Assigned vehicle from ELD
    //     const assignedVehicle = eldDevice.assignedVehicle
    //       ? {
    //           _id: eldDevice.assignedVehicle._id,
    //           vehicleNumber: eldDevice.assignedVehicle.vehicleNumber,
    //         }
    //       : null;

    //     // Merge assigned vehicle into unassigned list
    //     let merged = [...(unassignedVehicles || [])];
    //     if (
    //       assignedVehicle &&
    //       !merged.some((v) => v._id === assignedVehicle._id)
    //     ) {
    //       merged = [assignedVehicle, ...merged];
    //     }

    //     setVehicleOptions(merged);
    //   }, [eldDevice, unassignedVehicles]);

    useEffect(() => {
        if (!eldDevice) return;

        let merged = [...(unassignedVehicles || [])];

        // Case 1: ELD already has an assigned vehicle ID
        if (eldDevice.assignedVehicleId) {
            // Try to find the vehicle in unassigned list
            const existing = merged.find((v) => v._id === eldDevice.assignedVehicleId);

            // If not found in unassigned, create a placeholder option
            if (!existing) {
                merged = [
                    {
                        _id: eldDevice.assignedVehicleId,
                        vehicleNumber: eldDevice.assignedVehicle
                            ? eldDevice.assignedVehicle
                            : `Assigned Vehicle (${eldDevice.assignedVehicle})`,
                    },
                    ...merged,
                ];
            }
        }

        setVehicleOptions(merged);
    }, [eldDevice, unassignedVehicles]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const macAddress = formData.mac.join(":");
        const finalData = {
            serialNumber: formData.serialNumber,
            macAddress,
            eldModel: formData.eldModel,
            vehicle: formData.vehicle,
            assignedVehicleId: formData.vehicle || null,  // vehicle _id
            firmwareVersion: formData.firmwareVersion,
            companyId: companyId,
        };
        dispatch(updateEldDevice(companyId, id, finalData, navigate));
    };

    const confirmUnassignVehicle = async () => {
        const success = await dispatch(unassignVehicleFromEld(companyId, id, navigate));
        if (success) {
            setIsUnassigned(true);
            setFormData((prev) => ({ ...prev, vehicle: "" }));
        }
        setShowUnassign(false);
    };

    const confirmDeactivate = () => {
        dispatch(deactivateEld(companyId, id, navigate));
        setShowDeactivate(false);
    };

    const confirmDelete = () => {
        dispatch(deleteEld(companyId, id, navigate));
        setShowDelete(false);
    };

    if (loading) return <div className="p-3">Loading...</div>;

    return (
        <div className="EditELDDevice-page py-3">
            <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Edit ELD Device Info</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button variant="outline-danger" onClick={() => setShowUnassign(true)} disabled={isUnassigned}>
                            {isUnassigned ? "Unassigned" : "Unassign Vehicle"}
                        </Button>
                        <Button variant="outline-danger" onClick={() => setShowDeactivate(true)}>
                            Deactivate
                        </Button>
                        <Button variant="danger" onClick={() => setShowDelete(true)}>
                            Delete Device
                        </Button>
                        <Button variant="primary" type="submit" form="edit-device-form">
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Confirm Modals */}
                <ConfirmModal
                    show={showDeactivate}
                    handleClose={() => setShowDeactivate(false)}
                    onConfirm={confirmDeactivate}
                    title="Are you sure you want to deactivate this ELD device?"
                    confirmText="Deactivate"
                    confirmVariant="danger"
                    iconClass="bi-exclamation-triangle"
                />
                <ConfirmModal
                    show={showDelete}
                    handleClose={() => setShowDelete(false)}
                    onConfirm={confirmDelete}
                    title="Are you sure you want to permanently delete this ELD device?"
                    confirmText="Delete"
                    confirmVariant="danger"
                    iconClass="bi-trash"
                />
                <ConfirmModal
                    show={showUnassign}
                    handleClose={() => setShowUnassign(false)}
                    onConfirm={confirmUnassignVehicle}
                    title="Are you sure you want to unassign the vehicle from this ELD?"
                    confirmText="Unassign"
                    confirmVariant="danger"
                    iconClass="bi-slash-circle"
                />

                <div className="form-wrapper">
                    <Form id="edit-device-form" onSubmit={handleSubmit}>
                        <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                            <Row className="g-3 g-xl-4">
                                <Col xs={12}>
                                    <Form.Group controlId="serialNumber">
                                        <Form.Label>
                                            ELD SN (Serial Number)<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="serialNumber"
                                            value={formData.serialNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Serial Number"
                                            autoComplete="off"
                                            required
                                        />
                                        <div className="text-muted mt-1">
                                            Please make sure ELD SN was entered correctly. Once created it cannot be changed.
                                        </div>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="macAddress">
                                        <Form.Label>
                                            ELD MAC Address<span className="text-danger">*</span>
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
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="eldModel">
                                        <Form.Label>
                                            ELD Model<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select name="eldModel" value={formData.eldModel} onChange={handleChange} required>
                                            <option value="" hidden>
                                                Select ELD Model
                                            </option>
                                            <option value="PT30">PT30</option>
                                            <option value="PT30U">PT30U</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="vehicle">
                                        <Form.Label>
                                            Assign Vehicle<span className="text-danger"></span>
                                        </Form.Label>
                                        {/* <Form.Select name="vehicle" value={formData.vehicle} onChange={handleChange}>
                      <option value="" hidden>
                        Select Vehicle
                      </option>
                      {loadings ? (
                        <option>Loading...</option>
                      ) : (
                        unassignedVehicles.map((v) => (
                          <option key={v._id} value={v.vehicleNumber}>
                            {v.vehicleNumber}
                          </option>
                        ))
                      )}
                    </Form.Select> */}
                                        {/* <Form.Select
                                            name="vehicle"
                                            value={formData.vehicle} // store vehicle _id instead of number
                                            onChange={(e) => {
                                                const selectedVehicle = vehicleOptions.find(
                                                    (v) => v._id === e.target.value
                                                );
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    vehicle: e.target.value || "",
                                                    vehicleNumber: selectedVehicle?.vehicleNumber || "", // optional, if you want to display
                                                }));
                                            }}
                                        >
                                            <option value="">Select Vehicle</option>
                                            {loadings && <option>Loading...</option>}
                                            {vehicleOptions?.map((v) => (
                                                <option key={v._id} value={v._id}>
                                                    {v.vehicleNumber}
                                                </option>
                                            ))}
                                        </Form.Select> */}
                                        <Form.Select
  name="vehicle"
  value={formData.vehicle} // will store the _id
  onChange={(e) => {
    const selectedVehicle = vehicleOptions.find(
      (v) => v._id === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      vehicle: e.target.value || "", // store vehicle _id
      vehicleNumber: selectedVehicle?.vehicleNumber || "", // optional (in case you want to use it somewhere else)
    }));
  }}
>
  <option value="">Select Vehicle</option>
  {loadings && <option>Loading...</option>}
  {vehicleOptions?.map((v) => (
    <option key={v._id} value={v._id}>
      {v.vehicleNumber} {/* only show vehicleNumber */}
    </option>
  ))}
</Form.Select>


                                    </Form.Group>
                                </Col>
                            </Row>
                        </section>

                        <section>
                            <div className="main-heading mb-3">ELD Device Firmware Update</div>
                            <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                                <Form.Group controlId="firmwareVersion">
                                    <Form.Label>
                                        Select Firmware Version<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="firmwareVersion"
                                        // value={formData.firmwareVersion}
                                        value={formData.firmwareVersion || ""} // fallback to "" if null/undefined

                                        onChange={handleChange}
                                        // required
                                    >
                                        <option value="">
                                            Select Firmware
                                        </option>
                                        {firmwareOptions.map((version, idx) => (
                                            <option key={idx} value={version}>
                                                {version}
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
