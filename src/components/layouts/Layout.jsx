import React from 'react';
import { Outlet } from "react-router-dom";
import { Header } from '../Header';
import { Menubar } from '../Menubar';


export const Layout = () => {
    return (
        <>
            {/* Main Header Component */}
            {/* <Header /> */}

            {/* Common Menubar Component */}
            <div className="container-fluid">
                <Menubar />
            </div>

            <div className="main-content">
                <Outlet />
            </div>
        </>
    )
}
