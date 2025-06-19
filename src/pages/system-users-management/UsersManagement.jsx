import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';

export const UsersManagement = () => {
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
            name: 'Sr No.',
            selector: (row) => row.id,
            width: '70px',
        },
        {
            name: 'Name',
            selector: (row) => row.user_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (
                <div className='d-flex align-items-center gap-2'>
                    <img src={require('../../assets/images/dummy-user.jpeg')} alt="Client" className='img-fluid border border-white rounded-circle shadow' style={{ height: '35px', width: '35px' }} />
                    <div className='client-name fw-medium text-capitalize'>{row.user_name}</div>
                </div>
            ),
        },
        {
            name: 'Email',
            selector: (row) => row.user_email,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Role',
            selector: (row) => row.user_role,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Groups',
            selector: (row) => row.user_group,
            sortable: true,
            minWidth: '160px',
        },
        {
            name: 'Status',
            selector: (row) => row.user_status,
            sortable: true,
            minWidth: '80px',
            cell: (row) => <Badge className='' pill text={`${row.user_status === 'In Process' ? 'dark' : ''}`} bg={`${row.user_status === 'Active' ? 'success' : 'primary' && row.user_status === 'Pending' ? 'danger' : 'primary' && row.user_status === 'In Process' ? 'warning' : 'primary'}`}>{row.user_status}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '160px',
            cell: (row) => (
                <div className='action-wrapper d-flex gap-2'>
                    <Button variant='outline-success' className='focus-ring focus-ring-success rounded-circle' title='View' onClick={() => userDetails(row)}><i className='bi bi-eye-fill fs-18'></i></Button>
                    <Button variant='outline-warning' className='focus-ring focus-ring-warning rounded-circle' title='Edit'><i className='bi bi-pencil-square'></i></Button>
                    <Button variant='outline-danger' className='focus-ring focus-ring-danger rounded-circle' title='Delete' onClick={handleShow}><i className='bi bi-trash3-fill'></i></Button>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            user_name: 'Deena Cooley',
            user_email: 'deenacooley123@gmail.com',
            user_role: 'System Administrator',
            user_group: 'All Company Access',
            user_status: 'Active',
        },
        {
            id: '02',
            user_name: 'Jerry Wilcox',
            user_email: 'jerrywilcox786@gmail.com',
            user_role: 'System Technician',
            user_group: 'Jahangir Team',
            user_status: 'Pending',
        },
        {
            id: '03',
            user_name: 'Vasheem Ahmad',
            user_email: 'ahmadvasu123@gmail.com',
            user_role: 'System Super Admin',
            user_group: 'UNI Trans Team',
            user_status: 'In Process',
        },
        {
            id: '04',
            user_name: 'Carlos Jimenez',
            user_email: 'carlos.jimenez@example.com',
            user_role: 'Lab Technician',
            user_group: 'Lucid ELD Team',
            user_status: 'Active',
        },
        {
            id: '05',
            user_name: 'Emily Zhang',
            user_email: 'emily.zhang@example.com',
            user_role: 'System Technician',
            user_group: 'Anwar Khan Team',
            user_status: 'Pending',
        },
        {
            id: '06',
            user_name: 'Liam Thompson',
            user_email: 'liam.thompson@example.com',
            user_role: 'System Administrator',
            user_group: 'Jahangir Ali Team',
            user_status: 'In Process',
        },
        {
            id: '07',
            user_name: 'Vasheem Ahmad',
            user_email: 'ahmadvasu123@gmail.com',
            user_role: 'System Super Admin',
            user_group: 'UNI Trans Team',
            user_status: 'In Process',
        },
        {
            id: '08',
            user_name: 'Jerry Wilcox',
            user_email: 'Shire Horse',
            user_role: 'Vicki Walsh',
            user_group: 'Asthma',
            user_status: 'Pending',
        },
        {
            id: '09',
            user_name: 'Carlos Jimenez',
            user_email: 'carlos.jimenez@example.com',
            user_role: 'Lab Technician',
            user_group: 'Lucid ELD Team',
            user_status: 'Active',
        },
    ];

    // Table Filter Option
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterGroup, setFilterGroup] = useState('');

    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.user_status === filterStatus;
        const matchesGroup = filterGroup === 'All' || filterGroup === '' || item.user_role === filterGroup;

        return matchesSearch && matchesStatus && matchesGroup;
    });

    const resetFilters = () => {
        setSearchText('');
        setFilterStatus('');
        setFilterGroup('');
    };

    return (
        <div className="UsersManagement-page py-3">
            <div className="container-fluid">
                <div className="bg-white rounded-3 p-3">
                    <div className="hrading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <h5 className="fw-bold m-0">System User Management</h5>
                        <Button variant="success" className="px-3" onClick={addNewUser}><i className="bi bi-plus-circle-dotted me-1"></i> Add User</Button>
                    </div>

                    <div className="filter-wrapper d-flex flex-column flex-sm-row flex-wrap gap-2 mb-3">
                        <Form.Group>
                            <Form.Control type="search" value={searchText} placeholder="Search by name, email, etc..." onChange={e => setSearchText(e.target.value)} style={{ minWidth: '300px' }} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: '200px' }} required >
                                <option value="" hidden>Filter by status</option>
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="In Process">In Process</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} style={{ minWidth: '200px' }} required>
                                <option value="" hidden>Filter by group</option>
                                <option value="All">All Roles</option>
                                <option value="System Administrator">System Administrator</option>
                                <option value="System Technician">System Technician</option>
                                <option value="System Super Admin">System Super Admin</option>
                                <option value="Lab Technician">Lab Technician</option>
                            </Form.Select>
                        </Form.Group>
                        <Button className="text-secondary bg-primary bg-opacity-10 border d-flex align-items-center justify-content-center px-3" title="Reset Filters" onClick={resetFilters}>
                            <i className="bi bi-arrow-clockwise fs-18"></i> <span className="ms-1 d-sm-none">Refresh</span>
                        </Button>
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            // selectableRows
                            // sortIcon={<i className="bi bi-eye-fill"></i>}
                            onRowClicked={userDetails}
                            dense
                            pagination
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={dataTableCustomStyles}
                            noDataComponent={<NoDataComponent />}
                        // striped
                        />
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
