import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useParams  , useLocation} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardVehicleList, getVehiclePathAction } from '../../../store/actions/dashboard';
import { getCompanyInfo } from "../../../store/actions/companies";
import SearchIcon from '../../../assets/images/icons/search.svg';
import "./Location.scss";
import moment from "moment-timezone";

// Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const Location = () => {
    const dispatch = useDispatch();
    const { companyId } = useParams();

    const { vehicles, loading, error, historyPoints: storeHistoryPoints } = useSelector((state) => state.dashboard);
    const { company } = useSelector((state) => state.companies || {});

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("ascending");

    // NEW: selected date & history points
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [historyPoints, setHistoryPoints] = useState([]);

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const dateInputRef = useRef(null);
     const location = useLocation();

    const timeZoneId = location.state?.timeZoneId || null;
    console.log("Location page timezone ID:", timeZoneId);

    const getCompanyTimezone = useCallback(() => {
        // Mirror conversion approach from EditEvent: prefer company timezone, then vehicle, then provided state, then guess
        return (
            company?.timeZoneId ||
            company?.timeZone ||
            timeZoneId ||
          
            "America/Los_Angeles"
        );
    }, [company, selectedVehicle, timeZoneId]);

    const formatTimestampInCompanyTz = useCallback(
        (timestamp) => {
            if (!timestamp) return "-";
            const tz = getCompanyTimezone();
          
            const m = moment.utc(timestamp).tz(tz);
            return m.isValid() ? m.format("DD MMM YYYY hh:mm:ss A") : "-";
        },
        [getCompanyTimezone]
    );

    /** ------------------ Load Vehicles ------------------ **/
    useEffect(() => {
        if (companyId) {
            dispatch(getDashboardVehicleList(companyId));
            dispatch(getCompanyInfo(companyId));
        }
    }, [dispatch, companyId]);


    // Load vehicle path whenever selection/date changes
    useEffect(() => {
        if (!selectedVehicle || !selectedDate) return;
        dispatch(getVehiclePathAction(selectedVehicle.vehicleId, selectedDate, companyId));
    }, [dispatch, selectedVehicle, selectedDate, companyId]);

    // Sync store path to local state; normalize lat/lon keys for map
    useEffect(() => {
        if (storeHistoryPoints?.length) {
            setHistoryPoints(
                storeHistoryPoints.map((p) => ({
                    ...p,
                    latitude: p.latitude ?? p.lat,
                    longitude: p.longitude ?? p.lon,
                }))
            );
        } else {
            setHistoryPoints([]);
        }
    }, [storeHistoryPoints]);




const mapRef = useRef(null);

