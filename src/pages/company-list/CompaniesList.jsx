import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import TableFilter from '../../components/TableFilter';
import { NoDataComponent } from '../../components/NoDataComponent';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import FilterIocn from '../../assets/images/icons/filter.svg';
import ExternalIcon from '../../assets/images/icons/external.svg';
import TrashIcon from '../../assets/images/icons/trash.svg';
import { DeleteModal } from '../../components/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, deleteCompany } from '../../store/actions/companies';

export const CompaniesList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [companyToDelete, setCompanyToDelete] = useState(null); // State to keep the selected company ID
    // console.log(companyToDelete);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleClose = () => setShowDeleteModal(false);
    const handleShow = () => setShowDeleteModal(true);

    // Handler to delete company
    const handleDelete = () => {
        if (companyToDelete) {
            console.log("ID", companyToDelete);
            dispatch(deleteCompany(companyToDelete));
            handleClose();
        }
    };

    // Filter dropdown button
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('Filter by Status');

    const options = ['All', 'Active', 'Inactive'];

    const handleSelect = (option) => {
        setSelected(option);
        setFilterStatus(option);
        setOpen(false);
    };

    const columns = [
        // {
        //     name: 'Name',
        //     selector: (row) => row.companyName,
        //     sortable: true,
        //     minWidth: '200px',
        //     cell: (row) => (<div className='client-name fw-medium text-capitalize'>{row.companyName}</div>),
        // },
        {
            name: 'Name',
            selector: (row) => row.companyName,
            sortable: true,
            minWidth: '200px',
            cell: (row) => (
              <a
                // href={`/company/${row._id}/dashboard`}
                href={`/settings/company-info/${row._id}`}

                target="_blank"
                rel="noopener noreferrer"
                className="client-name fw-medium text-capitalize text-primary text-decoration-underline"
              >
                {row.companyName}
              </a>
            ),
          },          
        {
            name: 'Address',
            selector: (row) => row.address,
            minWidth: '170px',
        },
        {
            name: 'Dot Number',
            selector: (row) => row.dotNumber,
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            minWidth: '100px',
            cell: (row) => (
                <Badge
                    className='fs-12 fw-medium bg-opacity-10'
                    pill
                    bg={
                        row.status === 'Active'
                            ? 'success text-success'
                            : row.status === 'Pending'
                                ? 'danger text-danger'
                                : row.status === 'In Process'
                                    ? 'warning text-warning'
                                    : 'primary'
                    }
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            name: 'ID',
            selector: (row) => row.timeZoneId,
            sortable: true,
        },
        {
            name: 'Active Vehicles',
            selector: (row) => row.activeVehicles,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Sub. Vehicles',
            selector: (row) => row.subVehicles,
            sortable: true,
            minWidth: '140px',
        },
        {
            name: 'Subscription',
            selector: (row) => row.subscriptionStatus,
            cell: (row) => (
                <Badge
                    className='fs-12 fw-medium bg-opacity-10'
                    pill
                    bg={
                        row.subscriptionStatus === 'Paid'
                            ? 'success text-success'
                            : row.subscriptionStatus === 'Open'
                                ? 'danger text-danger'
                                : ''
                    }
                >
                    {row.subscriptionStatus}
                </Badge>
            ),
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer p-0' title='Details'><img src={ExternalIcon} alt="External Icon" /></span>
                    <span className='pointer p-0' title='Delete' onClick={() => {
                        setCompanyToDelete(row._id); // store ID
                        handleShow();
                    }}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    // Redux state
    // const { companies, loading, error } = useSelector(state => state.companies);
    const { companies, loading, error } = useSelector((state) => state.companies || { companies: [] });

    useEffect(() => {
        dispatch(getCompanies());
    }, [dispatch]);

    // Filter state
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
        setFilterStatus('');
        setSelected('Filter by Status');
    };

    // Filtered data
    const filteredData = companies?.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.status === filterStatus;

        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Companies (Admin)</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Company Name or DOT"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='primary' onClick={() => navigate('/companies-list/create-company')}><i className="bi bi-plus-lg fs-16"></i> Create Company</Button>
                                <div className="position-relative inline-block text-start">
                                    <Button variant='white' onClick={() => setOpen(!open)} className="bg-white border-gray" style={{ minWidth: '150px' }}>
                                        <img src={FilterIocn} alt="Filter Icon" /> {selected}
                                    </Button>
                                    {open && (
                                        <div className="position-absolute bg-white rounded-3 shadow-lg z-1 mt-1 p-2" style={{ width: '180px' }}>
                                            {options.map((option, index) => (
                                                <li key={index} onClick={() => handleSelect(option)} className={`fs-14 w-100 text-theme3 text-start d-block rounded-2 pointer px-3 py-2 ${selected === option ? 'bg-secondary bg-opacity-10 font-medium' : ''}`}>
                                                    {option}
                                                </li>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant='white'
                                    className="bg-white border-gray"
                                    onClick={() => {
                                        navigate('/login');
                                        localStorage.removeItem("token");
                                    }}
                                >
                                    <img src={LogoutIocn} alt="Logout Icon" /> Log Out
                                </Button>
                            </div>
                        </div>
                        <div className='table-responsive table-custom-wrapper'>
                            {loading ? (
                                <div className="text-center my-4">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : error ? (
                                <div className="text-danger text-center my-4">{error}</div>
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    pointerOnHover
                                    // onRowClicked={() => navigate('/settings/eld-devices')}
                                    striped
                                    pagination
                                    highlightOnHover
                                    responsive
                                    customStyles={dataTableCustomStyles}
                                    noDataComponent={<NoDataComponent />}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Table Record Modal */}
            <DeleteModal show={showDeleteModal} handleClose={handleClose} onConfirm={handleDelete} />
        </div>
    )
}
