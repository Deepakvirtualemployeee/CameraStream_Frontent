import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
import TableFilter from '../../../components/TableFilter';

export const DVIRSList = () => {
    const navigate = useNavigate();
    const columns = [
        {
            name: 'Time',
            selector: (row) => row.time,
            minWidth: '180px',
        },
        {
            name: 'Driver',
            selector: (row) => row.driver_name,
            minWidth: '170px',
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle_number,
            minWidth: '100px',
        },
        {
            name: 'Odometer',
            selector: (row) => row.odometer,
            minWidth: '120px',
        },
        {
            name: 'Vehicle Defects',
            minWidth: '200px',
            cell: (row) => {
                const defects = Array.isArray(row.vehicle_defects)
                    ? row.vehicle_defects
                    : row.vehicle_defects
                        ? [row.vehicle_defects]
                        : [];
                return (
                    <div className="d-flex flex-wrap gap-1">
                        {defects.map((defect, index) => (
                            <Badge key={index} className="fs-12 fw-medium bg-opacity-10" pill bg={row.trailer_defects ? "theme6 text-theme6" : " "}>
                                {defect}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            name: 'Trailer Defects',
            minWidth: '200px',
            cell: (row) => {
                const defects = Array.isArray(row.trailer_defects)
                    ? row.trailer_defects
                    : row.trailer_defects
                        ? [row.trailer_defects]
                        : [];
                return (
                    <div className="d-flex flex-wrap gap-1">
                        {defects.map((defect, index) => (
                            <Badge key={index} className="fs-12 fw-medium bg-opacity-10" pill bg={row.trailer_defects ? "warning text-warning" : ""}>
                                {defect}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            name: 'Status',
            minWidth: '130px',
            cell: (row) => (
                <Badge className="fs-12 fw-medium bg-opacity-10" pill bg={row.status === "Defects Fixed" ? "success text-success" : row.status === "Has Defects" ? "danger text-danger" : "secondary text-body"}>
                    {row.status}
                </Badge>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            time: 'Jan 15, 12:00:00 AM ET',
            driver_name: 'Sukhwinder Singh',
            vehicle_number: '023',
            odometer: '25365.00',
            vehicle_defects: 'Tail Lights',
            trailer_defects: 'Horn',
            status: 'Defects Fixed',
        },
        {
            id: '02',
            time: 'Jan 16, 12:00:00 AM ET',
            driver_name: 'Lakhan Singh',
            vehicle_number: '024',
            odometer: '25365.00',
            vehicle_defects: ['Tail Lights', 'Brake Lights'],
            trailer_defects: ['Doors', 'Battery'],
            status: 'Has Defects',
        },
        {
            id: '03',
            time: 'Jan 21, 12:00:00 AM ET',
            driver_name: 'Amit Kumar',
            vehicle_number: '025',
            odometer: '25365.00',
            vehicle_defects: 'Starter',
            trailer_defects: 'Battery',
            status: 'No Defects',
        },
        {
            id: '04',
            time: 'Jan 10, 12:00:00 AM ET',
            driver_name: 'Surendra Pratap Singh',
            vehicle_number: '026',
            odometer: '25365.00',
            vehicle_defects: 'Steering',
            trailer_defects: 'Brakes',
            status: 'Defects Fixed',
        },
    ];

    const today = new Date();

    // Filter state
    const [dateRange, setDateRange] = useState([today, today]);
    const [startDate, endDate] = dateRange;
    const [vehiclesStatus, setVehiclesStatus] = useState('All Vehicles');
    const [driversStatus, setDriversStatus] = useState('All Driver');
    const [defectsStatus, setDefectsStatus] = useState('All DVIRs');

    // Reset filters
    const resetFilters = () => {
        setDateRange([null, null]);
        setVehiclesStatus('');
        setDriversStatus('');
        setDefectsStatus('');
    };

    const filters = [
        {
            value: vehiclesStatus,
            setValue: setVehiclesStatus,
            // placeholder: 'Filter by Vehicles Status',
            options: ['All Vehicles', '023', '024'],
        },
        {
            value: driversStatus,
            setValue: setDriversStatus,
            // placeholder: 'Filter by Driver Status',
            options: ['All Driver', 'Sukhwinder Singh', 'Amit Kumar'],
        },
        {
            value: defectsStatus,
            setValue: setDefectsStatus,
            // placeholder: 'Filter by Defects Status',
            options: ['All DVIRs', 'No Defects', 'Has Defects', 'Defects Fixed'],
        }
    ];

    // Filtered data
    const filteredData = data.filter(item => {
        // ✅ Date filter
        const itemDate = new Date(item.date);
        const matchesDate = (!startDate || !endDate) || (itemDate >= startDate && itemDate <= endDate);

        const matchesVehiclesStatus = vehiclesStatus === 'All Vehicles' || vehiclesStatus === '' || item.vehicle_number === vehiclesStatus;
        const matchesDriversStatus = driversStatus === 'All Driver' || driversStatus === '' || item.driver_name === driversStatus;
        const matchesDefectsStatus = defectsStatus === 'All DVIRs' || defectsStatus === '' || item.status === defectsStatus;

        return matchesVehiclesStatus && matchesDriversStatus && matchesDefectsStatus;
        // && matchesDate;
    });

    return (
        <div className="FMCSARecords-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">DVIRs</div>
                <div className="table-content-wrapper">
                    <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap align-items-sm-start justify-content-between gap-2 mb-4">
                        <TableFilter
                            showSearch={false}
                            showReset={false}
                            startDate={startDate}
                            endDate={endDate}
                            setDateRange={setDateRange}
                            showDateFilter={true}
                            filters={filters}
                            onReset={resetFilters}
                        />

                        <div className="btn-wrapper d-flex flex-wrap gap-2">
                            <Button variant='warning' className="d-flex align-items-center justify-center gap-1">
                                <i className="bi bi-file-earmark-arrow-down fs-16"></i> Download
                            </Button>
                            <Button variant='primary' className="d-flex align-items-center justify-center gap-1" onClick={() => navigate('/dvirs-list/add-dvir')}>
                                <i className="bi bi-plus-lg fs-16"></i> Create DVIR
                            </Button>
                        </div>
                    </div>
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            onRowClicked={()=> navigate('/dvirs-list/dvir-details')}
                            pagination
                            pointerOnHover
                            highlightOnHover
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
