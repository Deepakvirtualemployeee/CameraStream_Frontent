import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "react-bootstrap";
import ReloadIcon from '../../../assets/images/icons/reload.svg';
import EditIcon from '../../../assets/images/icons/edit.svg'
import ExternalIcon from '../../../assets/images/icons/external.svg'
import LogChart from "./LogChart";
import { getDriverData, getDriverLogs, getMobileSettings } from '../../../store/actions/driverHOS';

export const GraphDetails = () => {
    // State for showing phone
    const [showPhone, setShowPhone] = useState(false);

    // Get params
     let { id, driverId } = useParams();

    // For testing
     driverId = '688b50c55dc4bbb932ffad56';

    // const [searchParams] = useSearchParams();
    // const companyId = searchParams.get("companyId");

    console.log("Driver ID:", driverId);
    console.log("Company ID:", id);

    const dispatch = useDispatch();

    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [logsEnabled, setLogsEnabled] = useState(false);

    const navigate = useNavigate();

    // Redux state
    const { driverData, driverLogs, driverSettings, loading, error } = useSelector((state) => state.driversHOS);

    console.log("driverData", driverData);
    console.log("driverLogs", driverLogs);
    console.log("driverSettings", driverSettings);

    useEffect(() => {
        if (driverId) {
            dispatch(getDriverData(driverId));
            dispatch(getDriverLogs(driverId));
            dispatch(getMobileSettings(driverId));
        }
    }, [dispatch, driverId, id]);

    const handlePrevDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
    };

    // const handleNextDay = () => {
    //     setSelectedDate((prev) => {
    //         const next = new Date(prev);
    //         next.setDate(next.getDate() + 1);

    //         // prevent going beyond today
    //         const today = new Date();
    //         today.setHours(0, 0, 0, 0);

    //         if (next > today) {
    //             return prev; // keep current date
    //         }

    //         return next;
    //     });
    // };

    /** Filter logs by selected date */
    // Utility: format date (YYYY-MM-DD)
    const formatDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };

    // Filter logs based on selected date
    const filteredLogs = driverLogs?.filter(
        (log) => formatDate(log.logDate) === formatDate(selectedDate)
    ) || [];


    // Convert seconds → HH:mm format
    // keep24h = true  → wrap hours within 24h (08:00, 11:00, 14:00)
    // keep24h = false → keep full hours (70:00 etc.)
    const formatSecondsToHHMM = (seconds, keep24h = false) => {
        if (!seconds || isNaN(seconds)) return "00:00";

        const totalMinutes = Math.floor(seconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const displayHours = keep24h ? hours % 24 : hours;

        return `${displayHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    };

    const breakTimeLeft = formatSecondsToHHMM(
        (driverData.breakTime?.limitTime || 0) - (driverData.breakTime?.accumulatedTime || 0)
    );
    const driveTimeLeft = formatSecondsToHHMM(
        (driverData.driveTime?.limitTime || 0) - (driverData.driveTime?.accumulatedTime || 0)
    );
    const shiftTimeLeft = formatSecondsToHHMM(
        (driverData.shiftTime?.limitTime || 0) - (driverData.shiftTime?.accumulatedTime || 0)
    );
    const cycleTimeLeft = formatSecondsToHHMM(
        (driverData.cycleTime?.limitTime || 0) - (driverData.cycleTime?.accumulatedTime || 0)
    );
    const columns = [
        {
            name: '#',
            selector: (row) => row.id,
            sortable: true,
            minWidth: '50px',
        },
        // {
        //     name: 'Start (PDT)',
        //     selector: (row) => row.start_PDT,
        //     minWidth: '170px',
        //     cell: (row) => (
        //         <div className="d-flex align-items-center gap-1">
        //             {(row.id === '02' || row.id === '05' || row.id === '07') ? (
        //                 <span><img src={BluetoothOffIcon} alt="Bluetooth On Icon" className="img-fluid" /></span>
        //             ) : (
        //                 <span><img src={BluetoothOnIcon} alt="Bluetooth Off Icon" className="img-fluid" /></span>
        //             )}
        //             <span><i className="bi bi-geo-alt fs-5 text-body"></i></span>
        //             <span className="fw-semibold text-body text-nowrap ms-1">{row.vehicle}</span>
        //         </div>
        //     ),
        // },
        {
            name: 'Status',
            minWidth: '180px',
            cell: (row) => {
                const isGreen = row.status === "Driving" || row.status === "ON Duty";
                return (
                    <div
                        className={`${isGreen ? "bg-success" : "bg-secondary"} text-white text-center rounded-3 px-3 py-2`}
                        style={{ width: '120px' }}
                    >
                        <div className="fs-14 fw-medium">{row.status}</div>
                        {/* <div className="fs-10 mt-1">15 days ago</div> */}
                    </div>
                );
            },
        },

        {
            // name: `Start (PDT)`,
            name: `Start (${driverSettings?.timeZone || 'PDT'})`,
            selector: (row) => row.start_PDT,
            minWidth: '230px'
        },
        {
            name: 'Duration',
            selector: (row) => row.duration,
            minWidth: '120px',
        },
        {
            name: 'Location',
            // selector: (row) => row.location,
            minWidth: '250px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-body text-nowrap ms-1">{row.location}</span>
                    <span><img src={ExternalIcon} alt="ExternalIcon" className="img-fluid" /></span>
                    <span><i className="bi bi-copy fs-5 text-body"></i></span>
                </div>
            ),
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle,
            minWidth: '80px',
        },
        {
            name: 'Odometer',
            selector: (row) => row.odometer,
            minWidth: '120px',
        },
        {
            name: 'Engine Hours',
            minWidth: '120px',
            selector: (row) => row.engine_hours,
        },
        {
            name: 'Origin',
            minWidth: '80px',
            selector: (row) => row.origin,
        },
        // {
        //     name: 'Trailers',
        //     minWidth: '120px',
        //     cell: (row) => (
        //         <div className="d-flex align-items-center gap-2 ms-2">
        //             {row.trailers === false &&
        //                 <i className="bi bi-activity fs-5 text-body"></i>
        //             }
        //         </div>
        //     ),
        // },
        {
            name: "Trailers",
            minWidth: '120px',
            selector: (row) => row.trailers,
            sortable: false,
        },
        {
            name: 'Shipping Docs',
            // cell: (row) => (
            //     <div className="d-flex align-items-center gap-2 ms-2">
            //         {row.shiping_docs === false &&
            //             <i className="bi bi-activity fs-5 text-body"></i>
            //         }
            //     </div>
            // ),
            selector: (row) => row.shippingDocs,
            minWidth: '150px',
        },
        {
            name: 'Notes',
            minWidth: '120px',
            // cell: (row) => (
            //     <div className="d-flex align-items-center gap-2 ms-2 ps-1">
            //         {row.notes === true &&
            //             <span className="text-body text-nowrap ms-1">Break</span>
            //         }
            //     </div>
            // ),
            selector: (row) => row.notes,
        },
        {
            name: 'Actions',
            minWidth: '120px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer' title='Edit' onClick={() => navigate('/settings/drivers-listing/edit-driver')}><img src={EditIcon} alt="Edit Icon" /></span>
                    <span className='pointer p-0' title='Clock'><i className="bi bi-clock fs-5"></i></span>
                </div>
            ),
        },
    ];

    // Create a function for event codes
    function mapEventCodeToStatus(eventCode) {
        // console.log(eventCode);
        switch (eventCode) {

            case "DS_OFF": return "OFF Duty";
            case "DS_SB": return "Sleeper Berth";
            case "DS_D": return "Driving";
            case "DS_ON": return "ON Duty";
            case "DS_WT": return "Waiting Time";

            case "DR_SH": return "Short Haul";
            case "DR_MD": return "Manual Drive";
            case "DR_RD": return "Restrict Driver";

            case "DR_IND_YM": return "Yard Move";
            case "DR_IND_PC": return "Personal Conveyance";
            case "DR_IND_CLEARED": return "Special Driving Cleared";

            case "DR_LOGIN": return "Driver Login";
            case "DR_LOGOUT": return "Driver Logout";

            case "ELD_DIAG_CLEARED": return "ELD Diagnostic Cleared";
            case "ELD_DIAG": return "ELD Diagnostic Event";
            case "ELD_MALF_CLEARED": return "ELD Malfunction Cleared";
            case "ELD_MALF": return "ELD Malfunction Event";


            case "ENG_DOWN_REDUCED": return "Engine Power Down (Reduced)";
            case "ENG_DOWN_NORMAL": return "Engine Power Down (Normal)";
            case "ENG_UP_REDUCED": return "Engine Power Up (Reduced)";
            case "ENG_UP_NORMAL": return "Engine Power Up (Normal)";

            // --- Driver Certification ---
            case "DR_CERT_1": return "Driver Certified Record (Day 1)";
            case "DR_CERT_2": return "Driver Certified Record (Day 2)";
            case "DR_CERT_3": return "Driver Certified Record (Day 3)";
            case "DR_CERT_4": return "Driver Certified Record (Day 4)";
            case "DR_CERT_5": return "Driver Certified Record (Day 5)";
            case "DR_CERT_6": return "Driver Certified Record (Day 6)";
            case "DR_CERT_7": return "Driver Certified Record (Day 7)";
            case "DR_CERT_8": return "Driver Certified Record (Day 8)";
            case "DR_CERT_9": return "Driver Certified Record (Day 9)";

            // --- Intermediate Events ---
            case "INTER_REDUCED_PERCISION": return "Intermediate Event (Reduced Precision)";
            case "INTER_NORMAL_PRECISION": return "Intermediate Event (Normal Precision)";

            default: return eventCode || "Unknown";
        }
    }

    // Allowed event codes for duration calculation
    const allowedEventCodes = [
        "DR_IND_YM", // Yard Move
        "DR_IND_PC", // Personal Conveyance
        "DS_SB",     // Sleeper Berth
        "DR_SH",     // Short Haul
        "DR_MD",     // Manual Drive
        "DR_RD",     // Restrict Driver
    ];

    // Convert milliseconds → HH:mm:ss
    const formatDuration = (ms) => {
        if (!ms || ms < 0) return "--";
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}h:${minutes}m:${seconds}s`;
    };

    // Transform filteredLogs into table data
    const tableData = filteredLogs
        ?.flatMap((log) =>
            log.hosEvents.map((event, index) => {
                const nextEvent = log.hosEvents[index + 1];
                let duration = "--";

                if (nextEvent) {
                    const startTime = new Date(event.eventDateTime).getTime();
                    const endTime = new Date(nextEvent.eventDateTime).getTime();
                    duration = formatDuration(endTime - startTime);
                }

                return {
                    id: String(index + 1).padStart(2, "0"),
                    status: mapEventCodeToStatus(event.eventCode) || event.eventCode,
                    start_PDT: new Date(event.eventDateTime).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                    duration,
                    location: event.manualLocation || event.calculatedLocation || "Unknown",
                    vehicle: event.vehicle?.vehicleNumber || "--",
                    odometer: event.odometer || "--",
                    engine_hours: event.engineHours || "--",
                    origin: event.origin || "--",
                    trailers: event.trailers?.length ? event.trailers.join(", ") : "",
                    shippingDocs: event.shippingDocs?.length ? event.shippingDocs.join(", ") : "",
                    notes: event.notes?.length ? event.notes.join(", ") : "",
                };
            })
        )
        .filter(Boolean);

    // Getting tailers and shipping docs
    const trailers = filteredLogs
        ?.flatMap(log => log.trailers || []) // collect all trailers
        .filter(Boolean); // remove empty/null

    const shippingDocs = filteredLogs
        ?.flatMap(log => log.shippingDocuments || []) // collect all docs
        .filter(Boolean); // remove empty/null

    // Final strings with fallback
    const trailersText = trailers.length ? trailers.join(", ") : "Missing";
    const shippingDocsText = shippingDocs.length ? shippingDocs.join(", ") : "Missing";

    // Helper function to check if two dates are the same day
    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const today = new Date();
    return (
        <div className="GraphDetails-page py-2">
            <div className="container-fluid">
                <div className="top-section mb-3">
                    <div className="row gx-2 gy-3">
                        <div className="col-lg-6 col-xl-4">
                            <div className="info-wrapper">
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Carrier:</span>
                                    <span className="text-body fw-semibold text-truncate">{driverSettings?.companyName}</span>
                                </div>
                                {/* <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Driver:</span>
                                    <span className="text-body fw-semibold text-truncate">{driverSettings?.driverName} <i className="bi bi-telephone text-theme6 ms-1"></i></span>
                                </div> */}

                                {/* <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Driver:</span>
                                    <span className="text-body fw-semibold text-truncate">
                                        {driverSettings?.driverName}
                                        <i
                                            className="bi bi-telephone text-theme6 ms-1 pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowPhone(!showPhone)}
                                        ></i>
                                        {showPhone && (
                                            <span className="ms-2 text-muted">
                                                {driverSettings?.phoneNumber || "No Number"}
                                            </span>
                                        )}
                                    </span>
                                </div> */}
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted">Driver:</span>

                                    <span className="text-body fw-semibold">
                                        {driverSettings?.driverName}
                                        <i
                                            className="bi bi-telephone text-theme6 ms-1 pointer"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowPhone(!showPhone)}
                                        ></i>
                                    </span>

                                    {showPhone && (
                                        <span className="ms-2 fw-semibold text-primary">
                                            {driverSettings?.phoneNumber || "No Number"}
                                        </span>
                                    )}
                                </div>

                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Vehicle:</span>
                                    <span className="text-body fw-semibold text-truncate">{driverSettings?.vehicleNumber}</span>
                                </div>

                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Trailers:</span>
                                    <span
                                        className={`fw-semibold text-truncate ${trailersText === "Missing" ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {trailersText}
                                    </span>
                                </div>

                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Shipping Docs:</span>
                                    <span
                                        className={`fw-semibold text-truncate ${shippingDocsText === "Missing" ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {shippingDocsText}
                                    </span>
                                </div>

                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Certification:</span>
                                    {/* <span
                                        className={`fw-semibold text-truncate ${driverLogs.isCertified ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        {driverLogs.isCertified ? "Certified" : "Uncertified"}
                                    </span> */}
                                    <span
                                        className={`fw-semibold text-truncate ${filteredLogs[0]?.isCertified ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        {filteredLogs[0]?.isCertified ? "Certified" : "Uncertified"}
                                    </span>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-4">
                            <div className="wrapper text-lg-center">
                                <div className="fs-14 text-muted mb-1">Worked Hours: <span className="text-body fs-12 fw-bold">00:00</span></div>
                                <div className="d-flex flex-wrap justify-content-lg-center gap-1">
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-primary rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">{breakTimeLeft}</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Break</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-success rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">{driveTimeLeft}</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Drive</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-theme6 rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">{shiftTimeLeft}</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Shift</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-secondary rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">{cycleTimeLeft}</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Cycle</span>
                                    </div>
                                    {/* <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-dark rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">00:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Recap</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="content-wrapper d-flex flex-column gap-2">
                                {/* Calendar Row */}
                                <div className="d-flex justify-content-xl-end">
                                    <div className="date-picker-element d-flex gap-1">
                                        <span className="event-btn border border-secondary border-opacity-50 rounded" onClick={handlePrevDay}>
                                            <i className="bi bi-chevron-left"></i>
                                        </span>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            maxDate={new Date()}   // disables all future dates
                                            dateFormat="MMM dd, yyyy"
                                            customInput={
                                                <div className="input-field d-flex align-items-center gap-2 border border-secondary border-opacity-50 rounded">
                                                    <i className="bi bi-calendar-week"></i>
                                                    <span className="text-body fw-medium">
                                                        {selectedDate.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            }
                                        />
                                        {/* <span className="event-btn border border-secondary border-opacity-50 rounded" onClick={handleNextDay}>
                                            <i className="bi bi-chevron-right"></i>
                                        </span> */}

                                        <span
                                            className={`event-btn border border-secondary border-opacity-50 rounded ${isSameDay(selectedDate, today) ? "disabled text-muted" : "cursor-pointer"
                                                }`}
                                            onClick={() => {
                                                if (!isSameDay(selectedDate, today)) {
                                                    // move one day forward
                                                    const nextDate = new Date(selectedDate);
                                                    nextDate.setDate(nextDate.getDate() + 1);

                                                    // only allow up to today
                                                    if (nextDate <= today) {
                                                        setSelectedDate(nextDate);
                                                    }
                                                }
                                            }}
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </span>
                                    </div>
                                </div>

                                {/* Buttons Row */}
                                <div className="action-btn-wrapper d-flex flex-wrap justify-content-xl-end gap-1">
                                    <Button variant='outline-danger'><i className="bi bi-sun fs-16"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-pencil"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-plus-lg fs-16"></i></Button>
                                    <Button variant='white' className="bg-white border-gray d-flex align-items-center justify-content-center gap-1 lh-1" title="Reset" >
                                        <img src={ReloadIcon} alt="Reload Icon" className="lh-1" />
                                        <span className="ms-1 d-sm-none">Refresh</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <LogChart />

                {/* Error Table Section */}
                <div className="table-content-wrapper">
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={tableData || []}
                            pagination
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
    )
}
