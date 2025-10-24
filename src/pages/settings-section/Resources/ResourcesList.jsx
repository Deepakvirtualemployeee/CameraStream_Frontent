import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../../../assets/style/dataTableCustomStyles';
import { NoDataComponent } from '../../../components/NoDataComponent';
// import TableFilter from '../../../components/TableFilter';
// import LogoutIocn from '../../../assets/images/icons/logout.svg';
import AndroidIocn from '../../../assets/images/icons/android.svg';
import IOSIcon from '../../../assets/images/icons/ios.svg';
import BookDownloadIcon from '../../../assets/images/icons/book-download.svg'

export const ResourcesList = () => {
    // const navigate = useNavigate();

    const columns = [
        {
            name: 'Description',
            sortable: true,
            minWidth: '600px',
            cell: (row) => (
                <div className="info-wrapper py-2">
                    <div className="title fs-16 fw-bold text-black mb-1">{row.title}</div>
                    <div className="title fs-14 text-muted">{row.description}</div>
                </div>
            ),
        },
        {
            name: '',
            selector: row => row.type,
            width: '230px',
            cell: (row) => {
                if (row.type === 'Andorid / IOS') {
                    return (
                        <div className="d-flex align-items-center gap-2 text-muted">
                            <span className="d-flex align-items-center gap-2">Andorid <img src={AndroidIocn} alt="Android" className='img-fluid' style={{ filter: 'brightness(0.2)' }} /></span>
                            <span className="text-gray px-2">|</span>
                            <span className="d-flex align-items-center gap-2">IOS <img src={IOSIcon} alt="IOS" className='img-fluid' style={{ filter: 'brightness(0.2)' }} /></span>
                        </div>
                    );
                } else {
                    return (
                        <div className="d-flex align-items-center gap-2 text-muted">
                            <span className="text-capitalize">{row.type}</span>
                            {row.android && <img src={BookDownloadIcon} alt="Book Download Icon" className='img-fluid' />}
                        </div>
                    );
                }
            },
        },
    ];

    const data = [
        {
            id: '01',
            title: 'LUCID ELD Sticker',
            description: 'A simple sticker can help roadside inspectors or enforcement personnel quickly ascertain that the device on board is, in fact, an ELD and carry out the inspection accordingly.',
            type: 'Downloads',
            android: true,
            ios: false,
        },
        {
            id: '02',
            title: 'Compliance Certificate',
            description: 'Lucid ELD Compliance Certificate',
            type: 'Downloads',
            android: true,
            ios: false,
        },
        {
            id: '03',
            title: 'Users Manual',
            description: 'Sources of Instructions on how to use the Lucid ELD',
            type: 'Downloads',
            android: true,
            ios: true,
        },
        {
            id: '04',
            title: 'DOT Instructions Sheet',
            description: 'Step by Step instructions for DOT Inspection',
            type: 'Downloads',
            android: true,
            ios: true,
        },
        {
            id: '05',
            title: 'Malfunction Manual',
            description: 'Guide on what actions to take when ELD Device doesn’t work as intented',
            type: 'Downloads',
            android: true,
            ios: true,
        },
        {
            id: '06',
            title: 'Mobile Applications',
            description: 'Quick links to install mobile applications',
            type: 'Andorid / IOS',
            android: true,
            ios: true,
        },
    ];

    return (
        <div className="ResourcesList-page py-3">
            <div className="container-fluid">
                <div className="main-heading mb-3">Resources</div>
                <div className="table-content-wrapper">
                    <div className='table-responsive table-custom-wrapper'>
                        <DataTable
                            columns={columns}
                            data={data}
                            // striped
                            // pagination
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={dataTableCustomStyles}
                            noDataComponent={<NoDataComponent />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
