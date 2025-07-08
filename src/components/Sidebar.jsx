import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArrowLogoutIcon from '../assets/images/icons/arrow-bar-right.svg';

const Sidebar = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [activepage, setActivepage] = useState('')

    const toggleSidebar = () => setCollapsed(!collapsed);

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
        <aside className={`sidebar d-flex flex-column ${collapsed ? 'collapsed' : ''}`}>
            <div className="logo-wrapper d-flex align-items-center justify-content-between gap-1 p-2">
                <Link to={'/'} className='sidebar-logo text-decoration-none'>
                    <img className="img-fluid" src={require('../assets/images/sidebar-logo.png')} alt="Logo" style={{ width: '55px' }} />
                </Link>
                <span className="text-white pointer" onClick={toggleSidebar}><i className={`bi ${!collapsed ? 'bi bi-caret-right-square' : 'bi-caret-left-square'}`}></i></span>
            </div>

            <ul className="sidebar-item-cover list-inline overflow-auto m-0">
                <li className="nav-item">
                    <Link to={'/'} className={`${activepage === '/' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('/')}>
                        <i className="bi bi-house-door"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/companies-list'} className={`${activepage === 'companies-list' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('companies-list')}>
                        <i className="bi bi-clock"></i>
                        {!collapsed && <span>Deadline</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/system-users-management'} className={`${activepage === 'system-users-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('system-users-management')}>
                        <i className="bi bi-activity"></i>
                        {!collapsed && <span>Activity</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/fmcsa-transfer'} className={`${activepage === 'fmcsa-transfer' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('fmcsa-transfer')}>
                        <i className="bi bi-truck"></i>
                        {!collapsed && <span>Delivery</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-wrench"></i>
                        {!collapsed && <span>Management</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-layers"></i>
                        {!collapsed && <span>Layers</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-clipboard-data"></i>
                        {!collapsed && <span>Reports</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-chat"></i>
                        {!collapsed && <span>Message</span>}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/billing-management'} className={`${activepage === 'billing-management' ? 'active' : ' '} nav-link d-flex align-items-center gap-2`} onClick={() => closeSidebar('billing-management')}>
                        <i className="bi bi-gear"></i>
                        {!collapsed && <span>Settings</span>}
                    </Link>
                </li>
            </ul>

            <ul className="sidebar-item-cover list-inline mt-auto">
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