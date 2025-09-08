import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form } from "react-bootstrap";
import ReloadIcon from '../../../assets/images/icons/reload.svg';
import EditIcon from '../../../assets/images/icons/edit.svg'
import ExternalIcon from '../../../assets/images/icons/external.svg'
import LogChart from "./LogChart";

export const GraphDetails = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [logsEnabled, setLogsEnabled] = useState(false);

    const navigate = useNavigate();
    const handlePrevDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
    };

    const handleNextDay = () => {
        setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
    };

    const columns = [
        {
            name: '#',
            selector: (row) => row.id,
            sortable: true,
            minWidth: '50px',
        },
        // {
        //     name: 'Start (PDT)',
        //     selector: (row) => row.start_PDT,
        //     minWidth: '170px',
        //     cell: (row) => (
        //         <div className="d-flex align-items-center gap-1">
        //             {(row.id === '02' || row.id === '05' || row.id === '07') ? (
        //                 <span><img src={BluetoothOffIcon} alt="Bluetooth On Icon" className="img-fluid" /></span>
        //             ) : (
        //                 <span><img src={BluetoothOnIcon} alt="Bluetooth Off Icon" className="img-fluid" /></span>
        //             )}
        //             <span><i className="bi bi-geo-alt fs-5 text-body"></i></span>
        //             <span className="fw-semibold text-body text-nowrap ms-1">{row.vehicle}</span>
        //         </div>
        //     ),
        // },
        {
            name: 'Status',
            minWidth: '180px',
            cell: (row) => (
                <div className={`${row.status === "OFF Duty" ? "bg-success" : "bg-secondary"} bg-secondary text-white text-center rounded-3 px-3 py-2`} style={{ width: '120px' }}>
                    <div className="fs-14 fw-medium">{row.status}</div>
                    {/* <div className="fs-10 mt-1">15 days ago</div> */}
                </div>
            ),
        },
        {
            name: 'Start (PDT)',
            selector: (row) => row.start_PDT,
            minWidth: '230px'
        },
        {
            name: 'Duration',
            selector: (row) => row.duration,
            minWidth: '120px',
        },
        {
            name: 'Location',
            // selector: (row) => row.location,
            minWidth: '250px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-body text-nowrap ms-1">{row.location}</span>
                    <span><img src={ExternalIcon} alt="ExternalIcon" className="img-fluid" /></span>
                    <span><i className="bi bi-copy fs-5 text-body"></i></span>
                </div>
            ),
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle,
            minWidth: '80px',
        },
        {
            name: 'Odometer',
            selector: (row) => row.odometer,
            minWidth: '120px',
        },
        {
            name: 'Engine Hours',
            minWidth: '120px',
            selector: (row) => row.engine_hours,
        },
        {
            name: 'Origin',
            minWidth: '80px',
            selector: (row) => row.origin,
        },
        {
            name: 'Trailers',
            minWidth: '120px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-2">
                    {row.trailers === false &&
                        <i className="bi bi-activity fs-5 text-body"></i>
                    }
                </div>
            ),
        },
        {
            name: 'Shipping Docs',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-2">
                    {row.shiping_docs === false &&
                        <i className="bi bi-activity fs-5 text-body"></i>
                    }
                </div>
            ),
            minWidth: '150px',
        },
        {
            name: 'Notes',
            minWidth: '80px',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2 ms-2 ps-1">
                    {row.notes === true &&
                        <span className="text-body text-nowrap ms-1">Break</span>
                    }
                </div>
            ),
        },
        {
            name: 'Actions',
            minWidth: '120px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer' title='Edit' onClick={() => navigate('/settings/drivers-listing/edit-driver')}><img src={EditIcon} alt="Edit Icon" /></span>
                    <span className='pointer p-0' title='Clock'><i className="bi bi-clock fs-5"></i></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            status: 'OFF Duty',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: true,
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '02',
            status: 'Login',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '03',
            status: 'Diagnostic Cleared',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '04',
            status: 'Malfunction',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '05',
            status: 'OFF Duty',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '06',
            status: 'Login',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '07',
            status: 'Diagnostic Cleared',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
        },
        {
            id: '08',
            status: 'Malfunction',
            start_PDT: 'Aug 26, 2025 - 04:59:20 AM',
            duration: '5h:4m:59s',
            location: '6046.5mi WSW of Bethel, AK',
            vehicle: 'TESTG',
            odometer: '62,165',
            engine_hours: '12.2',
            origin: "Driver",
            trailers: true,
            shiping_docs: true,
            notes: 'Break',
            vehicle_status_id: '2',
            action: true
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
                                    {/* <div className="info-circle d-flex flex-column align-items-center justify-content-center border border-3 border-dark rounded-circle" style={{ width: '65px', height: '65px' }}>
                                        <span className="text-black fs-12 fw-bold">00:00</span>
                                        <span className="fs-10 fw-bold text-muted text-uppercase">Recap</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <div className="content-wrapper d-flex flex-wrap gap-2">
                                <div className="d-flex flex-wrap gap-1 ms-xl-auto">
                                    {/* Logs toggle */}
                                    {/* <div className="d-flex align-items-center">
                                        <span className="fw-semibold me-2">Logs</span>
                                        <Form.Check type="switch" id="logs-switch" className="fs-3" checked={logsEnabled} onChange={() => setLogsEnabled(!logsEnabled)} />
                                    </div> */}

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
                                    {/* <Button variant='outline-danger'><i className="bi bi-arrow-left-right"></i></Button> */}
                                    {/* <Button variant='outline-primary'><i className="bi bi-sliders"></i></Button> */}
                                    <Button variant='outline-danger'><i className="bi bi-sun fs-16"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-pencil"></i></Button>
                                    <Button variant='outline-danger'><i className="bi bi-plus-lg fs-16"></i></Button>
                                    {/* <Button variant='outline-danger'><i className="bi bi-person-badge fs-16"></i></Button> */}
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
