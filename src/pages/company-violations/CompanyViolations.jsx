import React, { useState } from 'react';
import { Modal, Button, Accordion, Badge, Tabs, Tab } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import InvokeIocn from '../../assets/images/icons/pin-invoke.svg';
import TrashIcon from '../../assets/images/icons/trash.svg';

export const CompanyViolations = () => {
    const [activeTab, setActiveTab] = useState('violation');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Table data 1st
    const columns = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Status',
            sortable: true,
            cell: (row) => <Badge className='fs-12 fw-normal bg-opacity-10' pill bg={row.status === 'ON Duty' ? 'success text-success' : row.status === 'OFF Duty' ? 'secondary text-black' : ''}>{row.status}</Badge>,
            minWidth: '120px',
        },
        {
            name: 'Type',
            cell: (row) => <Badge className='fs-12 fw-normal bg-opacity-10' pill bg={row.type === 'Violation' ? 'danger text-danger' : ''}>{row.type}</Badge>,
            minWidth: '120px',
        },
        {
            name: 'Shift Limit',
            selector: row => row.shift_limit,
            minWidth: '170px',
        },
        {
            name: 'Date',
            selector: row => row.date,
            minWidth: '170px',
        },
    ];

    const data = [
        {
            id: '01',
            name: 'Akhmedov',
            status: 'OFF Duty',
            type: 'Violation',
            shift_limit: '14 Shift Limit Required',
            date: 'June 12, 6:46 AM EDT',
        },
        {
            id: '02',
            name: 'Akhmedov',
            status: 'OFF Duty',
            type: 'Violation',
            shift_limit: '14 Shift Limit Required',
            date: 'June 12, 6:46 AM EDT',
        },
        {
            id: '03',
            name: 'Akhmedov',
            status: 'OFF Duty',
            type: 'Violation',
            shift_limit: '14 Shift Limit Required',
            date: 'June 12, 6:46 AM EDT',
        },
        {
            id: '04',
            name: 'Akhmedov',
            status: 'OFF Duty',
            type: 'Violation',
            shift_limit: '14 Shift Limit Required',
            date: 'June 12, 6:46 AM EDT',
        },
    ];

    // Table data 2nd
    const columns1 = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.vehicle_number,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'VIN',
            sortable: true,
            selector: row => row.vin_number,
            minWidth: '250px',
        },
        {
            name: 'ELD Serial Number (ELD MAC Address)',
            selector: row => row.serial_number,
            minWidth: '400px',
        },
        {
            name: 'Unidentified Count',
            selector: row => row.unidentified_count,
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

    const data1 = [
        {
            id: '01',
            vehicle_number: '93001',
            vin_number: '3ALACWFC1JDJY9030',
            serial_number: '3B5000266646 (00:00:00:00:00:00)',
            unidentified_count: '4',
        },
        {
            id: '02',
            vehicle_number: '93002',
            vin_number: '3ALACWFC1JDJY9030',
            serial_number: '4B5000266646 (00:00:00:00:00:00)',
            unidentified_count: '4',
        },
        {
            id: '03',
            vehicle_number: '93003',
            vin_number: '4ALACWFC1JDJY9130',
            serial_number: '7B5000166646 (00:00:00:00:00:00)',
            unidentified_count: '4',
        },
    ];

    // Filter state
    const [searchText, setSearchText] = useState('');

    // Reset filters
    const resetFilters = () => {
        setSearchText('');
    };

    // Filtered data
    const filteredData = data1.filter(item => {
        const matchesSearch = Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        return matchesSearch;
    });

    return (
        <div className="DrivenHours-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">Company Violations</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-column flex-sm-row flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by name or email"
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                {/* ✅ Show unidentified Button only on Unidentified tab */}
                                {activeTab === 'unidentified' && (
                                    <Button variant='danger'><img src={LogoutIocn} alt="Logout Iocn" className="me-2" style={{ filter: 'invert(100%) brightness(200%)' }} />Delete All Unidentified Events</Button>
                                )}
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>

                        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="common-tabs-wrapper mb-3">
                            <Tab eventKey="violation" title="Violation Page">
                                {/* Info Card 1 */}
                                <div className="info-card bg-theme5 rounded-3 mb-3 p-3">
                                    <div className="card-title text-black fw-medium font-roboto mb-2">AAJ TRANSPORTATION INC</div>
                                    <div className='table-responsive table-custom-wrapper'>
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            highlightOnHover
                                            pointerOnHover
                                            responsive
                                            customStyles={dataTableCustomStyles}
                                            noDataComponent={<NoDataComponent />}
                                            striped
                                            noTableHead
                                        />
                                    </div>
                                </div>

                                {/* Info Card 2 */}
                                <div className="info-card bg-theme5 rounded-3 mb-3 p-3">
                                    <div className="card-title text-black fw-medium font-roboto mb-2">Apps Review Dont delete</div>
                                    <div className='table-responsive table-custom-wrapper'>
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            highlightOnHover
                                            pointerOnHover
                                            responsive
                                            customStyles={dataTableCustomStyles}
                                            noDataComponent={<NoDataComponent />}
                                            striped
                                            noTableHead
                                        />
                                    </div>
                                </div>
                            </Tab>

                            <Tab eventKey="unidentified" title="Unidentified Events">
                                <div className="accordion-wrapper">
                                    <Accordion defaultActiveKey="0" flush className='custom-accordion d-flex flex-column gap-3'>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <span>CMV TRANSPORTATION LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                                <span className="icon"><img src={TrashIcon} alt="Trash Iocn" className="img-fluid" /></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='table-responsive table-custom-wrapper'>
                                                    <DataTable
                                                        columns={columns1}
                                                        data={filteredData}
                                                        // pagination
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
                                                <span>DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                                <span className="icon"><img src={TrashIcon} alt="Trash Iocn" className="img-fluid" /></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='table-responsive table-custom-wrapper'>
                                                    <DataTable
                                                        columns={columns1}
                                                        data={filteredData}
                                                        // pagination
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
                                                <span>DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                                <span className="icon"><img src={TrashIcon} alt="Trash Iocn" className="img-fluid" /></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='table-responsive table-custom-wrapper'>
                                                    <DataTable
                                                        columns={columns1}
                                                        data={filteredData}
                                                        // pagination
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
                                                <span>DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                                <span className="icon"><img src={TrashIcon} alt="Trash Iocn" className="img-fluid" /></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='table-responsive table-custom-wrapper'>
                                                    <DataTable
                                                        columns={columns1}
                                                        data={filteredData}
                                                        // pagination
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
                                                <span>DIIDEY TRUCKING LLC (1) <img src={InvokeIocn} alt="Invoke Iocn" className="img-fluid" /></span>
                                                <span className="icon"><img src={TrashIcon} alt="Trash Iocn" className="img-fluid" /></span>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className='table-responsive table-custom-wrapper'>
                                                    <DataTable
                                                        columns={columns1}
                                                        data={filteredData}
                                                        // pagination
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
                            </Tab>
                        </Tabs>
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
