import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import IOSIcon from '../../../assets/images/icons/ios.svg';
import EditIcon from '../../../assets/images/icons/edit.svg';
import { fetchDrivers } from '../../../store/actions/drivers';

export const DriversListing = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Company id from url
  console.log(id);
  const dispatch = useDispatch();

  // Get data from redux
  const { loading, drivers, error } = useSelector((state) => state.drivers);

  // Fetch drivers when page loads or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchDrivers(id));
    }
  }, [dispatch, id]);

  // Table columns
  const columns = [
    {
      name: 'Driver',
      selector: (row) => row.firstName + ' '+ row.lastName,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'User Name',
      selector: (row) => row.userName,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'Phone',
      selector: (row) => row.phoneNumber,
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'HOS Rules',
      selector: (row) => row.hos_rules,
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Assigned Vehicle',
      selector: (row) => row.assigned_vehicle,
      sortable: true,
      minWidth: '160px',
    },
    {
      name: 'Co-Driver',
      selector: (row) => row.co_driver,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'App Version',
      minWidth: '110px',
      cell: (row) => (
        <div className="app-version d-flex align-items-center gap-2">
          <img src={IOSIcon} alt="IOS Icon" className="img-fluid" /> {row.app_version}
        </div>
      ),
    },
    {
      name: 'Device',
      minWidth: '70px',
      cell: (row) => (
        <div className="device d-flex align-items-center gap-2">
          <i className="bi bi-pc-display fs-5"></i>
        </div>
      ),
    },
    {
      name: 'Status',
      minWidth: '90px',
      cell: (row) => (
        <Badge
          className="fs-12 fw-medium bg-opacity-10"
          pill
          bg={
            row.isActive === true
              ? 'success text-success'
              : row.isActive === false
              ? 'danger text-danger'
              : 'secondary text-body'
          }
        >
          {row.isActive === true ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      name: 'Activated',
      selector: (row) => row.activated,
      minWidth: '140px',
    },
    {
      name: 'Terminated',
      selector: (row) => row.terminated,
      minWidth: '140px',
    },
    {
      name: 'Actions',
      minWidth: '120px',
      cell: (row) => (
        <div className="action-wrapper d-flex flex-wrap align-items-center gap-3">
          <span
            className="pointer"
            title="Edit"
            onClick={() =>
              navigate(`/settings/drivers-listing/edit-driver/${row._id}`, {
                state: { companyId: id },
              })
            }
          >
            <img src={EditIcon} alt="Edit Icon" />
          </span>
          <span className="pointer p-0" title="Clock">
            <i className="bi bi-clock fs-5"></i>
          </span>
        </div>
      ),
    },
  ];

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
      options: ['All', 'Active', 'Inactive'],
    },
  ];
  
    // Filtered data
    const filteredData = (drivers || []).filter((item) => {
        const search = searchText.toLowerCase();
    
        // Combine first + last name
        const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
    
        const matchesSearch =
        Object.values(item).some((val) =>
            val?.toString().toLowerCase().includes(search)
        ) ||
        fullName.includes(search);
    
        const status = item.isActive ? 'Active' : 'Inactive';
    
        const matchesStatus =
        filterStatus === 'All' ||
        filterStatus === '' ||
        status === filterStatus;
    
        return matchesSearch && matchesStatus;
    });
  
  return (
    <div className="DriversListing-page py-3">
      <div className="container-fluid">
        <div className="main-heading mb-3">
          Drivers ({filteredData.length})
        </div>
        <div className="table-content-wrapper">
          <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
            <TableFilter
              searchText={searchText}
              setSearchText={setSearchText}
              searchPlaceholder="Search by Driver Name"
              filters={filters}
              onReset={resetFilters}
            />

            <div className="btn-wrapper d-flex flex-wrap gap-2">
              <Button
                variant="primary"
                className="d-flex align-items-center justify-center gap-1"
                onClick={() => navigate(`/settings/drivers-listing/add-driver/${id}`)}
              >
                <i className="bi bi-plus-lg fs-16"></i> Add Driver
              </Button>
            </div>
          </div>
          <div className="table-responsive table-custom-wrapper">
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
              progressPending={loading}
            />
            {error && <div className="text-danger mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
