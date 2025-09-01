import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import TableFilter from "../../../components/TableFilter";
import EditIcon from "../../../assets/images/icons/edit.svg";
import { fetchEldDevices } from "../../../store/actions/eldDevices";

export const ELDDevice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eldDevices, loading } = useSelector((state) => state.eldDevices);

  // const companyId = localStorage.getItem("companyId");
  const { id } = useParams(); // Company id from url

  useEffect(() => {
    if (id) {
      dispatch(fetchEldDevices(id));
    }
  }, [dispatch, id]);

  const columns = [
    { name: "ELD SN (MAC)", selector: (row) => `${row.serialNumber} (${row.macAddress || ""})`, sortable: true, minWidth: "300px" },
    { name: "ELD Model", selector: (row) => row.eldModel, sortable: true, minWidth: "150px" },
    { name: "Assigned Vehicle", selector: (row) => row.assignedVehicleId?.vehicleNumber, sortable: true, minWidth: "170px" },
    { name: "BLE Version", selector: (row) => row.bleVersion || '1.5.6', sortable: true, minWidth: "150px" },
    { name: "Firmware Version", selector: (row) => row.firmwareVersion, sortable: true, minWidth: "170px" },
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
            onClick={() => navigate(`/settings/eld-devices/edit-device/${row._id}`, {
              state: { companyId: id },
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

  const filteredData = eldDevices.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesStatus = filterStatus === "All" || filterStatus === "" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ELDDevice-page py-3">
      <div className="container-fluid">
        <div className="main-heading mb-3">ELD Devices ({eldDevices.length})</div>
        <div className="table-content-wrapper">
          <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
            <TableFilter
              searchText={searchText}
              setSearchText={setSearchText}
              searchPlaceholder="Search by ELD SN or ELD MAC Address"
              filters={filters}
              onReset={resetFilters}
            />
            <Button variant="primary" onClick={() => navigate(`/settings/eld-devices/add-device/${id}`)}>
              <i className="bi bi-plus-lg fs-16"></i> Add ELD Device
            </Button>
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
