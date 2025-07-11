import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';
import EditIcon from '../../../assets/images/icons/edit.svg'

export const ELDDevice = () => {
    const navigate = useNavigate();

    const columns = [
        {
            name: 'ELD SN (MAC)',
            selector: (row) => row.eld_sm,
            sortable: true,
            minWidth: '300px',
        },
        {
            name: 'ELD Model',
            selector: (row) => row.eld_model,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Assigned Vehicle',
            selector: (row) => row.assigned_vehicle,
            sortable: true,
            minWidth: '170px',
        },
        {
            name: 'BLE Version',
            selector: (row) => row.ble_version,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Firmware Version',
            selector: (row) => row.firmware_version,
            sortable: true,
            minWidth: '170px',
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
                    <span className='pointer ms-3' title='Edit' onClick={() => navigate('/settings/eld-devices/edit-device')}><img src={EditIcon} alt="Edit Icon" /></span>
                    {/* <span className='pointer p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span> */}
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30',
            assigned_vehicle: '7000',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Active',
        },
        {
            id: '02',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7001',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Inactive',
        },
        {
            id: '03',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7002',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Active',
        },
        {
            id: '04',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7003',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Active',
        },
        {
            id: '05',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7004',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Active',
        },
        {
            id: '06',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7005',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Active',
        },
        {
            id: '07',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7006',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
            status: 'Inactive',
        },
        {
            id: '08',
            eld_sm: '3B2000090651 (C2:E8:DE:F5:13:2E)',
            eld_model: 'PT30U',
            assigned_vehicle: '7007',
            ble_version: '1.5.6',
            firmware_version: '1.1.46,72',
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
        <div className="ELDDevice-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">ELD Devices (62)</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            searchText={searchText}
                            setSearchText={setSearchText}
                            searchPlaceholder="Search by ELD SN or ELD MAC Address"
                            filters={filters}
                            onReset={resetFilters}
                        />
                        <Button variant='primary' onClick={() => navigate('/settings/eld-devices/add-device')}><i className="bi bi-plus-lg fs-16"></i> Add ELD Device</Button>
                        {/* <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='primary' onClick={() => navigate('/eld-devices/add-device')}><i className="bi bi-plus-lg fs-16"></i> Add ELD Device</Button>
                        </div> */}
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
