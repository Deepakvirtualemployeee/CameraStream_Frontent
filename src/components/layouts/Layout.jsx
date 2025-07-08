import React from 'react';
import { Outlet } from "react-router-dom";
import { Menubar } from '../Menubar';


export const Layout = () => {
    return (
        <>
            {/* Common Menubar Component */}
            <div className="container-fluid">
                <Menubar />
            </div>

            <div className="main-content-wrapper">
                <Outlet />
            </div>
        </>
    )
}
