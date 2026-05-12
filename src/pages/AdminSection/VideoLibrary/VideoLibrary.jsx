import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../axios-config";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import moment from "moment-timezone";
import "./VideoLibrary.scss";

const LIVE_ROWS = [
  {
    id: "cam-1",
    type: "Road-facing Main Camera",
    cameraSn: "200147",
    deviceID: "200147",
    vehicleId: "001",
    currentDriver: "N/A",
    location: "16mi W of Somerton, AZ",
    connection: "4G",
    lastSync: "Mar 11, 2026 04:39 AM",
  },
];

const INITIAL_REQUESTS = [];

const initialRequestForm = {
  deviceNo: "",
  resStartTime: null,
  resEndTime: null,
  channel: "1",
  resDeviceFileName: "",
  fileFormat: "mp4",
};

const formatDateTimeForApi = (value) => {
  if (!value) return "";
  const parsedDate = moment(value);
  return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD HH:mm:ss") : "";
};

const CHANNEL_OPTIONS = [
  { value: "1", label: "Channel 1" },
  { value: "2", label: "Channel 2" },
  { value: "3", label: "Channel 3" },
  { value: "4", label: "Channel 4" },
];

const FILE_FORMAT_OPTIONS = [
  { value: "mp4", label: "MP4" },
];

const getRecordsFromResponse = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.data?.docs)) return responseData.data.docs;
  if (Array.isArray(responseData?.data?.videos)) return responseData.data.videos;
  if (Array.isArray(responseData?.data?.downloadedVideos)) return responseData.data.downloadedVideos;
  if (Array.isArray(responseData?.data?.records)) return responseData.data.records;
  if (Array.isArray(responseData?.docs)) return responseData.docs;
  if (Array.isArray(responseData?.videos)) return responseData.videos;
  if (Array.isArray(responseData?.downloadedVideos)) return responseData.downloadedVideos;
  if (Array.isArray(responseData?.records)) return responseData.records;
  return [];
};

const formatRequestRow = (record, fallbackPayload, fallbackVehicleId, index) => ({
  id:
    record?.id ||
    record?._id ||
    record?.recordId ||
    record?.videoId ||
    `${fallbackPayload?.deviceNo || fallbackPayload?.deviceID || "video"}-${
      fallbackPayload?.resStartTime || fallbackPayload?.startTime || "request"
    }-${index}`,
  vehicleId:
    record?.vehicleId ||
    record?.vehicleID ||
    record?.vehicleNumber ||
    fallbackVehicleId ||
    "-",
  cameraSn:
    record?.cameraSn ||
    record?.cameraSN ||
    record?.cameraSerialNumber ||
    record?.deviceNo ||
    record?.deviceID ||
    record?.deviceId ||
    fallbackPayload?.deviceNo ||
    fallbackPayload?.deviceID ||
    "-",
  requestedOn:
    record?.requestedOn ||
    record?.requestDate ||
    record?.createdAt ||
    record?.updatedAt ||
    new Date().toLocaleString(),
  duration:
    record?.duration ||
    record?.videoDuration ||
    `${record?.resStartTime || record?.startTime || fallbackPayload?.resStartTime || fallbackPayload?.startTime || "-"} - ${
      record?.resEndTime || record?.endTime || fallbackPayload?.resEndTime || fallbackPayload?.endTime || "-"
    }`,
  status:
    record?.status ||
    record?.downloadStatus ||
    (record?.downloadUrl || record?.downloadURL || record?.playUrl ? "Ready" : "Requested"),
  requestedBy:
    record?.requestedBy ||
    record?.requestedUser ||
    record?.userName ||
    record?.createdBy ||
    "Current User",
  raw: record,
});

