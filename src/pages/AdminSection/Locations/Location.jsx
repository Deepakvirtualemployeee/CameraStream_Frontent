import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getVehicles } from "../../../store/actions/vehicles";
import "./Location.scss";

const DEFAULT_CENTER = [39.5, -98.35];

const getNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getVehicleCoordinates = (vehicle, index) => {
  const lat =
    getNumber(vehicle?.latitude) ??
    getNumber(vehicle?.lat) ??
    getNumber(vehicle?.location?.latitude) ??
    getNumber(vehicle?.location?.lat) ??
    getNumber(vehicle?.coordinates?.latitude) ??
    getNumber(vehicle?.coordinates?.lat);

  const lng =
    getNumber(vehicle?.longitude) ??
    getNumber(vehicle?.lng) ??
    getNumber(vehicle?.lon) ??
    getNumber(vehicle?.location?.longitude) ??
    getNumber(vehicle?.location?.lng) ??
    getNumber(vehicle?.coordinates?.longitude) ??
    getNumber(vehicle?.coordinates?.lng);

  if (lat !== null && lng !== null) {
    return { lat, lng, fallback: false };
  }

  return {
    lat: DEFAULT_CENTER[0] + (index % 6) * 0.55,
    lng: DEFAULT_CENTER[1] + (index % 6) * 0.9,
    fallback: true,
  };
};

const getVehicleLocationLabel = (vehicle) =>
  vehicle?.location ||
  vehicle?.currentLocation ||
  vehicle?.lastKnownLocation ||
  vehicle?.address ||
  [vehicle?.licensePlateNumber, vehicle?.licensePlateState].filter(Boolean).join(", ") ||
  "Location unavailable";

