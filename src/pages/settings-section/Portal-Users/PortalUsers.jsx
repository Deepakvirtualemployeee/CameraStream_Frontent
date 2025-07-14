import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import CreditCardIcon from '../../../assets/images/icons/credit-card.svg';
import EditIcon from '../../../assets/images/icons/edit.svg'

export const PortalUsers = () => {
    const navigate = useNavigate();

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Role',
            selector: (row) => row.role,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Status',
            minWidth: '120px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Inactive' ? 'danger text-danger' : 'secondary text-body'}>{row.status}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: () => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer ms-3' title='Edit'><img src={EditIcon} alt="Edit Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            name: 'Jakhongir Khasanov',
            email: 'jack@abctrans.com',
            role: 'Company Administrator',
            status: 'Active',
        },
        {
            id: '02',
            name: 'John Smith',
            email: 'john@abctrans.com',
            role: 'Company Safety Personnel',
            status: 'Active',
        },
        {
            id: '03',
            name: 'Jakhongir Khasanov',
            email: 'jack@abctrans.com',
            role: 'Company Administrator',
            status: 'Inactive',
        },
        {
            id: '04',
            name: 'John Smith',
            email: 'john@abctrans.com',
            role: 'Company Safety Personnel',
            status: 'Active',
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
        <div className="PortalUsers-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Portal Users (2)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Name or Email"
                            filters={filters}
                            onReset={resetFilters}
                        />

                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='primary'><i className="bi bi-plus-lg fs-16"></i> Add User</Button>
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
