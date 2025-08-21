import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import IOSIcon from '../../../assets/images/icons/ios.svg'
import EditIcon from '../../../assets/images/icons/edit.svg'

export const DriversListing = () => {
    const navigate = useNavigate();

    const columns = [
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'User Name',
            selector: (row) => row.username,
            sortable: true,
            minWidth: '130px',
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            sortable: true,
            minWidth: '140px',
        },
        {
            name: 'HOS Rules',
            selector: (row) => row.hos_rules,
            sortable: true,
            minWidth: '160px',
        },
        {
            name: 'Assigned Vehicle',
            selector: (row) => row.assigned_vehicle,
            sortable: true,
            minWidth: '160px',
        },
        {
            name: 'Co-Driver',
            selector: (row) => row.co_driver,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'App Version',
            minWidth: '110px',
            cell: (row) => (
                <div className="app-version d-flex align-items-center gap-2"><img src={IOSIcon} alt="IOS Icon" className="img-fluid" /> {row.app_version}</div>
            ),
        },
        {
            name: 'Device',
            minWidth: '70px',
            cell: (row) => (
                <div className="device d-flex align-items-center gap-2"><i className="bi bi-pc-display fs-5"></i></div>
            ),
        },
        {
            name: 'Status',
            minWidth: '90px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Inactive' ? 'danger text-danger' : 'secondary text-body'}>{row.status}</Badge>,
        },
        {
            name: 'Activated',
            selector: (row) => row.activated,
            minWidth: '140px',
        },
        {
            name: 'Terminated',
            selector: (row) => row.terminated,
            minWidth: '140px',
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
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '02',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Inactive',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '03',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '04',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '05',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Inactive',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '06',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '07',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Inactive',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
        {
            id: '08',
            driver_name: 'Android Review',
            username: 'AndroidReview',
            email: 'androidreview@gmail.com',
            phone: '+91 8978787877',
            hos_rules: 'USA 70 Hour / 8 Day',
            assigned_vehicle: 'ANDROID01',
            co_driver: 'Review Driver',
            app_version: '7.7.7',
            device: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
            activated: 'Jun 13, 07:01 AM',
            terminated: 'Nov 24, 04:24 PM',
        },
    ];

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setFilterStatus('');
    };

    // Dropdown filter options
    const filters = [
        {
            value: filterStatus,
            setValue: setFilterStatus,
            placeholder: 'Filter by status',
            options: ['All', 'Active', 'Inactive'],
        },
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="DriversListing-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Drivers (10)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Driver Name"
                            filters={filters}
                            onReset={resetFilters}
                        />

                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='primary' className="d-flex align-items-center justify-center gap-1" onClick={() => navigate('/settings/drivers-listing/add-driver')}><i className="bi bi-plus-lg fs-16"></i> Add Driver</Button>
                        </div>
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            pointerOnHover
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
