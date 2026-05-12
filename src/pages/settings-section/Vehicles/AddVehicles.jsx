import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createVehicle } from "../../../store/actions/vehicles";
import { getDriversIssuingState } from "../../../store/actions/drivers";
import {
  ALPHABATES_NUMERIC,
  FUELTYPE,
  MAKE,
  VEHICLE_MODEL_OPTIONS,
  VIN_REGEX,
} from "../../../constants";

export const AddVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const { loading } = useSelector((state) => state.vehicles || {});
  const { issuingState, loading: issuingStateLoading } = useSelector((state) => state.drivers);

  const [formData, setFormData] = useState({
    companyId,
    vehicleNumber: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    fuelType: "",
    licensePlateState: "",
    licensePlateNumber: "",
  });

  useEffect(() => {
    if (companyId) {
      dispatch(getDriversIssuingState(companyId));
    }
  }, [companyId, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "year") {
      setFormData((prev) => ({
        ...prev,
        year: value.replace(/\D/g, "").slice(0, 4),
      }));
      return;
    }

    if (name === "vin") {
      const cleaned = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
      if (cleaned.length <= 17) {
        setFormData((prev) => ({
          ...prev,
          vin: cleaned,
        }));
      }
      return;
    }

    if (name === "licensePlateNumber") {
      if (value === "" || ALPHABATES_NUMERIC.test(value)) {
        setFormData((prev) => ({
          ...prev,
          licensePlateNumber: value,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!VIN_REGEX.test(formData.vin)) {
      toast.error("VIN must be exactly 17 characters and cannot include I, O, or Q.");
      return;
    }

    await dispatch(createVehicle(companyId, formData, navigate));
  };

  return (
    <div className="AddVehicles-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">Add Vehicle</div>
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
              form="add-vehicle-form"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Add Vehicle"}
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
                      inputMode="numeric"
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
                      placeholder="Enter VIN"
                      required
                    />
                    <div className="text-muted mt-1">
                      Must be 17 characters and cannot include I, O, or Q.
                    </div>
                  </Form.Group>
                </Col>

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
                    <Form.Select
                      name="licensePlateState"
                      value={formData.licensePlateState}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Issuing state</option>
                      {issuingStateLoading && <option>Loading...</option>}
                      {issuingState?.map((stateOption) => (
                        <option key={stateOption.state} value={stateOption.state}>
                          {stateOption.state}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group controlId="licensePlateNumber">
                    <Form.Label>License Plate Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="licensePlateNumber"
                      value={formData.licensePlateNumber}
                      onChange={handleChange}
                      placeholder="Enter license plate number"
                      required
                    />
                    <div className="text-muted mt-1">
                      Only letters, numbers, spaces, and underscores are allowed.
                    </div>
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
