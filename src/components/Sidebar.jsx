import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppointmentsIcon from '../assets/images/appointments-list.svg';

const Sidebar = (props) => {
    const [activepage, setActivepage] = useState('')

    const handlePageClick = (page) => {
        setActivepage(page)
    }

    const closeSidebar = (value) => {
        handlePageClick('activepage', value)
        if (window.innerWidth >= '1024') {
            handlePageClick(value)
        } else {
            handlePageClick(value)
            props.closeOffcanvas()
        }
    }

    return (
        <aside className="sidebar d-flex flex-column flex-shrink-0">
            <Link to={'/'} className='sidebar-logo text-decoration-none border-bottom border-white border-opacity-25 d-flex align-items-center px-3 py-2 mb-2' style={{ minHeight: '61px' }}>
                <img className="img-fluid" src={require('../assets/images/logo.png')} alt="Logo" />
            </Link>

            <ul className="sidebar-item-cover list-inline m-0">
                <li className="nav-item">
                    <Link to={'/'} className={`${activepage === '/' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('/')}>
                        <i className="bi bi-house-door"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/companies-list'} className={`${activepage === 'companies-list' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('companies-list')}>
                        <img src={AppointmentsIcon} alt="" className="img-fluid" />
                        <span>Companies List</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/system-users-management'} className={`${activepage === 'system-users-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('system-users-management')}>
                        <img src={AppointmentsIcon} alt="" className="img-fluid" />
                        <span>Sys. Users Management</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/fmcsa-transfer'} className={`${activepage === 'fmcsa-transfer' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('fmcsa-transfer')}>
                        <i className="bi bi-buildings"></i>
                        <span>FMCSA Transfer</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-person-badge-fill"></i>
                        <span>Billing Management</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/driven-hours'} className={`${activepage === 'driven-hours' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('driven-hours')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Driven Hours</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/group-management'} className={`${activepage === 'group-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('group-management')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Group Management</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/company-violations'} className={`${activepage === 'company-violations' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('company-violations')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Company Violations</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/app-feedback'} className={`${activepage === 'app-feedback' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('app-feedback')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>App Feedback</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/resource-list'} className={`${activepage === 'resource-list' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('resource-list')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Resource</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/drivers-list'} className={`${activepage === 'drivers-list' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('drivers-list')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Drivers</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/vehicles-list'} className={`${activepage === 'vehicles-list' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('vehicles-list')}>
                        {/* <i className="bi bi-journal-text"></i> */}
                        <img src={require('../assets/images/reports-list.png')} alt="" className="img-fluid" />
                        <span>Vehicles</span>
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;