import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import BluetoothOnIcon from '../../../assets/images/icons/bluetooth-on.svg'
import BluetoothOffIcon from '../../../assets/images/icons/bluetooth-off.svg'

export const DriversHOSList = () => {
    const navigate = useNavigate();

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

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterELDStatus, setFilterELDStatus] = useState('');
    const [filterDutyStatus, setFilterDutyStatus] = useState('');
    const [filterViolationStatus, setFilterViolationStatus] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setFilterELDStatus('');
        setFilterDutyStatus('');
        setFilterViolationStatus('');
    };

    // Dropdown filter options
    const filters = [
        {
            value: filterELDStatus,
            setValue: setFilterELDStatus,
            placeholder: 'Filter by ELD Status',
            options: ['All', 'Active', 'Inactive'],
        },
        {
            value: filterDutyStatus,
            setValue: setFilterDutyStatus,
            placeholder: 'Filter by Duty Status',
            options: ['All', 'OFF Duty', 'Driving'],
        },
        {
            value: filterViolationStatus,
            setValue: setFilterViolationStatus,
            placeholder: 'Filter by Violation Status',
            options: ['All', 'Violated', 'Non Violated'],
        }
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesELDStatus = filterELDStatus === 'All' || filterELDStatus === '' || item.status === filterELDStatus;
        const matchesDutyStatus = filterDutyStatus === 'All' || filterDutyStatus === '' || item.status === filterDutyStatus;
        const matchesViolationStatus = filterViolationStatus === 'All' || filterViolationStatus === '' || item.violations === filterViolationStatus;

        return matchesSearch && matchesELDStatus && matchesDutyStatus && matchesViolationStatus;
    });

    return (
        <div className="DriversHOSList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Drivers HOS (10)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Driver or Vehicle Number"
                            filters={filters}
                            onReset={resetFilters}
                        />

                        {/* <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='primary' className="d-flex align-items-center justify-center gap-1" onClick={() => navigate('/settings/drivers-listing/add-driver')}><i className="bi bi-plus-lg fs-16"></i> Add Driver</Button>
                        </div> */}
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={filteredData}
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
