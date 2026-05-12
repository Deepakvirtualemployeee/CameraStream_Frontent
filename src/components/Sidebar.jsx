import React, { memo, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowLogoutIcon from "../assets/images/icons/arrow-bar-right.svg";
import { ROLES } from "../constants";
const Sidebar = ({ collapsed, openSidebar }) => {
  const location = useLocation();
  const { companyId } = useParams();

  const { userDetails } = useSelector((state) => state.auth);
  const userRole = userDetails?.role;

  const [openSettings, setOpenSettings] = useState(false);
  const toggleSettings = () => setOpenSettings(!openSettings);
  // Group of routes under Settings
  const settingsRoutes = useMemo(() => [
    "/settings",
    "/settings/devices",
    "/settings/camera-devices",
    "/settings/vehicles-list",
    "/settings/company-info",
    "/settings/portal-users",
    "/settings/resources",
  ], []);

  const isSettingsActive = settingsRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  // Auto-toggle settings dropdown based on current route
  useEffect(() => {
    setOpenSettings(isSettingsActive);
  }, [isSettingsActive, location.pathname]);

  return (
    <aside
      className={`sidebar d-flex flex-column ${collapsed ? "collapsed" : ""
        } pb-2`}
    >
      <div className={`logo-wrapper d-flex align-items-center gap-1 ${collapsed ? "px-2 py-3" : "p-3"
        }`}>
        <Link
          to={`/companies-list`}
          className="sidebar-logo text-decoration-none"
        >
          <img
            className="img-fluid"
            src={require("../assets/images/sidebar-logo.png")}
            alt="Logo"
            style={{ width: collapsed ? "55px" : "100px" }}
          />
        </Link>
      </div>

      <ul className="sidebar-item-cover list-inline overflow-auto flex-fill m-0">
        <li className="nav-item">
          <Link
            to={`/location/${companyId}`}
            className={`${location.pathname.startsWith(`/location/${companyId}`) ? "active" : ""
              } nav-link d-flex align-items-center gap-2`}
            onClick={openSidebar}
          >
            <i className="bi bi-map"></i>
            {!collapsed && <span>Map</span>}
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to={`/video-library/${companyId}`}
            className={`${location.pathname.startsWith(`/video-library/${companyId}`) ? "active" : ""
              } nav-link d-flex align-items-center gap-2`}
            onClick={openSidebar}
          >
            <i className="bi bi-camera-video"></i>
            {!collapsed && <span>Video Library</span>}
          </Link>
        </li>

        <li className="nav-item">
          <hr className="opacity-100 my-2" />
        </li>

        <li className="nav-item">
          <button
            type="button"
            className={`nav-link d-flex align-items-center gap-2 pointer w-100 border-0 bg-transparent ${
              collapsed ? "justify-content-center" : "text-start"
            }`}
            onClick={() => {
              toggleSettings();
              openSidebar();
            }}
          >
            <i className="bi bi-gear"></i>
            {!collapsed && <span> Manage / Settings</span>}
            {!collapsed && (
              <i
                className={`bi fs-16 ms-auto ${openSettings ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
              ></i>
            )}
          </button>

          {/* Dropdown submenu */}
          {!collapsed && openSettings && (
            <ul className="sub-menu list-unstyled">
              {userRole === ROLES.Broker ? (
                <>
                  <li className="nav-item">
                    <Link
                      to={`/settings/vehicles-list/${companyId}`}
                      className={`${
                        location.pathname.startsWith(`/settings/vehicles-list/${companyId}`)
                          ? "active"
                          : ""
                      }`}
                    >
                      Vehicles
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/devices/${companyId}`}
                      className={`${
                        location.pathname.startsWith(`/settings/devices/${companyId}`) ||
                        location.pathname.startsWith(`/settings/camera-devices/${companyId}`)
                          ? "active"
                          : ""
                      }`}
                    >
                      Devices
                    </Link>
                  </li>
                </>

              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      to={`/settings/drivers-listing/${companyId}`}
                      className={`${location.pathname.startsWith(`/settings/drivers-listing/${companyId}`) ? "active" : ""}`}
                    >
                      Drivers
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/vehicles-list/${companyId}`}
                      className={`${
                        location.pathname.startsWith(`/settings/vehicles-list/${companyId}`)
                          ? "active"
                          : ""
                      }`}
                    >
                      Vehicles
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/devices/${companyId}`}
                      className={`${
                        location.pathname.startsWith(`/settings/devices/${companyId}`) ||
                        location.pathname.startsWith(`/settings/camera-devices/${companyId}`)
                          ? "active"
                          : ""
                      }`}
                    >
                      Devices
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/portal-users/${companyId}`}
                      className={`${location.pathname.startsWith(`/settings/portal-users/${companyId}`) ? "active" : ""}`}
                    >
                      Portal Users
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/company-info/${companyId}`}
                      className={`${location.pathname.startsWith(`/settings/company-info/${companyId}`) ? "active" : ""}`}
                    >
                      Company
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </li>
      </ul>

      <ul className="sidebar-item-cover list-inline mt-auto mb-0 ml-5">
        <li className="nav-item">
          <hr className="opacity-100 my-2" />
          <Link
            to={"/login"}
            className="nav-link d-flex align-items-center gap-2"
          >
            <img
              src={ArrowLogoutIcon}
              alt="Arrow Logout Icon"
              className="img-fluid"
              style={{ filter: "none", width: "auto" }}
            />
            {!collapsed && <span>Logout</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default memo(Sidebar);
