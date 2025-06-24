import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Badge, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import FilterIocn from '../../assets/images/icons/filter.svg';
import ExternalIcon from '../../assets/images/icons/external.svg';
import EditIcon from '../../assets/images/icons/edit.svg'
import TrashIcon from '../../assets/images/icons/trash.svg';


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
            name: 'Name',
            selector: (row) => row.user_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.user_name}</div>),
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
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-25' pill bg={row.user_status === 'Active' ? 'success text-success' : row.user_status === 'Pending' ? 'danger text-danger' : row.user_status === 'In Process' ? 'warning text-dark' : 'primary'}>{row.user_status}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    {/* <span className='pointer p-0' title='Details' onClick={() => userDetails(row)}><img src={ExternalIcon} alt="External Icon" /></span> */}
                    <span className='pointer p-0' title='Edit'><img src={EditIcon} alt="Edit Icon" /></span>
                    <span className='pointer p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            user_name: 'Jakhongir Khasanov',
            user_email: 'jack@abctrans.com',
            user_role: 'System Administrator',
            user_group: 'All Companies',
            user_status: 'Active',
        },
        {
            id: '02',
            user_name: 'John Smith ',
            user_email: 'john@abctrans.com',
            user_role: 'System Administrator',
            user_group: 'Super Team',
            user_status: 'Active',
        },
        {
            id: '03',
            user_name: 'Vasheem Ahmad',
            user_email: 'ahmadvasu123@gmail.com',
            user_role: 'System Super Admin',
            user_group: 'All Companies',
            user_status: 'Pending',
        },
        {
            id: '04',
            user_name: 'Carlos Jimenez',
            user_email: 'carlos.jimenez@example.com',
            user_role: 'Lab Technician',
            user_group: 'All Companies',
            user_status: 'Active',
        },
        {
            id: '05',
            user_name: 'Emily Zhang',
            user_email: 'emily.zhang@example.com',
            user_role: 'System Technician',
            user_group: 'Super Team',
            user_status: 'Pending',
        },
        {
            id: '06',
            user_name: 'Liam Thompson',
            user_email: 'liam.thompson@example.com',
            user_role: 'System Administrator',
            user_group: 'Super Team',
            user_status: 'Active',
        },
    ];

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setFilterGroup('');
    };

    // Dropdown filter options
    const filters = [
        {
            value: filterGroup,
            setValue: setFilterGroup,
            placeholder: 'Filter by Group',
            options: ['All', 'All Companies', 'Super Team'],
        },
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesGroup = filterGroup === 'All' || filterGroup === '' || item.user_group === filterGroup;

        return matchesSearch && matchesGroup;
    });

    return (
        <div className="UsersManagement-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">System Users Management</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Name or email"
                                filters={filters}
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='primary'><i className="bi bi-plus-lg fs-16"></i> Add User</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={FilterIocn} alt="Filter Iocn" /> Filter by Status</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>
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
