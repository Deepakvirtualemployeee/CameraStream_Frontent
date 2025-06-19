import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
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
            name: 'Sr. No',
            selector: (row) => row.id,
            sortable: true,
            width: '90px',
        },
        {
            name: 'Subscription Name',
            selector: (row) => row.subscription_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (
                <div className='d-flex align-items-center gap-2'>
                    <img src={require('../../assets/images/dummy-user.jpeg')} alt="Client" className='img-fluid border border-white rounded-circle shadow' style={{ height: '35px', width: '35px' }} />
                    <div className='client-name fw-medium text-capitalize'>{row.subscription_name}</div>
                </div>
            ),
        },
        {
            name: 'Plan Price',
            selector: (row) => row.plan_price,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Validity',
            selector: (row) => row.validity,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            minWidth: '120px',
        },
        {
            name: 'Time',
            selector: (row) => row.time,
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
            id: '#001',
            subscription_name: 'Deena Cooley',
            plan_price: '$900',
            validity: '9 Months',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#002',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$300',
            validity: '3 Months',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#003',
            subscription_name: 'Deena Cooley',
            plan_price: '$2400',
            validity: '2 Years',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#004',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$300',
            validity: '3 Months',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#005',
            subscription_name: 'Deena Cooley',
            plan_price: '$3600',
            validity: '3 Years',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#006',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$600',
            validity: '6 Months',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#007',
            subscription_name: 'Deena Cooley',
            plan_price: '$1200',
            validity: '12 Months',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#008',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$300',
            validity: '3 Months',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#009',
            subscription_name: 'Deena Cooley',
            plan_price: '$900',
            validity: '9 Months',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#010',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$600',
            validity: '6 Months',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#011',
            subscription_name: 'Deena Cooley',
            plan_price: '$2400',
            validity: '2 Year',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#012',
            subscription_name: 'Jerry Wilcox',
            plan_price: '$1200',
            validity: '1 Year',
            date: '08/23/2024',
            time: '9:45 AM',
        },
    ]

    return (
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="appointments-list-wrapper bg-white rounded-3 p-3">
                    <div className="hrading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <h5 className="fw-bold m-0">Companies List - </h5>
                        <Button variant="success" onClick={openSubscriptionModal}><i className="bi bi-person-plus-fill"></i> Add Company</Button>
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={data}
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
