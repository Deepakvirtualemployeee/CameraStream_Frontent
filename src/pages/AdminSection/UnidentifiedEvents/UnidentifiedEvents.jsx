import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Alert, Spinner, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import { getUnidentifiedEvents } from "../../../store/actions/unidentifiedEvents";
import { getVehicles } from "../../../store/actions/vehicles";
import { fetchDrivers } from "../../../store/actions/drivers";
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

// Driver Dropdown Menu using Portal for proper positioning
const DriverDropdownMenu = ({
  buttonRef,
  activeDrivers,
  driversLoading,
  onSelectDriver,
  eventId,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const listStyle = useMemo(
    () => ({
      maxHeight: "320px",
      overflowY: "auto",
      overflowX: "hidden",
    }),
    []
  );
  const itemStyle = useMemo(
    () => ({
      padding: "14px 16px",
      minHeight: "46px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      lineHeight: "1.4",
    }),
    []
  );
  const dropdownStyle = useMemo(
    () => ({
      position: "fixed",
      width: "200px",
      minWidth: "180px",
      maxWidth: "210px",
    }),
    []
  );

  useEffect(() => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 320, // Position above button (320px is max height + gap)
        left: rect.left + window.scrollX - 120, // Shift left by 120px to center it better
      });
    }
  }, [buttonRef]);

  return (
    <div
      ref={dropdownRef}
      className="driver-select-dropdown"
      style={{
        ...dropdownStyle,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="driver-select-header">Select Driver</div>
      <div className="driver-select-list" style={listStyle}>
        {driversLoading ? (
          <div className="driver-select-item disabled" style={itemStyle}>
            Loading drivers...
          </div>
        ) : activeDrivers && activeDrivers.length > 0 ? (
          activeDrivers.map((driver, index) => (
            <button
              type="button"
              key={driver?._id || driver?.id}
              className={`driver-select-item ${index % 2 === 0 ? "even" : "odd"}`}
              onClick={() =>
                onSelectDriver(eventId, driver?._id || driver?.id)
              }
              style={itemStyle}
            >
              {[driver?.firstName, driver?.lastName]
                .filter(Boolean)
                .join(" ") ||
                driver?.userName ||
                driver?.email ||
                "Driver"}
            </button>
          ))
        ) : (
          <div className="driver-select-item disabled" style={itemStyle}>
            No active drivers
          </div>
        )}
      </div>
    </div>
  );
};

// Separate Assign Cell Component to handle dropdown properly
const AssignCell = ({
  row,
  openAssignId,
  selectedDriverMap,
  activeDrivers,
  driversLoading,
  onToggleDropdown,
  onSelectDriver,
}) => {
  const eventId = row?._id || row?.id || "";
  const open = openAssignId === eventId;
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        if (open && !event.target.closest(".driver-select-dropdown")) {
          onToggleDropdown(eventId);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open, eventId, onToggleDropdown]);

  return (
    <>
      <div className="assign-dropdown-wrapper">
        <button
          ref={buttonRef}
          type="button"
          className="assign-driver-btn"
          onClick={() => onToggleDropdown(eventId)}
          title="Select active driver"
        >
          <i className="bi bi-person-plus fs-5 text-primary"></i>
        </button>
      </div>
      {open && (
        <DriverDropdownMenu
          buttonRef={buttonRef}
          activeDrivers={activeDrivers}
          driversLoading={driversLoading}
          onSelectDriver={onSelectDriver}
          eventId={eventId}
        />
      )}
    </>
  );
};

export const UnidentifiedEvents = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams();

  const { events, meta, loading, error } = useSelector(
    (state) => state.unidentifiedEvents
  );
  const { vehicles } = useSelector((state) => state.vehicles);
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
  const [selectedDriverMap, setSelectedDriverMap] = useState({});
  const [openAssignId, setOpenAssignId] = useState(null);
  const limit = 20;

  useEffect(() => {
    if (companyId) {
      dispatch(getVehicles(companyId));
      dispatch(fetchDrivers(companyId));
    }
  }, [dispatch, companyId]);

  const vehicleOptions = useMemo(() => {
    const list = Array.isArray(vehicles) ? vehicles : [];
    return [
      { value: "all", label: "All Vehicles" },
      ...list
        .filter((v) => v?._id)
        .map((v) => ({
          value: v._id,
          label: v.vehicleNumber || v.vehicleNo || v.vin || v._id,
        })),
    ];
  }, [vehicles]);

  const fetchEvents = useCallback(
    (nextPage = 1, append = false) => {
      dispatch(
        getUnidentifiedEvents({
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
    [dispatch, startDate, endDate, vehicleId, assumed, sortOrder]
  );

  useEffect(() => {
    if (!companyId) return;
    setPage(1);
    fetchEvents(1, false);
  }, [companyId, startDate, endDate, vehicleId, assumed, sortOrder, fetchEvents]);

  const filteredEvents = useMemo(() => {
    return (events || []).filter((evt) => {
      const textMatch = Object.values(evt || {}).some((val) =>
        val?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      return textMatch;
    });
  }, [events, searchText]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const aDate = a.eventDateTime ? new Date(a.eventDateTime).getTime() : 0;
      const bDate = b.eventDateTime ? new Date(b.eventDateTime).getTime() : 0;
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    });
  }, [filteredEvents, sortOrder]);

  const getAssumedLabel = (row) =>
    row?.linkedEventId ? "Assumed" : "Not Assumed";

  const getNotesText = (row) => {
    const notes = row?.notes;
    if (Array.isArray(notes)) return notes.filter(Boolean).join(", ") || "-";
    return notes || "-";
  };

  const activeDrivers = useMemo(() => {
    return (driverList || []).filter((driver) => driver?.isActive);
  }, [driverList]);

  const handleAssignChange = (eventId, driverId) => {
    setSelectedDriverMap((prev) => ({ ...prev, [eventId]: driverId }));
  };

  const handleSelectDriver = (eventId, driverId) => {
    handleAssignChange(eventId, driverId);
    setOpenAssignId(null);
  };

  const toggleAssignDropdown = (eventId) => {
    setOpenAssignId((prev) => (prev === eventId ? null : eventId));
  };

  const columns = [
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
    { name: "Status", selector: (row) => getAssumedLabel(row), sortable: true },
    { name: "Location", selector: (row) => row.location || "-", sortable: true },
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
    { name: "Notes", selector: (row) => getNotesText(row), minWidth: "160px" },
    {
      name: "Assign",
      cell: (row) => (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "8px 0"
        }}>
          <AssignCell
            row={row}
            openAssignId={openAssignId}
            selectedDriverMap={selectedDriverMap}
            activeDrivers={activeDrivers}
            driversLoading={driversLoading}
            onToggleDropdown={toggleAssignDropdown}
            onSelectDriver={handleSelectDriver}
          />
        </div>
      ),
      width: "100px",
      center: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

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
                  <option value="all">All</option>
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

              <Button
                style={{ backgroundColor: "#c89a4a", borderColor: "#c89a4a" }}
              >
                Bulk Assign Events
              </Button>
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
  );
};

export default UnidentifiedEvents;
