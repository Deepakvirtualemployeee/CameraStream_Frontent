import React, { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { createDvir, getVehicles } from "../../../store/actions";
import { fetchDrivers } from "../../../store/actions/drivers";
import { getUnitDefects, getTrailerDefects } from "../../../store/actions/dvir";

export const AddNewDVIR = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const animatedComponents = makeAnimated();
  const { companyId } = useParams();
  const { loading, unitDefects: unitDefectsOptions = [], trailerDefects: trailerDefectsOptions = [] } = useSelector((state) => state.dvir || { loading: false });
  const vehicles = useSelector((state) => state.vehicles?.vehicles || []);
  const drivers = useSelector((state) => state.drivers?.drivers || []);

  useEffect(() => {
    if (companyId) {
      dispatch(getVehicles(companyId));
      dispatch(fetchDrivers(companyId));
      dispatch(getUnitDefects());
      dispatch(getTrailerDefects());
    }
  }, [companyId, dispatch]);

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((v) => ({
        value: v._id,
        label: v.vehicleNumber || v.name || v.licensePlate || v._id,
      })),
    [vehicles]
  );

  const driverOptions = useMemo(
    () =>
      drivers.map((d) => ({
        value: d._id,
        label:
          [d.firstName, d.lastName].filter(Boolean).join(" ") ||
          d.driverName ||
          d.name ||
          d.email ||
          d._id,
      })),
    [drivers]
  );

  const [form, setForm] = useState({
    vehicleId: "",
    driverId: "",
    trailers: "",
    location: "",
    dateTime: "",
    odometer: "",
    unitDefects: [],
    trailerDefects: [],
    status: "",
    safetyStatus: "",
    notes: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "unitDefects" || key === "trailerDefects") {
        const unitLen =
          key === "unitDefects" ? (value?.length || 0) : prev.unitDefects?.length || 0;
        const trailerLen =
          key === "trailerDefects" ? (value?.length || 0) : prev.trailerDefects?.length || 0;
        const hasDefects = unitLen + trailerLen > 0;
        if (hasDefects && prev.status === "No Defects") {
          next.status = "";
        }
      }
      return next;
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        unitDefects: form.unitDefects.map((opt) => opt.value),
        trailerDefects: form.trailerDefects.map((opt) => opt.value),
        odometer: form.odometer ? Number(form.odometer) : 0,
      };
      await dispatch(createDvir(payload));
      navigate(-1);
    } catch (err) {
      console.warn("Create DVIR failed", err?.response?.data?.message || err.message);
    }
  };

  const hasDefectsSelected =
    (form.unitDefects?.length || 0) > 0 || (form.trailerDefects?.length || 0) > 0;

  return (
    <div className="AddVehicles-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">Add DVIR</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-vehicle-form" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
          </div>
        </div>

        <div className="form-wrapper">
          <Form id="add-vehicle-form" onSubmit={submitHandler}>
            <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3 g-xl-4">
                <Col sm={6}>
                  <Form.Group controlId="vehicle_number">
                    <Form.Label>Vehicle<span className="text-danger">*</span></Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      options={vehicleOptions}
                      placeholder="Select vehicle"
                      value={vehicleOptions.find((opt) => opt.value === form.vehicleId) || null}
                      onChange={(opt) => updateForm("vehicleId", opt ? opt.value : "")}
                      isClearable
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="driver_name">
                    <Form.Label>Driver<span className="text-danger">*</span></Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      options={driverOptions}
                      placeholder="Select driver"
                      value={driverOptions.find((opt) => opt.value === form.driverId) || null}
                      onChange={(opt) => updateForm("driverId", opt ? opt.value : "")}
                      isClearable
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="trailers">
                    <Form.Label>Trailers</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter trailers"
                      value={form.trailers}
                      onChange={(e) => updateForm("trailers", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="vehicleModel">
                    <Form.Label>Date & Time (Select driver first)<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.dateTime}
                      onChange={(e) => updateForm("dateTime", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Location<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter location"
                      value={form.location}
                      onChange={(e) => updateForm("location", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Odometer (mi)</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.odometer}
                      onChange={(e) => updateForm("odometer", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Unit Defects</Form.Label>
                    <Select
                      className='custom-select'
                      classNamePrefix='custom-select'
                      components={animatedComponents}
                      isMulti
                      options={unitDefectsOptions}
                      placeholder="Select unit defects"
                      value={form.unitDefects}
                      onChange={(opts) => updateForm("unitDefects", opts || [])}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Trailer Defects</Form.Label>
                    <Select
                      className='custom-select'
                      classNamePrefix='custom-select'
                      components={animatedComponents}
                      isMulti
                      options={trailerDefectsOptions}
                      placeholder="Select trailer defects"
                      value={form.trailerDefects}
                      onChange={(opts) => updateForm("trailerDefects", opts || [])}
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Status<span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={form.status}
                      onChange={(e) => updateForm("status", e.target.value)}
                      required
                    >
                      <option value="" hidden>Select defects</option>
                      <option value="No Defects" disabled={hasDefectsSelected}>
                        No Defects
                      </option>
                      <option value="Has Defects">Has Defects</option>
                      <option value="Defects Fixed">Defects Fixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Choose Safety Status<span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={form.safetyStatus}
                      onChange={(e) => updateForm("safetyStatus", e.target.value)}
                      required
                    >
                      <option value="" hidden>Select safety status</option>
                      <option value="Safe to Driver">Safe to Driver</option>
                      <option value="Unsafe">Unsafe</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group controlId="notes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add notes (optional)"
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
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
