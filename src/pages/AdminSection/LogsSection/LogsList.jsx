import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';

export const LogsList = () => {
    const columns = [
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'HOS Violations',
            minWidth: '170px',
            cell: (row) => (
                <div className="d-flex flex-wrap align-items-center gap-1">
                    <span className={`${row.hos_violations === "PTI Violations" ? "text-danger" : "text-body"}`}>{row.hos_violations}</span>
                    <span className="counter bg-theme2 fs-12 fw-medium text-danger rounded lh-1 ms-1 px-2 py-1">+3</span>
                </div>
            ),
        },
        {
            name: 'Forms & Manner Errors',
            minWidth: '130px',
            cell: (row) => (
                <div className="d-flex flex-wrap align-items-center gap-1">
                    <span className="text-danger">{row.manner_errors}</span>
                    <span className="counter bg-theme2 fs-12 fw-medium text-danger rounded lh-1 ms-1 px-2 py-1">+23</span>
                </div>
            ),
        },
        {
            name: 'Last Sync',
            minWidth: '100px',
            selector: (row) => row.last_sync,
        },
    ];

    const data = [
        {
            id: '01',
            driver_name: 'Android Review',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '02',
            driver_name: 'Test Driver',
            hos_violations: 'PTI Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '03',
            driver_name: 'Android Review',
            hos_violations: 'No Violations',
            manner_errors: 'Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '04',
            driver_name: 'Test Driver',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '05',
            driver_name: 'Android Review',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '06',
            driver_name: 'Test Driver',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '07',
            driver_name: 'Android Review',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
        {
            id: '08',
            driver_name: 'Test Driver',
            hos_violations: 'No Violations',
            manner_errors: 'Trailer Number Missing',
            last_sync: '18 Hours',
        },
    ];

    const today = new Date();

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterHOSViolation, setfilterHOSViolation] = useState('');
    const [filterFormMannerErrors, setFilterFormMannerErrors] = useState('');
    const [dateRange, setDateRange] = useState([today, today]); // <-- For date picker
    const [startDate, endDate] = dateRange;

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setfilterHOSViolation('');
        setFilterFormMannerErrors('');
        setDateRange([null, null]);
    };

    // Dropdown filter options
    const filters = [
        {
            value: filterHOSViolation,
            setValue: setfilterHOSViolation,
            placeholder: 'Filter by HOS Violation',
            options: ['All', 'No Violations', 'PTI Violations'],
        },
        {
            value: filterFormMannerErrors,
            setValue: setFilterFormMannerErrors,
            placeholder: 'Filter by Form & Manner Errors',
            options: ['All', 'Trailer Number Missing', 'Number Missing'],
        },
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesHOSViolation = filterHOSViolation === 'All' || filterHOSViolation === '' || item.hos_violations === filterHOSViolation;
        const matchesFormMannerErrors = filterFormMannerErrors === 'All' || filterFormMannerErrors === '' || item.manner_errors === filterFormMannerErrors;

        // ✅ Date filter
        const itemDate = new Date(item.date);
        const matchesDate = (!startDate || !endDate) || (itemDate >= startDate && itemDate <= endDate);

        return matchesSearch && matchesHOSViolation && matchesFormMannerErrors
        // && matchesDate;
    });

    return (
        <div className="LogsList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Logs (10)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Driver"
                            filters={filters}
                            startDate={startDate}
                            endDate={endDate}
                            setDateRange={setDateRange}
                            showDateFilter={true}
                            onReset={resetFilters}
                        />

                        {/* <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='primary' className="d-flex align-items-center justify-center gap-1"><i className="bi bi-cloud-upload fs-16"></i> Transfer Data</Button>
                            <Button variant='warning' className="d-flex align-items-center justify-center gap-1"><i className="bi bi-file-earmark-arrow-down fs-16"></i> Download Data</Button>
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