export const VideoLibrary = () => {
  const location = useLocation();
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "live");
  const [search, setSearch] = useState("");

  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [lastSearchMeta, setLastSearchMeta] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(
    Boolean(location.state?.openRequestModal)
  );
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({
    ...initialRequestForm,
    deviceNo: location.state?.deviceID || "",
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
        deviceNo: location.state.deviceID || prev.deviceNo,
      }));
    }
  }, [location.state]);

  const fetchDownloadedVideos = useCallback(async () => {
    if (!companyId) {
      setRequests([]);
      return;
    }

    try {
      setLoadingRequests(true);
      const response = await axios.get("/video/downloaded-videos", {
        params: { companyId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const records = getRecordsFromResponse(response.data);
      setRequests(
        records.map((record, index) =>
          formatRequestRow(record, {}, location.state?.vehicleId, index)
        )
      );
      setLastSearchMeta(null);
    } catch (error) {
      setRequests([]);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to fetch requested videos."
      );
    } finally {
      setLoadingRequests(false);
    }
  }, [companyId, location.state?.vehicleId]);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchDownloadedVideos();
    }
  }, [activeTab, fetchDownloadedVideos]);

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

  const deviceOptions = useMemo(
    () => [...new Set(LIVE_ROWS.map((row) => row.deviceID || row.cameraSn).filter(Boolean))],
    []
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
    setRequestForm({
      ...initialRequestForm,
      deviceNo: location.state?.deviceID || "",
    });
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.deviceNo || !requestForm.resStartTime || !requestForm.resEndTime) {
      toast.error("Device ID, start time, and end time are required.");
      return;
    }

    const payload = {
      deviceNo: requestForm.deviceNo.trim(),
      channel: Number(requestForm.channel),
      resStartTime: formatDateTimeForApi(requestForm.resStartTime),
      resEndTime: formatDateTimeForApi(requestForm.resEndTime),
      resDeviceFileName: requestForm.resDeviceFileName.trim() || "video-request",
      fileFormat: requestForm.fileFormat,
    };

    if (moment(payload.resStartTime).isAfter(moment(payload.resEndTime))) {
      toast.error("End time must be greater than start time.");
      return;
    }

    try {
      setSubmittingRequest(true);
      const response = await axios.post("/video/download/tasks", payload, {
        params: { companyId },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const records = getRecordsFromResponse(response.data);
      const nextRows = records.length
        ? records.map((record, index) =>
            formatRequestRow(record, payload, location.state?.vehicleId, index)
          )
        : [
            formatRequestRow({}, payload, location.state?.vehicleId, 0),
          ];

      setRequests(nextRows);
      setLastSearchMeta({
        total: records.length,
        deviceID: payload.deviceNo,
        startTime: payload.resStartTime,
        endTime: payload.resEndTime,
      });
      toast.success(
        records.length
          ? `Created ${records.length} video request${records.length > 1 ? "s" : ""}.`
          : "Video request submitted successfully."
      );
      closeRequestModal();
    } catch (error) {
      toast.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to request video."
      );
    } finally {
      setSubmittingRequest(false);
    }
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
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={fetchDownloadedVideos}
                    disabled={loadingRequests}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>

              {lastSearchMeta && (
                <div className="small text-muted mb-3">
                  Showing {requests.length} result{requests.length !== 1 ? "s" : ""} for device{" "}
                  <strong>{lastSearchMeta.deviceID}</strong> from {lastSearchMeta.startTime} to{" "}
                  {lastSearchMeta.endTime}
                </div>
              )}

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
                    </tr>
                  </thead>
                  <tbody>
                    {loadingRequests ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          Loading requested videos...
                        </td>
                      </tr>
                    ) : filteredRequests.length ? (
                      filteredRequests.map((row) => (
                        <tr key={row.id}>
                          <td>{row.vehicleId}</td>
                          <td>{row.cameraSn}</td>
                          <td>{row.requestedOn}</td>
                          <td>{row.duration}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                row.status === "Ready" ? "download" : "play"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td>{row.requestedBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No requested videos found.
                        </td>
                      </tr>
                    )}
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
          <Modal.Body className="request-video-form">
            <Form.Group className="request-video-form__group">
              <Form.Label>Device ID</Form.Label>
              <div className="request-video-form__input-wrap">
                <Form.Control
                  list="request-video-device-options"
                  type="text"
                  value={requestForm.deviceNo}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, deviceNo: e.target.value }))
                  }
                  placeholder="Enter device ID"
                  required
                />
                <datalist id="request-video-device-options">
                  {deviceOptions.map((deviceID) => (
                    <option key={deviceID} value={deviceID} />
                  ))}
                </datalist>
              </div>
            </Form.Group>

            <Form.Group className="request-video-form__group">
              <Form.Label>Start Time</Form.Label>
              <CustomDateTimePicker
                value={requestForm.resStartTime}
                onChange={(value) =>
                  setRequestForm((prev) => ({ ...prev, resStartTime: value }))
                }
                placeholder="Select start date and time"
              />
            </Form.Group>

            <Form.Group className="request-video-form__group">
              <Form.Label>End Time</Form.Label>
              <CustomDateTimePicker
                value={requestForm.resEndTime}
                onChange={(value) =>
                  setRequestForm((prev) => ({ ...prev, resEndTime: value }))
                }
                placeholder="Select end date and time"
              />
            </Form.Group>

            <Form.Group className="request-video-form__group">
              <Form.Label>Channel</Form.Label>
              <div className="request-video-form__input-wrap">
                <Form.Select
                  value={requestForm.channel}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, channel: e.target.value }))
                  }
                  required
                >
                  {CHANNEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group className="request-video-form__group">
              <Form.Label>File Name</Form.Label>
              <div className="request-video-form__input-wrap">
                <Form.Control
                  type="text"
                  value={requestForm.resDeviceFileName}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, resDeviceFileName: e.target.value }))
                  }
                  placeholder="Enter file name"
                />
              </div>
            </Form.Group>

            <Form.Group className="request-video-form__group">
              <Form.Label>File Format</Form.Label>
              <div className="request-video-form__input-wrap">
                <Form.Select
                  value={requestForm.fileFormat}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, fileFormat: e.target.value }))
                  }
                >
                  {FILE_FORMAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="light"
              className="request-video-form__footer-btn request-video-form__footer-btn--secondary"
              onClick={closeRequestModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="request-video-form__footer-btn request-video-form__footer-btn--primary"
              disabled={submittingRequest}
            >
              {submittingRequest ? "Searching..." : "Request Video"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
 
    </div>
  );
};
