import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Button, Form, InputGroup, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Edit Screen for Driver HOS Events (UI only)
// Mirrors the look-and-feel from the provided design and existing theme
export const AddEvent = () => {
    const [eventDate, setEventDate] = useState(new Date());
    const navigate = useNavigate();

    const [form, setForm] = useState({
        seqId: 21,
        locationSource: "Generated when connected to ECM",
        positioning: "Automatic",
        status: "Sleeper",
        origin: "Driver",
        state: "Active",
        vehicle: "TESTG",
        odometer: "62137",
        engineHours: "1.0",
        eld: "3B4000178655(C8:28:31:D6:56:...)"
    });

    const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const incrementSeq = (delta) => updateField("seqId", Number(form.seqId || 0) + delta);

    const chips = [
        "PTI", "Pick up", "Delivery", "Break", "Fuel",
        "Scale", "DOT Inspection", "Drop", "Hook",
        "Drop & Hook", "Co-Driver Joined", "Co-Driver Left"
    ];

    return (
        <div className="EditEvent-page py-3">
            <div className="container-fluid"  style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Add Event <span className="text-muted fs-14">(System Administrator)</span></div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='primary' type="submit" form="add-user-form" >
                            <><i className="bi bi-plus-lg fs-16"></i> Add Event</>
                        </Button>
                        <Button variant='white' className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                    </div>
                </div>
                <div className="bg-theme4 border form-wrapper rounded-2 p-3 p-md-4">

                    <Form>
                        <div className="row g-3">
                            {/* Left column */}
                            <div className="col-xl-12">
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Seq ID<span className="text-danger">*</span></Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                value={form.seqId}
                                                onChange={(e) => updateField("seqId", e.target.value)}
                                            />
                                            <Button variant="outline-secondary" onClick={() => incrementSeq(1)}><i className="bi bi-chevron-up" /></Button>
                                            <Button variant="outline-secondary" onClick={() => incrementSeq(-1)}><i className="bi bi-chevron-down" /></Button>
                                        </InputGroup>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Location Source<span className="text-danger">*</span></Form.Label>
                                        <Form.Select value={form.locationSource} onChange={(e) => updateField("locationSource", e.target.value)}>
                                            <option>Generated when connected to ECM</option>
                                            <option>Manual Location</option>
                                            <option>Calculated Location</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Date & Time<span className="text-danger">*</span></Form.Label>
                                        <div className="w-100">
                                            <DatePicker
                                                selected={eventDate}
                                                onChange={setEventDate}
                                                showTimeSelect
                                                dateFormat="MMMM d, yyyy hh:mm aa"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Positioning<span className="text-danger">*</span></Form.Label>
                                        <Form.Select value={form.positioning} onChange={(e) => updateField("positioning", e.target.value)}>
                                            <option>Automatic</option>
                                            <option>Manual</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Status</Form.Label>
                                        <Form.Select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                                            <option>OFF</option>
                                            <option>Sleeper</option>
                                            <option>ON Duty</option>
                                            <option>Driving</option>
                                            <option>Yard Move</option>
                                            <option>Personal Conveyance</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Location Note</Form.Label>
                                        <Form.Control type="text" placeholder="Location Note" />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Origin</Form.Label>
                                        <Form.Select value={form.origin} onChange={(e) => updateField("origin", e.target.value)}>
                                            <option>Driver</option>
                                            <option>System</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-3">
                                        <Form.Label className="fw-semibold">Latitude<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" defaultValue="21.973442" />
                                    </div>
                                    <div className="col-sm-3">
                                        <Form.Label className="fw-semibold">Longitude<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" defaultValue="76.6908" />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">State</Form.Label>
                                        <Form.Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Calc. Location</Form.Label>
                                        <Form.Control type="text" placeholder="6046.5mi WSW of Bethel, AK" disabled />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Vehicle</Form.Label>
                                        <Form.Select value={form.vehicle} onChange={(e) => updateField("vehicle", e.target.value)}>
                                            <option>TESTG</option>
                                            <option>93005</option>
                                        </Form.Select>
                                    </div>

                                    {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Actions</Form.Label>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button variant="white" className="bg-white border-gray">Copy</Button>
                                            <Button variant="white" className="bg-white border-gray">Paste</Button>
                                            <Button variant="white" className="bg-white border-gray">Map <i className="bi bi-geo-alt ms-1" /></Button>
                                        </div>
                                    </div> */}

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Notes</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" placeholder="Notes" />
                                            <Button variant="outline-secondary">Clear</Button>
                                        </InputGroup>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Odometer(mi)<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="number" value={form.odometer} onChange={(e) => updateField("odometer", e.target.value)} />
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Event Tags</Form.Label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {chips.map((chip) => (
                                                <Badge bg="light" key={chip} className="text-body fw-medium border px-2 py-2">
                                                    {chip}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">Engine Hours</Form.Label>
                                        <Form.Control type="text" value={form.engineHours} onChange={(e) => updateField("engineHours", e.target.value)} />
                                    </div>

                                    {/* <div className="col-sm-6">
                                        <Form.Label className="fw-semibold">ELD</Form.Label>
                                        <Form.Select value={form.eld} onChange={(e) => updateField("eld", e.target.value)}>
                                            <option>{form.eld}</option>
                                            <option>Another ELD</option>
                                        </Form.Select>
                                    </div>

                                    <div className="col-12">
                                        <Form.Label className="fw-semibold">Trailers</Form.Label>
                                        <Form.Control type="text" placeholder="Separated by space; example: val1 val2" />
                                    </div>

                                    <div className="col-12">
                                        <Form.Label className="fw-semibold">Shipping Docs</Form.Label>
                                        <Form.Control type="text" placeholder="Separated by space; example: val1 val2" />
                                    </div> */}
                                </div>
                            </div>

                            {/* Right column (empty spacer to align with design) */}
                            <div className="col-xl-6 d-none d-xl-block"></div>
                        </div>
                    </Form>
                    {/* <div className="text-muted fs-12 mt-3">Lucid ELD, as your service provider, is not responsible for any financial or legal repercussions resulting from facilitating your request. It is the sole responsibility of the user to maintain legal compliance while using ELD.</div> */}
                </div>
            </div>
        </div>
    );
};

export default AddEvent;


