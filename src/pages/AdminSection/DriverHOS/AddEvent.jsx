import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, InputGroup, Badge, Spinner } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addEditEvent } from "../../../store/actions/driverHOS"; // redux action
import { getAssignableVehicles } from "../../../store/actions/vehicles";
import moment from "moment-timezone";
import {fetchLocationFromLatLng} from "../../../data/utils";

export const AddEvent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { timeZoneId } = location.state || {};
    console.log("timeZoneId", timeZoneId);

    // helper: get now in company timezone as Date object
    const getNowInTZ = () => {
        return moment.tz(timeZoneId).toDate();
    };

    const { companyId, driverId } = useParams(); // company and driver id from URL
    const [errors, setErrors] = useState({});

    const { loading, error } = useSelector(
        (state) => state.addEditEvent || { loading: false, error: null }
    );
    const { assignableVehicles, loading: vehiclesLoading } = useSelector((state) => state.vehicles);

    // const companyNow = moment().tz(timeZoneId);
    const companyNow = moment.tz(timeZoneId);


    // dynamic form state (empty on page load)
    const [eventDate, setEventDate] = useState(new Date());
    const [form, setForm] = useState({
        // companyId: companyId,
        seqId: null,
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
        isEldConnected: false,   // added
        calcLocation: ""         // added for automatic positioning
    });

    // const updateField = (key, value) =>
    //     setForm((prev) => ({ ...prev, [key]: value }));

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
    //     updateField("seqId", Number(form.seqId || 0) + delta);

    const incrementSeq = (delta) => {
        setForm((prev) => {
            let newVal = Number(prev.seqId || 0) + delta;
            if (newVal < 0) newVal = 0; // prevent negative
            return { ...prev, seqId: newVal };
        });
    };


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

    const handleChipClick = (chip) => {
        let currentNotes = form.notes ? form.notes.split(",").map(n => n.trim()) : [];
        if (!currentNotes.includes(chip)) {
            currentNotes.push(chip);
            updateField("notes", currentNotes.join(", "));
        }
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
                if (!value || value <= 0 || value >= 10000000 || !Number.isInteger(Number(value))) {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;

        isValid &= validateField("seqId", form.seqId);
        isValid &= validateField("eventDate", eventDate);
        isValid &= validateField("eventCode", form.eventCode);
        isValid &= validateField("origin", form.origin);
        isValid &= validateField("odometer", form.odometer);
        isValid &= validateField("engineHours", form.engineHours);

        if (!isValid) {
            return; // stop submit if errors
        }

        // Transform values
        const activeStatus =
            form.isActive?.toLowerCase() === "active" ? true : false;

        const eventDateUTC = new Date(eventDate).toISOString();
        const odometerVal = Number(form.odometer);
        const engineHoursVal = form.engineHours
            ? parseFloat(form.engineHours).toFixed(2)
            : null;

        // handle positioning logic for backend payload
        let finalLocationNote = form.locationNote;
        if (form.positioning === "automatic" && form.latitude && form.longitude) {
            finalLocationNote = form.calcLocation || `Lat:${form.latitude}, Lng:${form.longitude}`;
        }

        // Validation against company timezone current time
        const companyNow = moment.tz(timeZoneId);

        if (moment(eventDate).isAfter(companyNow)) {
            setErrors((prev) => ({
                ...prev,
                eventDate: "You cannot select a future time based on company timezone.",
            }));
            return;
        }

        const payload = [
            {
                ...form,
                seqId: Number(form.seqId),
                isActive: activeStatus,
                eventDateTime: eventDateUTC,
                odometer: odometerVal,
                engineHours: engineHoursVal,
                notes: form.notes
                    ? form.notes.split(",").map((n) => n.trim()).filter(Boolean)
                    : [],
                locationNote: finalLocationNote,
                isEldConnected: form.source === "connected",  // force true/false
                isAddEdit: false,
            },
        ];

        // Remove calcLocation, source, and vehicleNumber before sending
        delete payload[0].calcLocation;
        delete payload[0].source;
        delete payload[0].vehicleNumber;

        console.log("Add event payload:", payload);
        dispatch(addEditEvent(companyId, driverId, null, payload, navigate));
    };

    // Fetch Assignable Vehicles
    useEffect(() => {
        if (companyId) {
            dispatch(getAssignableVehicles(companyId));
        }
    }, [companyId, dispatch]);

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
                                                required
                                                placeholder="Enter seq id"
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
                                        {errors.seqId && <div className="text-danger">{errors.seqId}</div>}
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

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">
                                            Date & Time<span className="text-danger">*</span>
                                        </Form.Label>
                                        <div className="w-100">
                                            {/* <DatePicker
                                                selected={eventDate}
                                                onChange={setEventDate}
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                                required
                                                maxDate={companyNow.toDate()}   // restrict date
                                                maxTime={
                                                    eventDate && moment(eventDate).isSame(companyNow, "day")
                                                        ? companyNow.toDate()
                                                        : moment().endOf("day").toDate()
                                                }
                                            /> */}
                                            {/* <DatePicker
                                                selected={eventDate}
                                                onChange={setEventDate}
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                                required
                                                maxDate={companyNow.toDate()} // restrict date
                                                minTime={moment().startOf("day").toDate()} // beginning of the day
                                                maxTime={
                                                    eventDate && moment(eventDate).isSame(companyNow, "day")
                                                        ? companyNow.toDate() // restrict until current time if today
                                                        : moment().endOf("day").toDate() // full day available if past date
                                                }
                                            /> */}
                                            <DatePicker
                                                selected={eventDate}
                                                onChange={(date) => {
                                                    // convert picked date into company timezone moment
                                                    const zoned = moment.tz(date, timeZoneId);
                                                    setEventDate(zoned.toDate());
                                                }}
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                                required
                                                // Restrict calendar to today or earlier
                                                maxDate={getNowInTZ()}
                                                // Min time = start of the selected day
                                                minTime={moment.tz(eventDate || getNowInTZ(), timeZoneId).startOf("day").toDate()}
                                                // Max time = now (if same day), otherwise full day
                                                maxTime={
                                                    eventDate &&
                                                        moment(eventDate).tz(timeZoneId).isSame(moment.tz(timeZoneId), "day")
                                                        ? getNowInTZ()
                                                        : moment.tz(eventDate || getNowInTZ(), timeZoneId).endOf("day").toDate()
                                                }
                                            />

                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Positioning<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={form.positioning}
                                            onChange={(e) => updateField("positioning", e.target.value)}
                                            required
                                        >
                                            <option value="">-- Not Selected --</option>
                                            <option value="automatic">Automatic</option>
                                            <option value="manual">Manual</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Status<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={form.eventCode}
                                            onChange={(e) => updateField("eventCode", e.target.value)}
                                            required
                                        >
                                            <option value="">-- Not Selected --</option>
                                            <option value="DS_OFF">OFF</option>
                                            <option value="DS_SB">Sleeper</option>
                                            <option value="DS_ON">ON Duty</option>
                                            <option value="DS_D">Driving</option>
                                            <option value="DR_IND_YM">Yard Move</option>
                                            <option value="DR_IND_PC">Personal Conveyance</option>
                                        </Form.Select>
                                    </div>

                                    {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Location Note</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.locationNote}
                                            onChange={(e) =>
                                                updateField("locationNote", e.target.value)
                                            }
                                        />
                                    </div> */}
                                    {/* Location Note (disabled if Automatic) */}
                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Location Note</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.locationNote}
                                            placeholder="Enter location note"
                                            disabled={form.positioning === "automatic"}
                                            onChange={(e) => updateField("locationNote", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Origin<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={form.origin}
                                            onChange={(e) => updateField("origin", e.target.value)}
                                            required
                                        >
                                            <option value="">-- Not Selected --</option>
                                            <option value="DRIVER">Driver</option>
                                            <option value="AUTO">Auto</option>
                                        </Form.Select>
                                        {errors.origin && <div className="text-danger">{errors.origin}</div>}
                                    </div>

                                    <div className="col-sm-3">
                                        <Form.Label className="fw-semibold">
                                            Latitude<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.latitude}
                                            placeholder="Enter latitude"
                                            disabled={form.positioning === "manual"}
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
                                            placeholder="Enter longitude"
                                            disabled={form.positioning === "manual"}
                                            onChange={(e) => updateField("longitude", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">State<span className="text-danger">*</span></Form.Label>
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

                                    {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Calc. Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // placeholder="6046.5mi WSW of Bethel, AK"
                                            placeholder="Enter calc location"
                                            disabled={form.positioning === "manual"}
                                        />
                                    </div> */}

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Calc. Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={form.calcLocation}
                                            placeholder="Enter calc location"
                                            disabled={form.positioning === "manual"}
                                            onChange={(e) => updateField("calcLocation", e.target.value)}
                                        />
                                    </div>


                                    {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Vehicle</Form.Label>
                                        <Form.Select
                                            value={form.vehicleId}
                                            onChange={(e) => updateField("vehicleId", e.target.value)}
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="TESTG">TESTG</option>
                                            <option value="93005">93005</option>
                                        </Form.Select>
                                    </div> */}
                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Vehicle<span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={form.vehicleId}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                const selectedVehicle = assignableVehicles.find(v => v._id === selectedId);

                                                updateField("vehicleId", selectedId);
                                            }}
                                            required
                                        >
                                            <option value="">-- Not Selected --</option>
                                            {vehiclesLoading && <option>Loading...</option>}
                                            {assignableVehicles?.map((v) => (
                                                <option key={v._id} value={v._id}>
                                                    {v.vehicleNumber}
                                                </option>
                                            ))}
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
                                            placeholder="Enter odometer"
                                            value={form.odometer}
                                            onChange={(e) => updateField("odometer", e.target.value)}
                                            required
                                        />
                                        {errors.odometer && <div className="text-danger">{errors.odometer}</div>}
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
                                                    onClick={() => handleChipClick(chip)}  // click handler
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {chip}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Engine Hours<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter engine hours"
                                            value={form.engineHours}
                                            onChange={(e) =>
                                                updateField("engineHours", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.engineHours && <div className="text-danger">{errors.engineHours}</div>}
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
