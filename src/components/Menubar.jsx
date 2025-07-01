import React from 'react';
import { Link, useLocation } from "react-router-dom";
import AppointmentsIcon from '../assets/images/appointments-list.svg';

export const Menubar = (props) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            props.closeOffcanvas();
        }
    };

    return (
        <nav className="menubar-wrapper fs-6 text-body bg-theme2 rounded-2 overflow-x-auto mt-4 mb-xl-3">
            <ul className="list-inline d-flex  m-0">
                {/* <li className="nav-item">
                    <Link to={'/'} className={`${currentPath === '/' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('/')}>Dashboard</Link>
                </li> */}
                <li className="nav-item">
                    <Link to={'//'} className={`${currentPath.includes('/') ? 'active' : ''} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('/')}>Companies List</Link>
                    {/* <Link to={'/companies-list'} className={`${currentPath.includes('companies-list') ? 'active' : ''} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('companies-list')}>Companies List</Link> */}
                </li>
                <li className="nav-item">
                    <Link to={'/system-users-management'} className={`${currentPath.includes('system-users-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('system-users-management')}>System Users Management</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/fmcsa-transfer'} className={`${currentPath.includes('fmcsa-transfer') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('fmcsa-transfer')}>FMCSA Transfer</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${currentPath.includes('billing-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>Billing Management</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/driven-hours'} className={`${currentPath.includes('driven-hours') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('driven-hours')}>Driven Hours</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/group-management'} className={`${currentPath.includes('group-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('group-management')}>Group Management</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/company-violations'} className={`${currentPath.includes('company-violations') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('company-violations')}>Company Violations</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/app-feedback'} className={`${currentPath.includes('app-feedback') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('app-feedback')}>App Feedback</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/resource-list'} className={`${currentPath.includes('resource-list') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('resource-list')}>Resource</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/drivers-list'} className={`${currentPath.includes('drivers-list') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('drivers-list')}>Drivers</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/vehicles-list'} className={`${currentPath.includes('vehicles-list') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('vehicles-list')}>Vehicles</Link>
                </li>
            </ul>
        </nav>
    )
}
