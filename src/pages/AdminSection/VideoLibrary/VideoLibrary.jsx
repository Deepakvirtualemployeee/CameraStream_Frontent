import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./VideoLibrary.scss";

const LIVE_ROWS = [
  {
    id: "cam-1",
    type: "Road-facing Main Camera",
    cameraSn: "200147",
    vehicleId: "001",
    currentDriver: "N/A",
    location: "16mi W of Somerton, AZ",
    connection: "4G",
    lastSync: "Mar 11, 2026 04:39 AM",
  },
];

const INITIAL_REQUESTS = [
  {
    id: "req-1",
    vehicleId: "001",
    cameraSn: "200147",
    requestedOn: "Mar 09, 2026 11:05 PM",
    duration: "Mar 09, 2026 10:25 PM - 01:22:23 PM",
    requestedBy: "Manpreet Singh",
  },
  {
    id: "req-2",
    vehicleId: "001",
    cameraSn: "200147",
    requestedOn: "Mar 10, 2026 12:07 PM",
    duration: "Mar 09, 2026 08:23:52 AM - 02:09:52 AM",
    requestedBy: "Manpreet Singh",
  },
];

const initialRequestForm = {
  vehicleId: "",
  date: "",
  cameraView: "road",
  videoType: "standard",
  hour: "12",
  minute: "00",
  second: "00",
  durationMinute: "02",
  durationSecond: "00",
};

