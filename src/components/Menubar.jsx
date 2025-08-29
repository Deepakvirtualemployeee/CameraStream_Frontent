import React, { useRef } from 'react';
import { Link, useLocation } from "react-router-dom";

export const Menubar = (props) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 200, // adjust scroll distance
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="menubar-wrapper mt-4 mb-xl-3">
            <div className="container-fluid">
                <nav className="position-relative fs-6 text-body bg-theme2 rounded-2 d-inline-flex mw-100">
                    <ul ref={scrollRef} className="list-inline d-flex overflow-x-auto mb-0 me-4 pe-3">
                        {/* <li className="nav-item">
                        <Link to={'/'} className={`${currentPath === '/' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('/')}>Dashboard</Link>
                    </li> */}
                        <li className="nav-item">
                            <Link to={'/companies-list'} className={`${currentPath.includes('companies-list') ? 'active' : ''} nav-link d-flex align-items-center gap-2`}>Companies List</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link to={'/system-users-management'} className={`${currentPath.includes('system-users-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>System Users Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/fmcsa-transfer'} className={`${currentPath.includes('fmcsa-transfer') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>FMCSA Transfer</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/billing-management'} className={`${currentPath.includes('billing-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Billing Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/driven-hours'} className={`${currentPath.includes('driven-hours') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Driven Hours</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/group-management'} className={`${currentPath.includes('group-management') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Group Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/company-violations'} className={`${currentPath.includes('company-violations') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Company Violations</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/app-feedback'} className={`${currentPath.includes('app-feedback') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>App Feedback</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/resource'} className={`${currentPath.includes('resource') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Resource</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/drivers-list'} className={`${currentPath.includes('drivers-list') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Drivers</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/vehicles-list'} className={`${currentPath.includes('vehicles-list') ? 'active' : ' '} nav-link d-flex align-items-center gap-2`}>Vehicles</Link>
                        </li> */}
                    </ul>
                    {/* Scroll Arrow Button */}
                    <button onClick={scrollRight} className="position-absolute end-0 top-0 bg-theme2 border-0 border-start border-white rounded-end-3" style={{ padding: '8px 12px', zIndex: 10 }}>
                        <i className="bi bi-chevron-right fs-5"></i>
                    </button>
                </nav>
            </div>
        </div>
    )
}
