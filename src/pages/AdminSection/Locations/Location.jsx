import React from 'react';
import { Form } from 'react-bootstrap';
import "./Location.scss";
import SearchIcon from '../../../assets/images/icons/search.svg';

export const Location = () => {
    return (
        <div className="Location-page py-2">
            <div className="container-fluid px-2">
                <div className="location-wrapper d-flex flex-column flex-lg-row justify-content-between gap-2">
                    <div className="left-section d-flex flex-column gap-3">
                        <div className="filter-wrapper">
                            <div className="searchfield-wrapper mw-100 mb-3">
                                <Form.Control type="search" value={''} placeholder='Search by Vehicle Number or Driver Name' />
                                <img src={SearchIcon} alt="Search Icon" className="icon" />
                            </div>

                            <div className="d-flex gap-2">
                                <Form.Group className="w-50">
                                    <Form.Label className="fs-12 fw-medium">Filter By Truck Status</Form.Label>
                                    <Form.Select>
                                        <option value="1">All</option>
                                        <option value="2">Active</option>
                                        <option value="3">Deactive</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="w-50">
                                    <Form.Label className="fs-12 fw-medium">Filter By Truck Status</Form.Label>
                                    <Form.Select>
                                        <option value="1">All</option>
                                        <option value="2">Active</option>
                                        <option value="3">Deactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="locations-list d-flex flex-column border rounded h-100 overflow-auto">
                            {[...Array(8)].map((_, index, arr) => (
                                <div className={`info-card fs-12 ${index !== arr.length - 1 ? "border-bottom" : ""} p-3`}>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className='driver-status bg-secondary rounded' style={{ height: '12px', width: '12px' }}></span>
                                        <span className='driver-name text-body fw-bold'>ANDROID01</span>
                                        <span className={`driver-status fw-medium ${index === 0 ? "text-success" : index === 2 ? "text-warning" : index === 4 ? "text-primary" : index === 6 ? "text-danger" : "text-secondary"}`}>
                                            {index === 0 ? "Online" : index === 2 ? "Waiting" : index === 4 ? "Rest" : index === 6 ? "Sleep" : "Offline"}
                                        </span>
                                        <span className='link ms-auto'><i className="bi bi-link-45deg fs-16"></i></span>
                                    </div>
                                    <div className="location-name d-flex align-items-center gap-2 mb-1">
                                        <span><i class="bi bi-geo-alt"></i></span>
                                        <span className="text-truncate">101, Indira Gandhi International Airport, New Delhi, India</span>
                                        <span className="text-secondary text-opacity-75 fw-medium text-nowrap ms-auto">3 Hours</span>
                                    </div>
                                    <div className="location-name d-flex align-items-center gap-2">
                                        <span className={`driving-status ${index === 0 ? "bg-success" : index === 2 ? "bg-warning" : index === 4 ? "bg-primary" : index === 6 ? "bg-danger" : "bg-secondary"} fw-medium text-white text-uppercase rounded-1 lh-1 px-2 py-1`}>
                                            {index === 0 ? "SB" : index === 2 ? "YM" : index === 4 ? "AK" : index === 6 ? "MS" : "OFF"}
                                        </span>
                                        <span className="driver-name text-body fw-bold text-capitalize text-truncate">Tarannum Khan</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right-section d-flex flex-column">
                        <div className="location-map flex-fill">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28035.403603834988!2d77.07949470853555!3d28.556984445167238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b85fc2a2d89%3A0xbef376182c43ed9d!2sIndira%20Gandhi%20International%20Airport!5e0!3m2!1sen!2sin!4v1756132217905!5m2!1sen!2sin" width="100%" height="100%" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
