import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Spinner, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import TrashIcon from '../../assets/images/icons/trash.svg';
import { DeleteModal } from '../../components/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, deleteCompany } from '../../store/actions/companies';

export const CompaniesList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [companyToDelete, setCompanyToDelete] = useState(null); // State to keep the selected company ID
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

    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.companyName,
            sortable: true,
            minWidth: '220px',
            cell: (row) => (
              <div className="d-flex flex-column">
                <span className="fw-semibold text-body">{row.companyName}</span>
                <a
                  href={`/location/${row._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="small text-primary text-decoration-underline"
                >
                  Open dashboard
                </a>
              </div>
            ),
          },          
        {
            name: 'Address',
            selector: (row) => row.address,
            minWidth: '200px',
        },
        {
            name: 'Dot Number',
            selector: (row) => row.dotNumber,
            sortable: true,
            minWidth: '110px',
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            minWidth: '120px',
            cell: (row) => (
                <Badge
                    className='fs-12 fw-medium bg-opacity-10'
                    pill
                    bg={
                        row.status === 'Active'
                            ? 'success text-success'
                            : row.status === 'Pending'
                                ? 'warning text-warning'
                                : 'secondary text-secondary'
                    }
                >
                    {row.status || 'Inactive'}
                </Badge>
            ),
        },
        // keep a minimal action (delete) only
        {
            name: 'Actions',
            minWidth: '120px',
            cell: (row) => (
                <div className='action-wrapper d-flex align-items-center gap-2'>
                    <span className='pointer p-0' title='Delete' onClick={() => {
                        setCompanyToDelete(row._id); // store ID
                        handleShow();
                    }}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    // Redux state
    const { companies, loading, error } = useSelector((state) => state.companies || { companies: [] });

    useEffect(() => {
        dispatch(getCompanies());
    }, [dispatch]);

    // Filtered data
    const filteredData = useMemo(() => {
        const base = companies || [];
        const statusFiltered =
            filterStatus === 'All'
                ? base
                : base.filter((item) => (item.status || 'Inactive') === filterStatus);

        if (!searchText) return statusFiltered;

        return statusFiltered.filter((item) =>
            Object.values(item || {}).some((val) =>
                val?.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [companies, searchText, filterStatus]);

    const totalCompanies = companies?.length || 0;
    const activeCompanies = companies?.filter((c) => c.status === 'Active').length || 0;
    const pendingCompanies = companies?.filter((c) => c.status === 'Pending').length || 0;

    return (
        <div className="CompaniesList-page py-3">
            <div className="container-fluid">
                <div className="bg-white border rounded-3 p-3 p-md-4 shadow-sm">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                        <div>
                            <div className="fs-4 fw-bold mb-1">Companies</div>
                            <div className="text-muted">Manage all companies in one place.</div>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            <Button variant="outline-secondary" onClick={() => {
                                navigate('/login');
                                localStorage.removeItem("token");
                            }}>
                                <img src={LogoutIocn} alt="Logout Icon" className="me-1" /> Log Out
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/companies-list/create-company')}>
                                <i className="bi bi-plus-lg fs-16 me-1"></i>
                                Create Company
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-3 mb-3">
                        {[{
                            label: 'Total Companies',
                            value: totalCompanies,
                            tone: 'primary'
                        }, {
                            label: 'Active',
                            value: activeCompanies,
                            tone: 'success'
                        }].map((stat, idx) => (
                            <div className="col-sm-6 col-lg-4" key={idx}>
                                <div className={`border rounded-3 p-3 h-100 bg-${stat.tone}-subtle`}>
                                    <div className="text-muted small">{stat.label}</div>
                                    <div className="fs-3 fw-bold text-dark">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="d-flex flex-column flex-lg-row flex-wrap align-items-lg-center gap-2 mb-3">
                        <Form.Control
                            type="search"
                            placeholder="Search by name, DOT, or address"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ maxWidth: '360px' }}
                        />
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {['All', 'Active', 'Inactive'].map((status) => (
                                <Button
                                    key={status}
                                    variant={filterStatus === status ? 'dark' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setFilterStatus(status)}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="link"
                            className="ms-lg-auto text-decoration-none"
                            onClick={() => {
                                setSearchText('');
                                setFilterStatus('All');
                            }}
                        >
                            Reset filters
                        </Button>
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

            {/* Delete Table Record Modal */}
            <DeleteModal show={showDeleteModal} handleClose={handleClose} onConfirm={handleDelete} />
        </div>
    )
}
