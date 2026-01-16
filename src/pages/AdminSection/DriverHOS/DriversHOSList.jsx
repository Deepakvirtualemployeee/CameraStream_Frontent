import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import BluetoothOnIcon from '../../../assets/images/icons/bluetooth-on.svg';
import BluetoothOffIcon from '../../../assets/images/icons/bluetooth-off.svg';
import { getDriversHOS } from '../../../store/actions/driverHOS';
import './DriverHOS.scss';

export const DriversHOSList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { companyId } = useParams(); // company id from URL

    // Redux state
    const { driversHOS, loading, error } = useSelector((state) => state.driversHOS);

    console.log(driversHOS);

    useEffect(() => {
        dispatch(getDriversHOS(companyId));
    }, [dispatch]);

    // Convert seconds → HH:mm format
    // keep24h = true  → wrap hours within 24h (08:00, 11:00, 14:00)
    // keep24h = false → keep full hours (70:00 etc.)
    // const formatSecondsToHHMM = (seconds, keep24h = false) => {
    //     if (!seconds || isNaN(seconds)) return "00:00";

    //     const totalMinutes = Math.floor(seconds / 60);
    //     const hours = Math.floor(totalMinutes / 60);
    //     const minutes = totalMinutes % 60;

    //     const displayHours = keep24h ? hours % 24 : hours;

    //     return `${displayHours.toString().padStart(2, "0")}:${minutes
    //         .toString()
    //         .padStart(2, "0")}`;
    // };

    const formatSecondsToHHMM = (seconds, keep24h = false) => {
        if (seconds == null || isNaN(seconds)) return "00:00";

        // clamp negatives to 0
        const safeSeconds = Math.max(0, seconds);

        const totalMinutes = Math.floor(safeSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const displayHours = keep24h ? hours % 24 : hours;

        return `${displayHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    };

    // Convert seconds → "X Hours" (for Last Sync style)
    // const formatSecondsToHoursText = (seconds) => {
    //     if (!seconds || isNaN(seconds)) return "0 Hours";

    //     const hours = Math.floor(seconds / 3600);
    //     return `${hours} Hour${hours !== 1 ? "s" : ""}`;
    // };

    const formatSecondsToHoursText = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0 seconds ago";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
        } else {
            return `${secs} second${secs !== 1 ? "s" : ""} ago`;
        }
    };

    // Convert ISO eventDatetime to "X seconds/minutes/hours ago" using UTC
    const timeAgoFromEventUTC = (eventDatetime) => {
        if (!eventDatetime) return "—";

        const nowUTC = new Date(); // current UTC time
        const eventTime = new Date(eventDatetime); // ISO date in UTC

        let diffSeconds = Math.floor((nowUTC.getTime() - eventTime.getTime()) / 1000); // difference in seconds

        if (diffSeconds < 0) diffSeconds = 0; // clamp negative

        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;

        if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
        return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    };

    const timeBadgeColors = {
        break: "#A67C52",
        drive: "#4C8EF3",
        shift: "#54B571",
        cycle: "#808080",
    };

    const getRemainingSeconds = (timeObj) => {
        if (!timeObj) return 0;
        return Math.max(0, (timeObj.limitTime || 0) - (timeObj.accumulatedTime || 0));
    };

    const renderTimeBadge = (timeObj, colorKey, keep24h = true) => {
        const remaining = getRemainingSeconds(timeObj);
        const label = timeObj ? formatSecondsToHHMM(remaining, keep24h) : "—";

        return (
            <span
                className="fw-semibold d-inline-flex align-items-center justify-content-center"
                style={{
                    minWidth: "72px",
                    padding: "8px 14px",
                    borderRadius: "12px",
                    backgroundColor: timeBadgeColors[colorKey] || "#dee2e6",
                    color: "#111",
                    fontSize: "14px",
                    lineHeight: "1",
                }}
            >
                {label}
            </span>
        );
    };

    const columns = [
        // {
        //     name: 'Driver',
        //     selector: (row) => (
        //         <span
        //             className="text-primary pointer client-name fw-medium text-capitalize text-primary text-decoration-underline"
        //             onClick={() =>
        //                 navigate(`/driver-hos/graph-details/${row.driverId}`, {
        //                     state: { driver: row, companyId: row.companyId || id },
        //                 })
        //             }
        //         >
        //             {row.driver}
        //         </span>
        //     ),
        //     sortable: true,
        //     minWidth: '150px',
        // },
        {
            name: 'Driver',
            selector: (row) => (
                <span
                    className="text-primary pointer client-name fw-medium text-capitalize"
                    onClick={() =>
                        window.open(
                            // `/driver-hos/graph-details/${row.driverId}?companyId=${row.companyId || id}`,
                            `/driver-hos/graph-details/${row.companyId || companyId}/${row.driverId}`,
                            '_blank' // opens in new tab
                        )
                    }
                >
                    {row.driver}
                </span>
            ),
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Vehicle',
            sortable: true,
            minWidth: '170px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    {row.eldConnected === 'inactive' ? (
                        <span><img src={BluetoothOffIcon} alt="Bluetooth Off Icon" className="img-fluid" /></span>
                    ) : (
                        <span><img src={BluetoothOnIcon} alt="Bluetooth On Icon" className="img-fluid" /></span>
                    )}
                    <span><i className="bi bi-geo-alt fs-5 text-body"></i></span>
                    <span className="fw-semibold text-body text-nowrap ms-1">{row.vehicle}</span>
                </div>
            ),
        },
        {
            name: 'Status',
            minWidth: '130px',
            cell: (row) => (
                <div
                    className={`${row.status === "Off Duty" ? "bg-secondary" : "bg-success"} text-white text-center rounded-3 px-3 py-2`}
                    style={{ width: '120px' }}
                >
                    <div className="fs-14 fw-medium">{row.status}</div>
                    {/* <div className="fs-10 mt-1">{row.statusUpdated || "—"}</div> */}
                    <div className="fs-10 mt-1">
                        {timeAgoFromEventUTC(row.eventDatetime)}
                    </div>
                </div>
            ),
        },
        {
            name: "Break",
            selector: (row) => getRemainingSeconds(row.break),
            cell: (row) => renderTimeBadge(row.break, "break", true),
            sortable: true,
        },
        {
            name: "Drive",
            selector: (row) => getRemainingSeconds(row.drive),
            cell: (row) => renderTimeBadge(row.drive, "drive", true),
            sortable: true,
        },
        {
            name: "Shift",
            selector: (row) => getRemainingSeconds(row.shift),
            cell: (row) => renderTimeBadge(row.shift, "shift", true),
            sortable: true,
        },
        {
            name: "Cycle",
            selector: (row) => getRemainingSeconds(row.cycle),
            cell: (row) => renderTimeBadge(row.cycle, "cycle", false), // keep full hours like 70:00
            sortable: true,
        },
        {
            name: "Last Sync",
            selector: (row) =>
                row.lastSync ? formatSecondsToHoursText(row.lastSync) : "—",
            sortable: true,
        },
        {
            name: 'Violations',
            minWidth: '100px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-4">
                    {row.violations && <i className="bi bi-clock fs-5 text-danger"></i>}
                </div>
            ),
        },
        {
            name: 'Logs',
            minWidth: '80px',
            cell: (row) => (
                <div
                    className="d-flex align-items-center gap-2 ms-2 pointer"
                    onClick={() =>
                        navigate(`/driver-hos/graph-details/${row.companyId || companyId}/${row.driverId}`, {
                            state: { driver: row, companyId: row.companyId || companyId },
                        })
                    }
                >
                    <i className="bi bi-activity fs-5 text-body"></i>
                </div>
            ),
        },
        { name: 'Contacts', selector: (row) => row.contacts, minWidth: '110px' },
        // {
        //     name: 'Device',
        //     minWidth: '80px',
        //     cell: (row) => (
        //         <div className="d-flex align-items-center gap-2 ms-2 ps-1">
        //             <i className="bi bi-pc-display fs-5 text-muted"></i>
        //         </div>
        //     ),
        // },
    ];

    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterELDStatus, setFilterELDStatus] = useState('');
    const [filterDutyStatus, setFilterDutyStatus] = useState('');
    const [filterViolationStatus, setFilterViolationStatus] = useState('');

    const resetFilters = () => {
        setSearchText('');
        setFilterELDStatus('');
        setFilterDutyStatus('');
        setFilterViolationStatus('');
    };

    const filters = [
        {
            value: filterELDStatus,
            setValue: setFilterELDStatus,
            placeholder: 'Filter by ELD Status',
            options: ['All', 'active', 'inactive'],
        },
        {
            value: filterDutyStatus,
            setValue: setFilterDutyStatus,
            placeholder: 'Filter by Duty Status',
            options: ['All', 'Off Duty', 'Driving'],
        },
        {
            value: filterViolationStatus,
            setValue: setFilterViolationStatus,
            placeholder: 'Filter by Violation Status',
            options: ['All', 'Violated', 'Non Violated'],
        }
    ];

    // Apply filters on backend data
    const filteredData = (driversHOS || []).filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesELDStatus = filterELDStatus === 'All' || filterELDStatus === '' || item.eldConnected === filterELDStatus;
        const matchesDutyStatus = filterDutyStatus === 'All' || filterDutyStatus === '' || item.status === filterDutyStatus;
        // const matchesViolationStatus = filterViolationStatus === 'All' || filterViolationStatus === '' || item.violations === filterViolationStatus;
        let matchesViolationStatus = true;
        if (filterViolationStatus === 'Violated') {
            matchesViolationStatus = item.violations === true;
        } else if (filterViolationStatus === 'Non Violated') {
            matchesViolationStatus = item.violations === false;
        }

        return matchesSearch && matchesELDStatus && matchesDutyStatus && matchesViolationStatus;
    });

    return (
        <div className="DriversHOSList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">
                    {/* Drivers HOS ({driversHOS?.length || 0}) */}
                    Drivers HOS ({filteredData?.length || 0})
                </div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Driver or Vehicle Number"
                            filters={filters}
                            onReset={resetFilters}
                        />
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            // onRowClicked={() => navigate(`/driver-hos/graph-details`)}
                            onRowClicked={(row) => {
                                const url = `/driver-hos/graph-details/${row.companyId || companyId}/${row.driverId}`;
                                window.open(url, "_blank", "noopener,noreferrer");
                            }}
                            pointerOnHover
                            highlightOnHover
                            pagination
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
    )
};
