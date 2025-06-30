import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../components/NoDataComponent';
import TableFilter from '../../components/TableFilter';
import LogoutIocn from '../../assets/images/icons/logout.svg';
import FileIcon from '../../assets/images/icons/file.svg';
import TrashIcon from '../../assets/images/icons/trash.svg'
import AndroidIcon from '../../assets/images/icons/android.svg'
import IOSIcon from '../../assets/images/icons/ios.svg'


export const AppFeedback = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const columns = [
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Company',
            selector: (row) => row.company,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Vehicle',
            selector: (row) => row.vehicle,
            sortable: true,
        },
        {
            name: 'Driver',
            selector: (row) => row.driver,
            sortable: true,
            minWidth: '140px',
        },
        {
            name: 'Device Name',
            selector: (row) => row.device_name,
            minWidth: '200px',
        },
        {
            name: 'Software Version',
            selector: (row) => row.software_version,
            minWidth: '150px',
        },
        {
            name: 'App Version',
            selector: (row) => row.app_version,
            minWidth: '120px',
            cell: (row) => (
                <div className="app-version d-flex align-items-center gap-2"><img src={AndroidIcon} alt="Android Icon" className="img-fluid" /> {row.app_version}</div>
            ),
        },
        {
            name: 'File',
            selector: (row) => row.user_group,
            width: '65px',
            cell: () => (<span className='pointer p-0' title='Delete'><img src={FileIcon} alt="File Icon" className="img-fluid" /></span>),
        },
        {
            name: 'Action',
            selector: (row) => row.user_group,
            width: '90px',
            cell: () => (<span className='pointer ms-2 p-0' title='Delete' onClick={handleShow}><img src={TrashIcon} alt="Trash Icon" className="img-fluid" /></span>),
        }
    ];

    const data = [
        {
            id: '01',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'Samsung SM-T307U',
            software_version: '11',
            app_version: '1.0.0',
        },
        {
            id: '02',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'iPad',
            software_version: '16.2',
            app_version: '1.0.0',
        },
        {
            id: '03',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'iPhone',
            software_version: '16.2',
            app_version: '1.0.0',
        },
        {
            id: '01',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'Samsung SM-T307U',
            software_version: '11',
            app_version: '1.0.0',
        },
        {
            id: '02',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'iPad',
            software_version: '16.2',
            app_version: '1.0.0',
        },
        {
            id: '03',
            date: 'Jan 15, 2022 - 11:25 PM',
            company: 'ABC Trans Inc',
            vehicle: '7000',
            driver: 'Corey Goodman',
            device_name: 'iPhone',
            software_version: '16.2',
            app_version: '1.0.0',
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
        <div className="FmcsaTransfer-page py-3">
            <div className="container-fluid">
                <div className="bg-theme4 border rounded-2 p-3">
                    <div className="main-heading mb-3">App Feedback</div>
                    <div className="table-content-wrapper">
                        <div className="action-wrapper d-flex flex-wrap justify-content-between gap-2 mb-4">
                            <TableFilter
                                searchText={searchText}
                                setSearchText={setSearchText}
                                searchPlaceholder="Search by Company Name or Driver..."
                                onReset={resetFilters}
                            />
                            <div className="btn-wrapper d-flex flex-wrap gap-2">
                                <Button variant='white' className="bg-white border-gray"><img src={LogoutIocn} alt="Logout Iocn" /> Log Out</Button>
                            </div>
                        </div>
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
