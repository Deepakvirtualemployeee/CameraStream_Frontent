import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';

export const FMCSARecords = () => {
    const columns = [
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Vehicle Number',
            selector: (row) => row.vehicle_number,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            sortable: true,
            minWidth: '130px',
        },
        {
            name: 'Actions',
            minWidth: '100px',
            cell: () => (
                <div className="action-wrapper ms-3">
                    <a href="/report.pdf" download>
                        <i className="bi bi-file-earmark-arrow-down fs-18"></i>
                    </a>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '02',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '03',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '04',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '05',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '06',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '07',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
        {
            id: '08',
            date: 'Aug 26, 2025 - 04:59 AM PDT',
            vehicle_number: 'TESTG',
            driver_name: 'Android Review',
        },
    ];

    const today = new Date();

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState([today, today]);
    const [startDate, endDate] = dateRange;

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setDateRange([null, null]);
    };

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        // ✅ Date filter
        const itemDate = new Date(item.date);
        const matchesDate = (!startDate || !endDate) || (itemDate >= startDate && itemDate <= endDate);

        return matchesSearch;
        // && matchesDate;
    });

    return (
        <div className="FMCSARecords-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">FMCSA Records</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Vehicle Number or Driver Name"
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
