import React, {useState} from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../Sidebar';
import { Header } from '../Header';


export const Layout2 = () => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleSidebar = () => setCollapsed(!collapsed);
    const openSidebar = () => setCollapsed(false);

    return (
        <>
            <div className="main-wrapper d-flex w-100">
                <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} openSidebar={openSidebar} />

                <div className="main-content">
                    <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
