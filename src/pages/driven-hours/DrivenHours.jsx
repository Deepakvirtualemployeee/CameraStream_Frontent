import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Accordion } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import AndroidIocn from '../../assets/images/icons/android.svg';
import IOSIcon from '../../assets/images/icons/ios.svg';
import EditIcon from '../../assets/images/icons/edit.svg'
import TrashIcon from '../../assets/images/icons/trash.svg';


export const DrivenHours = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addNewUser = () => {
        navigate('/system-users-management/add-user');
    }

    const userDetails = (row) => {
        navigate('/system-users-management/user-details', { state: row });
    }

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.description,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'File',
            selector: row => row.type,
            minWidth: '200px',
            cell: (row) => {
                if (row.type === 'Andorid / IOS') {
                    return (
                        <div className="d-flex align-items-center gap-2 text-gray">
                            <span className="d-flex align-items-center gap-2">Andorid <img src={AndroidIocn} alt="Android" className='img-fluid' /></span>
                            <span className="text-black px-2">|</span>
                            <span className="d-flex align-items-center gap-2">IOS <img src={IOSIcon} alt="IOS" className='img-fluid' /></span>
                        </div>
                    );
                } else {
                    return (
                        <div className="d-flex align-items-center gap-2 text-gray">
                            <span className="text-capitalize">{row.type}</span>
                            {row.android && <img src={AndroidIocn} alt="Android" className='img-fluid' />}
                        </div>
                    );
                }
            },
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: () => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer p-0' title='Edit'><img src={EditIcon} alt="Edit Icon" /></span>
                    <span className='pointer p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            description: 'DOT Inspection Lucid ELD DOT Inspection',
            type: 'Downloads',
            android: true,
            ios: false,
        },
        {
            id: '02',
            description: 'DOT Inspection Lucid ELD DOT Inspection',
            type: 'Downloads',
            android: true,
            ios: false,
        },
        {
            id: '03',
            description: 'DOT Inspection Lucid ELD DOT Inspection',
            type: 'Andorid / IOS',
            android: true,
            ios: true,
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

    const sectionHeaders = [
        'User Management',
        'Company Overview',
        'Driver Records',
        'Vehicle Logs',
        'Violation Reports'
    ];

    return (
        <div className="UsersManagement-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Driven Hours</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by name or email"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='primary'><i className="bi bi-plus-lg fs-16"></i> Add Resources</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>

                        <div className="accordion-wrapper bg-secondary bg-opacity-25 rounded-3 p-3">
                            <Accordion defaultActiveKey="0" flush className='d-flex flex-column gap-2'>
                                {sectionHeaders.map((title, idx) => (
                                    <Accordion.Item eventKey={String(idx)} key={idx}>
                                        <Accordion.Header>{title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='table-responsive table-custom-wrapper'>
                                                <DataTable
                                                    columns={columns}
                                                    data={filteredData}
                                                    // selectableRows
                                                    onRowClicked={userDetails}
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
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>


                    </div>
                </div>
            </div>

            {/* Delete Table Record Modal */}
            <Modal show={show} centered onHide={handleClose} dialogClassName='' contentClassName='border-0 rounded-4'>
                <Modal.Body className="text-center px-md-5 py-5">
                    <div className="icon-cover d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mx-auto mb-3" style={{ height: '50px', width: '50px' }}>
                        <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                    </div>
                    <div className="fs-18 fw-semibold lh-sm mb-3 pb-1">Are you sure you want to delete this report?</div>
                    <div className="btn-wrapper d-flex flex-wrap justify-content-center gap-2">
                        <Button variant="secondary" className="px-4 py-2" onClick={handleClose}>Cancel</Button>
                        <Button variant="danger" className="px-4 py-2" onClick={handleClose}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
