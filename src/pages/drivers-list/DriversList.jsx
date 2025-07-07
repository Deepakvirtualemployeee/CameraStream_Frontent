import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import TableFilter from '../../components/TableFilter';
import { NoDataComponent } from '../../components/NoDataComponent';
import IOSIcon from '../../assets/images/icons/ios.svg'
import LogoutIocn from '../../assets/images/icons/logout.svg';

export const DriversList = () => {
    const columns = [
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.driver_name}</div>),
        },
        {
            name: 'Username',
            selector: (row) => row.username,
            sortable: true,
            minWidth: '120px',
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'HOS Rules',
            selector: (row) => row.hos_rules,
            sortable: true,
            minWidth: '150px',
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
            minWidth: '150px',
        },
        {
            name: 'Driver License',
            selector: (row) => row.driver_license,
            minWidth: '120px',
        },
        {
            name: 'License State',
            selector: (row) => row.license_state,
            minWidth: '120px',
        },
        {
            name: 'App Version',
            selector: (row) => row.app_version,
            minWidth: '120px',
            cell: (row) => (
                <div className="app-version d-flex align-items-center gap-2"><img src={IOSIcon} alt="IOS Icon" className="img-fluid" /> {row.app_version}</div>
            ),
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            minWidth: '100px',
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
    ];

    const data = [
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Active',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        },
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Inactive',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        },
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Active',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        },
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Inactive',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        },
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Active',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        },
        {
            driver_name: 'Corey Goodman',
            username: 'corey21',
            email: 'corey21@gmail.com',
            phone: '+1 (000) 000-0000',
            hos_rules: 'USA 70 hour/ 8 day',
            assigned_vehicle: '7000',
            co_driver: 'Corey Goodman',
            driver_license: 'AD020721A',
            license_state: 'Alaska (AK)',
            app_version: '1.0.0',
            status: 'Inactive',
            activated: 'Jan 28, 06:54 AM',
            terminated: 'Jan 28, 06:54 AM'
        }
    ]

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
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Driver List</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Driver Name"
                                filters={filters}
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap align-items-center row-gap-2 column-gap-3">
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>
                        <div className='table-responsive table-custom-wrapper'>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                // selectableRows
                                striped
                                pagination
                                highlightOnHover
                                responsive
                                customStyles={dataTableCustomStyles}
                                noDataComponent={<NoDataComponent />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
