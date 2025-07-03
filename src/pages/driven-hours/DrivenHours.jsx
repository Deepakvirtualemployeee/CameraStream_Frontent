import React, { useState } from 'react';
import './driven-hours.scss'
import { Modal, Button, Accordion, Badge } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import FilterIocn from '../../assets/images/icons/filter.svg';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import LoaderIocn from '../../assets/images/icons/loader.svg';
import InvokeIocn from '../../assets/images/icons/pin-invoke.svg';
import TrashIcon from '../../assets/images/icons/trash.svg';

export const DrivenHours = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.vehicle_number,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Driver',
            sortable: true,
            selector: row => row.driver_name,
            cell: (row) => <div className="d-flex align-items-center gap-2">{row.driver_name} <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></div>,
            minWidth: '200px',
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: (row) => <Badge className='fs-12 fw-medium bg-opacity-10' pill bg={row.status === 'Active' ? 'success text-success' : row.status === 'Inactive' ? 'danger text-danger' : 'secondary text-body'}>{row.status}</Badge>,
            minWidth: '100px',
        },
        {
            name: 'Total Days',
            selector: row => row.total_days,
            minWidth: '100px',
        },
        {
            name: 'Total Hours',
            selector: row => row.total_hours,
            minWidth: '120px',
        },
        {
            name: 'Jun 1, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 2, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 3, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 4, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 5, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 6, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 7, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 8, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 9, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Jun 10, 2025',
            selector: row => row.date_value,
            minWidth: '100px',
        },
        {
            name: 'Actions',
            minWidth: '150px',
            cell: () => (
                <div className='action-wrapper d-flex flex-wrap align-items-center gap-3'>
                    <span className='pointer ms-3 p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" /></span>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '01',
            vehicle_number: '93005',
            driver_name: 'Botnariuc Eugeniu',
            status: 'Active',
            total_days: '30',
            total_hours: '185',
            date_value: '4',
        },
        {
            id: '02',
            vehicle_number: '93005',
            driver_name: 'Victor Ursachi',
            status: 'Active',
            total_days: '30',
            total_hours: '185',
            date_value: '4',
        },
        {
            id: '03',
            vehicle_number: 'N/A',
            driver_name: 'Victor Ursachi',
            status: 'Active',
            total_days: '30',
            total_hours: '185',
            date_value: '4',
        },
        {
            id: '04',
            vehicle_number: '3704',
            driver_name: 'Lahoucine Et Tammamy',
            status: 'Active',
            total_days: '30',
            total_hours: '185',
            date_value: '4',
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
        <div className="DrivenHours-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Driven Hours</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by name or email"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='white' className="bg-white border-gray"><img src={FilterIocn} alt="Filter Iocn" /> Filter by Status</Button>
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>

                        <div className="text-black fs-16 fw-semibold font-roboto mb-3">Last 14 days Driver Data</div>

                        <div className="bg-opacity-25 rounded-3 mb-3 p-3" style={{ backgroundColor: '#EBF0F7' }}>
                            <div className="font-roboto d-flex flex-wrap align-items-center justify-content-between gap-2">
                                <div className="text-black fs-16 fw-semibold font-roboto">All 513 Comapnies found</div>
                                <Button variant='primary' className="fs-16 py-2">Download Excel sheet</Button>
                            </div>
                        </div>

                        <div className="accordion-wrapper">
                            <Accordion defaultActiveKey="0" flush className='custom-accordion d-flex flex-column gap-3'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span>1ST ROAD TRUCKING LLC - 220 - 4075101 - Lucid ELD Team 1 Active Vehicle 1 Drivers icons</span>
                                        <span className="d-flex align-items-center gap-2">1 Active Vehicle 1 Drivers icons <img src={LoaderIocn} alt="Loader Iocn" className="img-fluid" /></span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='table-responsive table-custom-wrapper'>
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                // selectableRows
                                                // onRowClicked={userDetails}
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
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        <span>2B EMPIRE INC - 648 - 3410220</span>
                                        <span className="d-flex align-items-center gap-2">1 Active Vehicle & 1 Driver <img src={LoaderIocn} alt="Loader Iocn" className="img-fluid" /></span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='table-responsive table-custom-wrapper'>
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                // selectableRows
                                                // onRowClicked={userDetails}
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
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>
                                        <span>3 BROTHERS EXPRESS NC LLC</span>
                                        <span className="d-flex align-items-center gap-2">1 Active Vehicle & 1 Driver <img src={LoaderIocn} alt="Loader Iocn" className="img-fluid" /></span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='table-responsive table-custom-wrapper'>
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                // selectableRows
                                                // onRowClicked={userDetails}
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
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>
                                        <span className="d-flex align-items-center gap-2">DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                        <span className="d-flex align-items-center gap-2">1 Active Vehicle & 1 Driver <img src={LoaderIocn} alt="Loader Iocn" className="img-fluid" /></span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='table-responsive table-custom-wrapper'>
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                // selectableRows
                                                // onRowClicked={userDetails}
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
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>
                                        <span className="d-flex align-items-center gap-2">DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                        <span className="d-flex align-items-center gap-2">1 Active Vehicle & 1 Driver <img src={LoaderIocn} alt="Loader Iocn" className="img-fluid" /></span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='table-responsive table-custom-wrapper'>
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                // selectableRows
                                                // onRowClicked={userDetails}
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
