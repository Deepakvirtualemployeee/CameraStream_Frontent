import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addEldDevice } from "../../../store/actions/eldDevices";
import { getAssignableVehiclesForEld } from "../../../store/actions/vehicles";

export const AddELDDevice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // companyId from route params

  const { loading, error, success } = useSelector((state) => state.eldDevices || {});
  const { assignableVehicles, loading: vehiclesLoading } = useSelector((state) => state.vehicles);

  const [formData, setFormData] = useState({
    serialNumber: "",
    mac: ["", "", "", "", "", ""],
    eldModel: "",
    assignedVehicleId: "",
    companyId: id,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // MAC Address Handling
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
    if (e.key === "Backspace") {
      if (e.target.value === "" && index > 0) {
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
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const macAddress = formData.mac.join(":");
    const finalData = {
      serialNumber: formData.serialNumber,
      macAddress,
      eldModel: formData.eldModel,
      assignedVehicleId: formData.assignedVehicleId,
      companyId: formData.companyId,
    };
    console.log("Submitting ELD Device:", finalData);
    dispatch(addEldDevice(id, finalData, navigate));
  };

  // Fetch vehicles
  useEffect(() => {
    if (id) {
      dispatch(getAssignableVehiclesForEld(id));
    }
  }, [id, dispatch]);

  return (
    <div className="AddELDDevice-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">ELD Device Info</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="add-eld-form" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : <><i className="bi bi-plus-lg fs-16"></i> Add ELD Device</>}
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">ELD Device added successfully!</Alert>}

        <div className="form-wrapper bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
          <Form id="add-eld-form" onSubmit={handleSubmit}>
            <Row className="g-3 g-xl-4">
              {/* Serial Number */}
              <Col xs={12}>
                <Form.Group controlId="serialNumber">
                  <Form.Label>ELD SN (Serial Number)<span className="text-danger">*</span></Form.Label>
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

              {/* MAC Address */}
              <Col xs={12}>
                <Form.Group controlId="macAddress">
                  <Form.Label>ELD MAC Address<span className="text-danger">*</span></Form.Label>
                  <div className="d-flex align-items-center form-control">
                    {formData.mac.map((value, i) => (
                      <React.Fragment key={i}>
                        <input
                          id={`mac-${i}`}
                          type="text"
                          maxLength={2}
                          className="form-control text-center border-0 shadow-none out p-0"
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
                  <div className="text-muted mt-1">
                    Please make sure ELD MAC Address was entered correctly. Once created it cannot be changed.
                  </div>
                </Form.Group>
              </Col>

              {/* Eld Model */}
              <Col xs={12}>
                <Form.Group controlId="eldModel">
                  <Form.Label>Eld Model<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="eldModel"
                    value={formData.eldModel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select ELD Model</option>
                    <option value="PT30">PT30</option>
                    {/* <option value="PT30U">PT30U</option> */}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Assign Vehicle (same as AddDriver) */}
              <Col xs={12}>
                <Form.Group controlId="assignedVehicleId">
                  <Form.Label>Assign Vehicle<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="assignedVehicleId"
                    value={formData.assignedVehicleId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedVehicle = assignableVehicles.find(v => v._id === selectedId);
                      setFormData((prev) => ({
                        ...prev,
                        assignedVehicleId: selectedId,
                        // Optionally include vehicleNumber: selectedVehicle?.vehicleNumber
                      }));
                    }}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehiclesLoading && <option>Loading...</option>}
                    {assignableVehicles?.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicleNumber}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="text-muted mt-1">
                    Mobile app will automatically connect to ELD device during login process.
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};
