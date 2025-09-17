import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dataTableCustomStyles from "../../../assets/style/dataTableCustomStyles";
import { NoDataComponent } from "../../../components/NoDataComponent";
import TableFilter from "../../../components/TableFilter";
import EditIcon from "../../../assets/images/icons/edit.svg";
import { getPortalUsers } from "../../../store/actions/portalUsers";

export const PortalUsers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companyId } = useParams(); // companyId from URL

    const { portalUsers, loading } = useSelector((state) => state.portalUsers);
    console.log("Users:", portalUsers);
    useEffect(() => {
        dispatch(getPortalUsers(companyId));
    }, [dispatch, companyId]);

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: "Role",
            selector: (row) =>
              row.role
                ? row.role
                    .toLowerCase()
                    .split(/[-\s]+/) // split on dash OR space
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "",
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
                            navigate(`/settings/portal-users/edit-portal-user/${companyId}/${row._id}`, {
                                state: { companyId: companyId },
                            })
                        }
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

    const filteredData = portalUsers?.filter((item) => {
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
        <div className="PortalUsers-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">
                    Portal Users ({filteredData?.length || 0})
                </div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Name or Email"
                            filters={filters}
                            onReset={resetFilters}
                        />
                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                onClick={() =>
                                    navigate(`/settings/portal-users/add-portal-user/${companyId}`)
                                }
                            >
                                <i className="bi bi-plus-lg fs-16"></i> Add User
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
