import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getVehicleById,
  updateVehicle,
  deactivateVehicle,
  activateVehicle,
  unassignEld,
  deleteVehicle,   // import delete action
} from "../../../store/actions/vehicles";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import { getUnassignedElds } from "../../../store/actions/eldDevices";

export const EditVehicles = () => {
  const { id } = useParams(); // vehicle id from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const { companyId } = location.state || {}; // reading state
  console.log("Company Id:", companyId);
  console.log("Vehicle Id:", id);

  const { vehicle, loading } = useSelector((state) => state.vehicles);
  const { unassignedElds, loadings } = useSelector((state) => state.eldDevices);

  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [showUnassign, setShowUnassign] = useState(false);
  const [showDelete, setShowDelete] = useState(false); // new
  const [isUnassigned, setIsUnassigned] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    companyId: companyId,
    make: "",
    model: "",
    year: "",
    vin: "",
    fuelType: "",
    licensePlateState: "",
    licensePlateNumber: "",
    eldSerialNumber: "",
    eldId: "",
    status: "Active",
  });

  // Fetch vehicle + unassigned ELDs
  useEffect(() => {
    if (id) {
      dispatch(getVehicleById(companyId, id));
    }
    dispatch(getUnassignedElds(companyId));
  }, [dispatch, id, companyId]);

  // Prefill form when vehicle is loaded
  useEffect(() => {
    if (vehicle) {
      setFormData({
        companyId: companyId,
        vehicleNumber: vehicle.vehicleNumber || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        vin: vehicle.vin || "",
        fuelType: vehicle.fuelType || "",
        licensePlateState: vehicle.licensePlateState || "",
        licensePlateNumber: vehicle.licensePlateNumber || "",
        eldSerialNumber: vehicle.eldSerialNumber || "",
        eldId: vehicle.eldId || "",
      });
      setIsUnassigned(!vehicle.eldSerialNumber);
    }
  }, [vehicle, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "eldSerialNumber") {
      const selectedEld = unassignedElds.find(
        (eld) => eld.serialNumber === value
      );
      setFormData((prev) => ({
        ...prev,
        eldSerialNumber: value,
        eldId: selectedEld?._id || "", // assign eldId
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateVehicle(companyId, id, formData, navigate)); // navigate handled in action
    }
  };

  // Unassign ELD
  const confirmUnassignEld = async () => {
    if (!id) return;
    const success = await dispatch(unassignEld(companyId, id, navigate));
    if (success) {
      setIsUnassigned(true);
      setFormData((prev) => ({
        ...prev,
        eldSerialNumber: "",
        eldId: "",
      }));
    }
    setShowUnassign(false);
  };

  // Deactivate vehicle
  const confirmDeactivate = () => {
    if (!id) return;
    dispatch(deactivateVehicle(companyId, id, navigate));
    setShowDeactivate(false);
  };

  // Activate vehicle
  const confirmActivate = () => {
    if (!id) return;
    dispatch(activateVehicle(companyId, id, navigate));
    setShowActivate(false);
  };

  // Delete vehicle
  const confirmDelete = () => {
    if (!id) return;
    dispatch(deleteVehicle(companyId, id, navigate)); // delete + navigate handled in action
    setShowDelete(false);
  };

  if (loading) return <div className="p-3">Loading...</div>;

  return (
    <div className="EditVehicles-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">Edit Vehicle Info</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setShowUnassign(true)}
              disabled={isUnassigned}
            >
              {isUnassigned ? "Unassigned" : "Unassign ELD"}
            </Button>
            {vehicle?.status === "Active" ? (
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
              Delete Vehicle
            </Button>
            <Button variant="primary" type="submit" form="edit-vehicle-form">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Confirm Modals */}
        <ConfirmModal
          show={showDeactivate}
          handleClose={() => setShowDeactivate(false)}
          onConfirm={confirmDeactivate}
          title="Are you sure you want to deactivate this vehicle?"
          confirmText="Deactivate"
          confirmVariant="danger"
          iconClass="bi-exclamation-triangle"
        />

        <ConfirmModal
          show={showActivate}
          handleClose={() => setShowActivate(false)}
          onConfirm={confirmActivate}
          title="Are you sure you want to activate this vehicle?"
          confirmText="Activate"
          confirmVariant="success"
          iconClass="bi-check-circle"
        />

        <ConfirmModal
          show={showUnassign}
          handleClose={() => setShowUnassign(false)}
          onConfirm={confirmUnassignEld}
          title="Are you sure you want to unassign the ELD from this vehicle?"
          confirmText="Unassign"
          confirmVariant="danger"
          iconClass="bi-slash-circle"
        />

        <ConfirmModal
          show={showDelete}
          handleClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          title="Are you sure you want to permanently delete this vehicle?"
          confirmText="Delete"
          confirmVariant="danger"
          iconClass="bi-trash"
        />

        <div className="form-wrapper">
          <Form id="edit-vehicle-form" onSubmit={handleSubmit}>
            <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3 g-xl-4">
                <Col xs={12}>
                  <Form.Group controlId="vehicleNumber">
                    <Form.Label>Vehicle Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="vehicleMake">
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="vehicleModel">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="vehicleYear">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="vehicleVin">
                    <Form.Label>VIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      required
                    />
                    <div className="text-muted mt-1">
                      Please make sure your VIN was entered correctly. Once the
                      vehicle record is created its VIN cannot be changed.
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="fuelType">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Control
                      type="text"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="licensePlateState">
                    <Form.Label>Issuing State</Form.Label>
                    <Form.Control
                      type="text"
                      name="licensePlateState"
                      value={formData.licensePlateState}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="licensePlateNumber">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="licensePlateNumber"
                      value={formData.licensePlateNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </section>

            <section>
              <div className="main-heading mb-3">ELD Settings</div>
              <div className="bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
                <Form.Group controlId="eldSerialNumber">
                  <Form.Label>Assign ELD</Form.Label>
                  <Form.Select
                    name="eldSerialNumber"
                    value={formData.eldSerialNumber}
                    onChange={handleChange}
                  >
                    <option value="">Select ELD</option>
                    {loadings ? (
                      <option>Loading...</option>
                    ) : (
                      unassignedElds.map((eld) => (
                        <option key={eld._id} value={eld.serialNumber}>
                          {eld.serialNumber} ({eld.macAddress})
                        </option>
                      ))
                    )}
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
