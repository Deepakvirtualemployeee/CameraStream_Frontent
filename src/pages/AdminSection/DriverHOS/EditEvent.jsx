import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addEditEvent } from "../../../store/actions/driverHOS"; // redux action
import { getAssignableVehicles } from "../../../store/actions/vehicles";
import { getUnassignedElds } from "../../../store/actions/eldDevices";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { fetchLocationFromLatLng } from "../../../data/utils";

// import "rsuite/dist/rsuite.min.css";


export const EditEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch
  const location = useLocation();

  const { selectedDate, eventId, driverLogs, timeZoneId } =
    location.state || {};
  console.log(
    "EventId:",
    eventId,
    "driverLogs",
    driverLogs,
    "timeZoneId",
    timeZoneId,
    "selectedDate",
    selectedDate
  );

  // get now in company timezone as Date object
  // const getNowInTZ = () => {
  //     return moment.tz(timeZoneId).toDate();
  // };

  const { companyId, driverId } = useParams();
  const [eventDateForDb, setEventDateForDb] = useState(null);
  const [eventDate, setEventDate] = useState(new Date());
  

  console.log("eventDate state:", eventDate);
  const { loading, error } = useSelector(
    (state) => state.addEditEvent || { loading: false, error: null }
  );
  const { assignableVehicles, loading: vehiclesLoading } = useSelector(
    (state) => state.vehicles
  );
  const { unassignedElds = [], loading: eldLoading } = useSelector(
    (state) => state.eldDevices || {}
  );

  const [form, setForm] = useState({
    seqId: null,
    source: "",
    positioning: "",
    eventCode: "",
    origin: "",
    isActive: "",
    vehicleId: null,
    eldId: null,
    odometer: "",
    engineHours: "",
    locationNote: "",
    latitude: "",
    longitude: "",
    notes: null,
    isEldConnected: false, // added for location source
    calcLocation: "", // added for automatic positioning
  });

  const [errors, setErrors] = useState({});

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

  // const updateField = (key, value) => {
  //     setForm((prev) => ({ ...prev, [key]: value }));
  //     validateField(key, value);
  // };

  // --- updateField ---
  const updateField = (key, value) => {
    setForm((prev) => {
      let updated = { ...prev, [key]: value };

      // update isEldConnected automatically
      if (key === "source") {
        updated.isEldConnected = value === "connected";
      }

      // handle positioning logic
      if (key === "positioning") {
        if (value === "manual") {
          updated.latitude = "";
          updated.longitude = "";
          updated.calcLocation = "";
        } else if (value === "automatic") {
          updated.locationNote = "";
        }
      }

      return updated;
    });
    validateField(key, value);
  };

  // Auto update calcLocation when lat/lng changes
  useEffect(() => {
    if (form.positioning === "automatic" && form.latitude && form.longitude) {
      fetchLocationFromLatLng(form.latitude, form.longitude).then((loc) => {
        setForm((prev) => ({ ...prev, calcLocation: loc }));
      });
    }
  }, [form.latitude, form.longitude, form.positioning]);

  // const incrementSeq = (delta) =>
  //   updateField("seqId", Number(form.seqId || 0) + delta);

  const incrementSeq = (delta) => {
    setForm((prev) => {
      let newVal = Number(prev.seqId || 0) + delta;
      if (newVal < 0) newVal = 0; // prevent negative
      return { ...prev, seqId: newVal };
    });
  };

  const validateField = (name, value) => {
    let message = "";

    // Always check the latest values
    const currentEventCode = name === "eventCode" ? value : form.eventCode;
    const currentOrigin = name === "origin" ? value : form.origin;

    switch (name) {
      case "seqId":
        if (value < 0) message = "Seq ID cannot be negative.";
        break;

      case "eventDate":
        if (!value) message = "Please select a valid date and time.";
        break;

      case "eventCode":
      case "origin":
        if (currentEventCode === "DS_D") {
          // Driving → allow both AUTO & DRIVER
          if (!(currentOrigin === "AUTO" || currentOrigin === "DRIVER")) {
            message = "Driving status requires origin AUTO or DRIVER.";
          }
        } else {
          // Not Driving → only DRIVER is allowed
          if (currentOrigin === "AUTO") {
            message = "Only DRIVER origin allowed for this status.";
          }
        }
        break;

      case "odometer":
        if (
          !value ||
          value <= 0 ||
          value >= 10000000 ||
          !Number.isInteger(Number(value))
        ) {
          message = "Odometer must be an integer between 1 and 9,999,999.";
        }
        break;

      case "engineHours":
        if (value && isNaN(value)) {
          message = "Engine hours must be a valid number.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));

    // Keep both fields in sync for cross-field validation
    if (name === "eventCode" || name === "origin") {
      let otherField = name === "eventCode" ? "origin" : "eventCode";
      let otherMsg = "";

      if (currentEventCode === "DS_D") {
        if (!(currentOrigin === "AUTO" || currentOrigin === "DRIVER")) {
          otherMsg = "Driving status requires origin AUTO or DRIVER.";
        }
      } else {
        if (currentOrigin === "AUTO") {
          otherMsg = "Only DRIVER origin allowed for this status.";
        }
      }

      setErrors((prev) => ({ ...prev, [otherField]: otherMsg }));
    }

    return message === "";
  };

  const handleChipClick = (chip) => {
    let currentNotes = form.notes
      ? form.notes.split(",").map((n) => n.trim())
      : [];
    if (!currentNotes.includes(chip)) {
      currentNotes.push(chip);
      updateField("notes", currentNotes.join(", "));
    }
  };

  // Fetch Assignable Vehicles
  useEffect(() => {
    if (companyId) {
      dispatch(getAssignableVehicles(companyId));
    }
  }, [companyId, dispatch]);

  // Fetch Unassigned ELDs
  useEffect(() => {
    if (companyId) {
      dispatch(getUnassignedElds(companyId));
    }
  }, [companyId, dispatch]);

  // Prefill form using driverLogs if available
  useEffect(() => {
    const tz = timeZoneId || "America/Los_Angeles"; // Use the passed timezone or fallback to LA

    if (!driverLogs || !eventId) {
      console.warn("Missing driverLogs or eventId");
      return;
    }

    // Find the event in driverLogs by eventId
    const event = driverLogs
      .flatMap((log) => log.hosEvents || [])
      .find((e) => String(e._id) === String(eventId));

    if (!event) {
      console.warn("Event not found for the given eventId:", eventId);
      return;
    }

    // --- TIMEZONE CONVERSION ---
    let eventDateForPicker;
    let eventDateFormatted;

    // If the event has a valid eventDateTime, convert it from UTC to company timezone
    if (event.eventDateTime) {
      // Build a Date using local clock so the picker shows the same wall-clock time as company TZ
      console.log("Original Event Date in DB (UTC):", event.eventDateTime);
      const eventMoment = moment.utc(event.eventDateTime).tz(tz);
      eventDateForPicker = new Date(
        eventMoment.year(),
        eventMoment.month(),
        eventMoment.date(),
        eventMoment.hour(),
        eventMoment.minute(),
        eventMoment.second(),
        eventMoment.millisecond()
      );
      eventDateFormatted = eventMoment.format("dd MMM YYYY hh:mm:ss A "); // Human-readable formatted date
      // store original UTC for backend if picker not changed
      setEventDateForDb(new Date(event.eventDateTime));
    } else {
      // Fallback to current date in company timezone
      const nowInCompany = moment().tz(tz);
      eventDateForPicker = new Date(
        nowInCompany.year(),
        nowInCompany.month(),
        nowInCompany.date(),
        nowInCompany.hour(),
        nowInCompany.minute(),
        nowInCompany.second(),
        nowInCompany.millisecond()
      );
      eventDateFormatted = nowInCompany.format("YYYY-MM-DD hh:mm:ss A");
      setEventDateForDb(nowInCompany.toDate());
    }

    console.log("Stored Event Date in DB (UTC):", event.eventDateTime);
    console.log(
      "Converted Event Date for Picker (Company TZ):",
      eventDateForPicker
    );
    console.log("Formatted Event Date (Company TZ):", eventDateFormatted);

    // Prefill the form with event data
    setForm({
      seqId: event.seqId || null,
      source: event.isEldConnected ? "connected" : "disconnected",
      isEldConnected: !!event.isEldConnected,
      positioning: event.positioning || "",
      eventCode: event.eventCode || "",
      origin: event.origin || "",
      isActive: event.eventStatus === "ACTIVE" ? "active" : "inactive",
      vehicleId: event.vehicle?._id || "",
      vehicleNumber: event.vehicle?.vehicleNumber || "",
      eldId: event.eldId?._id || "",
      odometer: event.odometer || "",
      engineHours: event.engineHours || "",
      locationNote: event.locationNote || "",
      latitude: event.latitude || "",
      longitude: event.longitude || "",
      notes: Array.isArray(event.notes)
        ? event.notes.join(", ")
        : event.notes || null,
      calcLocation: "",
    });

    // Set the event date in the company timezone
    setEventDate(eventDateForPicker); // Store the event date for use in the picker
  }, [driverLogs, eventId, timeZoneId]); // Runs when these change

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    Object.keys(form).forEach((key) => {
      if (!validateField(key, form[key])) valid = false;
      // console.log("Validating:", key, "Value:", form[key], "Result:", valid);
    });

    // Explicit cross-check for eventCode + origin
    if (
      form.eventCode === "DS_D" &&
      !(form.origin === "AUTO" || form.origin === "DRIVER")
    ) {
      setErrors((prev) => ({
        ...prev,
        origin: "Driving status requires origin AUTO or DRIVER.",
      }));
      valid = false;
    }

    if (form.eventCode !== "DS_D" && form.origin === "AUTO") {
      setErrors((prev) => ({
        ...prev,
        origin: "Only DRIVER origin allowed for this status.",
      }));
      valid = false;
    }

    if (!valid) return;

    // Transform values
    const activeStatus =
      form.isActive?.toLowerCase() === "active" ? true : false;

    const eventDateUTC = eventDateForDb
      ? new Date(eventDateForDb).toISOString()
      : null;
    console.log("event", eventDateUTC);
    const odometerVal = Number(form.odometer);
    const engineHoursVal = form.engineHours
      ? parseFloat(form.engineHours).toFixed(2)
      : null;

    // handle positioning logic for backend payload
    let finalLocationNote = form.locationNote;
    if (form.positioning === "automatic" && form.latitude && form.longitude) {
      finalLocationNote =
        form.calcLocation || `Lat:${form.latitude}, Lng:${form.longitude}`;
    }

    // Validation against company timezone current time
    const companyNow = moment.tz(timeZoneId);
    const selectedEventMoment = eventDateForDb
      ? moment(eventDateForDb).tz(timeZoneId)
      : null;

    if (selectedEventMoment && selectedEventMoment.isAfter(companyNow)) {
      setErrors((prev) => ({
        ...prev,
        eventDate: "You cannot select a future time based on company timezone.",
      }));
      return;
    }

    // Prepare payload for Redux action
    const payload = [
      {
        ...form,
        seqId: Number(form.seqId),
        isActive: activeStatus,
         
        eventDateTime: eventDateForDb,

        odometer: odometerVal,
        engineHours: engineHoursVal,
        notes: form.notes
          ? form.notes
              .split(",")
              .map((n) => n.trim())
              .filter(Boolean)
          : [],
        locationNote: finalLocationNote,
        isEldConnected: form.source === "connected", // force true/false
        isAddEdit: true,
      },
    ];

    // Remove calcLocation before sending
    delete payload[0].calcLocation;
    delete payload[0].source;
    delete payload[0].vehicleNumber;

    console.log("Edit event payload:", payload);

    // Dispatch Redux action
    dispatch(
      addEditEvent(
        companyId,
        driverId,
        eventId,
        payload,
        selectedDate,
        navigate
      )
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
            Edit Event{" "}
            <span className="text-muted fs-14">(System Administrator)</span>
          </div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="primary"
              type="submit"
              form="add-user-form"
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <>
                  <i className="bi bi-pencil"></i> Edit Event
                </>
              )}
            </Button>
            {/* <Button
                            variant="white"
                            className="bg-white border-gray"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button> */}
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => {
                if (selectedDate && companyId && driverId) {
                  navigate(
                    `/driver-hos/graph-details/${companyId}/${driverId}`,
                    {
                      state: {
                        selectedDate,
                        timeZoneId,
                      },
                    }
                  );
                } else {
                  navigate(-1); // fallback if no date
                }
              }}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="bg-theme4 border form-wrapper rounded-2 p-3 p-md-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <Form id="add-user-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-xl-12">
                <div className="row g-3">
                  {/* <div className="col-sm-6">
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
                                            {errors.seqId && <div className="text-danger">{errors.seqId}</div>}
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
                                    </div> */}

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Seq ID<span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={form.seqId}
                        onChange={(e) => updateField("seqId", e.target.value)}
                        placeholder="Enter seq id"
                        required
                        style={{ MozAppearance: "textfield" }} // extra safety for Firefox inline
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
                    {errors.seqId && (
                      <div className="text-danger">{errors.seqId}</div>
                    )}
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
                      <option value="">-- Not Selected --</option>
                      <option value="connected">
                        Generated when connected to ECM
                      </option>
                      <option value="disconnected">
                        Generated when not connected to ECM
                      </option>
                      {/* <option value="Manual Location">Manual Location</option>
                                            <option value="Calculated Location">
                                                Calculated Location
                                            </option> */}
                    </Form.Select>
                  </div>

                  {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">
                                            Date & Time<span className="text-danger">*</span>
                                        </Form.Label>
                                        <div className="w-100">
                                            <DatePicker
                                                selected={eventDate}
                                                onChange={(date) => {
                                                    const selectedInTZ = moment.tz(date, timeZoneId);
                                                    const nowInTZ = moment.tz(timeZoneId);

                                                    // check if selected date is in future (based on timezone)
                                                    if (selectedInTZ.isAfter(nowInTZ)) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            eventDate: "You cannot select a future time based on company timezone.",
                                                        }));
                                                    } else {
                                                        setErrors((prev) => ({ ...prev, eventDate: "" }));
                                                        setEventDate(selectedInTZ.toDate());
                                                    }
                                                }}
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                                required
                                            />
                                            {errors.eventDate && (
                                                <div className="text-danger">{errors.eventDate}</div>
                                            )}
                                        </div>
                                    </div> */}

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Date & Time<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="w-100">
                      {/* <DatePicker
                                                selected={
                                                    eventDate
                                                        ? new Date(moment(eventDate).format("YYYY-MM-DDTHH:mm:ss"))
                                                        : null
                                                }
                                                onChange={(date) => {
                                                    if (!date) return;

                                                    // interpret the picked local time as company timezone
                                                    const selectedInTZ = moment.tz(
                                                        moment(date).format("YYYY-MM-DD HH:mm:ss"),
                                                        "YYYY-MM-DD HH:mm:ss",
                                                        timeZoneId
                                                    );

                                                    const nowInTZ = moment.tz(timeZoneId);

                                                    if (selectedInTZ.isAfter(nowInTZ)) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            eventDate: "You cannot select a future time based on company timezone.",
                                                        }));
                                                    } else {
                                                        setErrors((prev) => ({ ...prev, eventDate: "" }));
                                                        setEventDate(selectedInTZ); // store moment (not raw Date)
                                                    }
                                                }}
                                                showTimeSelect
                                                timeFormat="hh:mm aa"
                                                timeIntervals={1}
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                                required
                                                placeholderText={`Select date/time (${timeZoneId})`}
                                            /> */}
                      {/* <div className="col-sm-6">
                                                <Form.Label className="fw-semibold">
                                                    Date & Time<span className="text-danger">*</span>
                                                </Form.Label>
                                                <div className="w-100"> */}
                                            <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{
                            fontWeight: "bold",
                            marginBottom: "5px",
                            display: "block",
                          }}
                        >
                          Select Event Date/Time (Company Timezone: {timeZoneId})
                        </label>
                        <DatePicker
                          selected={eventDate ? moment(eventDate).toDate() : null}
                          onChange={(date) => {
                            if (!date) return;

                            const companyTimeZone = timeZoneId;
                            const dateString = moment(date).format(
                              "YYYY-MM-DD HH:mm:ss"
                            );
                            const dateInCompanyTZ = moment.tz(
                              dateString,
                              "YYYY-MM-DD HH:mm:ss",
                              companyTimeZone
                            );

                            const nowInTZ = moment().tz(companyTimeZone);
                            if (dateInCompanyTZ.isAfter(nowInTZ)) {
                              setErrors((prev) => ({
                                ...prev,
                                eventDate:
                                  "You cannot select a future time based on company timezone.",
                              }));
                              return;
                            }

                            setErrors((prev) => ({
                              ...prev,
                              eventDate: "",
                            }));

                            setEventDate(date);
                            setEventDateForDb(dateInCompanyTZ.utc().toDate());
                          }}
                          showTimeSelect
                          timeFormat="hh:mm aa"
                          timeIntervals={1}
                          dateFormat="MMMM d, yyyy hh:mm aa"
                          className="form-control"
                          placeholderText={`Select date/time (${timeZoneId})`}
                          wrapperClassName="w-100"
                          required
                        />
                      </div>

                      {/* Show current company time below */}
                      {/* <div className="mt-1 text-muted small">
                                                        Current time ({timeZoneId}):{" "}
                                                        {moment().tz(timeZoneId).format("MMMM D, YYYY hh:mm:ss A")}
                                                    </div>

                                                    {errors.eventDate && (
                                                        <div className="text-danger">{errors.eventDate}</div>
                                                    )} */}
                      {/* </div>
                                            </div> */}

                      {/* Display timezone info below */}
                      <div className="mt-1 text-muted small">
                        Current time ({timeZoneId}):{" "}
                        {moment()
                          .tz(timeZoneId)
                          .format("MMMM D, YYYY hh:mm:ss A")}
                      </div>

                      {errors.eventDate && (
                        <div className="text-danger">{errors.eventDate}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Positioning<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.positioning}
                      onChange={(e) =>
                        updateField("positioning", e.target.value)
                      }
                      required
                    >
                      <option value="">-- Not Selected --</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Status<span className="text-danger">*</span>
                    </Form.Label>
                  <Form.Select
                      value={form.eventCode}
                      onChange={(e) => updateField("eventCode", e.target.value)}
                      required
                    >
                    <option value="">-- Not Selected --</option>

                      
                      <option value="DS_OFF">Off Duty</option>
                      <option value="DS_SB">Sleeper Berth</option>
                      <option value="DS_ON">On Duty</option>
                      <option value="DS_D">Driving</option>

                      
                      <option value="DR_IND_YM">Yard Move</option>
                      <option value="DR_IND_PC">Personal Conveyance</option>

                      
                      <option value="DR_LOGIN">Driver Login</option>
                      <option value="DR_LOGOUT">Driver Logout</option>

                      
                      <option value="DR_CERT">Driver Certification</option>
                      <option value="DR_CERT_1">Driver Certification 1</option>
                      <option value="DR_CERT_2">Driver Certification 2</option>
                      <option value="DR_CERT_3">Driver Certification 3</option>
                      <option value="DR_CERT_4">Driver Certification 4</option>
                      <option value="DR_CERT_5">Driver Certification 5</option>
                      <option value="DR_CERT_6">Driver Certification 6</option>
                      <option value="DR_CERT_7">Driver Certification 7</option>
                      <option value="DR_CERT_8">Driver Certification 8</option>
                      <option value="DR_CERT_9">Driver Certification 9</option>

                      <option value="ENG_UP_NORMAL">Engine Power Up (Normal)</option>
                      <option value="ENG_DOWN_NORMAL">Engine Power Down (Normal)</option>
                      <option value="ENG_UP_REDUCED">Engine Power Up (Reduced)</option>
                      <option value="ENG_DOWN_REDUCED">Engine Power Down (Reduced)</option>

                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Location Note
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.locationNote}
                      placeholder="Enter location note"
                      disabled={form.positioning === "automatic"}
                      onChange={(e) =>
                        updateField("locationNote", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Origin<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.origin}
                      onChange={(e) => updateField("origin", e.target.value)}
                      required
                    >
                      <option value="">-- Not Selected --</option>
                      <option value="DRIVER">Driver</option>
                      <option value="AUTO">Auto</option>
                    </Form.Select>
                    {errors.origin && (
                      <div className="text-danger">{errors.origin}</div>
                    )}
                  </div>

                  <div className="col-sm-3">
                    <Form.Label className="fw-semibold">
                      Latitude<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.latitude}
                      onChange={(e) => updateField("latitude", e.target.value)}
                      placeholder="Enter latitude"
                      disabled={form.positioning === "manual"}
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
                      placeholder="Enter longitude"
                      disabled={form.positioning === "manual"}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      State<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.isActive}
                      onChange={(e) => updateField("isActive", e.target.value)}
                      required
                    >
                      <option value="">-- Not Selected --</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Calc. Location
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.calcLocation}
                      placeholder="Enter calc location"
                      disabled={form.positioning === "manual"}
                      onChange={(e) =>
                        updateField("calcLocation", e.target.value)
                      }
                      // placeholder="6046.5mi WSW of Bethel, AK"
                      // disabled
                    />
                  </div>

 
                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Vehicle<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={form.vehicleId}
                      onChange={(e) => updateField("vehicleId", e.target.value)}
                      required
                    >
                      <option value="">-- Not Selected --</option>
                      {vehiclesLoading && <option>Loading...</option>}

                      {/* Normal assignable vehicles */}
                      {assignableVehicles?.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.vehicleNumber}
                        </option>
                      ))}

                      {/* If prefilled vehicle is NOT in assignableVehicles, show it separately */}
                      {form.vehicleId &&
                        !assignableVehicles?.some(
                          (v) => v._id === form.vehicleId
                        ) && (
                          <option value={form.vehicleId}>
                            {form.vehicleNumber ||
                              "Previously Assigned Vehicle"}
                          </option>
                        )}
                    </Form.Select>
                  </div>

                  {/* <div className="col-sm-6">
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
                                    </div> */}

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Notes</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={form.notes || ""}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Enter notes separated by commas"
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
                      placeholder="Enter odometer"
                      required
                    />
                    {errors.odometer && (
                      <div className="text-danger">{errors.odometer}</div>
                    )}
                  </div>

                  {/* <div className="col-sm-6">
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
                                    </div> */}
                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">Event Tags</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {chips.map((chip) => (
                        <Badge
                          bg="light"
                          key={chip}
                          className="text-body fw-medium border px-2 py-2 cursor-pointer"
                          onClick={() => handleChipClick(chip)} // click handler
                          style={{ cursor: "pointer" }}
                        >
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">
                      Engine Hours<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={form.engineHours}
                      placeholder="Enter engine hours"
                      onChange={(e) =>
                        updateField("engineHours", e.target.value)
                      }
                      required
                    />
                    {errors.engineHours && (
                      <div className="text-danger">{errors.engineHours}</div>
                    )}
                  </div>

                  <div className="col-sm-6">
                    <Form.Label className="fw-semibold">ELD</Form.Label>
                    <Form.Select
                      value={form.eldId || ""}
                      onChange={(e) => updateField("eldId", e.target.value)}
                    >
                      <option value="">-- Not Selected --</option>
                      {eldLoading && <option>Loading...</option>}
                      {unassignedElds?.length > 0
                        ? unassignedElds.map((eld) => (
                            <option key={eld._id} value={eld._id}>
                              {eld.serialNumber} ({eld.macAddress})
                            </option>
                          ))
                        : !eldLoading && (
                            <option disabled>No unassigned ELDs</option>
                          )}
                    </Form.Select>
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

export default EditEvent;

