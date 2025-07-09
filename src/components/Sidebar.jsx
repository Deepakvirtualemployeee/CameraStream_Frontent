import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowLogoutIcon from '../assets/images/icons/arrow-bar-right.svg';

const Sidebar = ({ collapsed }) => {
    const location = useLocation();

    return (
        <aside className={`sidebar d-flex flex-column ${collapsed ? 'collapsed' : ''} py-2`}>
            <div className="logo-wrapper d-flex align-items-center gap-1 p-2">
                <Link to={'/'} className='sidebar-logo text-decoration-none ms-1'>
                    <img className="img-fluid" src={require('../assets/images/sidebar-logo.png')} alt="Logo" style={{ width: '55px' }} />
                </Link>
            </div>

            <ul className="sidebar-item-cover list-inline overflow-auto m-0">
                <li className="nav-item">
                    <Link to={'/dashboard'} className={`${location.pathname === '/dashboard' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-house-door"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/deadline'} className={`${location.pathname === 'deadline' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-clock"></i>
                        {!collapsed && <span>Deadline</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/activity'} className={`${location.pathname === 'activity' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-activity"></i>
                        {!collapsed && <span>Activity</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/delivery'} className={`${location.pathname === 'delivery' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-truck"></i>
                        {!collapsed && <span>Delivery</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/management'} className={`${location.pathname === 'management' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-wrench"></i>
                        {!collapsed && <span>Management</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/layers'} className={`${location.pathname === 'layers' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-layers"></i>
                        {!collapsed && <span>Layers</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/reports'} className={`${location.pathname === 'reports' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-clipboard-data"></i>
                        {!collapsed && <span>Reports</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/message'} className={`${location.pathname === 'message' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-chat"></i>
                        {!collapsed && <span>Message</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/settings'} className={`${location.pathname === 'settings' ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>
                        <i className="bi bi-gear"></i>
                        {!collapsed && <span>Settings</span>}
                    </Link>
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