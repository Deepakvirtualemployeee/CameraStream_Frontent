import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import EditIcon from '../../../assets/images/icons/edit.svg'

export const CompanyInfo = () => {
    const navigate = useNavigate();

    return (
        <div className="CompanyInfo-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">ABC Trans Inc</div>
                    <Button variant='primary' className="d-flex align-items-center gap-2" onClick={() => navigate('/settings/company-info/edit-company-info')}>
                        <img src={EditIcon} alt="Edit Icon" className="img-fluid" style={{ width: '1rem', height: '1rem', filter: 'brightness(10)' }} /> Edit
                    </Button>
                </div>
                <div className='info-wrapper fs-16 border-bottom mb-4'>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <div className="title-name text-dark fw-medium">General Information</div>
                        </div>
                        <div className="col-md-8">
                            <div className="d-flex flex-column" style={{ gap: '12px' }}>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Company ID:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value text-black text-opacity-75 fw-semibold">Company ID</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Company Name:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">ABC Trans Inc</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">DOT Number:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">0000000</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Company Time Zone:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">EST</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Company Address</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">1 Cristina Ln, Oxford PA, 19363</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='info-wrapper fs-16 border-bottom mb-4'>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <div className="title-name text-dark fw-medium">Carrier Settings</div>
                        </div>
                        <div className="col-md-8">
                            <div className="d-flex flex-column" style={{ gap: '12px' }}>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Compliance Mode:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value text-black text-opacity-75 fw-semibold">ELD</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Vehicle Motion Threshold:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">5 mi/h</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Cycle Rule:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">USA 70 Hour / 8 Day</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Cargo Type:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Property</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Restart:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">34 Hour Restart</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Rest Break:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">30 Minute Break Required</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Short-Haul Exception:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Forbidden</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Split-Sleeper Birth:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Forbidden</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Personal Conveyance:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Forbidden</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Yard Move:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Forbidden</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Manual Drive:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">Forbidden</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='info-wrapper fs-16 border-bottom'>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <div className="title-name text-dark fw-medium">Terminal 1</div>
                        </div>
                        <div className="col-md-8">
                            <div className="d-flex flex-column" style={{ gap: '12px' }}>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Terminal Address:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value text-black text-opacity-75 fw-semibold">1 Cristina Ln, Oxford PA, 19363</div>
                                    </div>
                                </div>
                                <div className="row gx-3 gy-1">
                                    <div className="col-sm-5 col-xl-4">
                                        <div className="label fw-light text-gray">Time Zone:</div>
                                    </div>
                                    <div className="col-sm-7 col-xl-6">
                                        <div className="value fw-semibold text-black text-opacity-75">EST</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
