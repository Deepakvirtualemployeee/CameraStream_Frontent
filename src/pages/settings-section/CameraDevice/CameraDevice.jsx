import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import TableFilter from "../../../components/TableFilter";
import EditIcon from "../../../assets/images/icons/edit.svg";
import { fetchCameraDevices } from "../../../store/actions/cameraDevices";
import { ROLES } from '../../../constants';

const getVehicleName = (device = {}) => {
  const vehicle =
    device.vehicleId ||
    device.vehcileId ||
    device.vehicleID ||
    device.assignedVehicleId ||
    device.vehicle;

  if (vehicle && typeof vehicle === "object") {
    return vehicle.vehicleNumber || vehicle.name || vehicle.vehicleName || "N/A";
  }

  return device.vehicleNumber || device.vehicleName || "N/A";
};

export const CameraDevice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cameraDevices, loading } = useSelector((state) => state.cameraDevices);
  const { userDetails } = useSelector((state) => state.auth);
  const userRole = userDetails?.role;

  const { companyId } = useParams(); // Company id from url

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCameraDevices(companyId));
    }
  }, [dispatch, companyId]);

  const columns = [
    { name: "Device Name", selector: (row) => row.deviceName, sortable: true, minWidth: "200px" },
    { name: "Device Type", selector: (row) => row.deviceType, sortable: true, minWidth: "150px" },
    { name: "Vehicle Name", selector: getVehicleName, sortable: true, minWidth: "170px" },
    { name: "Online Status", selector: (row) => row.onlineStatus ? 'Online' : 'Offline', sortable: true, minWidth: "150px" },
    {
      name: "Status",
      minWidth: "120px",
      cell: (row) => (
        <Badge
          className="fs-12 fw-medium bg-opacity-10"
          pill
          bg={row.status === "Active" ? "success text-success" : row.status === "Inactive" ? "danger text-danger" : "secondary text-body"}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => (
        <div className="action-wrapper d-flex flex-wrap align-items-center gap-3">
          <span
            className="pointer ms-3"
            title="Edit"
            onClick={() => navigate(`/settings/camera-devices/edit-device/${companyId}/${row._id}`, {
              state: { companyId: companyId },
            })}
          >
            <img src={EditIcon} alt="Edit Icon" />
          </span>
        </div>
      ),
    },
  ];

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Reset filters
  const resetFilters = () => {
    setSearchText("");
    setFilterStatus("");
  };

  const filters = [
    { value: filterStatus, setValue: setFilterStatus, placeholder: "Filter by status", options: ["All", "Active", "Inactive"] },
  ];

  const filteredData = cameraDevices.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesStatus = filterStatus === "All" || filterStatus === "" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="CameraDevice-page py-3">
      <div className="container-fluid">
        <div className="main-heading mb-3">Camera Devices ({cameraDevices.length})</div>
        <div className="table-content-wrapper">
          <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
            <TableFilter
              searchText={searchText}
              setSearchText={setSearchText}
              searchPlaceholder="Search by camera serial number or MAC address"
              filters={filters}
              onReset={resetFilters}
            />
            {userRole !== ROLES.Company_Safety_Personal && (
            <Button variant="primary" onClick={() => navigate(`/settings/camera-devices/add-device/${companyId}`)}>
              <i className="bi bi-plus-lg fs-16"></i> Add Camera Device
            </Button>)}
          </div>
          <div className="table-responsive table-custom-wrapper">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                customStyles={dataTableCustomStyles}
                noDataComponent={<NoDataComponent />}
                striped
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
