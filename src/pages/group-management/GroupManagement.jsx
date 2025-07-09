import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import EditIcon from '../../assets/images/icons/edit.svg'
import TrashIcon from '../../assets/images/icons/trash.svg';


export const GroupManagement = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.user_name,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.user_name}</div>),
        },
        {
            name: 'Users',
            selector: (row) => row.group_user,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Companies',
            selector: (row) => row.group_companies,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'Status',
            selector: (row) => row.group_status,
            sortable: true,
            minWidth: '80px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.group_status === 'Active' ? 'success text-success' : row.group_status === 'Inactive' ? 'danger text-danger' : 'secondary text-body'}>{row.group_status}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
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
            user_name: 'Super Team',
            group_user: '10 Users',
            group_companies: '4 Companies',
            group_status: 'Active',
        },
        {
            id: '02',
            user_name: 'Mango Team',
            group_user: '3 Users',
            group_companies: 'All Companies',
            group_status: 'Active',
        },
        {
            id: '03',
            user_name: 'Mango Team',
            group_user: '5 Users',
            group_companies: '7 Companies',
            group_status: 'Active',
        },
        {
            id: '04',
            user_name: 'Super Team',
            group_user: '10 Users',
            group_companies: '4 Companies',
            group_status: 'Active',
        },
        {
            id: '05',
            user_name: 'Mango Team',
            group_user: '3 Users',
            group_companies: 'All Companies',
            group_status: 'Active',
        },
        {
            id: '06',
            user_name: 'Mango Team',
            group_user: '5 Users',
            group_companies: '7 Companies',
            group_status: 'Active',
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
        <div className="UsersManagement-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Group Management</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Group Name"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='primary' onClick={()=> navigate('/group-management/add-group')}><i className="bi bi-plus-lg fs-16"></i> Add Group</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
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
