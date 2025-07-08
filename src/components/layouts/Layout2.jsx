import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../Sidebar';
import { Header } from '../Header';


export const Layout2 = () => {
    return (
        <>
            <div className="main-wrapper d-flex w-100">
                <Sidebar />

                <div className="main-content">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