const formatRelativeTime = (value) => {
  if (!value) {
    return "No sync data";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours < 24) {
    return minutes ? `${hours} hr ${minutes} min ago` : `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const createVehicleIcon = (label, active) =>
  L.divIcon({
    className: "vehicle-map-marker-wrap",
    html: `<div class="vehicle-map-marker ${active ? "is-active" : ""}">${label}</div>`,
    iconSize: [52, 30],
    iconAnchor: [26, 15],
  });

export const Location = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { vehicles, loading } = useSelector((state) => state.vehicles);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const markerMapRef = useRef(new Map());

  const [searchText, setSearchText] = useState("");
  const [activeVehicleId, setActiveVehicleId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveVehicle, setLiveVehicle] = useState(null);
  const [liveDuration, setLiveDuration] = useState(10);
  const [cameraView, setCameraView] = useState("road");
  const [menuPosition, setMenuPosition] = useState(null);

  const menuButtonRefs = useRef({});

  useEffect(() => {
    if (!openMenuId) {
      setMenuPosition(null);
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (event.target.closest(".vehicle-row__menu-wrap, .vehicle-row__menu--portal")) {
        return;
      }

      setOpenMenuId(null);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
      }
    };

    const handleViewportChange = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (companyId) {
      dispatch(getVehicles(companyId));
    }
  }, [companyId, dispatch]);

  const cameraVehicles = useMemo(
    () =>
      (vehicles || []).map((vehicle, index) => ({
        ...vehicle,
        uiId: vehicle?._id || `${vehicle?.vehicleNumber || "vehicle"}-${index}`,
        vehicleNumber: vehicle?.vehicleNumber || `${String(index + 1).padStart(3, "0")}`,
        cameraSerial:
          vehicle?.cameraSerialNumber ||
          vehicle?.cameraSn ||
          vehicle?.deviceSerialNumber ||
          vehicle?.eldSerialNumber ||
          "N/A",
        statusLabel: vehicle?.status || "Active",
        locationLabel: getVehicleLocationLabel(vehicle),
        syncLabel: formatRelativeTime(
          vehicle?.lastSync || vehicle?.lastSeenAt || vehicle?.updatedAt || vehicle?.createdAt
        ),
        coordinates: getVehicleCoordinates(vehicle, index),
      })),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return cameraVehicles;

    return cameraVehicles.filter((vehicle) =>
      [vehicle.vehicleNumber, vehicle.vin, vehicle.cameraSerial, vehicle.locationLabel]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query))
    );
  }, [cameraVehicles, searchText]);

  useEffect(() => {
    if (!activeVehicleId && filteredVehicles.length) {
      setActiveVehicleId(filteredVehicles[0].uiId);
    }
  }, [filteredVehicles, activeVehicleId]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const markers = markerMapRef.current;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(DEFAULT_CENTER, 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);

    markerLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    return () => {
      markers.clear();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markerLayerRef.current || !mapInstanceRef.current) return;

    markerLayerRef.current.clearLayers();
    markerMapRef.current.clear();

    const bounds = [];

    filteredVehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.coordinates.lat, vehicle.coordinates.lng], {
        icon: createVehicleIcon(vehicle.vehicleNumber, vehicle.uiId === activeVehicleId),
      });

      marker.on("click", () => {
        setActiveVehicleId(vehicle.uiId);
      });

      marker.addTo(markerLayerRef.current);
      markerMapRef.current.set(vehicle.uiId, marker);
      bounds.push([vehicle.coordinates.lat, vehicle.coordinates.lng]);
    });

    if (bounds.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 7 });
    } else if (bounds.length === 1) {
      mapInstanceRef.current.setView(bounds[0], 7);
    } else {
      mapInstanceRef.current.setView(DEFAULT_CENTER, 4);
    }
  }, [filteredVehicles, activeVehicleId]);

  const activeVehicle =
    filteredVehicles.find((vehicle) => vehicle.uiId === activeVehicleId) ||
    cameraVehicles.find((vehicle) => vehicle.uiId === activeVehicleId) ||
    null;

  const focusVehicleOnMap = (vehicle) => {
    setActiveVehicleId(vehicle.uiId);
    setOpenMenuId(null);

    if (!mapInstanceRef.current) {
      return;
    }

    mapInstanceRef.current.flyTo(
      [vehicle.coordinates.lat, vehicle.coordinates.lng],
      Math.max(mapInstanceRef.current.getZoom(), 9),
      { duration: 0.7 }
    );
  };

  const openLiveStreamModal = (vehicle) => {
    setLiveVehicle(vehicle);
    setShowLiveModal(true);
    setOpenMenuId(null);
  };

  const goToRequestVideo = (vehicle) => {
    setOpenMenuId(null);
    navigate(`/video-library/${companyId}`, {
      state: {
        activeTab: "requests",
        openRequestModal: true,
        vehicleId: vehicle.vehicleNumber,
      },
    });
  };

  const toggleMenu = (vehicleId) => {
    if (openMenuId === vehicleId) {
      setOpenMenuId(null);
      return;
    }

    const button = menuButtonRefs.current[vehicleId];
    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.right - 210,
    });
    setOpenMenuId(vehicleId);
  };

  const openMenuVehicle =
    filteredVehicles.find((vehicle) => vehicle.uiId === openMenuId) ||
    cameraVehicles.find((vehicle) => vehicle.uiId === openMenuId) ||
    null;

  return (
    <div className="Location-page">
      <div ref={mapRef} id="map" />

      <div className="location-modal">
        <div className="location-modal__tabs">
         
          <button type="button" className="active">
            Cameras
          </button>
        </div>

        <div className="location-modal__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Vehicle ID, VIN, or Device S/N"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="location-modal__stats">
          <div className="location-modal__stats-left">
            <span className="stat-dot green"></span>
            <strong>0</strong>
            <span className="stat-dot yellow"></span>
            <strong>0</strong>
            <span className="stat-dot blue"></span>
            <strong>{filteredVehicles.length}</strong>
          </div>
          <div className="location-modal__stats-right">
            <i className="bi bi-camera-video text-primary" />
            <i className="bi bi-camera-video-off text-danger" />
          </div>
        </div>

        <div className="location-modal__list">
          {filteredVehicles.length ? (
            filteredVehicles.map((vehicle) => (
              <article
                key={vehicle.uiId}
                className={`vehicle-row ${activeVehicleId === vehicle.uiId ? "active" : ""}`}
                onMouseEnter={() => setActiveVehicleId(vehicle.uiId)}
              >
                <div className="vehicle-row__top">
                  <div className="vehicle-row__identity">
                    <div className="vehicle-row__icon">
                      <i className="bi bi-cone-striped" />
                    </div>
                    <div>
                      <div className="vehicle-row__title">
                        <span>{vehicle.vehicleNumber}</span>
                        <span className="vehicle-row__badge">{vehicle.statusLabel}</span>
                      </div>
                      <div className="vehicle-row__meta">Camera S/N: {vehicle.cameraSerial}</div>
                    </div>
                  </div>
                  <div className="vehicle-row__actions">
                    <button
                      type="button"
                      className="vehicle-row__action-btn live"
                      aria-label={`Show ${vehicle.vehicleNumber} on map`}
                      onClick={() => focusVehicleOnMap(vehicle)}
                    >
                      <i className="bi bi-camera-video" />
                    </button>

                    <div className="vehicle-row__menu-wrap">
                      <button
                        type="button"
                        className="vehicle-row__action-btn"
                        aria-label={`More actions for ${vehicle.vehicleNumber}`}
                        ref={(node) => {
                          if (node) {
                            menuButtonRefs.current[vehicle.uiId] = node;
                          } else {
                            delete menuButtonRefs.current[vehicle.uiId];
                          }
                        }}
                        onClick={() => toggleMenu(vehicle.uiId)}
                      >
                        <i className="bi bi-three-dots-vertical" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="vehicle-row__bottom">
                  <div className="vehicle-row__location">
                    <i className="bi bi-geo-alt" />
                    <span>{vehicle.locationLabel}</span>
                  </div>
                  <div className="vehicle-row__sync">
                    <i className="bi bi-clock-history" />
                    <span>{vehicle.syncLabel}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="location-modal__empty">
              {loading ? "Loading vehicles..." : "No vehicles found."}
            </div>
          )}
        </div>

        {activeVehicle && (
          <div className="location-modal__footer">
            <span>Selected: {activeVehicle.vehicleNumber}</span>
            <span>{activeVehicle.locationLabel}</span>
          </div>
        )}
      </div>

      <Modal
        show={showLiveModal}
        onHide={() => setShowLiveModal(false)}
        centered
        className="live-stream-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Live Stream</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="live-stream-modal__vehicle">
            {liveVehicle?.vehicleNumber || "Vehicle"}
          </div>

          <Form.Group className="mb-4">
            <Form.Label>Camera View</Form.Label>
            <Form.Select
              value={cameraView}
              onChange={(event) => setCameraView(event.target.value)}
            >
              <option value="road">Road View</option>
              <option value="cabin">Cabin View</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Duration</Form.Label>
            <div className="live-stream-modal__duration">
              <button
                type="button"
                onClick={() => setLiveDuration((current) => Math.max(10, current - 10))}
              >
                <i className="bi bi-dash-lg" />
              </button>
              <div>{liveDuration}s</div>
              <button
                type="button"
                onClick={() => setLiveDuration((current) => Math.min(120, current + 10))}
              >
                <i className="bi bi-plus-lg" />
              </button>
            </div>
            <div className="live-stream-modal__hint">
              Minimum 10s - maximum 120s
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowLiveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowLiveModal(false)}>
            Start Live Stream
          </Button>
        </Modal.Footer>
      </Modal>

      {openMenuVehicle && menuPosition &&
        createPortal(
          <div
            className="vehicle-row__menu vehicle-row__menu--portal"
            style={{
              top: `${menuPosition.top}px`,
              left: `${Math.max(16, menuPosition.left)}px`,
            }}
          >
            <button
              type="button"
              onClick={() => goToRequestVideo(openMenuVehicle)}
            >
              <i className="bi bi-camera-reels" />
              <span>Request Video</span>
            </button>
            <button
              type="button"
              onClick={() => openLiveStreamModal(openMenuVehicle)}
            >
              <i className="bi bi-camera-video" />
              <span>Live Stream</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Location;
