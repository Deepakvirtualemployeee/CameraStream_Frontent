import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import ReloadIcon from '../../../assets/images/icons/reload.svg';
import EditIcon from '../../../assets/images/icons/edit.svg';
// import ExternalIcon from '../../../assets/images/icons/external.svg';
import TrashIcon from '../../../assets/images/icons/trash.svg';
// import LogChart from "./LogChart";
import Chart from "./Chart";
import TrailersShippingInfoModal from "../../../components/TrailersShippingInfoModal";
import { getDriverData, getDriverLogs, getMobileSettings, getProcessedDriverData, deleteEvent } from '../../../store/actions/driverHOS';
import moment from "moment-timezone";
import { ConfirmModal } from "../../../components/common/ConfirmModal";
import CircularTimer from "./CircularTimer";
import { ROLES } from "../../../constants"

export const GraphDetails = () => {

    const { userDetails } = useSelector((state) => state.auth);
    const userRole = userDetails?.role;

    // State for showing phone
    const [showPhone, setShowPhone] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [allRefreshing, setAllRefreshing] = useState(false);
    const [dateLoading, setDateLoading] = useState(false);

    // Get params
    let { companyId, driverId } = useParams();
    // console.log("driverId", driverId);

    // For testing
    // driverId = '688b50c55dc4bbb932ffad56';

    // const [searchParams] = useSearchParams();
    // const companyId = searchParams.get("companyId");

    // console.log("Driver ID:", driverId);
    // console.log("Company ID:", companyId);

    const dispatch = useDispatch();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTSModal, setShowTSModal] = useState(false);
    const [hoveredEventId, setHoveredEventId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const tableWrapperRef = useRef(null);
    const scrollRetryRef = useRef(null);
    const requestIdRef = useRef(0); // tracks latest date fetch to avoid stale updates
    const datePickerPopperContainer = ({ children }) => (
        <div style={{ zIndex: 2000 }}>{children}</div>
    );
    // console.log("selectedDate", selectedDate);
    // const [logsEnabled, setLogsEnabled] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();

    // On mount, set selected date from location.state
    useEffect(() => {
        if (location.state?.selectedDate) {
            setSelectedDate(new Date(location.state.selectedDate));
        }
    }, [location.state]);
    // Redux state
    const { driverData, driverLogs, driverSettings, driverProcessedData, loading, error } = useSelector((state) => state.driversHOS);
    const driverTimeZone = driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles";

    // console.log("driverData", driverData);
    // console.log("driverSettings", driverSettings);
    // console.log("processedDriverData", driverProcessedData);

    // useEffect(() => {
    //     if (driverId) {
    //         dispatch(getDriverData(driverId));
    //         dispatch(getDriverLogs(driverId, formattedDate));
    //         dispatch(getMobileSettings(driverId));
    //         dispatch(getProcessedDriverData(driverId));
    //     }
    // }, [dispatch, driverId, companyId]);

    // Convert a Date object into a Date adjusted for a specific timezone
    const convertToCompanyTimezone = (date, tz) => {
        if (!tz) return date;
        // moment.tz keeps time correct, then format back to JS Date
        return moment.tz(moment(date), tz).toDate();
    };

    // Utility: format date as YYYY-MM-DD in driver’s timezone (defensive)
    const formatDate = (
        date,
        tz = driverTimeZone
    ) => {
        if (!date) return "";
        try {
            const m = tz ? moment.tz(moment(date), tz) : moment(date);
            if (!m || !m.isValid()) return "";
            return m.format("YYYY-MM-DD");
        } catch (_err) {
            const fallback = moment(date);
            return fallback.isValid() ? fallback.format("YYYY-MM-DD") : "";
        }
    };

    // --- useEffect to fetch logs whenever selectedDate changes ---
    // useEffect(() => {
    //     if (driverId && selectedDate) {
    //         const formattedDate = formatDate(selectedDate);
    //         dispatch(getDriverData(driverId));
    //         dispatch(getDriverLogs(driverId, formattedDate));
    //         dispatch(getMobileSettings(driverId));
    //         dispatch(getProcessedDriverData(driverId));
    //     }
    // }, [dispatch, driverId, companyId, selectedDate]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //       if (driverId && selectedDate) {
    //         setDateLoading(true); // show spinner

    //         const formattedDate = formatDate(selectedDate);

    //         try {
    //           await Promise.all([
    //             dispatch(getDriverData(driverId)),
    //             dispatch(getDriverLogs(driverId, formattedDate)),
    //             dispatch(getMobileSettings(driverId)),
    //             dispatch(getProcessedDriverData(driverId)),
    //           ]);
    //         } catch (error) {
    //           console.error("Error fetching data for new date:", error);
    //         } finally {
    //           setDateLoading(false); // hide spinner
    //         }
    //       }
    //     };

    //     fetchData();
    //   }, [dispatch, driverId, companyId, selectedDate]);

useEffect(() => {
    if (!driverId || !selectedDate) return;

    const fetchId = ++requestIdRef.current;
    const fetchData = async () => {
        setDateLoading(true);

        const tz = driverTimeZone;
        const formattedDate = formatDate(selectedDate, tz);
        if (!formattedDate) {
            if (requestIdRef.current === fetchId) setDateLoading(false);
            return;
        }

        try {
            await Promise.all([
                dispatch(getDriverData(driverId, formattedDate)),
                dispatch(getDriverLogs(driverId, formattedDate)),
                dispatch(getMobileSettings(driverId)),
            ]);
        } finally {
            if (requestIdRef.current === fetchId) {
                setDateLoading(false);
            }
        }
    };

    fetchData();
}, [dispatch, driverId, selectedDate, driverTimeZone]);


    useEffect(() => {
        if (driverLogs && driverLogs.length > 0) {
            setDateLoading(false); // Hide spinner after logs are loaded
        }
    }, [driverLogs]);

    useEffect(() => {
        setHoveredEventId(null);
    }, [selectedDate, driverLogs]);

    // Hover is ignored; we highlight rows only on click/tap.
    const handleHoverEvent = () => { };
    const handleHoverEnd = () => { };

    const handleSelectEvent = (eventId) => {
        console.log("[GraphDetails] Click from chart:", eventId);
        setHoveredEventId(eventId || null);
    };

    // const handlePrevDay = () => {
    //     setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
    // };

    const handlePrevDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
    };

    // const handleNextDay = () => {
    //     setSelectedDate((prev) => {
    //         const next = new Date(prev);
    //         next.setDate(next.getDate() + 1);

    //         const today = new Date();
    //         today.setHours(0, 0, 0, 0);

    //         if (next > today) return prev; // prevent future
    //         return next;
    //     });
    // };


    const handleRefreshDriverLogs = () => {
        if (driverId && selectedDate) {
            const formattedDate = formatDate(selectedDate);
            dispatch(getDriverLogs(driverId, formattedDate));
            dispatch(getMobileSettings(driverId));
        }
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

    // Format date for driver logs
    // const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    // console.log("formattedDate", formattedDate); // 2025-09-18

    /** Filter logs by selected date */
    // Utility: format date (YYYY-MM-DD)
    // const formatDate = (date) => {
    //     return new Date(date).toISOString().split("T")[0];
    // };
    // Utility: format date (YYYY-MM-DD)
    // const formatDate = (date) => {
    //     return moment(date).format("YYYY-MM-DD");  // <-- using moment
    //   };

    console.log("driverLogs", driverLogs);


    // Filter logs based on selected date
    const filteredLogs = driverLogs?.filter(
        (log) => formatDate(log.logDate) === formatDate(selectedDate)
    ) || [];


    // Convert seconds → HH:mm format
    // keep24h = true  → wrap hours within 24h (08:00, 11:00, 14:00)
    // keep24h = false → keep full hours (70:00 etc.)
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

    // Circle values now use driverProcessedData
    const breakTimeLeft = formatSecondsToHHMM(
        (driverProcessedData?.breakTime?.limitTime || 0) -
        (driverProcessedData?.breakTime?.accumulatedTime || 0)
    );

    const driveTimeLeft = formatSecondsToHHMM(
        (driverProcessedData?.driveTime?.limitTime || 0) -
        (driverProcessedData?.driveTime?.accumulatedTime || 0)
    );

    const shiftTimeLeft = formatSecondsToHHMM(
        (driverProcessedData?.shiftTime?.limitTime || 0) -
        (driverProcessedData?.shiftTime?.accumulatedTime || 0)
    );

    const cycleTimeLeft = formatSecondsToHHMM(
        (driverProcessedData?.cycleTime?.limitTime || 0) -
        (driverProcessedData?.cycleTime?.accumulatedTime || 0)
    );

    // Handle refresh button click
    const handleRefreshProcessedData = async () => {
        if (driverId) {
            setRefreshing(true);
            await dispatch(getProcessedDriverData(driverId));
            setRefreshing(false);
        }
    };

    const handleRefreshAllData = async () => {
        if (!driverId || !selectedDate) return;
        setAllRefreshing(true);

        const formattedDate = formatDate(selectedDate);

        try {
            await Promise.all([
                dispatch(getDriverData(driverId, formattedDate)),
                dispatch(getDriverLogs(driverId, formattedDate)),
                dispatch(getMobileSettings(driverId)),
                // dispatch(getProcessedDriverData(driverId)),
            ]);
            console.log("All data refreshed successfully!");
        } catch (error) {
            console.error("Error refreshing all data:", error);
        } finally {
            setAllRefreshing(false);
        }
    };


    const handleDeleteLog = (eventId) => {
        setSelectedEventId(eventId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedEventId || !driverId || !selectedDate) return;

        const formattedDate = formatDate(selectedDate);

        await dispatch(deleteEvent(companyId, driverId, selectedEventId, navigate));

        // Refresh all related data (same pattern as edit submit)
        await Promise.all([
            dispatch(getDriverData(driverId, formattedDate)),
            dispatch(getDriverLogs(driverId, formattedDate)),
            dispatch(getMobileSettings(driverId)),
            // dispatch(getProcessedDriverData(driverId)), // enable if processed circles must update too
        ]);

        setShowDeleteModal(false);
        setSelectedEventId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedEventId(null);
    };

    const columns = [
        {
            name: '#',
            selector: (row) => row.id,
            sortable: true,
            minWidth: '50px',
            center: true,
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
        // {
        //     name: 'Status',
        //     minWidth: '180px',
        //     cell: (row) => {
        //         const isGreen = row.status === "Driving" || row.status === "ON Duty";
        //         return (
        //             <div
        //                 className={`${isGreen ? "bg-success" : "bg-secondary"} text-white text-center rounded-3 px-3 py-2`}
        //                 style={{ width: '120px' }}
        //             >
        //                 <div className="fs-14 fw-medium">{row.status}</div>
        //                 {/* <div className="fs-10 mt-1">15 days ago</div> */}
        //             </div>
        //         );
        //     },
        // },
        {
            name: "Status",
            minWidth: "180px",
            center: true,
            cell: (row) => {
                // Reverse-map from status to eventCode if needed
                const eventCode = row.eventCode; // make sure you store this in tableData
                const color = eventCodeColors[eventCode] || "#000"; // default black
                const isHighlighted = !!eventCodeColors[eventCode];

                return (
                    <span
                        style={{
                            color,
                            fontWeight: isHighlighted ? "bold" : "normal",
                        }}
                    >
                        {row.status}
                    </span>
                );
            },
        },
        {
            // name: `Start (PDT)`,
            name: `Start (${driverSettings?.timeZoneId || driverSettings?.timeZone || 'PDT'})`,
            selector: (row) => row.start_PDT,
            minWidth: '230px',
            center: true,
        },
        {
            name: 'Duration',
            selector: (row) => row.duration,
            minWidth: '120px',
            center: true,
        },
        {
            name: 'Location',
            // selector: (row) => row.location,
            minWidth: '250px',
            center: true,
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-body text-nowrap ms-1">{row.location}</span>
                    {/* <span><img src={ExternalIcon} alt="ExternalIcon" className="img-fluid" /></span>
                    <span><i className="bi bi-copy fs-5 text-body"></i></span> */}
                </div>
            ),
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle,
            minWidth: '80px',
            center: true,
        },
        {
            name: 'Odometer',
            selector: (row) => row.odometer,
            minWidth: '120px',
            center: true,
        },
        {
            name: 'Engine Hours',
            minWidth: '120px',
            selector: (row) => row.engine_hours,
            center: true,
        },
        {
            name: 'Origin',
            minWidth: '80px',
            selector: (row) => row.origin,
            center: true,
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
            center: true,
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
            center: true,
        },
        {
            name: 'Notes',
            minWidth: '120px',
            center: true,
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
            name: 'ID',
            selector: (row) => row.seqId,
            minWidth: '120px',
            center: true,
        },
        {
            name: userRole === ROLES.FLEET_MANAGER ? "" : "Actions",
            minWidth: '120px',
            center: true,
            cell: (row) =>
                userRole !== ROLES.FLEET_MANAGER && (
                    <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                        {!row.isFirstEvent && (
                            <>
                                <span className='pointer' title='Edit' onClick={() => navigate(`/driver-hos/graph-details/edit-event/${companyId}/${driverId}`, {
                                    state: { selectedDate: selectedDate, eventId: row.eventId, driverLogs: driverLogs, timeZoneId: driverSettings?.timeZoneId || driverSettings?.timeZone || 'America/Los_Angeles' },
                                })}><img src={EditIcon} alt="Edit Icon" /></span>
                                {userRole !== ROLES.Company_Safety_Personal && (
                                    <span
                                        className='pointer p-0'
                                        title='Delete'
                                        onClick={() => handleDeleteLog(row.eventId)}
                                    >
                                        <img src={TrashIcon} alt="Trash Icon" />
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                )
        },
    ];

    // Define event code → color mapping
    const eventCodeColors = {
        DS_SB: "#E0AD3C",
        DS_OFF: "#686F83",
        DS_ON: "#4C8EF3",
        DR_IND_PC: "#755BEF",
        DR_IND_YM: "#EB542A",
        DS_D: "#54B571",
    };

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

    // Convert milliseconds → HH:mm:ss
    // const formatDuration = (ms) => {
    //     if (!ms || ms < 0) return "--";
    //     const totalSeconds = Math.floor(ms / 1000);
    //     const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    //     const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    //     const seconds = String(totalSeconds % 60).padStart(2, "0");
    //     return `${hours}h:${minutes}m:${seconds}s`;
    // };

    const formatDuration = (ms) => {
        if (ms == null || isNaN(ms)) return "--";
        const totalSeconds = Math.max(0, Math.floor(ms / 1000)); // never negative
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        // HHh:MMm:SSs format (e.g., 02h:57m:04s)
        return `${hours}h:${minutes}m:${seconds}s`;
    };


    // Allowed event codes for duration calculation
    const allowedEventCodes = [
        "DR_IND_YM", // Yard Move
        "DR_IND_PC", // Personal Conveyance
        "DS_SB",     // Sleeper Berth
        "DS_OFF",     // Driver off duty
        "DS_ON",     // Driver on duty
        "DS_D",     // Driving
    ];

    const resolveEventId = (event) =>
        event?._id ||
        event?.seqId ||
        event?.eventDateTime ||
        event?.startTime ||
        event?.eventCode ||
        null;

    // Transform filteredLogs into table data
    const tableData = driverLogs
        ?.flatMap((log) =>
            log.hosEvents.map((event, index) => {
                let duration = "--";
                const eventId = resolveEventId(event);

                const tz = driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles";

                if (allowedEventCodes.includes(event?.eventCode)) {
                    const startMoment = event?.startTime || event?.eventDateTime
                        ? moment.tz(event.startTime || event.eventDateTime, tz)
                        : null;

                    let endMoment = null;

                    // Prefer explicit endTime from backend when available
                    if (event?.endTime) {
                        endMoment = moment.tz(event.endTime, tz);
                    } else {
                        // Otherwise fall back to the next allowed event's start
                        const nextAllowed = log.hosEvents
                            .slice(index + 1)
                            .find((e) => allowedEventCodes.includes(e?.eventCode));

                        if (nextAllowed?.startTime || nextAllowed?.eventDateTime) {
                            endMoment = moment.tz(
                                nextAllowed.startTime || nextAllowed.eventDateTime,
                                tz
                            );
                        } else if (startMoment) {
                            // If no next event, use end of day (or current time if same day)
                            const now = moment().tz(tz);
                            const endOfDay = moment.tz(log.date || startMoment, tz).endOf("day");
                            endMoment = startMoment.isSame(now, "day") ? now : endOfDay;
                        }
                    }

                    if (startMoment && endMoment) {
                        const diff = Math.max(0, endMoment.diff(startMoment));
                        duration = formatDuration(diff);
                    }
                }

                return {
                    eventId,
                    id: String(index + 1).padStart(2, "0"),
                    eventCode: event.eventCode,
                    status: mapEventCodeToStatus(event.eventCode) || event.eventCode,
                    start_PDT: event.eventDateTime
                        ? moment(event.eventDateTime).tz(tz).format("MMM DD, YYYY hh:mm:ss A")
                        : "--",
                    duration,
                    location: event.location || event.manualLocation || event.calculatedLocation || "Unknown",
                    vehicle: event.vehicle?.vehicleNumber || "--",
                    odometer: event.odometer || "--",
                    engine_hours: event.engineHours || "--",
                    origin: event.origin || "--",
                    trailers: event.trailers?.length ? event.trailers.join(", ") : "",
                    shippingDocs: event.shippingDocs?.length ? event.shippingDocs.join(", ") : "",
                    notes: event.notes?.length ? event.notes.join(", ") : "",
                    seqId: event.seqId || "--",
                    isFirstEvent: index === 0 // <-- mark the first event
                };
            })
        );


    useEffect(() => {
        if (!hoveredEventId) {
            console.log("[GraphDetails] highlight cleared");
            return;
        }
        const match = (tableData || []).find((row) => row.eventId === hoveredEventId);
        console.log("[GraphDetails] highlight attempt", {
            hoveredEventId,
            found: !!match,
            matchStatus: match?.status,
            matchStart: match?.start_PDT,
        });
    }, [hoveredEventId, tableData]);

    useEffect(() => {
        if (!hoveredEventId || !tableData?.length) return;
        const rowIndex = tableData.findIndex((row) => row.eventId === hoveredEventId);
        if (rowIndex === -1) return;
        const targetPage = Math.floor(rowIndex / rowsPerPage) + 1;
        if (targetPage !== currentPage) {
            console.log("[GraphDetails] switching page for highlight", { targetPage, currentPage, rowIndex, rowsPerPage });
            setCurrentPage(targetPage);
        }
    }, [hoveredEventId, tableData, rowsPerPage, currentPage]);

    const conditionalRowStyles = [
        {
            when: (row) => hoveredEventId && row.eventId === hoveredEventId,
            style: {
                backgroundColor: "#e7f1ff",
                color: "#000",
            },
            classNames: ["hovered-hos-row"],
        },
    ];

    useEffect(() => {
        if (scrollRetryRef.current) {
            clearTimeout(scrollRetryRef.current);
            scrollRetryRef.current = null;
        }
        if (!hoveredEventId) return;

        const container = tableWrapperRef.current;
        const rowIndex = tableData?.findIndex((row) => row.eventId === hoveredEventId) ?? -1;
        if (rowIndex === -1) return;

        const targetPage = Math.floor(rowIndex / rowsPerPage) + 1;

        // Keep the very first rows visible (no auto-scroll) so they don't hide under the graph.
        // But ensure the list is scrolled to top when coming back from deeper pages.
        if (targetPage === 1 && rowIndex <= 2) {
            if (targetPage !== currentPage) {
                setCurrentPage(targetPage);
                scrollRetryRef.current = setTimeout(() => {
                    if (container?.scrollTo) {
                        container.scrollTo({ top: 0, behavior: "smooth" });
                    }
                }, 200);
            } else if (container?.scrollTo) {
                container.scrollTo({ top: 0, behavior: "smooth" });
            }
            return;
        }

        const performScroll = (attempt = 0) => {
            const highlighted = container?.querySelector(".hovered-hos-row");
            if (!highlighted) {
                if (attempt < 12) {
                    scrollRetryRef.current = setTimeout(() => performScroll(attempt + 1), 80);
                }
                return;
            }

            // Smoothly center the highlighted row within its scroll container
            highlighted.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        };

        // If we need to change pages, switch first and then scroll after a short delay
        if (targetPage !== currentPage) {
            setCurrentPage(targetPage);
            scrollRetryRef.current = setTimeout(() => performScroll(0), 220);
            return;
        }

        performScroll(0);
    }, [hoveredEventId, currentPage, rowsPerPage, tableData]);

    // Getting tailers and shipping docs
    const trailers = driverLogs
        ?.flatMap(log => log.trailers || []) // collect all trailers
        .filter(Boolean); // remove empty/null

    const shippingDocs = driverLogs
        ?.flatMap(log => log.shippingDocuments || []) // collect all docs
        .filter(Boolean); // remove empty/null

    // Final strings with fallback
    const trailersText = trailers.length ? trailers.join(", ") : "Missing";
    const shippingDocsText = shippingDocs.length ? shippingDocs.join(", ") : "Missing";

    // Violations for the selected day (break/shift/drive/cycle)
const violationsForDay = React.useMemo(() => {
    if (!driverLogs || driverLogs.length === 0) return [];

    const log = driverLogs[0]; // API returns single day log

    if (!log?.violations) return [];

    const entries = [];

    const pushType = (list, type) => {
        (list || []).forEach((v) => {
            entries.push({
                id: v._id || `${type}-${v.startTime || v.logDate}`,
                type,
                start: v.startTime || v.logDate,
            });
        });
    };

    pushType(log.violations.break, "Break");
    pushType(log.violations.shift, "Shift");
    pushType(log.violations.drive, "Drive");
    pushType(log.violations.cycle, "Cycle");

    return entries.sort((a, b) => new Date(a.start) - new Date(b.start));
}, [driverLogs]);

    const formatViolationTime = (iso) => {
        if (!iso) return "--";
        const tz = driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles";
        return moment(iso).tz(tz).format("MMM DD, YYYY hh:mm A");
    };

    // Helper function to check if two dates are the same day
    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const today = new Date();

    // if (dateLoading || allRefreshing || refreshing) {
    //     return (
    //         <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "70vh" }}>
    //             <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
    //                 <span className="visually-hidden">Loading...</span>
    //             </div>
    //             <p className="mt-3 fw-semibold text-secondary">
    //                 {allRefreshing
    //                     ? "Refreshing all data..."
    //                     : refreshing
    //                         ? "Refreshing processed data..."
    //                         : "Loading driver data..."}
    //             </p>
    //         </div>
    //     );
    // }

    {
        (dateLoading || allRefreshing || refreshing) && (
            <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)",
                }}
            >
                <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 fw-semibold text-secondary">
                    {allRefreshing
                        ? "Refreshing all data..."
                        : refreshing
                            ? "Refreshing processed data..."
                            : "Loading driver data..."}
                </p>
            </div>
        )
    }

    const tz = driverTimeZone;
    const carrierName = driverSettings?.companyName || driverData?.companyName || "--";
    const vehicleNumber =
        driverSettings?.vehicleNumber ||
        driverData?.vehicleNumber ||
        driverLogs?.[0]?.hosEvents?.find((event) => event?.vehicle?.vehicleNumber)?.vehicle?.vehicleNumber ||
        "--";

    // Convert UTC to company timezone for display
    const displayDate = selectedDate
        ? moment.tz(selectedDate, tz).format("MMM DD, YYYY")
        : "";

    // Get current date in company timezone (without time)
    const todayInTZ = moment.tz(tz).startOf("day").toDate();

    // if (dateLoading) {
    return (
        <div className="GraphDetails-page py-2">
            <div className="GraphDetails-page py-2 position-relative">
                {/* Loader Overlay */}
                {(dateLoading || allRefreshing || refreshing) && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        style={{
                            background: "rgba(255, 255, 255, 0.3)",
                            zIndex: 9999,
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 fw-semibold text-secondary">
                            {allRefreshing
                                ? "Refreshing all data..."
                                : refreshing
                                    ? "Refreshing processed data..."
                                    : "Loading driver data..."}
                        </p>
                    </div>
                )}
                <div className="container-fluid">
                    <div className="top-section mb-3">
                        <div className="row gx-2 gy-3">
                            <div className="col-lg-6 col-xl-4">
                                <div className="info-wrapper">
                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted text-truncate">Carrier:</span>
                                        <span className="text-body fw-semibold text-truncate">{carrierName}</span>
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
                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted">Driver:</span>
                                        <span className="d-flex flex-column gap-1">
                                            <span className="text-body fw-semibold">
                                                {driverSettings?.driverName}
                                            </span>
                                            <span className="text-body fw-semibold d-flex align-items-center gap-2">
                                                <i className="bi bi-telephone-fill text-theme6 pointer"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setShowPhone(!showPhone)}
                                                ></i>
                                                {/* {showPhone && ( */}
                                                <span className="fw-semibold text-primary">
                                                    {driverSettings?.phoneNumber || "No Number"}
                                                </span>
                                                {/* )} */}
                                            </span>
                                        </span>
                                    </div>

                                    {(driverSettings?.coDriverName) && (
                                        <div className="info-box d-flex gap-1 mb-2">
                                            <span className="label-name text-muted text-truncate">Co-Driver:</span>
                                            <span className="text-body fw-semibold text-truncate">{driverSettings?.coDriverName}</span>
                                        </div>
                                    )}

                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted text-truncate">Vehicle:</span>
                                        <span className="text-body fw-semibold text-truncate">{vehicleNumber}</span>
                                    </div>

                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted text-truncate">Trailers:</span>
                                        <span
                                            className={`fw-semibold text-truncate ${trailersText === "Missing" ? "text-danger" : "text-success"
                                                }`}
                                        >
                                            {trailersText}
                                        </span>
                                    </div>

                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted text-truncate">Shipping Docs:</span>
                                        <span
                                            className={`fw-semibold text-truncate ${shippingDocsText === "Missing" ? "text-danger" : "text-success"
                                                }`}
                                        >
                                            {shippingDocsText}
                                        </span>
                                    </div>

                                    <div className="info-box d-flex gap-1 mb-2">
                                        <span className="label-name text-muted text-truncate">Certification:</span>
                                        {/* <span
                                        className={`fw-semibold text-truncate ${driverLogs.isCertified ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        {driverLogs.isCertified ? "Certified" : "Uncertified"}
                                    </span> */}
                                        <span
                                            className={`fw-semibold text-truncate ${driverLogs[0]?.isCertified ? "text-success" : "text-danger"
                                                }`}
                                        >
                                            {driverLogs[0]?.isCertified ? "Certified" : "Uncertified"}
                                        </span>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-4">
                                <div className="wrapper text-lg-center">
                                    <div className="fs-14 text-muted mb-1">Worked Hours: <span className="text-body fs-12 fw-bold">00:00</span></div>
                                    {/* <div className="d-flex flex-wrap justify-content-lg-center gap-3">
                                        <CircularTimer
                                            label="Break"
                                            limit={driverProcessedData?.breakTime?.limitTime || driverData?.breakTime?.limitTime || 0}
                                            accumulated={driverProcessedData?.breakTime?.accumulatedTime || driverData?.breakTime?.accumulatedTime || 0}
                                            color="#A67C52" // brown
                                        />
                                        <CircularTimer
                                            label="Drive"
                                            limit={driverProcessedData?.driveTime?.limitTime || 0}
                                            accumulated={driverProcessedData?.driveTime?.accumulatedTime || 0}
                                            color="#4C8EF3" // blue
                                        />
                                        <CircularTimer
                                            label="Shift"
                                            limit={driverProcessedData?.shiftTime?.limitTime || 0}
                                            accumulated={driverProcessedData?.shiftTime?.accumulatedTime || 0}
                                            color="#54B571" // green
                                        />
                                        <CircularTimer
                                            label="Cycle"
                                            limit={driverProcessedData?.cycleTime?.limitTime || 0}
                                            accumulated={driverProcessedData?.cycleTime?.accumulatedTime || 0}
                                            color="#808080" // grey
                                        />
                                    </div> */}
                                    <div className="d-flex flex-wrap justify-content-lg-center gap-3">
                                        <CircularTimer
                                            label="Break"
                                            limit={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.breakTime?.limitTime
                                                    : driverData.breakTime?.limitTime) || 0
                                            }
                                            accumulated={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.breakTime?.accumulatedTime
                                                    : driverData.breakTime?.accumulatedTime) || 0
                                            }
                                            color="#A67C52" // brown
                                        />

                                        <CircularTimer
                                            label="Drive"
                                            limit={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.driveTime?.limitTime
                                                    : driverData.driveTime?.limitTime)
                                            }
                                            accumulated={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.driveTime?.accumulatedTime
                                                    : driverData.driveTime?.accumulatedTime)
                                            }
                                            color="#4C8EF3" // blue
                                        />

                                        <CircularTimer
                                            label="Shift"
                                            limit={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.shiftTime?.limitTime
                                                    : driverData.shiftTime?.limitTime)
                                            }
                                            accumulated={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.shiftTime?.accumulatedTime
                                                    : driverData.shiftTime?.accumulatedTime)
                                            }
                                            color="#54B571" // green
                                        />

                                        <CircularTimer
                                            label="Cycle"
                                            limit={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.cycleTime?.limitTime
                                                    : driverData.cycleTime?.limitTime)
                                            }
                                            accumulated={
                                                (driverProcessedData && Object.keys(driverProcessedData).length > 0
                                                    ? driverProcessedData.cycleTime?.accumulatedTime
                                                    : driverData.cycleTime?.accumulatedTime)
                                            }
                                            color="#808080" // grey
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="content-wrapper d-flex flex-column gap-2">
                                    {/* Calendar Row */}
                                    <div className="d-flex justify-content-xl-end">
                                        <div className="date-picker-element d-flex gap-1">
                                            <span className="event-btn border border-secondary border-opacity-50 d-flex align-items-center rounded" onClick={handlePrevDay}>
                                                <i className="bi bi-chevron-left"></i>
                                            </span>
                                            {/* <DatePicker
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
                                            /> */}
                                            <DatePicker
                                                selected={convertToCompanyTimezone(selectedDate, driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles")}
                                                onChange={(date) => {
                                                    // Convert picked date back to UTC (neutral) for API usage
                                                    const tz = driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles";
                                                    const utcDate = moment.tz(moment(date).format("YYYY-MM-DD"), tz).utc().toDate();
                                                    setSelectedDate(utcDate);
                                                }}
                                                dateFormat="MMM dd, yyyy"
                                                className="form-control"
                                                showPopperArrow={false}
                                                popperContainer={datePickerPopperContainer}
                                                popperClassName="graph-details-datepicker-popper"
                                                maxDate={todayInTZ} // disables future dates according to company timezone
                                                customInput={
                                                    <div className="input-field d-flex align-items-center gap-2 border border-secondary border-opacity-50 rounded p-2">
                                                        <i className="bi bi-calendar-week"></i>
                                                        <span className="text-body fw-medium">{displayDate || "Select Date"}</span>
                                                    </div>
                                                }
                                            />

                                            {/* <span className="event-btn border border-secondary border-opacity-50 d-flex align-items-center rounded" onClick={handleNextDay}>
                                            <i className="bi bi-chevron-right"></i>
                                        </span> */}

                                            <span
                                                className={`event-btn border border-secondary border-opacity-50 d-flex align-items-center rounded ${isSameDay(selectedDate, today) ? "disabled text-muted" : "cursor-pointer"
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
                                    {![ROLES.FLEET_MANAGER, ROLES.Company_Safety_Personal].includes(userRole) && (
                                        <div className="action-btn-wrapper d-flex flex-wrap justify-content-xl-end gap-1">
                                            {/* <Button variant='outline-danger'><i className="bi bi-sun fs-16"></i></Button> */}
                                            <Button
                                                variant="outline-danger"
                                                title="Recalculate Processed Data"
                                                onClick={handleRefreshProcessedData}
                                                disabled={refreshing}
                                            >
                                                {refreshing ? (
                                                    <span className="spinner-border spinner-border-sm text-danger" role="status" />
                                                ) : (
                                                    <i className="bi bi-sun fs-16"></i>
                                                )}
                                            </Button>

                                            <Button variant='outline-danger' onClick={() => setShowTSModal(true)}><i className="bi bi-pencil"></i></Button>
                                            <Button variant='outline-danger' onClick={() => navigate(`/driver-hos/graph-details/add-event/${companyId}/${driverId}`, { state: { selectedDate: selectedDate, timeZoneId: driverSettings?.timeZoneId || driverSettings?.timeZone || 'America/Los_Angeles' } })}><i className="bi bi-plus-lg fs-16"></i></Button>

                                            <Button
                                                variant="white"
                                                className="bg-white border-gray d-flex align-items-center justify-content-center gap-1 lh-1"
                                                title="Refresh All"
                                                onClick={handleRefreshAllData}
                                                disabled={allRefreshing}
                                            >
                                                {allRefreshing ? (
                                                    <i className="bi bi-arrow-clockwise fs-5 spin"></i>
                                                ) : (
                                                    <img src={ReloadIcon} alt="Reload Icon" className="lh-1" />
                                                )}
                                                <span className="ms-1 d-sm-none">Refresh</span>
                                            </Button>
                                        </div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    {/* <LogChart
                    logs={driverLogs}
                    selectedDate={selectedDate}
                    timezone={driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles"}
                /> */}
                    <div
                        style={{
                            position: "sticky",
                            top: "120px",
                            zIndex: 5,
                            background: "#fff",
                        }}
                    >
                    <Chart
                        logs={driverLogs}
                        selectedDate={selectedDate}
                        timezone={driverSettings?.timeZoneId || driverSettings?.timeZone || "America/Los_Angeles"}
                        violations={violationsForDay}
                        onHoverEvent={undefined}
                        onHoverEnd={undefined}
                        onClickEvent={handleSelectEvent}
                    />
                    </div>

                    <ConfirmModal
                        show={showDeleteModal}
                        handleClose={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        title="Are you sure you want to permanently delete this event?"
                        confirmText="Delete"
                        confirmVariant="danger"
                        iconClass="bi-trash"
                    />

                    {/* Error Table Section */}
                    <div
                        className="table-content-wrapper"
                        style={{
                            zIndex: 1,
                            maxHeight: "30vh",
                            overflowY: "auto",
                        }}
                        ref={tableWrapperRef}
                    >
                        <div className='table-responsive table-custom-wrapper h-100'>

                            <DataTable
                                key={`hos-table-${currentPage}-${rowsPerPage}`}
                                columns={columns}
                                data={tableData || []}
                                pagination
                                paginationPerPage={rowsPerPage}
                                paginationDefaultPage={currentPage}
                                onChangePage={(page) => setCurrentPage(page)}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setRowsPerPage(newPerPage);
                                    setCurrentPage(page);
                                }}
                                highlightOnHover
                                responsive
                                customStyles={dataTableCustomStyles}
                                conditionalRowStyles={conditionalRowStyles}
                                noDataComponent={<NoDataComponent />}
                                striped
                            />

                        </div>
                    </div>

                    {/* Trailers & Shipping Docs Modal */}
                    <TrailersShippingInfoModal
                        show={showTSModal}
                        onClose={() => setShowTSModal(false)}
                        onRefresh={handleRefreshDriverLogs}   // automatically re-fetch data after submit
                        initialData={driverLogs}
                        onSubmit={() => setShowTSModal(false)}
                    />
                </div>
            </div>
            
        </div>

    )
    // }
}
