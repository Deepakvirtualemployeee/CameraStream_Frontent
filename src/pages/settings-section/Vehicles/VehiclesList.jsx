import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import CreditCardIcon from '../../../assets/images/icons/credit-card.svg';
import EditIcon from '../../../assets/images/icons/edit.svg'

export const VehiclesList = () => {
    const navigate = useNavigate();

    const columns = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.vehicle_number,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'License Plate',
            selector: (row) => row.license_plate,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Year',
            selector: (row) => row.year,
            sortable: true,
            minWidth: '120px',
        },
        {
            name: 'Make / Model',
            selector: (row) => row.make_model,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Vin',
            selector: (row) => row.vin,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Eld Sn (Mac)',
            selector: (row) => row.eld_sn,
            sortable: true,
            minWidth: '270px',
        },
        {
            name: 'Status',
            minWidth: '120px',
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Inactive' ? 'danger text-danger' : 'secondary text-body'}>{row.status}</Badge>,
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer ms-3' title='Edit' onClick={() => navigate('/settings/vehicles-list/edit-vehicle')}><img src={EditIcon} alt="Edit Icon" /></span>
                    {/* <span className='pointer p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span> */}
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            vehicle_number: '7000',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
        },
        {
            id: '02',
            vehicle_number: '7001',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Inactive',
        },
        {
            id: '03',
            vehicle_number: '7002',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
        },
        {
            id: '04',
            vehicle_number: '7003',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
        },
        {
            id: '05',
            vehicle_number: '7004',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
        },
        {
            id: '06',
            vehicle_number: '7005',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
        },
        {
            id: '07',
            vehicle_number: '7006',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Inactive',
        },
        {
            id: '08',
            vehicle_number: '7007',
            license_plate: 'PA-079225',
            year: '2020',
            make_model: 'Freightliner / Cascadia',
            vin: '4V4NC9GF72N326531',
            eld_sn: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            status: 'Active',
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
    const filteredData = data.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const matchesStatus = filterStatus === 'All' || filterStatus === '' || item.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="VehiclesList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Vehicles (62)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by Vehicle ID or VIN Number"
                            filters={filters}
                            onReset={resetFilters}
                        />

                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='white' className="bg-white border-gray d-flex align-items-center gap-2">
                                <img src={CreditCardIcon} alt="Credit Card Icon" className="img-fluid" style={{ filter: 'brightness(0.2)' }} /> Billing Page
                            </Button>
                            <Button variant='primary' onClick={() => navigate('/settings/vehicles-list/add-vehicle')}><i className="bi bi-plus-lg fs-16"></i> Add Vehicle</Button>
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
    )
}
