import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import TableFilter from "../../../components/TableFilter";
import { getDvirs } from "../../../store/actions/dvir";
import { getVehicles } from "../../../store/actions";
import { fetchDrivers } from "../../../store/actions/drivers";

export const DVIRSList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();

  const { list = [], loading } = useSelector((state) => state.dvir || {});
  const vehicles = useSelector((state) => state.vehicles?.vehicles || []);
  const drivers = useSelector((state) => state.drivers?.drivers || []);

  useEffect(() => {
    dispatch(getDvirs({ companyId }));
    if (companyId) {
      dispatch(getVehicles(companyId));
      dispatch(fetchDrivers(companyId));
    }
  }, [companyId, dispatch]);

  const vehicleFilterOptions = useMemo(
    () => ["All Vehicles", ...vehicles.map((v) => v.vehicleNumber || v.name || v.licensePlate || v._id)],
    [vehicles]
  );

  const driverFilterOptions = useMemo(
    () => [
      "All Driver",
      ...drivers.map(
        (d) =>
          [d.firstName, d.lastName].filter(Boolean).join(" ") ||
          d.driverName ||
          d.name ||
          d.email ||
          d._id
      ),
    ],
    [drivers]
  );

  const tableData = useMemo(
    () =>
      (list || []).map((item) => ({
        id: item._id,
        dateTime: item.dateTime,
        dateTimeDisplay: item.dateTime ? new Date(item.dateTime).toLocaleString() : "",
        driver: item.driver || "",
        vehicle: item.vehicle || "",
        odometer: item.odometer || 0,
        vehicleDefects: item.vehicleDefects || [],
        trailerDefects: item.trailerDefects || [],
        status: item.status || "",
        safetyStatus: item.safetyStatus || "",
      })),
    [list]
  );

  const columns = [
    {
      name: "Time",
      selector: (row) => row.dateTimeDisplay || row.dateTime,
      minWidth: "180px",
    },
    {
      name: "Driver",
      selector: (row) => row.driver,
      minWidth: "170px",
    },
    {
      name: "Vehicle",
      selector: (row) => row.vehicle,
      minWidth: "100px",
    },
    {
      name: "Odometer",
      selector: (row) => row.odometer,
      minWidth: "120px",
    },
    {
      name: "Vehicle Defects",
      minWidth: "200px",
      cell: (row) => {
        const defects = Array.isArray(row.vehicleDefects)
          ? row.vehicleDefects
          : row.vehicleDefects
          ? [row.vehicleDefects]
          : [];
        return (
          <div className="d-flex flex-column gap-1 align-items-start w-100" style={{ maxWidth: "220px" }}>
            {defects.map((defect, index) => {
              const label = typeof defect === "string" ? defect : defect?.name || defect?.label || defect?.id || "";
              if (!label) return null;
              return (
                <Badge
                  key={index}
                  className="fs-12 fw-medium bg-opacity-10"
                  pill
                  bg="theme6 text-theme6"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      name: "Trailer Defects",
      minWidth: "200px",
      cell: (row) => {
        const defects = Array.isArray(row.trailerDefects)
          ? row.trailerDefects
          : row.trailerDefects
          ? [row.trailerDefects]
          : [];
        return (
          <div className="d-flex flex-column gap-1 align-items-start w-100" style={{ maxWidth: "220px" }}>
            {defects.map((defect, index) => {
              const label = typeof defect === "string" ? defect : defect?.name || defect?.label || defect?.id || "";
              if (!label) return null;
              return (
                <Badge
                  key={index}
                  className="fs-12 fw-medium bg-opacity-10"
                  pill
                  bg="warning text-warning"
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      name: "Status",
      minWidth: "130px",
      cell: (row) => (
        <Badge
          className="fs-12 fw-medium bg-opacity-10"
          pill
          bg={row.status === "Defects Fixed" ? "success text-success" : row.status === "Has Defects" ? "danger text-danger" : "secondary text-body"}
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  // Filter state
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [vehiclesStatus, setVehiclesStatus] = useState("All Vehicles");
  const [driversStatus, setDriversStatus] = useState("All Driver");
  const [defectsStatus, setDefectsStatus] = useState("All DVIRs");

  // Reset filters
  const resetFilters = () => {
    setDateRange([null, null]);
    setVehiclesStatus("All Vehicles");
    setDriversStatus("All Driver");
    setDefectsStatus("All DVIRs");
  };

  const filters = [
    {
      value: vehiclesStatus,
      setValue: setVehiclesStatus,
      options: vehicleFilterOptions,
    },
    {
      value: driversStatus,
      setValue: setDriversStatus,
      options: driverFilterOptions,
    },
    {
      value: defectsStatus,
      setValue: setDefectsStatus,
      options: ["All DVIRs", "No Defects", "Has Defects", "Defects Fixed"],
    },
  ];

  // Filtered data
  const filteredData = tableData.filter((item) => {
    const itemDate = item.dateTime ? new Date(item.dateTime) : null;
    const hasStart = !!startDate;
    const hasEnd = !!endDate;
    let matchesDate = true;
    if (itemDate && (hasStart || hasEnd)) {
      const start = hasStart ? new Date(startDate) : null;
      const end = hasEnd ? new Date(endDate) : null;
      if (start && end) {
        matchesDate = itemDate >= start && itemDate <= end;
      } else if (start) {
        matchesDate = itemDate >= start;
      } else if (end) {
        matchesDate = itemDate <= end;
      }
    }

    const matchesVehiclesStatus = vehiclesStatus === "All Vehicles" || vehiclesStatus === "" || item.vehicle === vehiclesStatus;
    const matchesDriversStatus = driversStatus === "All Driver" || driversStatus === "" || item.driver === driversStatus;
    const matchesDefectsStatus = defectsStatus === "All DVIRs" || defectsStatus === "" || item.status === defectsStatus;

    return matchesVehiclesStatus && matchesDriversStatus && matchesDefectsStatus && matchesDate;
  });

  return (
    <div className="FMCSARecords-page py-3">
      <div className="container-fluid">
        <div className="main-heading mb-3">DVIRs</div>
        <div className="table-content-wrapper">
          <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
            <TableFilter
              showSearch={false}
              showReset={true}
              startDate={startDate}
              endDate={endDate}
              setDateRange={setDateRange}
              showDateFilter={true}
              filters={filters}
              onReset={resetFilters}
            />

            <div className="btn-wrapper d-flex flex-wrap gap-2">
              <Button variant="warning" className="d-flex align-items-center justify-center gap-1">
                <i className="bi bi-file-earmark-arrow-down fs-16"></i> Download
              </Button>
              <Button
                variant="primary"
                className="d-flex align-items-center justify-center gap-1"
                onClick={() => navigate(`/dvirs-list/add-dvir/${companyId}`)}
              >
                <i className="bi bi-plus-lg fs-16"></i> Create DVIR
              </Button>
            </div>
          </div>
          <div className="table-responsive table-custom-wrapper">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              progressComponent={
                <div className="p-3">
                  <Spinner animation="border" size="sm" />
                </div>
              }
              onRowClicked={(row) =>
                navigate(`/dvirs-list/dvir-details/${companyId}/${row.id || row._id || ""}`)
              }
              pagination
              pointerOnHover
              highlightOnHover
              responsive
              customStyles={dataTableCustomStyles}
              noDataComponent={<NoDataComponent />}
              striped
            />
          </div>
        </div>
      </div>
    </div>
  );
};
