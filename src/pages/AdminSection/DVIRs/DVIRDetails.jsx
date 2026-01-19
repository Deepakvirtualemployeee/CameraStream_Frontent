import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from "react-bootstrap";
import EditIcon from '../../../assets/images/icons/edit.svg';

export const DVIRDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="dvir-details-page py-3">
            <div className="container-fluid" style={{maxWidth: 'calc(1000px + 1.5rem)'}}>
                <div className="heading-wrapper d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div className="main-heading">DVIRs Information -</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            <i className="bi bi-trash3-fill"></i> Delete
                        </Button>
                        <Button variant="warning" onClick={() => window.print()}><i className="bi bi-printer"></i> Print</Button>
                        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => navigate('/dvirs-list/edit-dvir')}>
                            <img src={EditIcon} alt="Edit Icon" className="img-fluid" style={{ width: "1rem", height: "1rem", filter: "brightness(10)" }} />Edit DVIR
                        </Button>
                    </div>
                </div>

                <div className="content-wrapper">
                    <div className="d-flex flex-wrap align-items-center gap-2 lh-sm mb-3">
                        <span className="dvir-date fs-4 fw-bold text-dark">Thu, Jan 15, 2026 00:00 AM</span>
                        <span className="bg-primary bg-opacity-25 fs-12 fw-semibold rounded-2 text-primary text-uppercase p-2">ET</span>
                    </div>
                    <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
                        <Row className="g-3">
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">DRIVER</div>
                                    <div className="value text-capitalize text-dark">Sukhwinder Singh</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">LOCATION</div>
                                    <div className="value text-capitalize text-dark">Delhi, India</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">VEHICLE</div>
                                    <div className="value text-capitalize text-dark">03</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">DEFECTS STATUS</div>
                                    <div className="value text-capitalize text-dark">Defects Fixed</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">TRAILERS</div>
                                    <div className="value text-capitalize text-dark">Test Trailers</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">ODOMETER</div>
                                    <div className="value text-capitalize text-dark">25365</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">TRAILER DEFECTS</div>
                                    <div className="value text-capitalize text-dark">Horn</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">UNIT DEFECTS</div>
                                    <div className="value text-capitalize text-dark">Tail Lights</div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="info-card">
                                    <div className="label text-muted mb-1">Choose Safety Status</div>
                                    <div className="value text-capitalize text-dark">Safe to Driver</div>
                                </div>
                            </Col>
                        </Row>
                    </section>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button variant="success" className="d-flex align-items-center gap-2">Defect Fixed</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
