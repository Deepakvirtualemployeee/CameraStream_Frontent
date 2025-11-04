import React from 'react';
import { Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import dataTableCustomStyles from '../assets/style/dataTableCustomStyles';
import MonthlyRevenueChart from '../components/charts/MonthlyRevenueChart';
import PetTypeChart from '../components/charts/PetTypeChart';
import { NoDataComponent } from '../components/NoDataComponent';
import CustomerChart from '../components/charts/CustomerChart';
import { useSelector } from 'react-redux';

export const Dashboard = () => {

    const columns = [
        {
            name: 'Customer Name',
            selector: (row) => row.customer_name,
            sortable: true,
            minWidth: '180px',
            cell: (row) => (
                <div className='d-flex align-items-center gap-2'>
                    <img src={require('../assets/images/dummy-user.jpeg')} alt="Client" className='img-fluid border border-white rounded-circle shadow' style={{ height: '35px', width: '35px' }} />
                    <div className='client-name fw-medium text-capitalize'>{row.customer_name}</div>
                </div>
            ),
        },
        {
            name: 'Assigned Lead',
            selector: (row) => row.assigned_lead,
            sortable: true,
            minWidth: '160px',
        },
        {
            name: 'Company Name',
            selector: (row) => row.company,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            minWidth: '120px',
        },
        {
            name: 'Time',
            selector: (row) => row.time,
        },
        {
            name: 'Actions',
            minWidth: '120px',
            cell: (row) => (
                <div className='action-wrapper d-flex flex-wrap gap-2'>
                    <Button variant='outline-warning' className='focus-ring focus-ring-warning rounded-circle' title='Edit'><i className='bi bi-pencil-square'></i></Button>
                    <Button variant='outline-danger' className='focus-ring focus-ring-danger rounded-circle' title='Delete'><i className='bi bi-trash3-fill'></i></Button>
                </div>
            ),
        },
    ];

    const data = [
        {
            id: '#001',
            customer_name: 'Deena Cooley',
            assigned_lead: 'Basil Frost',
            company: 'A2Z Infra Pvt. Ltd.',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#002',
            customer_name: 'Jerry Wilcox',
            assigned_lead: 'Vicki Walsh',
            company: 'Yashraj Industries Ltd',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#003',
            customer_name: 'Deena Cooley',
            assigned_lead: 'Basil Frost',
            company: 'Indiabulls Pvt. Ltd',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#004',
            customer_name: 'Jerry Wilcox',
            assigned_lead: 'Vicki Walsh',
            company: 'Ravi Import Export',
            date: '08/23/2024',
            time: '9:45 AM',
        },
        {
            id: '#005',
            customer_name: 'Deena Cooley',
            assigned_lead: 'Basil Frost',
            company: 'Maavi Enterprises Ltd',
            date: '05/23/2024',
            time: '9:30 AM',
        },
        {
            id: '#006',
            customer_name: 'Jerry Wilcox',
            assigned_lead: 'Vicki Walsh',
            company: 'Khanna Brothers Ltd',
            date: '08/23/2024',
            time: '9:45 AM',
        },
    ]

    return (
        <div className="homePage py-3">
            <div className="container-fluid">
                {/* Info Boxes Section */}
                <section className="info-card-sec mb-3">
                    <div className="row g-2 g-md-3">
                        <div className="col-xl-3 col-sm-6">
                            <div className="bg-primary bg-opacity-25 border-bottom border-4 border-primary rounded-3 pointer h-100 p-3 p-xxl-4">
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                    <div className="card-details">
                                        <div className="label-value text-dark fs-5 fw-bold lh-1 mb-2">$35000</div>
                                        <div className="label-title small fw-medium text-muted lh-sm">Total Sales</div>
                                    </div>
                                    <div className="card-icon bg-primary d-flex align-items-center justify-content-center rounded-3 p-2 text-white lh-1" style={{height:'44px',width:'44px'}}>
                                        <i className="bi bi-bar-chart-line-fill fs-5 lh-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="bg-warning bg-opacity-25 border-bottom border-4 border-warning rounded-3 pointer h-100 p-3 p-xxl-4">
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                    <div className="card-details">
                                        <div className="label-value text-dark fs-5 fw-bold lh-1 mb-2">125</div>
                                        <div className="label-title small fw-medium text-muted lh-sm">New Customers</div>
                                    </div>
                                    <div className="card-icon bg-warning d-flex align-items-center justify-content-center rounded-3 p-2 text-white lh-1" style={{height:'44px',width:'44px'}}>
                                        <i className="bi bi-person-circle fs-5 lh-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="bg-info bg-opacity-25 border-bottom border-4 border-info rounded-3 pointer h-100 p-3 p-xxl-4">
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                    <div className="card-details">
                                        <div className="label-value text-dark fs-5 fw-bold lh-1 mb-2">150</div>
                                        <div className="label-title small fw-medium text-muted lh-sm">Total Staff</div>
                                    </div>
                                    <div className="card-icon bg-info d-flex align-items-center justify-content-center rounded-3 p-2 text-white lh-1" style={{height:'44px',width:'44px'}}>
                                        <i className="bi bi-people-fill fs-5 lh-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="bg-success bg-opacity-25 border-bottom border-4 border-success rounded-3 pointer h-100 p-3 p-xxl-4">
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                    <div className="card-details">
                                        <div className="label-value text-dark fs-5 fw-bold lh-1 mb-2">200+</div>
                                        <div className="label-title small fw-medium text-muted lh-sm">Total Order</div>
                                    </div>
                                    <div className="card-icon bg-success d-flex align-items-center justify-content-center rounded-3 p-2 text-white lh-1" style={{height:'44px',width:'44px'}}>
                                        <i className="bi bi-cart-check-fill fs-5 lh-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Welcome Card Section */}
                <section className="Welcome-section rounded-3 mb-3 px-3 py-4 p-md-4" style={{ background: `url(${require("../assets/images/medical-banner.jpg")}) center no-repeat`, backgroundSize: 'cover' }}>
                    <div className="fs-18 fw-semibold text-warning lh-sm mb-2">Good Morning</div>
                    <div className="fs-3 fw-bold text-white lh-1 mb-1">Mr. Vasheem Ahmad</div>
                    <div className="text-light">Have a nice day at work</div>
                </section>

                {/* Charts Section */}
                <section className="charts-section mb-3">
                    <div className="row g-3">
                        <div className="col-xl-6">
                            <div className="chart-wrapper card border-0 h-100">
                                <div className="fs-18 fw-bold mb-2 p-3 pb-0">Monthly Registered Customer - </div>
                                <CustomerChart />
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="chart-wrapper card border-0 h-100">
                                <div className="fs-18 fw-bold mb-2 p-3 pb-0">Monthly Revenue - </div>
                                <MonthlyRevenueChart />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Booked Appointment section */}
                <section className="doctors-list-wrapper">
                    <div className="row g-3">
                        <div className="col-xl-7 col-xxl-8">
                            <div className="card border-0 h-100 p-3">
                                <h5 className="fs-18 fw-bold mb-3">New Customer List - </h5>
                                <div className='table-responsive table-custom-wrapper'>
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        // selectableRows
                                        // striped
                                        dense
                                        // pagination
                                        highlightOnHover
                                        responsive
                                        customStyles={dataTableCustomStyles}
                                        noDataComponent={<NoDataComponent />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-xxl-4">
                            <div className="card border-0 h-100 p-3">
                                <div className="fs-18 fw-bold mb-3">Yearly Sales Growth - </div>
                                <div className="text-center mx-auto" style={{maxWidth:'400px',width:'100%'}}>
                                    <PetTypeChart />
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    )
}
