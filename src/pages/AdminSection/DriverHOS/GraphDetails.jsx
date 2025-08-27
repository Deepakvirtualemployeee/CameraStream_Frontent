import React, { useState } from "react";
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "react-bootstrap";
import ReloadIcon from '../../../assets/images/icons/reload.svg';
import BluetoothOnIcon from '../../../assets/images/icons/bluetooth-on.svg';
import BluetoothOffIcon from '../../../assets/images/icons/bluetooth-off.svg';
import LogChart from "./LogChart";

export const GraphDetails = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [logsEnabled, setLogsEnabled] = useState(false);

    const handlePrevDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
    };

    const handleNextDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
    };

    const columns = [
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Vehicle',
            sortable: true,
            minWidth: '170px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    {(row.id === '02' || row.id === '05' || row.id === '07') ? (
                        <span><img src={BluetoothOffIcon} alt="Bluetooth On Icon" className="img-fluid" /></span>
                    ) : (
                        <span><img src={BluetoothOnIcon} alt="Bluetooth Off Icon" className="img-fluid" /></span>
                    )}
                    <span><i className="bi bi-geo-alt fs-5 text-body"></i></span>
                    <span className="fw-semibold text-body text-nowrap ms-1">{row.vehicle}</span>
                </div>
            ),
        },
        {
            name: 'Status',
            minWidth: '130px',
            cell: (row) => (
                <div className={`${row.status === "OFF Duty" ? "bg-secondary" : "bg-success"} bg-secondary text-white text-center rounded-3 px-3 py-2`} style={{ width: '120px' }}>
                    <div className="fs-14 fw-medium">{row.status}</div>
                    <div className="fs-10 mt-1">15 days ago</div>
                </div>
            ),
        },
        {
            name: 'Break',
            selector: (row) => row.break,
            minWidth: '80px',
        },
        {
            name: 'Drive',
            selector: (row) => row.drive,
            minWidth: '80px',
        },
        {
            name: 'Shift',
            selector: (row) => row.shift,
            minWidth: '80px',
        },
        {
            name: 'Cycle',
            selector: (row) => row.cycle,
            minWidth: '80px',
        },
        {
            name: 'Recap',
            selector: (row) => row.recap,
            minWidth: '80px',
        },
        {
            name: 'Last Sync',
            minWidth: '100px',
            selector: (row) => row.last_sync,
        },
        {
            name: 'Violations',
            minWidth: '100px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-4">
                    {row.violations === "Violated" ? <i className="bi bi-clock fs-5 text-danger"></i> : ''}
                </div>
            ),
        },
        {
            name: 'Logs',
            minWidth: '80px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-2">
                    {row.logs === true &&
                        <i className="bi bi-activity fs-5 text-body"></i>
                    }
                </div>
            ),
        },
        {
            name: 'Contacts',
            selector: (row) => row.contact,
            minWidth: '110px',
        },
        {
            name: 'Device',
            minWidth: '80px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-2 ps-1">
                    {row.logs === true &&
                        <i className="bi bi-pc-display fs-5 text-muted"></i>
                    }
                </div>
            ),
        },
        // {
        //     name: 'Actions',
        //     minWidth: '120px',
        //     cell: (row) => (
        //         <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
        //             <span className='pointer' title='Edit' onClick={() => navigate('/settings/drivers-listing/edit-driver')}><img src={EditIcon} alt="Edit Icon" /></span>
        //             <span className='pointer p-0' title='Clock'><i className="bi bi-clock fs-5"></i></span>
        //         </div>
        //     ),
        // },
    ];

    const data = [
        {
            id: '01',
            driver_name: 'Android Review',
            vehicle: 'ANDROID01',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '02',
            driver_name: 'Test Driver',
            vehicle: 'ANDROID02',
            status: 'Driving',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '03',
            driver_name: 'Android Review',
            vehicle: 'ANDROID01',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '04',
            driver_name: 'Test Driver',
            vehicle: 'ANDROID02',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '05',
            driver_name: 'Android Review',
            vehicle: 'ANDROID01',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '06',
            driver_name: 'Test Driver',
            vehicle: 'ANDROID02',
            status: 'Driving',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '07',
            driver_name: 'Android Review',
            vehicle: 'ANDROID02',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
        {
            id: '08',
            driver_name: 'Test Driver',
            vehicle: 'ANDROID02',
            status: 'OFF Duty',
            break: '08:00',
            drive: '11:00',
            shift: '14:00',
            cycle: '70:00',
            recap: '00:00',
            last_sync: '18 Hours',
            violations: "Non Violated",
            logs: true,
            contact: '9647657654',
            device: true,
        },
    ];

    return (
        <div className="GraphDetails-page py-2">
            <div className="container-fluid">
                <div className="top-section mb-3">
                    <div className="row gx-2 gy-3">
                        <div className="col-lg-6 col-xl-4">
                            <div className="info-wrapper">
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Carrier:</span>
                                    <span className="text-body fw-semibold text-truncate">Apps Review</span>
                                </div>
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Driver:</span>
                                    <span className="text-body fw-semibold text-truncate">TestG Siso <i className="bi bi-telephone text-theme6 ms-1"></i></span>
                                </div>
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Vehicle:</span>
                                    <span className="text-body fw-semibold text-truncate">TestG [0ml]</span>
                                </div>
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Trailers:</span>
                                    <span className="text-danger fw-semibold text-truncate">Missing</span>
                                </div>
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Shipping Docs:</span>
                                    <span className="text-danger fw-semibold text-truncate">TestG Siso</span>
                                </div>
                                <div className="info-box d-flex gap-1 mb-1">
                                    <span className="label-name text-muted text-truncate">Certification:</span>
                                    <span className="text-danger fw-semibold text-truncate">Uncertified</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-4">
                            <div className="wrapper text-lg-center">
                                <div className="fs-14 text-muted mb-1">Worked Hours: <span className="text-body fs-12 fw-bold">00:00</span></div>
                                <div className="d-flex flex-wrap justify-content-lg-center gap-1">
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-primary rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">08:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Break</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-success rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">11:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Drive</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-theme6 rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">14:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Shift</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-secondary rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">70:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Cycle</span>
                                    </div>
                                    <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-dark rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">00:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Recap</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="content-wrapper d-flex flex-wrap gap-2">
                                <div className="d-flex flex-wrap gap-1 ms-xl-auto">
                                    {/* Logs toggle */}
                                    <div className="d-flex align-items-center">
                                        <span className="fw-semibold me-2">Logs</span>
                                        <Form.Check type="switch" id="logs-switch" className="fs-3" checked={logsEnabled} onChange={() => setLogsEnabled(!logsEnabled)} />
                                    </div>

                                    {/* Custom Date Picker */}
                                    <div className="date-picker-element d-flex gap-1">
                                        <span className="event-btn border border-secondary border-opacity-50 rounded" onClick={handlePrevDay}><i className="bi bi-chevron-left"></i></span>
                                        <DatePicker selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="MMM dd, yyyy"
                                            customInput={
                                                <div className="input-field d-flex align-items-center gap-2 border border-secondary border-opacity-50 rounded">
                                                    <i className="bi bi-calendar-week"></i>
                                                    <span className="text-body fw-medium">
                                                        {selectedDate.toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            }
                                        />
                                        <span className="event-btn border border-secondary border-opacity-50 rounded" onClick={handleNextDay}><i className="bi bi-chevron-right"></i></span>
                                    </div>
                                </div>
                                <div className="action-btn-wrapper d-flex flex-wrap justify-content-xl-end gap-1 ms-xl-auto">
                                    <Button variant='outline-danger'><i className="bi bi-arrow-left-right"></i></Button>
                                    <Button variant='outline-primary'><i className="bi bi-sliders"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-sun fs-16"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-pencil"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-plus-lg fs-16"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-person-badge fs-16"></i></Button>
                                    <Button variant='white' className="bg-white border-gray d-flex align-items-center justify-content-center gap-1 lh-1" title="Download" >
                                        <a href="/report.pdf" download className="text-secondary text-decoration-none">
                                            <i className="bi bi-file-earmark-arrow-down fs-16"></i> Download
                                        </a>
                                    </Button>
                                    <Button variant='white' className="bg-white border-gray d-flex align-items-center justify-content-center gap-1 lh-1" title="Reset" >
                                        <img src={ReloadIcon} alt="Reload Icon" className="lh-1" /> <span className="ms-1 d-sm-none">Refresh</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <LogChart />

                {/* Error Table Section */}
                <div className="table-content-wrapper">
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            highlightOnHover
                            responsive
                            customStyles={dataTableCustomStyles}
                            noDataComponent={<NoDataComponent />}
                            striped
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