useEffect(() => {
    if (!selectedVehicle) return;

    const toCoord = (p) => {
        const lat = Number(p.latitude ?? p.lat);
        const lon = Number(p.longitude ?? p.lon ?? p.lng ?? p.long);
        if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
        return null;
    };

    const defaultCenter = [39.5, -98.35];  
    const fromHistory = (historyPoints || []).map(toCoord).filter(Boolean);
    const fallbackCoord = toCoord(selectedVehicle);
    const points = fromHistory.length ? fromHistory : fallbackCoord ? [fallbackCoord] : [];
    const coordsForMap = points.length ? points : [defaultCenter];

    if (mapRef.current) {
        mapRef.current.off();       
        mapRef.current.remove();   
        mapRef.current = null;
    }

    // Create new map without zoom controls
    mapRef.current = L.map("map", {
        zoomAnimation: false,
        fadeAnimation: false,
        zoomControl: false,  // Disable zoom controls (the + and - buttons)
    }).setView(coordsForMap[0], points.length ? 14 : 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 15,
    }).addTo(mapRef.current);

    const goldIcon = L.divIcon({
        html: `<div style="background:#DAA520;width:14px;height:14px;border-radius:50%;border:2px solid black;"></div>`
    });

    // Add markers with tooltip
    if (points.length) {
        points.forEach((coord, index) => {
            const vehicleData = storeHistoryPoints[index]; // assuming the data matches the points

            const lat = coord[0];
            const lon = coord[1];
            const location = vehicleData?.location || "Unknown Location";
            const timestamp = vehicleData?.timestamp;
            const timestampLabel = formatTimestampInCompanyTz(timestamp);

            // Create marker
            const marker = L.marker(coord, { icon: goldIcon }).addTo(mapRef.current);

            // Bind tooltip to the marker
            marker.bindTooltip(`
                <strong>Latitude:</strong> ${lat}<br>
                <strong>Longitude:</strong> ${lon}<br>
                <strong>Location:</strong> ${location}<br>
                <strong>Time:</strong> ${timestampLabel}

            `, {
                permanent: false,
                direction: 'top',
                offset: [0, -10],
            });
        });
    }

    // Auto fit
    if (points.length > 1) {
        mapRef.current.fitBounds(points);
    }

}, [selectedVehicle, historyPoints, formatTimestampInCompanyTz]);




    const openDatePicker = () => {
        // showPicker must be triggered by a user gesture; fall back to focus if unavailable
        try {
            if (dateInputRef.current?.showPicker) {
                dateInputRef.current.showPicker();
                return;
            }
        } catch (err) {
            // Ignore and fall back to focus
        }
        dateInputRef.current?.focus();
    };


    const getStatusCode = (vehicle) => {
        const raw = vehicle?.driverStatus || vehicle?.eventCode || "";
        return typeof raw === "string" ? raw.toUpperCase() : "";
    };

    const getLastUpdatedMoment = (vehicle) => {
        const candidate = vehicle?.updatedAt || vehicle?.timestamp;
        const m = candidate ? moment.utc(candidate).local() : null;
        return m && m.isValid() ? m : null;
    };

    const getLastUpdatedText = (vehicle) => {
        const m = getLastUpdatedMoment(vehicle);
        return m ? m.fromNow() : "N/A";
    };

 

    /** ------------------ FILTER Logic ------------------ **/
    const filteredVehicles = vehicles
        .filter(v =>
            v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
            v.driverName?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(v => {
            const status = getStatusCode(v);
            if (statusFilter === "all") return true;
            if (statusFilter === "motion") return v.speed > 5;
            if (statusFilter === "off") return status === "DS_OFF";
            if (statusFilter === "on") return status === "DS_ON";
            if (statusFilter === "sleep") return status === "DS_SB";
            return true;
        })
        .sort((a, b) => {
            const A = getLastUpdatedMoment(a)?.valueOf() ?? 0;
            const B = getLastUpdatedMoment(b)?.valueOf() ?? 0;
            return sort === "ascending" ? A - B : B - A;
        });


    return (
        <div className="Location-page py-2">
            <div className="container-fluid px-2">
                <div className="location-wrapper d-flex flex-column flex-lg-row justify-content-between gap-2">

                    {/* ------------------ RIGHT SECTION — MAP ------------------ */}
                    <div className="right-section d-flex flex-column">
                        <div className="location-map flex-fill">

                            {selectedVehicle ? (
                                <div
                                    id="map"
                                    style={{ width: "100%", height: "100%", minHeight: "600px" }}
                                ></div>
                            ) : (
                                <iframe
                                    src="https://maps.google.com/maps?hl=es&z=2&output=embed"
                                    width="100%"
                                    height="100%"
                                ></iframe>
                            )}

                        </div>
                    </div>


                    {/* ------------------ LEFT SECTION ------------------ */}
                    <div className="left-section d-flex flex-column gap-3" style={{ width: "250px" }}>

                        {/* Vehicle Selected → Show header */}
                                        {selectedVehicle && (
                    <div className="d-flex flex-column align-items-start p-2 border-bottom bg-white">
                        <span
                        className="cursor-pointer fs-4"
                        onClick={() => setSelectedVehicle(null)}
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        >
                        ←
                        </span>

                        <h6 className="m-0 fw-bold">{selectedVehicle.vehicleNumber}</h6>
                        
                        <Form.Control
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        onClick={openDatePicker}
                        ref={dateInputRef}
                        style={{ width: "180px", marginTop: "10px" }} // Added marginTop for spacing
                        />
                    </div>
                    )}



                        {/* ORIGINAL LIST WHEN NO VEHICLE SELECTED */}
                        {!selectedVehicle && (
                            <>
                                {/* Filters */}
                                <div className="filter-wrapper">
                                    <div className="searchfield-wrapper" style={{ width: "250px" }}>
                                        <Form.Control
                                            type="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <img src={SearchIcon} alt="Search Icon" className="icon" />
                                    </div>

                                    <div className="gap-2">
                                        <Form.Group style={{ width: "250px" }}>
                                            <Form.Label className="fs-12 fw-medium">Display trucks by status</Form.Label>
                                            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                                <option value="all">All</option>
                                                <option value="motion">In Motion</option>
                                                <option value="off">Off Duty</option>
                                                <option value="on">On Duty</option>
                                                <option value="sleep">Sleep</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group style={{ width: "250px" }}>
                                            <Form.Label className="fs-12 fw-medium">Arrange By</Form.Label>
                                            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                                <option value="ascending">Ascending</option>
                                                <option value="descending">Descending</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>

                                {/* Vehicle List */}
                                <div className="locations-list d-flex flex-column border rounded h-100 overflow-auto">
                                    {loading ? (
                                        <div className="p-3 text-center"><Spinner animation="border" /></div>
                                    ) : error ? (
                                        <div className="p-3 text-danger">{error}</div>
                                    ) : filteredVehicles.length === 0 ? (
                                        <div className="p-3 text-muted">No vehicles found</div>
                                    ) : (
                                        filteredVehicles.map((vehicle, index) => {
                                            const statusCode = getStatusCode(vehicle);
                                            const statusText = statusCode.replace("DS_", "") || "UNKNOWN";
                                            const lastUpdate = getLastUpdatedMoment(vehicle);
                                            const now = moment();
                                            const minutesDiff = lastUpdate ? now.diff(lastUpdate, "minutes") : Infinity;
                                            const isOffline = minutesDiff > 10;
                                            const bgColor =
                                                statusCode === "DS_OFF" ? "#6c757d" :
                                                statusCode === "DS_ON" || statusCode === "DS_D" ? "#128c12" :
                                                statusCode === "DS_SB" ? "#ffcc00" :
                                                "#6c757d";

                                            return (
                                                <div
                                                    key={vehicle._id}
                                                    className={`info-card fs-12 ${index !== filteredVehicles.length - 1 ? "border-bottom" : ""} p-3 cursor-pointer`}
                                                    onClick={() => {
                                                        setSelectedVehicle(vehicle);
                                                        setSelectedDate(moment().format("YYYY-MM-DD"));
                                                    }}
                                                >
                                                    {/* Status Icon */}
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <span
                                                            className={!isOffline && vehicle.speed > 0
                                                                ? "bi bi-send-fill text-green fs-12"
                                                                : "driver-status bg-secondary rounded"}
                                                            style={{
                                                                color: !isOffline && vehicle.speed > 0 ? "green" : "gray",
                                                                height: "12px",
                                                                width: "12px",
                                                            }}
                                                        ></span>

                                                        <span className="driver-name text-body fw-bold">{vehicle.vehicleNumber}</span>

                                                        <span className={`fw-medium ${!isOffline && vehicle.speed > 0 ? "text-success" : "text-secondary"}`}>
                                                            {!isOffline && vehicle.speed > 0 ? "Online" : "Offline"}
                                                        </span>
                                                    </div>

                                                    {/* Location */}
                                                    <div className="location-name d-flex align-items-center gap-2 mb-1">
                                                        <i className="bi bi-geo-alt"></i>
                                                        <span className="text-truncate">{vehicle.location || "Unknown"}</span>
                                                        <span className="text-secondary text-opacity-75 fw-medium ms-auto">
                                                            {getLastUpdatedText(vehicle)}
                                                        </span>
                                                    </div>

                                                    {/* Driver */}
                                                    <div className="location-name d-flex align-items-center gap-2">
                                                        <span
                                                            className="driving-status fw-medium text-white text-uppercase rounded-1 lh-1 px-2 py-
                                                            1"
                                                            style={{
                                                                backgroundColor: bgColor
                                                            }}
                                                        >
                                                            {statusText}
                                                        </span>

                                                        <span className="driver-name text-body fw-bold text-capitalize text-truncate">
                                                            {vehicle.driverName}
                                                        </span>
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
