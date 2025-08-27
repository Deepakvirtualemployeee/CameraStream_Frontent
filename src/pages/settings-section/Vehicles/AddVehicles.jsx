import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createVehicle, updateVehicle, getVehicles } from "../../../store/actions/vehicles";
import { getUnassignedElds } from "../../../store/actions/eldDevices";

export const AddVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // company id from url

  //   const location = useLocation();
  //   const { companyId } = location.state || {};  // reading state
  // console.log("Company id:", companyId);
  //   const { vehicleDetails, loading } = useSelector((state) => state.vehicles);
  const { vehicleDetails, loading } = useSelector((state) => state.vehicles || { vehicleDetails: [] });
  // const { eldDevices, loadings } = useSelector((state) => state.eldDevices);
  const { unassignedElds, loadings } = useSelector((state) => state.eldDevices);


  // console.log("add eld", eldDevices);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    companyId: id,
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
    dispatch(getUnassignedElds(id));
  }, [dispatch]);

  // Fetch vehicle details if editing
  // useEffect(() => {
  //   if (id) {
  //   //   dispatch(getVehicleById(id));
  //     dispatch(getVehicles(companyId));

  //   }
  // }, [id, dispatch]);

  // Pre-fill data when editing
  // useEffect(() => {
  //   if (id && vehicleDetails) {
  //     setFormData(vehicleDetails);
  //   }
  // }, [vehicleDetails, id]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Special case for ELD select
    if (name === "eldSerialNumber") {
      const selectedEld = unassignedElds.find((eld) => eld.serialNumber === value);
      setFormData((prev) => ({
        ...prev,
        eldSerialNumber: value,
        eldId: selectedEld?._id || "",   // store _id alongside
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

    // if (id) {
    //   // Editing existing vehicle
    //   dispatch(updateVehicle(companyId, id, formData, navigate));
    // } else {
    // Adding new vehicle
    dispatch(createVehicle(id, formData, navigate));
    // }
  };

  return (
    <div className="AddVehicles-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">
            {/* {id ? "Edit Vehicle" : "Add Vehicle"} */}
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
              {/* {id ? "Update Vehicle" : "Add Vehicle"} */}
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
                  {/* <Form.Select
                    name="eldSerialNumber"
                    value={formData.eldSerialNumber}
                    onChange={handleChange}
                    required
                  >
                    <option value="" hidden>
                      Select ELD Device
                    </option>
                    <option value="7000">7000</option>
                    <option value="7001">7001</option>
                    <option value="7002">7002</option>
                    <option value="7003">7003</option>
                  </Form.Select> */}
                  <Form.Select
                    name="eldSerialNumber"
                    value={formData.eldSerialNumber}
                    onChange={handleChange}
                    required
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
