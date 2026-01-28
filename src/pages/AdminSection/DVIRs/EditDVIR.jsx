import React, { useEffect, useMemo, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  getVehicles,
  getUnitDefects,
  getTrailerDefects,
  getDvirById,
  updateDvir,
} from "../../../store/actions";
import { fetchDrivers } from "../../../store/actions/drivers";

const animatedComponents = makeAnimated();

export const EditDVIR = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId, id: dvirId } = useParams();

  const { loading, unitDefects = [], trailerDefects = [], current: dvir } = useSelector(
    (state) => state.dvir || {}
  );
  const vehicles = useSelector((state) => state.vehicles?.vehicles || []);
  const drivers = useSelector((state) => state.drivers?.drivers || []);
  const [fixing, setFixing] = useState(false);

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

  useEffect(() => {
    if (companyId) {
      dispatch(getVehicles(companyId));
      dispatch(fetchDrivers(companyId));
    }
    dispatch(getUnitDefects());
    dispatch(getTrailerDefects());
    if (dvirId) {
      dispatch(getDvirById(dvirId));
    }
  }, [companyId, dvirId, dispatch]);

  useEffect(() => {
    if (dvir && dvir._id === dvirId) {
      setForm({
        vehicleId: dvir.vehicleId?._id || "",
        driverId: dvir.driverId?._id || "",
        trailers: dvir.trailers || "",
        location: dvir.location || "",
        dateTime: dvir.dateTime ? dvir.dateTime.slice(0, 16) : "",
        odometer: dvir.odometer || "",
        unitDefects: (dvir.unitDefects || []).map((d) => ({
          value: d.id || d._id || d.name || d,
          label: d.name || d.label || d.id || d._id || d,
        })),
        trailerDefects: (dvir.trailerDefects || []).map((d) => ({
          value: d.id || d._id || d.name || d,
          label: d.name || d.label || d.id || d._id || d,
        })),
        status: dvir.status || "",
        safetyStatus: dvir.safetyStatus || "",
        notes: dvir.notes || "",
      });
    }
  }, [dvir, dvirId]);

  const vehicleOptions = useMemo(
    () => vehicles.map((v) => ({ value: v._id, label: v.vehicleNumber || v.name || v.licensePlate || v._id })),
    [vehicles]
  );

  const driverOptions = useMemo(
    () =>
      drivers.map((d) => ({
        value: d._id,
        label: [d.firstName, d.lastName].filter(Boolean).join(" ") || d.driverName || d.name || d.email || d._id,
      })),
    [drivers]
  );

  const updateForm = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "unitDefects" || key === "trailerDefects") {
        const total =
          (key === "unitDefects" ? value.length : prev.unitDefects.length) +
          (key === "trailerDefects" ? value.length : prev.trailerDefects.length);
        if (total > 0 && prev.status === "No Defects") {
          next.status = "";
        }
      }
      return next;
    });
  };

  const hasDefectsSelected = (form.unitDefects?.length || 0) > 0 || (form.trailerDefects?.length || 0) > 0;

  const handleMarkFixed = async () => {
    try {
      setFixing(true);
      await dispatch(updateDvir(dvirId, { status: "Defects Fixed" }));
      setForm((prev) => ({ ...prev, status: "Defects Fixed" }));
    } catch (err) {
      console.warn("Mark defects fixed failed", err?.response?.data?.message || err.message);
    } finally {
      setFixing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        odometer: form.odometer ? Number(form.odometer) : 0,
        unitDefects: (form.unitDefects || []).map((d) => d.value || d),
        trailerDefects: (form.trailerDefects || []).map((d) => d.value || d),
      };
      await dispatch(updateDvir(dvirId, payload));
      navigate(`/dvirs-list/dvir-details/${companyId}/${dvirId}`);
    } catch (err) {
      console.warn("Update DVIR failed", err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="AddVehicles-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">Edit DVIR</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="edit-dvir-form" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
            {/* {form.status === "Has Defects" && (
              <Button
                variant="success"
                type="button"
                disabled={loading || fixing}
                onClick={handleMarkFixed}
              >
                {fixing ? <Spinner animation="border" size="sm" /> : "Defects Fixed"}
              </Button>
            )} */}
          </div>
        </div>

        <div className="form-wrapper">
          <Form id="edit-dvir-form" onSubmit={handleSubmit}>
            <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3 g-xl-4">
                <Col sm={6}>
                  <Form.Group controlId="vehicle_number">
                    <Form.Label>
                      Vehicle<span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      options={vehicleOptions}
                      placeholder="Select vehicle"
                      value={vehicleOptions.find((opt) => opt.value === form.vehicleId) || null}
                      onChange={(opt) => updateForm("vehicleId", opt ? opt.value : "")}
                      isClearable
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="driver_name">
                    <Form.Label>
                      Driver<span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      options={driverOptions}
                      placeholder="Select driver"
                      value={driverOptions.find((opt) => opt.value === form.driverId) || null}
                      onChange={(opt) => updateForm("driverId", opt ? opt.value : "")}
                      isClearable
                      required
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
                  <Form.Group controlId="dateTime">
                    <Form.Label>
                      Date & Time<span className="text-danger">*</span>
                    </Form.Label>
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
                    <Form.Label>
                      Location<span className="text-danger">*</span>
                    </Form.Label>
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
                  <Form.Group controlId="odometer">
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
                  <Form.Group controlId="unitDefects">
                    <Form.Label>Unit Defects</Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      isMulti
                      options={unitDefects}
                      placeholder="Select unit defects"
                      value={form.unitDefects}
                      onChange={(opts) => updateForm("unitDefects", opts || [])}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="trailerDefects">
                    <Form.Label>Trailer Defects</Form.Label>
                    <Select
                      className="custom-select"
                      classNamePrefix="custom-select"
                      components={animatedComponents}
                      isMulti
                      options={trailerDefects}
                      placeholder="Select trailer defects"
                      value={form.trailerDefects}
                      onChange={(opts) => updateForm("trailerDefects", opts || [])}
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="status">
                    <Form.Label>
                      Status<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.status}
                      onChange={(e) => updateForm("status", e.target.value)}
                      required
                    >
                      <option value="" hidden>
                        Select defects
                      </option>
                      <option value="No Defects" disabled={hasDefectsSelected}>
                        No Defects
                      </option>
                      <option value="Has Defects">Has Defects</option>
                      <option value="Defects Fixed">Defects Fixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="safetyStatus">
                    <Form.Label>
                      Choose Safety Status<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.safetyStatus}
                      onChange={(e) => updateForm("safetyStatus", e.target.value)}
                      required
                    >
                      <option value="" hidden>
                        Select safety status
                      </option>
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
