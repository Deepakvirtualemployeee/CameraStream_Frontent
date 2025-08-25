import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import TableFilter from "../../../components/TableFilter";
import CreditCardIcon from "../../../assets/images/icons/credit-card.svg";
import EditIcon from "../../../assets/images/icons/edit.svg";
import { getVehicles } from "../../../store/actions/vehicles";

export const VehiclesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // company id from URL

    // const location = useLocation();
    // const { companyId } = location.state || {};  // reading state

    // Correct selector
    const { vehicles, loading } = useSelector((state) => state.vehicles);

    useEffect(() => {
        dispatch(getVehicles(id));
    }, [dispatch]);

    const columns = [
        {
            name: "Vehicle Number",
            selector: (row) => row.vehicleNumber,
            sortable: true,
            minWidth: "150px",
        },
        {
            name: "License Plate",
            selector: (row) =>
                `${row.licensePlateNumber || ""} (${row.licensePlateState || ""})`,
            sortable: true,
            minWidth: "180px",
        },
        {
            name: "Year",
            selector: (row) => row.year,
            sortable: true,
            minWidth: "100px",
        },
        {
            name: "Make / Model",
            selector: (row) => `${row.make || ""} ${row.model || ""}`,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Vin",
            selector: (row) => row.vin,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Eld Sn (Mac)",
            selector: (row) => row.eldSerialNumber,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Status",
            minWidth: "120px",
            cell: (row) => (
                <Badge
                    className="fs-12 fw-medium bg-opacity-10"
                    pill
                    bg={
                        row.status === "Active"
                            ? "success text-success"
                            : row.status === "Inactive"
                                ? "danger text-danger"
                                : "secondary text-body"
                    }
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
                        onClick={() =>
                            navigate(`/settings/vehicles-list/edit-vehicle/${row._id}`, { state: { companyId: id } })
                        }
                    >
                        <img src={EditIcon} alt="Edit Icon" />
                    </span>
                    {/* Add delete button here later */}
                </div>
            ),
        },
    ];

    // Filter state
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const resetFilters = () => {
        setSearchText("");
        setFilterStatus("");
    };

    const filters = [
        {
            value: filterStatus,
            setValue: setFilterStatus,
            placeholder: "Filter by status",
            options: ["All", "Active", "Inactive"],
        },
    ];

    const filteredData = vehicles?.filter((item) => {
        const matchesSearch = Object.values(item).some((val) =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus =
            filterStatus === "All" ||
            filterStatus === "" ||
            item.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="VehiclesList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">
                    {/* Vehicles ({vehicles?.length || 0}) */}
                    {/* Vehicles ({filteredData?.length || 0} / {vehicles?.length || 0}) */}
                    Vehicles ({filteredData?.length || 0})
                </div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Vehicle Number, VIN or Plate"
                            filters={filters}
                            onReset={resetFilters}
                        />

                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button
                                variant="white"
                                className="bg-white border-gray d-flex align-items-center gap-2"
                            >
                                <img
                                    src={CreditCardIcon}
                                    alt="Credit Card Icon"
                                    className="img-fluid"
                                    style={{ filter: "brightness(0.2)" }}
                                />{" "}
                                Billing Page
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/settings/vehicles-list/add-vehicle/${id}`)}
                            >
                                <i className="bi bi-plus-lg fs-16"></i> Add Vehicle
                            </Button>
                        </div>
                    </div>
                    <div className="table-responsive table-custom-wrapper">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            pointerOnHover
                            responsive
                            progressPending={loading}
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