export const VideoLibrary = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "live");
  const [search, setSearch] = useState("");

  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const [showRequestModal, setShowRequestModal] = useState(
    Boolean(location.state?.openRequestModal)
  );
  const [requestForm, setRequestForm] = useState({
    ...initialRequestForm,
    vehicleId: location.state?.vehicleId || "",
  });

  useEffect(() => {
    if (!location.state) return;

    if (location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    if (location.state.openRequestModal) {
      setShowRequestModal(true);
      setRequestForm((prev) => ({
        ...prev,
        vehicleId: location.state.vehicleId || prev.vehicleId,
      }));
    }
  }, [location.state]);

  const filteredLive = useMemo(() => {
    if (!search.trim()) return LIVE_ROWS;
    const q = search.toLowerCase();
    return LIVE_ROWS.filter((row) =>
      [row.type, row.cameraSn, row.vehicleId, row.location]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  const vehicleOptions = useMemo(
    () => ["all", ...new Set([...LIVE_ROWS.map((row) => row.vehicleId), ...requests.map((req) => req.vehicleId)])],
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const vehicleMatch =
        vehicleFilter === "all" ? true : req.vehicleId === vehicleFilter;
      const dateMatch = dateFilter
        ? req.requestedOn.toLowerCase().includes(dateFilter.toLowerCase())
        : true;
      return vehicleMatch && dateMatch;
    });
  }, [requests, vehicleFilter, dateFilter]);

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setRequestForm(initialRequestForm);
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!requestForm.vehicleId || !requestForm.date) return;

    const nextRow = {
      id: `req-${Date.now()}`,
      vehicleId: requestForm.vehicleId,
      cameraSn: "200147",
      requestedOn: new Date().toLocaleString(),
      duration: `${requestForm.date} ${requestForm.hour}:${requestForm.minute}:${requestForm.second} (${requestForm.durationMinute}m ${requestForm.durationSecond}s)`,
      requestedBy: "Current User",
    };

    setRequests((prev) => [nextRow, ...prev]);
    closeRequestModal();
  };

  return (
    <div className="video-library-page py-3">
      <div className="container-fluid">
        <div className="bg-white border rounded-3 shadow-sm">
          <div className="px-3 px-md-4 pt-3">
            <h4 className="video-library-title mb-3">Video Library</h4>
            <div className="video-library-tabs d-flex align-items-center gap-2 border-bottom">
              <button
                type="button"
                className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
                onClick={() => setActiveTab("live")}
              >
                Live
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
                onClick={() => setActiveTab("requests")}
              >
                Requests ({requests.length})
              </button>
            </div>
          </div>

          {activeTab === "live" ? (
            <div className="p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <div className="searchfield-wrapper video-search-input">
                  <span className="icon">
                    <i className="bi bi-search"></i>
                  </span>
                  <Form.Control
                    type="search"
                    placeholder="Search by Vehicle ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button type="button" className="icon-btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>

              <div className="table-responsive video-table-wrapper">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Camera SN</th>
                      <th>Vehicle ID</th>
                      <th>Current Driver</th>
                      <th>Location</th>
                      <th>Connection</th>
                      <th>Last Sync</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLive.map((row) => (
                      <tr key={row.id}>
                        <td>{row.type}</td>
                        <td>{row.cameraSn}</td>
                        <td>{row.vehicleId}</td>
                        <td>{row.currentDriver}</td>
                        <td>{row.location}</td>
                        <td>
                          <span className="status-pill success">{row.connection}</span>
                        </td>
                        <td>{row.lastSync}</td>
                        <td className="text-danger fw-medium">Live Stream</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-3 p-md-4">
              <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
                <div className="d-flex flex-wrap align-items-end gap-2">
                  <div>
                    <label className="small text-muted d-block mb-1">Filter By Vehicles</label>
                    <Form.Select
                      value={vehicleFilter}
                      onChange={(e) => setVehicleFilter(e.target.value)}
                      className="filter-select"
                    >
                      {vehicleOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "all" ? "All" : opt}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div>
                    <label className="small text-muted d-block mb-1">Filter By Date</label>
                    <Form.Control
                      type="text"
                      value={dateFilter}
                      placeholder="Mar 04, 2026 - Mar 11, 2026"
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="filter-select"
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="request-btn"
                    onClick={() => setShowRequestModal(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Request Video
                  </Button>
                  <button type="button" className="icon-btn">
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              <div className="table-responsive video-table-wrapper">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Camera SN</th>
                      <th>Requested On</th>
                      <th>Video Duration</th>
                      <th>Status</th>
                      <th>Requested By</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((row) => (
                      <tr key={row.id}>
                        <td>{row.vehicleId}</td>
                        <td>{row.cameraSn}</td>
                        <td>{row.requestedOn}</td>
                        <td>{row.duration}</td>
                        <td>
                          <span className="status-pill play me-2">Play</span>
                          <span className="status-pill download">Download</span>
                        </td>
                        <td>{row.requestedBy}</td>
                        <td>
                          <button type="button" className="icon-link" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showRequestModal}
        onHide={closeRequestModal}
        centered
        className="request-video-modal"
      >
        <Form onSubmit={handleCreateRequest}>
          <Modal.Header closeButton>
            <Modal.Title>Request Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Select
                value={requestForm.vehicleId}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, vehicleId: e.target.value }))
                }
                required
              >
                <option value="">Please enter Vehicle ID</option>
                {vehicleOptions
                  .filter((item) => item !== "all")
                  .map((vehicleId) => (
                    <option key={vehicleId} value={vehicleId}>
                      {vehicleId}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={requestForm.date}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, date: e.target.value }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Camera View</Form.Label>
              <div className="d-flex gap-2">
                <Form.Check
                  inline
                  type="radio"
                  id="road-view"
                  label="Road View"
                  name="cameraView"
                  checked={requestForm.cameraView === "road"}
                  onChange={() =>
                    setRequestForm((prev) => ({ ...prev, cameraView: "road" }))
                  }
                />
                <Form.Check
                  inline
                  type="radio"
                  id="cabin-view"
                  label="Cabin View"
                  name="cameraView"
                  checked={requestForm.cameraView === "cabin"}
                  onChange={() =>
                    setRequestForm((prev) => ({ ...prev, cameraView: "cabin" }))
                  }
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video Type</Form.Label>
              <div className="d-flex flex-column gap-2">
                {["standard", "high", "hyperlapse"].map((type) => (
                  <Form.Check
                    key={type}
                    type="radio"
                    id={`video-type-${type}`}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    name="videoType"
                    checked={requestForm.videoType === type}
                    onChange={() =>
                      setRequestForm((prev) => ({ ...prev, videoType: type }))
                    }
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  value={requestForm.hour}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, hour: e.target.value }))
                  }
                />
                <span>:</span>
                <Form.Control
                  value={requestForm.minute}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, minute: e.target.value }))
                  }
                />
                <span>:</span>
                <Form.Control
                  value={requestForm.second}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, second: e.target.value }))
                  }
                />
                <Button type="button" variant="outline-secondary" size="sm">
                  Add
                </Button>
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  value={requestForm.durationMinute}
                  onChange={(e) =>
                    setRequestForm((prev) => ({
                      ...prev,
                      durationMinute: e.target.value,
                    }))
                  }
                />
                <small className="text-muted">mins</small>
                <Form.Control
                  value={requestForm.durationSecond}
                  onChange={(e) =>
                    setRequestForm((prev) => ({
                      ...prev,
                      durationSecond: e.target.value,
                    }))
                  }
                />
                <small className="text-muted">secs</small>
              </div>
              <div className="text-muted small mt-1">Minimum 10s, Maximum 5 mins</div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="light" onClick={closeRequestModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Request Video
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
 
    </div>
  );
};
