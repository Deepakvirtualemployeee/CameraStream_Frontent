import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createVehicle } from "../../../store/actions/vehicles";
import { getUnassignedElds } from "../../../store/actions/eldDevices";
import { FUELTYPE, MAKE, VEHICLE_MODEL_OPTIONS, ALPHABATES_NUMERIC, VIN_REGEX } from "../../../constants";
import { getDriversIssuingState } from "../../../store/actions/drivers";
import { toast } from "react-toastify";

export const AddVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams(); // company id from url

  const { vehicleDetails, loading } = useSelector((state) => state.vehicles || { vehicleDetails: [] });
  const { unassignedElds, loadings } = useSelector((state) => state.eldDevices);
  const { issuingState, loading: issuingStateLoading } = useSelector((state) => state.drivers);

  // console.log("add eld", eldDevices);
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
    status: "Active"
  });

  useEffect(() => {
    dispatch(getUnassignedElds(companyId));
  }, [dispatch]);

  // Fetch issuing state
  useEffect(() => {
    if (companyId) {
      dispatch(getDriversIssuingState(companyId));
    }
  }, [companyId, dispatch]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   // Special case for ELD select
  //   if (name === "eldSerialNumber") {
  //     const selectedEld = unassignedElds.find((eld) => eld.serialNumber === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       eldSerialNumber: value,
  //       eldId: selectedEld?._id || "",   // store _id alongside
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "eldSerialNumber") {
      const selectedEld = unassignedElds.find((eld) => eld.serialNumber === value);
      setFormData((prev) => ({
        ...prev,
        eldSerialNumber: value,
        eldId: selectedEld?._id || "",
      }));
    }
    // License Plate Validation
    else if (name === "licensePlateNumber") {
      if (value === "" || ALPHABATES_NUMERIC.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    // VIN Number Validation
    // else if (name === "vin") {
    //   if (value === "" || VIN_REGEX.test(value)) {
    //     setFormData((prev) => ({
    //       ...prev,
    //       [name]: value.toUpperCase(), // always uppercase
    //     }));
    //   }
    // }
    else if (name === "vin") {
      // Allow only valid VIN chars while typing
      const cleaned = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
      if (cleaned.length <= 17) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleaned,
        }));
      }
    }

    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Adding new vehicle
  //   dispatch(createVehicle(companyId, formData, navigate));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!VIN_REGEX.test(formData.vin)) {
      toast.error("VIN must be exactly 17 characters (A–Z, 0–9, excluding I, O, Q).");
      return;
    }
    // Adding new vehicle
    dispatch(createVehicle(companyId, formData, navigate));
  };


  return (
    <div className="AddVehicles-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">
            {"Add Vehicle"}
          </div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>{" "}
            <Button
              variant="primary"
              type="submit"
              form="add-vehicle-form"
              disabled={loading}
            >
              {"Add Vehicle"}
            </Button>
          </div>
        </div>

        <div className="form-wrapper">
          <Form id="add-vehicle-form" onSubmit={handleSubmit}>
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
                      placeholder="Enter vehicle number"
                      required
                    />
                  </Form.Group>
                </Col>
                {/* <Col sm={6}>
                  <Form.Group controlId="vehicleMake">
                    <Form.Label>Make</Form.Label>
                    <Form.Control
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="Enter make"
                      required
                    />
                  </Form.Group>
                </Col> */}
                <Col sm={6}>
                  <Form.Group controlId="vehicleMake">
                    <Form.Label>Make</Form.Label>
                    <Form.Select
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Make Type</option>
                      {MAKE.map((make) => (
                        <option key={make.value} value={make.value}>
                          {make.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {/* <Col sm={6}>
                  <Form.Group controlId="vehicleModel">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="Enter model"
                      required
                    />
                  </Form.Group>
                </Col> */}
                <Col sm={6}>
                  <Form.Group controlId="vehicleModel">
                    <Form.Label>Model</Form.Label>
                    <Form.Select
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Model Type</option>
                      {VEHICLE_MODEL_OPTIONS.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </Form.Select>
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
                      placeholder="Enter year"
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
                      placeholder="Enter vin"
                      required
                    />
                    <div className="text-muted mt-1">
                      Must be 17 characters (letters A–Z, digits 0–9, excluding I, O, Q).
                    </div>
                    <div className="text-muted mt-1">
                      Please make sure your VIN was entered correctly. Once the
                      vehicle record is created its VIN cannot be changed.
                    </div>
                  </Form.Group>
                </Col>
                {/* <Col xs={12}>
                  <Form.Group controlId="fuelType">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Control
                      type="text"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      placeholder="Enter fuel type"
                      required
                    />
                  </Form.Group>
                </Col> */}
                <Col xs={12}>
                  <Form.Group controlId="fuelType">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {FUELTYPE.map((fuel) => (
                        <option key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="licensePlateState">
                    <Form.Label>Issuing State</Form.Label>
                    {/* <Form.Control
                      type="text"
                      name="licensePlateState"
                      value={formData.licensePlateState}
                      onChange={handleChange}
                      placeholder="Enter Issuing state"
                      required
                    /> */}
                    <Form.Select
                      name="licensePlateState"
                      value={formData.licensePlateState}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Issuing state</option>
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
                  <Form.Group controlId="licensePlateNumber">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="licensePlateNumber"
                      value={formData.licensePlateNumber}
                      onChange={handleChange}
                      placeholder="Enter license number"
                      required
                    />
                    <div className="text-muted mt-1">
                      Only letters, numbers, spaces, and underscores are allowed.
                    </div>
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
                  // required
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
