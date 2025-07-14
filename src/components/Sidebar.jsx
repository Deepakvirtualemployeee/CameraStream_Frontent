import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowLogoutIcon from '../assets/images/icons/arrow-bar-right.svg';

const Sidebar = ({ collapsed }) => {
    const location = useLocation();
    const [openSettings, setOpenSettings] = useState(false);
    const toggleSettings = () => setOpenSettings(!openSettings);

    // Group of routes under Settings
    const settingsRoutes = ['/settings', '/settings/eld-devices', '/settings/vehicles-list'];

    const isSettingsActive = settingsRoutes.some(path =>
        location.pathname.startsWith(path)
    );

    // Auto-close settings dropdown if not on a settings route
    useEffect(() => {
        if (!isSettingsActive) {
            setOpenSettings(false);
        }
    }, [location.pathname]);

    return (
        <aside className={`sidebar d-flex flex-column ${collapsed ? 'collapsed' : ''} py-2`}>
            <div className="logo-wrapper d-flex align-items-center gap-1 p-2">
                <Link to={'/'} className='sidebar-logo text-decoration-none ms-1'>
                    <img className="img-fluid" src={require('../assets/images/sidebar-logo.png')} alt="Logo" style={{ width: '55px' }} />
                </Link>
            </div>

            <ul className="sidebar-item-cover list-inline overflow-auto flex-fill m-0">
                <li className="nav-item">
                    <Link to={'/dashboard'} className={`${location.pathname === '/dashboard' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-house-door"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/drivers-hos'} className={`${location.pathname === '/drivers-hos' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-clock"></i>
                        {!collapsed && <span>Drivers HOS</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/logs'} className={`${location.pathname === '/logs' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-activity"></i>
                        {!collapsed && <span>Logs</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/delivery'} className={`${location.pathname === '/delivery' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-truck"></i>
                        {!collapsed && <span>Delivery</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/dvir'} className={`${location.pathname === '/dvir' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-wrench"></i>
                        {!collapsed && <span>DVIR</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/eld-events'} className={`${location.pathname === '/eld-events' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-layers"></i>
                        {!collapsed && <span>ELD Events</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/reports'} className={`${location.pathname === '/reports' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-clipboard-data"></i>
                        {!collapsed && <span>Reports</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/message'} className={`${location.pathname === '/message' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-chat"></i>
                        {!collapsed && <span>Message</span>}
                    </Link>
                </li>
                {/* Settings Dropdown */}
                <li className={`nav-item ${isSettingsActive || openSettings ? 'active' : ''}`}>
                    <a className={`nav-link d-flex align-items-center gap-2 pointer ${isSettingsActive ? 'active' : ''}`} onClick={toggleSettings}>
                        <i className="bi bi-gear"></i>
                        {!collapsed && <span>Settings</span>}
                        {!collapsed && (
                            <i className={`bi fs-16 ms-auto ${openSettings ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                        )}
                    </a>

                    {/* Dropdown submenu */}
                    {!collapsed && openSettings && (
                        <ul className="sub-menu list-unstyled">
                            <li className="nav-item">
                                <Link to="/settings/eld-devices" className={`${location.pathname === '/settings/eld-devices' ? 'active' : ''}`} onClick={() => setOpenSettings(false)}>
                                    ELD Devices
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings/vehicles-list" className={`${location.pathname === '/settings/vehicles-list' ? 'active' : ''}`} onClick={() => setOpenSettings(false)}>
                                    Vehicles
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings/company-info" className={`${location.pathname === '/settings/company-info' ? 'active' : ''}`} onClick={() => setOpenSettings(false)}>
                                    Company
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings/portal-users" className={`${location.pathname === '/settings/portal-users' ? 'active' : ''}`} onClick={() => setOpenSettings(false)}>
                                    Portal Users
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>

            <ul className="sidebar-item-cover list-inline mt-auto mb-0">
                <li className="nav-item">
                    <hr className="opacity-100 my-2" />
                    <Link to={'/login'} className="nav-link d-flex align-items-center gap-2">
                        <img src={ArrowLogoutIcon} alt="Arrow Logout Icon" className="img-fluid" style={{ filter: 'none', width: 'auto' }} />
                        {!collapsed && <span>Logout</span>}
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;