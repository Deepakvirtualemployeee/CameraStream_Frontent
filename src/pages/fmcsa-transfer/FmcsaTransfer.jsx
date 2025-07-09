import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import FileIcon from '../../assets/images/icons/file.svg';
import FileLeftIcon from '../../assets/images/icons/file-arrow-left.svg'
import FileRightIcon from '../../assets/images/icons/file-arrow-right.svg';

export const FmcsaTransfer = () => {
    const columns = [
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Company',
            selector: (row) => row.company,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle,
            sortable: true,
        },
        {
            name: 'Driver',
            selector: (row) => row.driver,
            sortable: true,
            minWidth: '140px',
        },
        {
            name: 'Request Origin',
            selector: (row) => row.request_origin,
            minWidth: '200px',
        },
        {
            name: 'Date Range',
            selector: (row) => row.date_range,
            minWidth: '140px',
        },
        {
            name: 'File Status',
            selector: (row) => row.file_status,
            minWidth: '120px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.file_status === 'Information' ? 'success text-success' : row.file_status === 'Error' ? 'danger text-danger' : row.file_status === 'Warning' ? 'warning text-dark' : 'primary'}>{row.file_status}</Badge>,
        },
        {
            name: 'Comment',
            selector: (row) => row.comment,
            minWidth: '140px',
        },
        {
            name: 'Submission ID',
            selector: (row) => row.submission_id,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'File',
            selector: (row) => row.user_group,
            width: '65px',
            cell: () => (<span className='pointer p-0'><img src={FileIcon} alt="File Icon" /></span>),
        },
        {
            name: 'Sent',
            selector: (row) => row.user_group,
            width: '65px',
            cell: () => (<span className='pointer p-0'><img src={FileLeftIcon} alt="File Left Icon" /></span>),
        },
        {
            name: 'Response',
            selector: (row) => row.user_group,
            width: '90px',
            cell: () => (<span className='pointer p-0'><img src={FileRightIcon} alt="File Right Icon" /></span>),
        }
    ];

    const data = [
        {
            id: '01',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Mobile App - Transfer Data',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Information',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
        {
            id: '02',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Portal - Transfer Data',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Warning',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
        {
            id: '03',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Mobile App - Email Logs',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Error',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
        {
            id: '01',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Mobile App - Transfer Data',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Information',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
        {
            id: '02',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Portal - Transfer Data',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Warning',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
        {
            id: '03',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            request_origin: 'Mobile App - Email Logs',
            date_range: 'Dec 9 - Dec 10',
            file_status: 'Error',
            comment: 'True',
            submission_id: '3988b373 3988b',
        },
    ];

    // Filter state
    const [searchText, setSearchText] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
    };

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        return matchesSearch;
    });

    return (
        <div className="FmcsaTransfer-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">FMCSA Transfer Logs</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Name or email"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>
                        <div className='table-responsive table-custom-wrapper'>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                // selectableRows
                                // onRowClicked={userDetails}
                                // dense
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
        </div>
    )
}
