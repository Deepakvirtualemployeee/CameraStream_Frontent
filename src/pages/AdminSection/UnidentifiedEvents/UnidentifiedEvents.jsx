import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Alert, Spinner, Form, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import { getUnidentifiedEvents, assignDriverToUnidentifiedEvent } from "../../../store/actions/unidentifiedEvents";
import {getAllActiveVehicles } from "../../../store/actions/vehicles";
import { fetchDrivers } from "../../../store/actions/drivers";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./UnidentifiedEvents.scss";

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDateForApi = (date) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    onClick={onClick}
    className="date-input-wrapper"
    aria-label={placeholder}
  >
    <Form.Control
      ref={ref}
      value={value}
      placeholder={placeholder}
      readOnly
      className="filter-control date-input"
    />
    <span className="date-input-icon" aria-hidden="true">
      <i className="bi bi-calendar3" />
    </span>
  </button>
));

export const UnidentifiedEvents = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams();

  const { events, meta, loading, error } = useSelector(
    (state) => state.unidentifiedEvents
  );
  const { vehicles, allActiveVehicles } = useSelector((state) => state.vehicles);
  const { drivers: driverList = [], loading: driversLoading } = useSelector(
    (state) => state.drivers
  );

  const [searchText, setSearchText] = useState("");
  const [vehicleId, setVehicleId] = useState("all");
  const [assumed, setAssumed] = useState("not_assumed");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const limit = 20;

  useEffect(() => {
    if (companyId) {
      dispatch(getAllActiveVehicles(companyId));
      dispatch(fetchDrivers(companyId));
    }
  }, [dispatch, companyId]);

  const vehicleOptions = useMemo(() => {
    const list = Array.isArray(allActiveVehicles) && allActiveVehicles.length
      ? allActiveVehicles
      : Array.isArray(vehicles) ? vehicles : [];
    return [
      { value: "all", label: "All Vehicles" },
      ...list
        .filter((v) => v?._id)
        .map((v) => ({
          value: v._id,
          label: v.vehicleNumber  || v.vin || v._id,
        })),
    ];
  }, [vehicles, allActiveVehicles]);

  const fetchEvents = useCallback(
    (nextPage = 1, append = false) => {
      dispatch(
        getUnidentifiedEvents({
          companyId,
          startDate: formatDateForApi(startDate),
          endDate: formatDateForApi(endDate),
          vehicleId,
          assumed,
          sort: sortOrder,
          page: nextPage,
          limit,
          append,
        })
      );
    },
    [dispatch, companyId, startDate, endDate, vehicleId, assumed, sortOrder]
  );

  useEffect(() => {
    if (!companyId) return;
    setPage(1);
    fetchEvents(1, false);
  }, [companyId, startDate, endDate, vehicleId, assumed, sortOrder, fetchEvents]);

  const eventsByAssumed = useMemo(() => {
    if (assumed === "assumed") {
      return (events || []).filter((evt) => evt?.isActive === false);
    }
    if (assumed === "not_assumed") {
      return (events || []).filter((evt) => evt?.isActive !== false);
    }
    return events || [];
  }, [events, assumed]);

  const filteredEvents = useMemo(() => {
    return eventsByAssumed.filter((evt) => {
      const textMatch = Object.values(evt || {}).some((val) =>
        val?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      return textMatch;
    });
  }, [eventsByAssumed, searchText]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const aDate = a.eventDateTime ? new Date(a.eventDateTime).getTime() : 0;
      const bDate = b.eventDateTime ? new Date(b.eventDateTime).getTime() : 0;
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    });
  }, [filteredEvents, sortOrder]);

  const getStatusLabel = (row) => {
    if (row?.isActive === false || assumed === "assumed") {
      return "Inactive - Changed";
    }
    return "Active";
  };

  const getNotesText = (row) => {
    const notes = row?.notes;
    if (Array.isArray(notes)) return notes.filter(Boolean).join(", ") || "-";
    return notes || "-";
  };

  const activeDrivers = useMemo(() => {
    return (driverList || []).filter((driver) => driver?.isActive);
  }, [driverList]);

  const handleAssignIconClick = useCallback((row) => {
    const eventId = row?._id || row?.id;
    setSelectedEvent(row);
    setSelectedDriverId("");
    setShowAssignModal(true);
  }, []);

  const toggleBulkMode = () => {
    setBulkMode((prev) => {
      const next = !prev;
      if (!next) setSelectedEventIds([]);
      return next;
    });
  };

  const handleRowCheckbox = (row) => {
    const id = row?._id || row?.id;
    if (!id) return;
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleHeaderCheckbox = (checked, rows) => {
    if (checked) {
      const allIds = rows
        .map((r) => r?._id || r?.id)
        .filter(Boolean);
      setSelectedEventIds(allIds);
    } else {
      setSelectedEventIds([]);
    }
  };

  const handleOpenBulkAssign = () => {
    if (!selectedEventIds.length) return;
    setSelectedDriverId("");
    setShowBulkAssignModal(true);
  };

  const handleBulkAssignSubmit = async () => {
    if (!selectedDriverId || !selectedEventIds.length) {
      toast.warn("Select a driver and at least one event");
      return;
    }
    setBulkAssigning(true);
    try {
      for (const eventId of selectedEventIds) {
        await dispatch(
          assignDriverToUnidentifiedEvent({ eventId, driverId: selectedDriverId })
        );
      }
      toast.success("Events assigned successfully");
      setShowBulkAssignModal(false);
      setBulkMode(false);
      setSelectedEventIds([]);
      handleRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign some events");
    } finally {
      setBulkAssigning(false);
    }
  };

  const handleAssignSubmit = () => {
    if (!selectedDriverId) {
      toast.warn("Please select a driver");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedEvent || !selectedDriverId) return;
    const eventId = selectedEvent?._id || selectedEvent?.id;
    await dispatch(assignDriverToUnidentifiedEvent({ eventId, driverId: selectedDriverId }));
    setShowConfirmModal(false);
    setShowAssignModal(false);
  };

  const handleCancelAssign = () => {
    setShowAssignModal(false);
    setShowConfirmModal(false);
    setSelectedDriverId("");
    setSelectedEvent(null);
  };

  const columns = useMemo(() => {
    const base = [
      ...(bulkMode && assumed !== "assumed"
        ? [
            {
              name: (
                <Form.Check
                  type="checkbox"
                  inputClassName="ue-checkbox"
                  checked={
                    sortedEvents.length > 0 &&
                    sortedEvents.every((r) =>
                      selectedEventIds.includes(r?._id || r?.id)
                    )
                  }
                  onChange={(e) =>
                    handleHeaderCheckbox(e.target.checked, sortedEvents)
                  }
                />
              ),
              width: "60px",
              center: true,
              cell: (row) => (
                <Form.Check
                  type="checkbox"
                  inputClassName="ue-checkbox"
                  checked={selectedEventIds.includes(row?._id || row?.id)}
                  onChange={() => handleRowCheckbox(row)}
                />
              ),
              ignoreRowClick: true,
            },
          ]
        : []),
      {
        name: "Time",
        selector: (row) => formatDateTime(row.eventDateTime),
        sortable: true,
        minWidth: "180px",
      },
      {
        name: "Vehicle",
        selector: (row) => row.vehicle?.vehicleNumber || "-",
        sortable: true,
        minWidth: "110px",
      },
      { name: "Event", selector: (row) => row.eventCode || "-", sortable: true },
      { name: "Status", selector: (row) => getStatusLabel(row), sortable: true },
      {
        name: "Location",
        selector: (row) => row.location || "-",
        sortable: true,
      },
      {
        name: "Odometer (MI)",
        selector: (row) => row.odometer ?? "-",
        sortable: true,
        right: true,
      },
      {
        name: "Engine Hours",
        selector: (row) => row.engineHours ?? "-",
        sortable: true,
        right: true,
      },
    ];

    if (assumed !== "assumed" && !bulkMode) {
      base.push({
        name: "Assign",
        cell: (row) => (
          <button
            type="button"
            className="assign-driver-btn"
            title="Assign to driver"
            onClick={() => handleAssignIconClick(row)}
          >
            <i className="bi bi-person-plus fs-5 text-primary"></i>
          </button>
        ),
        width: "100px",
        center: true,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      });
    }

    return base;
  }, [assumed, bulkMode, handleAssignIconClick, selectedEventIds, sortedEvents]);

  const handleRefresh = () => {
    if (!companyId) return;
    setPage(1);
    fetchEvents(1, false);
  };

  const hasMore = Boolean(meta?.hasMore);
  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, true);
  };

  return (
    <>
    <div className="UnidentifiedEvents-page py-3">
      <div className="container-fluid">
        <div className="main-heading mb-3">Unidentified Events</div>

        <div className="table-content-wrapper">
          <div className="ue-filters mb-3">
            {/* LEFT SIDE FILTERS */}
            <div>
              {/* Row 1 */}
              <div className="d-flex gap-3 mb-3">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  customInput={<DateInput placeholder="mm/dd/yyyy" />}
                />

                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  customInput={<DateInput placeholder="mm/dd/yyyy" />}
                />

                <Form.Select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                >
                  {vehicleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>

                <Form.Select
                  value={assumed}
                  onChange={(e) => setAssumed(e.target.value)}
                >
                  <option value="not_assumed">Not Assumed</option>
                  <option value="assumed">Assumed</option>
                </Form.Select>
              </div>

              {/* Row 2 */}
              <div style={{ maxWidth: 240 }}>
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Date (desc.)</option>
                  <option value="asc">Date (asc.)</option>
                </Form.Select>
              </div>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="d-flex flex-column gap-3">
              <Button
                variant="outline-secondary"
                onClick={() => setSearchText("")}
              >
                Clear Search
              </Button>

              <Button
                variant="outline-secondary"
                onClick={handleRefresh}
              >
                Refresh
              </Button>

              {assumed !== "assumed" && (
                <Button
                  style={{ backgroundColor: "#c89a4a", borderColor: "#c89a4a" }}
                  onClick={toggleBulkMode}
                >
                  {bulkMode ? "Cancel Bulk" : "Bulk Assign Events"}
                </Button>
              )}
            </div>
          </div>

          <div className="search-row mb-3">
            <Form.Control
              type="search"
              value={searchText}
              placeholder="Search by vehicle, event, or location"
              onChange={(e) => setSearchText(e.target.value)}
              className="search-control"
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <div className="table-responsive table-custom-wrapper">
              <DataTable
                columns={columns}
                data={sortedEvents}
                highlightOnHover
                responsive
                pagination
                customStyles={dataTableCustomStyles}
                noDataComponent={<NoDataComponent />}
                striped
              />
            </div>
          )}

          <div className="text-center mt-3">
              <Button
                variant="light"
                className="border"
                disabled={!hasMore || loading}
                onClick={handleLoadMore}
            >
              {hasMore ? "Load More" : "No More Data"}
            </Button>
          </div>
        </div>
      </div>
    </div>

    {bulkMode && selectedEventIds.length > 0 && (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          style={{ backgroundColor: "#00bcd4", borderColor: "#00bcd4" }}
          onClick={handleOpenBulkAssign}
        >
          Bulk Assign
        </Button>
      </div>
    )}

    <Modal show={showAssignModal} onHide={handleCancelAssign} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign to Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="assignDriverSelect">
          <Form.Label className="fw-semibold">Driver</Form.Label>
          <Form.Select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            disabled={driversLoading}
          >
            <option value="">Select driver</option>
            {driversLoading ? (
              <option value="">Loading...</option>
            ) : (
              activeDrivers.map((driver) => (
                <option key={driver?._id || driver?.id} value={driver?._id || driver?.id}>
                  {[driver?.firstName, driver?.lastName].filter(Boolean).join(" ") ||
                    driver?.userName ||
                    driver?.email ||
                    "Driver"}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <div className="fw-semibold small text-muted">
            Event Time: {formatDateTime(selectedEvent?.eventDateTime)}
          </div>
          <div className="small text-muted">
            Vehicle: {selectedEvent?.vehicle?.vehicleNumber || "-"}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={handleCancelAssign}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignSubmit}>
            Assign
          </Button>
        </div>
      </Modal.Footer>
    </Modal>

    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Assign this event to the selected driver?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmAssign}>
          Yes, Assign
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showBulkAssignModal} onHide={() => setShowBulkAssignModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bulk Assign to Driver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="bulkAssignDriverSelect">
          <Form.Label className="fw-semibold">Driver</Form.Label>
          <Form.Select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            disabled={driversLoading}
          >
            <option value="">Select driver</option>
            {driversLoading ? (
              <option value="">Loading...</option>
            ) : (
              activeDrivers.map((driver) => (
                <option key={driver?._id || driver?.id} value={driver?._id || driver?.id}>
                  {[driver?.firstName, driver?.lastName].filter(Boolean).join(" ") ||
                    driver?.userName ||
                    driver?.email ||
                    "Driver"}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
        <div className="mt-2 text-muted small">
          Selected events: {selectedEventIds.length}
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={() => setShowBulkAssignModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleBulkAssignSubmit} disabled={bulkAssigning}>
          {bulkAssigning ? "Assigning..." : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default UnidentifiedEvents;
