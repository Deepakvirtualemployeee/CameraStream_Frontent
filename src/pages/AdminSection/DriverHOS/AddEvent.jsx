import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addEvent } from "../../../store/actions/driverHOS"; // redux action

export const AddEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId, driverId } = useParams(); // company and driver id from URL

  const { loading, error } = useSelector(
    (state) => state.addEvent || { loading: false, error: null }
  );

  // dynamic form state (empty on page load)
  const [eventDate, setEventDate] = useState(new Date());
  const [form, setForm] = useState({
    // companyId: companyId,
    seqId: "",
    source: "",
    positioning: "",
    eventCode: "",
    origin: "",
    isActive: "",
    vehicleId: null,
    odometer: "",
    engineHours: "",
    latitude: "",
    longitude: "",
    locationNote: "",
    notes: null,
  });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const incrementSeq = (delta) =>
    updateField("seqId", Number(form.seqId || 0) + delta);

  const chips = [
    "PTI",
    "Pick up",
    "Delivery",
    "Break",
    "Fuel",
    "Scale",
    "DOT Inspection",
    "Drop",
    "Hook",
    "Drop & Hook",
    "Co-Driver Joined",
    "Co-Driver Left",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert isActive string to boolean
    const activeStatus =
      form.isActive?.toLowerCase() === "active" ? true : false;

    // Convert eventDate to UTC ISO string
    const eventDateUTC = new Date(eventDate).toISOString();

    const payload = {
      ...form,
      isActive: activeStatus,
      eventDateTime: eventDateUTC,

    //   eventDateTime: eventDate.toISOString(), // always UTC
    // isActive: form.isActive === "active",   // true if active, false otherwise
    };

    console.log("Add event payload:", payload);
    // dispatch(addEvent(companyId, driverId, null, payload, navigate)); // redux dispatch
    dispatch(
        addEvent(companyId, driverId, null, { event: payload }, navigate)
      );
      
  };

  return (
    <div className="EditEvent-page py-3">
      <div
        className="container-fluid"
        style={{ maxWidth: "calc(1000px + 1.5rem)" }}
      >
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">
            Add Event{" "}
            <span className="text-muted fs-14">(System Administrator)</span>
          </div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="primary"
              type="submit"
              form="add-event-form"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <>
                  <i className="bi bi-plus-lg fs-16"></i> Add Event
                </>
              )}
            </Button>
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="bg-theme4 border form-wrapper rounded-2 p-3 p-md-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <Form id="add-event-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-xl-12">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Seq ID<span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={form.seqId}
                        onChange={(e) => updateField("seqId", e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => incrementSeq(1)}
                      >
                        <i className="bi bi-chevron-up" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => incrementSeq(-1)}
                      >
                        <i className="bi bi-chevron-down" />
                      </Button>
                    </InputGroup>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Location Source<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.source}
                      onChange={(e) => updateField("source", e.target.value)}
                      required
                    >
                      <option value="">-- Select --</option>
                      <option value="Generated when connected to ECM">
                        Generated when connected to ECM
                      </option>
                      <option value="Manual Location">Manual Location</option>
                      <option value="Calculated Location">
                        Calculated Location
                      </option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Date & Time<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="w-100">
                      <DatePicker
                        selected={eventDate}
                        onChange={setEventDate}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy hh:mm aa"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Positioning</Form.Label>
                    <Form.Select
                      value={form.positioning}
                      onChange={(e) => updateField("positioning", e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Status</Form.Label>
                    <Form.Select
                      value={form.eventCode}
                      onChange={(e) => updateField("eventCode", e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="DS_OFF">OFF</option>
                      <option value="DS_SB">Sleeper</option>
                      <option value="DS_ON">ON Duty</option>
                      <option value="DS_D">Driving</option>
                      <option value="DR_IND_YM">Yard Move</option>
                      <option value="DR_IND_PC">Personal Conveyance</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Location Note</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.locationNote}
                      onChange={(e) =>
                        updateField("locationNote", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Origin</Form.Label>
                    <Form.Select
                      value={form.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="DRIVER">Driver</option>
                      <option value="AUTO">System</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-3">
                    <Form.Label className="fw-semibold">
                      Latitude<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.latitude}
                      onChange={(e) => updateField("latitude", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-3">
                    <Form.Label className="fw-semibold">
                      Longitude<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.longitude}
                      onChange={(e) => updateField("longitude", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">State</Form.Label>
                    <Form.Select
                      value={form.isActive}
                      onChange={(e) => updateField("isActive", e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Calc. Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="6046.5mi WSW of Bethel, AK"
                      disabled
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Vehicle</Form.Label>
                    <Form.Select
                      value={form.vehicleId}
                      onChange={(e) => updateField("vehicleId", e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="TESTG">TESTG</option>
                      <option value="93005">93005</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Notes</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={form.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateField("notes", "")}
                      >
                        Clear
                      </Button>
                    </InputGroup>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Odometer(mi)<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={form.odometer}
                      onChange={(e) => updateField("odometer", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Event Tags</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {chips.map((chip) => (
                        <Badge
                          bg="light"
                          key={chip}
                          className="text-body fw-medium border px-2 py-2"
                        >
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Engine Hours</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.engineHours}
                      onChange={(e) =>
                        updateField("engineHours", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 d-none d-xl-block"></div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
