import React, { useState, useEffect } from "react";
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
  const [openReports, setOpenReports] = useState(false);
  const toggleSettings = () => setOpenSettings(!openSettings);
  const toggleReports = () => setOpenReports(!openReports);

  // Group of routes under Reports
  const reportsRoutes = ["/reports/fmcsa-reports", "/reports/ifta-reports"];

  const isReportsActive = reportsRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  // Group of routes under Settings
  const settingsRoutes = [
    "/settings",
    "/settings/eld-devices",
    "/settings/vehicles-list",
    "/settings/company-info",
    "/settings/portal-users",
    "/settings/resources",
  ];

  const isSettingsActive = settingsRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  // Auto-toggle reports dropdown based on current route
  useEffect(() => {
    setOpenReports(isReportsActive);
  }, [isReportsActive, location.pathname]);

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
          to={`/location/${companyId}`}
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
        {/* <li className="nav-item">
          <Link
            to={`/location/${companyId}`}
            className={`${location.pathname === `/location/${companyId}` ? "active" : ""
              } nav-link d-flex align-items-center gap-2`}
            onClick={openSidebar}
          >
            <i className="bi bi-radar"></i>
            {!collapsed && <span>Fleet Radar</span>}
          </Link>
        </li> */}

        {userRole !== ROLES.Broker && (
          <>
            <li className="nav-item">
              <Link
                to={`/driver-hos/${companyId}`}
                className={`${location.pathname === `/driver-hos/${companyId}`
                  ? "active"
                  : ""
                  } nav-link d-flex align-items-center gap-2`}
                onClick={openSidebar}
              >
                <i className="bi bi-clock"></i>
                {!collapsed && <span>Drivers HOS</span>}
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={`/logs/${companyId}`}
                className={`${location.pathname === `/logs/${companyId}` ? "active" : ""
                  } nav-link d-flex align-items-center gap-2`}
                onClick={openSidebar}
              >
                <i className="bi bi-activity"></i>
                {!collapsed && <span>Logs</span>}
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link
                to={`/unidentified-events/${companyId}`}
                className={`${location.pathname === `/unidentified-events/${companyId}`
                  ? "active"
                  : ""
                  } nav-link d-flex align-items-center gap-2`}
                onClick={openSidebar}
              >
                <i className="bi bi-exclamation-circle"></i>
                {!collapsed && <span>Unidentified Events</span>}
              </Link>
            </li> */}

            <li className="nav-item">
              <Link to={`/dvirs-list/${companyId}`} className={`${location.pathname === `/dvirs-list/${companyId}` ? 'active' : ''} nav-link d-flex align-items-center gap-2`} onClick={openSidebar}>
                <i className="bi bi-list-check"></i>
                {!collapsed && <span>DVIRs</span>}
              </Link>
            </li>

            {userRole !== ROLES.Broker && (
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center gap-2 pointer"
                  onClick={() => {
                    toggleReports();
                    openSidebar();
                  }}
                >
                  <i className="bi bi-bar-chart"></i>
                  {!collapsed && <span>Reports</span>}
                  {!collapsed && (
                    <i
                      className={`bi fs-16 ms-auto ${openReports ? "bi-chevron-up" : "bi-chevron-down"}`}
                    ></i>
                  )}
                </a>

                {/* {!collapsed && openReports && (
                  <ul className="sub-menu list-unstyled">
                    <li className="nav-item">
                      <Link
                        to={`/reports/ifta-reports/${companyId}`}
                        className={`${
                          location.pathname.startsWith(`/reports/ifta-reports/${companyId}`) ? "active" : ""
                        }`}
                      >
                        IFTA Reports
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={`/fmcsa-records/${companyId}`}
                        className={`${
                          location.pathname.startsWith(`/fmcsa-records/${companyId}`) ? "active" : ""
                        }`}
                      >
                        FMCSA Reports
                      </Link>
                    </li>
                  </ul>
                )} */}
              </li>
            )}
          </>
        )}

        <li className="nav-item">
          <hr className="opacity-100 my-2" />
        </li>

        <li className="nav-item">
          <a
            className="nav-link d-flex align-items-center gap-2 pointer"
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
          </a>

          {/* Dropdown submenu */}
          {!collapsed && openSettings && (
            <ul className="sub-menu list-unstyled">
              {userRole === ROLES.Broker ? (
                <li className="nav-item">
                  <Link
                    to={`/settings/vehicles-list/${companyId}`}
                    className={`${location.pathname.startsWith(`/settings/vehicles-list/${companyId}`) ? "active" : ""}`}
                  >
                    Vehicles
                  </Link>
                </li>
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
                      className={`${location.pathname.startsWith(`/settings/vehicles-list/${companyId}`) ? "active" : ""}`}
                    >
                      Vehicles
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/settings/eld-devices/${companyId}`}
                      className={`${location.pathname.startsWith(`/settings/eld-devices/${companyId}`) ? "active" : ""}`}
                    >
                      ELD Devices
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

export default Sidebar;
