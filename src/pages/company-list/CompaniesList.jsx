import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import TableFilter from '../../components/TableFilter';
import { NoDataComponent } from '../../components/NoDataComponent';
import { NewSubscription } from './AddCompany';

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
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Dot Number',
            selector: (row) => row.dot_number,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            minWidth: '120px',
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
        },
        {
            name: 'Sub. Vehicles',
            selector: (row) => row.sub_vehicles,
            sortable: true,
        },
        {
            name: 'Subscription',
            selector: (row) => row.subscription,
            sortable: true,
        },
        {
            name: 'Actions',
            minWidth: '120px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap gap-2'>
                    <Button variant='outline-warning' className='focus-ring focus-ring-warning rounded-circle' title='Edit'><i className='bi bi-pencil-square'></i></Button>
                    <Button variant='outline-danger' className='focus-ring focus-ring-danger rounded-circle' title='Delete' onClick={handleShow}><i className='bi bi-trash3-fill'></i></Button>
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
            active_vehicles: '62',
            sub_vehicles: '62',
            subscription: 'Paid',
        },
    ]

    // Table Filter Code
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterGroup, setFilterGroup] = useState('');

    const resetFilters = () => {
        setSearchText('');
        setFilterStatus('');
        setFilterGroup('');
    };

    const filters = [
        {
            value: filterStatus,
            setValue: setFilterStatus,
            placeholder: 'Filter by status',
            options: ['All', 'Active', 'Pending', 'In Process'],
        },
        {
            value: filterGroup,
            setValue: setFilterGroup,
            placeholder: 'Filter by group',
            options: ['All Roles', 'System Administrator', 'System Technician', 'System Super Admin', 'Lab Technician'],
        },
    ];

    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.user_status === filterStatus;
        const matchesGroup = filterGroup === 'All Roles' || filterGroup === '' || item.user_role === filterGroup;

        return matchesSearch && matchesStatus && matchesGroup;
    });

    return (
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 rounded-2 p-3">
                    <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div className="main-heading m-0">Companies (Admin)</div>
                        <Button variant="success" onClick={openSubscriptionModal}><i className="bi bi-person-plus-fill"></i> Add Company</Button>
                    </div>

                    <div className="table-section">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filters={filters}
                            onReset={resetFilters}
                        />
                        <div className='table-responsive table-custom-wrapper'>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                // selectableRows
                                // striped
                                dense
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
