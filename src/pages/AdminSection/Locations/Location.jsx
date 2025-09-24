import React, { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardVehicles } from '../../../store/actions/dashboard';
import SearchIcon from '../../../assets/images/icons/search.svg';
import "./Location.scss";
import moment from "moment-timezone";

export const Location = () => {
    const dispatch = useDispatch();
    const { companyId } = useParams(); // company id from URL

    const { vehicles, loading, error } = useSelector((state) => state.dashboard);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sort, setSort] = useState("ascending");
    const [selectedVehicle, setSelectedVehicle] = useState(null); // 🚀 new state

    useEffect(() => {
        if (companyId) {
            dispatch(getDashboardVehicles(companyId));
        }
    }, [dispatch]);

    // Filtering + Searching + Sorting
    const filteredVehicles = vehicles
        .filter(v =>
            v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
            v.driverName?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(v => {
            if (statusFilter === "all") return true;

            if (statusFilter === "motion") {
                return v.speed > 5; // motion if speed > 5
            }

            if (statusFilter === "off") return v.driverStatus === "DS_OFF";
            if (statusFilter === "on") return v.driverStatus === "DS_ON";
            if (statusFilter === "sleep") return v.driverStatus === "DS_SB";

            return true; // default
        })
        .sort((a, b) => {
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();

            if (sort === "ascending") {
                return timeA - timeB; // older first → "longer ago"
            }
            return timeB - timeA; // newer first → "just now" first
        });

    return (
        <div className="Location-page py-2">
            <div className="container-fluid px-2">
                <div className="location-wrapper d-flex flex-column flex-lg-row justify-content-between gap-2">

                    {/* Left Section */}
                    <div className="left-section d-flex flex-column gap-3">
                        {/* Filters */}
                        <div className="filter-wrapper">
                            <div className="searchfield-wrapper mw-100 mb-3">
                                <Form.Control
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder='Search by Vehicle Number or Driver Name'
                                />
                                <img src={SearchIcon} alt="Search Icon" className="icon" />
                            </div>

                            <div className="d-flex gap-2">
                                <Form.Group className="w-50">
                                    <Form.Label className="fs-12 fw-medium">Filter By Truck Status</Form.Label>
                                    <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="motion">In Motion</option>
                                        <option value="off">Off Duty</option>
                                        <option value="on">On Duty</option>
                                        <option value="sleep">Sleep</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="w-50">
                                    <Form.Label className="fs-12 fw-medium">Sort</Form.Label>
                                    <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                        <option value="ascending">Ascending</option>
                                        <option value="descending">Descending</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        {/* Vehicle Cards */}
                        <div className="locations-list d-flex flex-column border rounded h-100 overflow-auto">
                            {loading ? (
                                <div className="p-3 text-center"><Spinner animation="border" /></div>
                            ) : error ? (
                                <div className="p-3 text-danger">{error}</div>
                            ) : filteredVehicles.length === 0 ? (
                                <div className="p-3 text-muted">No vehicles found</div>
                            ) : (
                                filteredVehicles.map((vehicle, index) => (
                                    <div
                                        key={vehicle._id}
                                        className={`info-card fs-12 ${index !== filteredVehicles.length - 1 ? "border-bottom" : ""} p-3 cursor-pointer`}
                                        onClick={() => setSelectedVehicle(vehicle)} // ✅ click sets location
                                    >
                                        {/* Header */}
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className={vehicle.speed > 0 ? "bi bi-send-fill text-green fs-12" : "driver-status bg-secondary rounded"} style={{ color: "green", height: '12px', width: '12px' }}></span>
                                            <span className='driver-name text-body fw-bold'>{vehicle.vehicleNumber}</span>
                                            <span
                                                className={`fw-medium ${vehicle.speed > 0 ? "text-success" : "text-secondary"}`}
                                            >
                                                {vehicle.speed > 0 ? "Online" : "Offline"}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div className="location-name d-flex align-items-center gap-2 mb-1">
                                            <span><i className="bi bi-geo-alt"></i></span>
                                            <span className="text-truncate">{vehicle.location || "Unknown"}</span>
                                            <span className="text-secondary text-opacity-75 fw-medium text-nowrap ms-auto">
                                                {moment(vehicle.updatedAt).fromNow()}
                                            </span>
                                        </div>

                                        {/* Driver */}
                                        <div className="location-name d-flex align-items-center gap-2">
                                            <span
                                                className={`driving-status fw-medium text-white text-uppercase rounded-1 lh-1 px-2 py-1`}
                                                style={{
                                                    backgroundColor:
                                                        vehicle.driverStatus === "DS_OFF" ? "#6c757d" : // grey
                                                            vehicle.driverStatus === "DS_ON" || vehicle.driverStatus === "DS_D" ? "#128c12" : // green
                                                                vehicle.driverStatus === "DS_SB" ? "#ffcc00" : // yellow
                                                                    "#6c757d" // default grey
                                                }}
                                            >
                                                {vehicle.driverStatus.replace("DS_", "")}
                                            </span>
                                            <span className="driver-name text-body fw-bold text-capitalize text-truncate">
                                                {vehicle.driverName}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Section (Map) */}
                    <div className="right-section d-flex flex-column">
                        <div className="location-map flex-fill">
                            {selectedVehicle ? (
                                <iframe
                                    src={`https://maps.google.com/maps?q=${selectedVehicle.latitude},${selectedVehicle.longitude}&hl=es;z=14&output=embed`}
                                    width="100%"
                                    height="100%"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                // Default Map (no marker)
                                // <iframe
                                //   src="https://maps.google.com/maps?q=20,0&hl=es;z=2&output=embed" 
                                //   width="100%"
                                //   height="100%"
                                //   allowFullScreen=""
                                //   loading="lazy"
                                //   referrerPolicy="no-referrer-when-downgrade"
                                // ></iframe>
                                <iframe
                                src="https://maps.google.com/maps?hl=es&z=2&output=embed"
                                width="100%"
                                height="100%"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                              )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
