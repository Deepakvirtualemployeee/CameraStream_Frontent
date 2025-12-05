import React, { useEffect, useState , useRef} from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardVehicles } from '../../../store/actions/dashboard';
import SearchIcon from '../../../assets/images/icons/search.svg';
import "./Location.scss";
import moment from "moment-timezone";

// Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const Location = () => {
    const dispatch = useDispatch();
    const { companyId } = useParams();

    const { vehicles, loading, error } = useSelector((state) => state.dashboard);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("ascending");

    // NEW: selected date & history points
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [historyPoints, setHistoryPoints] = useState([]);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    let mapInstance = null;

    /** ------------------ Load Vehicles ------------------ **/
    useEffect(() => {
        if (companyId) dispatch(getDashboardVehicles(companyId));
    }, [dispatch]);


   
    useEffect(() => {
        if (!selectedVehicle) return;

        // Filter all entries for selected vehicle & selected date
        const filtered = vehicles.filter(v =>
            v.vehicleId === selectedVehicle.vehicleId &&
            moment(v.timestamp).format("YYYY-MM-DD") === selectedDate
        );

        console.log("Filtered History Points:", filtered);

        setHistoryPoints(filtered);
    }, [selectedVehicle, selectedDate, vehicles]);

 
 

const mapRef = useRef(null);

useEffect(() => {
    if (!selectedVehicle) return;

    // Destroy old map safely
    if (mapRef.current) {
        mapRef.current.off();      // Remove event listeners
        mapRef.current.remove();   // Removes map & DOM safely
        mapRef.current = null;
    }

    const points = historyPoints?.length
        ? historyPoints.map(p => [p.latitude, p.longitude])
        : [[selectedVehicle.latitude, selectedVehicle.longitude]];

    // Create new map
    mapRef.current = L.map("map", {
        zoomAnimation: false,    
        fadeAnimation: false,
    }).setView(points[0], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(mapRef.current);

    const goldIcon = L.divIcon({
        html: `<div style="
            background:#DAA520;
            width:14px;
            height:14px;
            border-radius:50%;
            border:2px solid black;
        "></div>`
    });

    // Add markers
    points.forEach(coord => {
        L.marker(coord, { icon: goldIcon }).addTo(mapRef.current);
    });

    // Auto fit
    if (points.length > 1) {
        mapRef.current.fitBounds(points);
    }

}, [selectedVehicle, historyPoints]);




    /** ------------------ FILTER Logic ------------------ **/
    const filteredVehicles = vehicles
        .filter(v =>
            v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
            v.driverName?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(v => {
            if (statusFilter === "all") return true;
            if (statusFilter === "motion") return v.speed > 5;
            if (statusFilter === "off") return v.driverStatus === "DS_OFF";
            if (statusFilter === "on") return v.driverStatus === "DS_ON";
            if (statusFilter === "sleep") return v.driverStatus === "DS_SB";
            return true;
        })
        .sort((a, b) => {
            const A = new Date(a.updatedAt).getTime();
            const B = new Date(b.updatedAt).getTime();
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
                            <div className="d-flex align-items-center gap-2 p-2 border-bottom bg-white">

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
                                    style={{ width: "180px", marginLeft: "auto" }}
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
                                            const lastUpdate = moment(vehicle.updatedAt);
                                            const now = moment();
                                            const minutesDiff = now.diff(lastUpdate, "minutes");
                                            const isOffline = minutesDiff > 10;

                                            return (
                                                <div
                                                    key={vehicle._id}
                                                    className={`info-card fs-12 ${index !== filteredVehicles.length - 1 ? "border-bottom" : ""} p-3 cursor-pointer`}
                                                    onClick={() => setSelectedVehicle(vehicle)}
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
                                                            {moment(vehicle.updatedAt).fromNow()}
                                                        </span>
                                                    </div>

                                                    {/* Driver */}
                                                    <div className="location-name d-flex align-items-center gap-2">
                                                        <span
                                                            className="driving-status fw-medium text-white text-uppercase rounded-1 lh-1 px-2 py-
                                                            1"
                                                            style={{
                                                                backgroundColor:
                                                                    vehicle.driverStatus === "DS_OFF" ? "#6c757d" :
                                                                    vehicle.driverStatus === "DS_ON" || vehicle.driverStatus === "DS_D" ? "#128c12" :
                                                                    vehicle.driverStatus === "DS_SB" ? "#ffcc00" :
                                                                    "#6c757d"
                                                            }}
                                                        >
                                                            {vehicle.driverStatus.replace("DS_", "")}
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
