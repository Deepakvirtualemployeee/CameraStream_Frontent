import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowLogoutIcon from '../assets/images/icons/arrow-bar-right.svg';

const Sidebar = ({ collapsed, openSidebar }) => {
    const location = useLocation();
    const { companyId } = useParams();

   
    const { userDetails } = useSelector((state) => state.auth);
    const userRole = userDetails?.role;

    const [openSettings, setOpenSettings] = useState(false);
    const toggleSettings = () => setOpenSettings(!openSettings);

    // Group of routes under Settings
    const settingsRoutes = [
        '/settings',
        '/settings/eld-devices',
        '/settings/vehicles-list',
        '/settings/company-info',
        '/settings/portal-users',
        '/settings/resources'
    ];

    const isSettingsActive = settingsRoutes.some(path =>
        location.pathname.startsWith(path)
    );

    // Auto-close settings dropdown if not on a settings route
    useEffect(() => {
        if (!isSettingsActive) {
            setOpenSettings(false);
        }
    }, [isSettingsActive, location.pathname]);

    return (
        <aside className={`sidebar d-flex flex-column ${collapsed ? 'collapsed' : ''} py-2`}>
            <div className="logo-wrapper d-flex align-items-center gap-1 p-2">
                <Link to={`/location/${companyId}`} className='sidebar-logo text-decoration-none ms-1'>
                    <img
                        className="img-fluid"
                        src={require('../assets/images/sidebar-logo.png')}
                        alt="Logo"
                        style={{ width: '55px' }}
                    />
                </Link>
            </div>

            <ul className="sidebar-item-cover list-inline overflow-auto flex-fill m-0">
              
                <li className="nav-item">
                    <Link
                        to={`/location/${companyId}`}
                        className={`${location.pathname === `/location/${companyId}` ? 'active' : ''} nav-link d-flex align-items-center gap-2`}
                        onClick={openSidebar}
                    >
                        <i className="bi bi-house-door"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>

             
                {userRole !== "Broker" && (
                    <>
                        <li className="nav-item">
                            <Link
                                to={`/driver-hos/${companyId}`}
                                className={`${location.pathname === `/driver-hos/${companyId}` ? 'active' : ''} nav-link d-flex align-items-center gap-2`}
                                onClick={openSidebar}
                            >
                                <i className="bi bi-clock"></i>
                                {!collapsed && <span>Drivers HOS</span>}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to={`/logs/${companyId}`}
                                className={`${location.pathname === `/logs/${companyId}` ? 'active' : ''} nav-link d-flex align-items-center gap-2`}
                                onClick={openSidebar}
                            >
                                <i className="bi bi-activity"></i>
                                {!collapsed && <span>Logs</span>}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to={`/fmcsa-records/${companyId}`}
                                className={`${location.pathname === `/fmcsa-records/${companyId}` ? 'active' : ''} nav-link d-flex align-items-center gap-2`}
                                onClick={openSidebar}
                            >
                                <i className="bi bi-clipboard-data"></i>
                                {!collapsed && <span>FMCSA Records</span>}
                            </Link>
                        </li>
                    </>
                )}

                {/* ✅ Settings Dropdown */}
                <li className={`nav-item ${isSettingsActive || openSettings ? 'active' : ''}`}>
                    <a
                        className={`nav-link d-flex align-items-center gap-2 pointer ${isSettingsActive ? 'active' : ''}`}
                        onClick={() => { toggleSettings(); openSidebar(); }}
                    >
                        <i className="bi bi-gear"></i>
                        {!collapsed && <span>Settings</span>}
                        {!collapsed && (
                            <i className={`bi fs-16 ms-auto ${openSettings ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                        )}
                    </a>

                    {/* Dropdown submenu */}
                    {!collapsed && openSettings && (
                        <ul className="sub-menu list-unstyled">
                            {/* ✅ If Broker → Only Vehicles visible */}
                            {userRole === "Broker" ? (
                                <li className="nav-item">
                                    <Link
                                        to={`/settings/vehicles-list/${companyId}`}
                                        className={`${location.pathname === `/settings/vehicles-list/${companyId}` ? 'active' : ''}`}
                                    >
                                        Vehicles
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            to={`/settings/drivers-listing/${companyId}`}
                                            className={`${location.pathname === `/settings/drivers-listing/${companyId}` ? 'active' : ''}`}
                                        >
                                            Drivers
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to={`/settings/vehicles-list/${companyId}`}
                                            className={`${location.pathname === `/settings/vehicles-list/${companyId}` ? 'active' : ''}`}
                                        >
                                            Vehicles
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to={`/settings/eld-devices/${companyId}`}
                                            className={`${location.pathname === `/settings/eld-devices/${companyId}` ? 'active' : ''}`}
                                        >
                                            ELD Devices
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to={`/settings/portal-users/${companyId}`}
                                            className={`${location.pathname === `/settings/portal-users/${companyId}` ? 'active' : ''}`}
                                        >
                                            Portal Users
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to={`/settings/company-info/${companyId}`}
                                            className={`${location.pathname === `/settings/company-info/${companyId}` ? 'active' : ''}`}
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

            {/* ✅ Logout always visible */}
            <ul className="sidebar-item-cover list-inline mt-auto mb-0">
                <li className="nav-item">
                    <hr className="opacity-100 my-2" />
                    <Link to={'/login'} className="nav-link d-flex align-items-center gap-2">
                        <img
                            src={ArrowLogoutIcon}
                            alt="Arrow Logout Icon"
                            className="img-fluid"
                            style={{ filter: 'none', width: 'auto' }}
                        />
                        {!collapsed && <span>Logout</span>}
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
