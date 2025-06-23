import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../Sidebar';
import { Header } from '../Header';
import { Menubar } from '../Menubar';


export const Layout = () => {
    return (
        <>
            <div className="main-wrapper d-flex w-100">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>

                <div className="main-content">
                    <Header />
                    <Menubar />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
