import React, { useState } from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import TableFilter from '../../components/TableFilter';
import { NoDataComponent } from '../../components/NoDataComponent';
import ArrowUpRightIocn from '../../assets/images/icons/arrow-up-right.svg';
import LogoutIocn from '../../assets/images/icons/logout.svg';

export const BillingManagement = () => {
    const columns = [
        {
            name: 'Name',
            selector: (row) => row.company_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.company_name}</div>),
        },
        {
            name: 'ID',
            selector: (row) => row.company_id,
            sortable: true,
        },
        {
            name: 'Dot Number',
            selector: (row) => row.dot_number,
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Group',
            selector: (row) => row.group,
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            minWidth: '100px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Pending' ? 'danger text-danger' : row.status === 'In Process' ? 'warning text-warning' : 'primary'}>{row.status}</Badge>,
        },
        {
            name: 'Active Vehicles',
            selector: (row) => row.active_vehicles,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Sub. Vehicles',
            selector: (row) => row.sub_vehicles,
            sortable: true,
            minWidth: '140px',
        },
        {
            name: 'Subscription',
            selector: (row) => row.subscription,
            minWidth: '140px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.subscription === 'Subscribed' ? 'success text-success' : row.subscription === 'Not Subscribed' ? 'danger text-danger' : ''}>{row.subscription}</Badge>,
        },
        {
            name: 'Default Payment',
            selector: (row) => row.default_payment,
            minWidth: '150px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.default_payment === 'Bank Account' ? 'success text-success' : row.default_payment === 'Card' ? 'warning text-warning' : 'secondary text-body'}>{row.default_payment}</Badge>,
        },
        {
            name: 'Invoicess',
            selector: (row) => row.invoices,
            minWidth: '130px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.invoices === 'Paid' ? 'success text-success' : row.invoices === 'Processing' ? 'warning text-warning' : row.invoices === 'Voided' ? 'danger text-danger' : 'secondary text-body'}>{row.invoices}</Badge>,
        },
        {
            name: 'Subscription Plan',
            selector: (row) => row.address,
            minWidth: '230px',
            cell: (row) => (
                <Form.Select className="bg-transparent border-0 shadow-none flex-fill ps-0 py-0">
                    <option value="" hidden>Select here</option>
                    <option value="Small Fleet Plan" selected>Small Fleet Plan</option>
                    <option value="Small Fleet Plan 1">Small Fleet Plan 1</option>
                </Form.Select>
            ),
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3 ms-3'>
                    <span className='pointer p-0' title='Details'><img src={ArrowUpRightIocn} alt="Arrow Up Right Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '62',
            sub_vehicles: '62',
            subscription: 'Subscribed',
            default_payment: 'Card',
            invoices: 'Paid'
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '70',
            sub_vehicles: '70',
            subscription: 'Subscribed',
            default_payment: 'Bank Account',
            invoices: 'Processing'
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group, Lucid...',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '13',
            sub_vehicles: '13',
            subscription: 'Not Subscribed',
            default_payment: 'None',
            invoices: 'Paid'
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '36',
            sub_vehicles: '36',
            subscription: 'Subscribed',
            default_payment: 'Bank Account',
            invoices: 'Voided'
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '19',
            sub_vehicles: '19',
            subscription: 'Subscribed',
            default_payment: 'Bank Account',
            invoices: 'Paid'
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            group: 'LTL Group, Lucid...',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '49',
            sub_vehicles: '49',
            subscription: 'Subscribed',
            default_payment: 'Card',
            invoices: 'Paid'
        },
    ]

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSubscription, setFilterSubscription] = useState('');
    const [filterInvoice, setFilterInvoice] = useState('');
    const [filterGroup, setFilterGroup] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setFilterStatus('');
        setFilterSubscription('');
        setFilterInvoice('');
        setFilterGroup('');
    };

    // Dropdown filter options
    const filters = [
        {
            value: filterStatus,
            setValue: setFilterStatus,
            placeholder: 'Filter by status',
            options: ['All', 'Active', 'Pending', 'In Progress'],
        },
        {
            value: filterSubscription,
            setValue: setFilterSubscription,
            placeholder: 'Filter by subscription',
            options: ['All', 'Subscribed', 'Not Subscribed'],
        },
        {
            value: filterInvoice,
            setValue: setFilterInvoice,
            placeholder: 'Filter by invoice',
            options: ['All', 'Paid', 'Processing', 'Voided'],
        },
        {
            value: filterGroup,
            setValue: setFilterGroup,
            placeholder: 'Filter by group',
            options: ['All', 'LTL Group', 'LTL Group, Lucid...'],
        },
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.status === filterStatus;
        const matchesSubscription = filterSubscription === 'All' || filterSubscription === '' || item.subscription === filterSubscription;
        const matchesInvoice = filterInvoice === 'All' || filterInvoice === '' || item.invoices === filterInvoice;
        const matchesGroup = filterGroup === 'All' || filterGroup === '' || item.group === filterGroup;

        return matchesSearch && matchesStatus && matchesSubscription && matchesInvoice && matchesGroup;
    });

    return (
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Billing Management</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Company Name or DOT"
                                filters={filters}
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap align-items-center row-gap-2 column-gap-3">
                                <div className="fs-16 text-gray">Total Active Vehicles: <span className="fw-semibold text-body">197,</span></div>
                                <div className="fs-16 text-gray">Total Subscribed Vehicles: <span className="fw-semibold text-body">199</span></div>
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
