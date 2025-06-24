import React, { useState } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import TableFilter from '../../components/TableFilter';
import { NoDataComponent } from '../../components/NoDataComponent';
import { NewSubscription } from './AddCompany';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import FilterIocn from '../../assets/images/icons/filter.svg';
import ExternalIcon from '../../assets/images/icons/external.svg';
import TrashIcon from '../../assets/images/icons/trash.svg';

export const CompaniesList = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const closeSubscriptionModal = () => setShowSubscriptionModal(false);
    const openSubscriptionModal = () => setShowSubscriptionModal(true);

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.company_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.company_name}</div>),
        },
        {
            name: 'Address',
            selector: (row) => row.address,
            minWidth: '170px',
        },
        {
            name: 'Dot Number',
            selector: (row) => row.dot_number,
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            minWidth: '100px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-25' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Pending' ? 'danger text-danger' : row.status === 'In Process' ? 'warning text-warning' : 'primary'}>{row.status}</Badge>,
        },
        {
            name: 'ID',
            selector: (row) => row.company_id,
            sortable: true,
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
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-25' pill bg={row.subscription === 'Paid' ? 'success text-success' : row.subscription === 'Open' ? 'danger text-danger' : ''}>{row.subscription}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer p-0' title='Details'><img src={ExternalIcon} alt="External Icon" /></span>
                    <span className='pointer p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '62',
            sub_vehicles: '62',
            subscription: 'Paid',
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '70',
            sub_vehicles: '70',
            subscription: 'Paid',
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '13',
            sub_vehicles: '13',
            subscription: 'Open',
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '36',
            sub_vehicles: '36',
            subscription: 'Paid',
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '19',
            sub_vehicles: '19',
            subscription: 'Paid',
        },
        {
            company_name: 'ABC Trans LLC',
            address: '1 Cristina Ln, Oxford PA, 19363',
            dot_number: '000000',
            status: 'Active',
            company_id: 'CompanyID',
            active_vehicles: '49',
            sub_vehicles: '49',
            subscription: 'Paid',
        },
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
            options: ['All', 'Active', 'Pending', 'In Process'],
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
                    <div className="main-heading mb-3">Companies (Admin)</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Company Name or DOT"
                                filters={filters}
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='primary'><i className="bi bi-plus-lg fs-16"></i> Create Company</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={FilterIocn} alt="Filter Iocn" /> Filter by Status</Button>
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

            {/* Add Subscription Modal */}
            <NewSubscription show={showSubscriptionModal} onHide={closeSubscriptionModal} />

            {/* Delete Table Record Modal */}
            <Modal show={show} centered onHide={handleClose} dialogClassName='' contentClassName='border-0 rounded-4'>
                <Modal.Body className="text-center px-md-5 py-5">
                    <div className="icon-cover d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mx-auto mb-3" style={{ height: '50px', width: '50px' }}>
                        <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                    </div>
                    <div className="fs-18 fw-semibold lh-sm mb-3 pb-1">Are you sure you want to delete this subscription ?</div>
                    <div className="btn-wrapper d-flex flex-wrap justify-content-center gap-2">
                        <Button variant="secondary" className="px-4 py-2" onClick={handleClose}>Cancel</Button>
                        <Button variant="danger" className="px-4 py-2" onClick={handleClose}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
