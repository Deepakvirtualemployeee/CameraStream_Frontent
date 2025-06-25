import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const UserDetails = () => {
    const location = useLocation();
    const detail = location.state;

    return (
        <div className="userDetails-page py-3">
            <div className="container-fluid">
                <div className="doctor-details-wrapper">
                    <div className="row g-3 g-xl-4">
                        <div className="col-md-5 col-xl-4 col-xxl-3">
                            <div className="left-section bg-white rounded-3 px-3 py-4">
                                <div className="main-info text-center pb-2">
                                    <div className="img-cover position-relative d-flex align-items-center justify-content-center bg-primary bg-opacity-25 border border-2 border-primary rounded-circle shadow mx-auto mb-2" style={{ height: '100px', width: '100px' }}>
                                        <img src={require('../../assets/images/dummy-user.jpeg')} alt="Doctor" className="img-fluid h-100 w-100 rounded-circle object-fit-cover" />
                                        {/* <div className="doctor-sortname text-primary fs-2 fw-bold text-uppercase">VA</div> */}
                                        <span title='User Active' className='current-status border border-light rounded-circle position-absolute' style={{height:'15px',width:'15px',backgroundColor:'#01b501',bottom:'5px',right:'7px'}}></span>
                                    </div>
                                    <div className="doctor-name fs-18 fw-semibold text-capitalize">{detail.user_name}</div>
                                    <div className="doctor-subtitle fs-14 text-muted text-capitalize">Neurologist</div>
                                    <div className="social-wrapper mt-2"> 
                                        <ul className="list-group-horizontal d-flex flex-wrap justify-content-center gap-2 m-0 p-0">
                                            <li className="list-group-item">
                                                <Link to={'#'} title="Facebook">
                                                    <img src={require('../../assets/images/facebook.png')} alt="Facebook" className="img-fluid" style={{height:'30px',width:'30px'}} />
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to={'#'} title="Twitter">
                                                    <img src={require('../../assets/images/twitter.png')} alt="Twitter" className="img-fluid rounded" style={{height:'30px',width:'30px'}} />
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to={'#'} title="Instagram">
                                                    <img src={require('../../assets/images/instagram.png')} alt="Instagram" className="img-fluid" style={{height:'30px',width:'30px'}} />
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to={'#'} title="Snapchat">
                                                    <img src={require('../../assets/images/snapchat.png')} alt="Snapchat" className="img-fluid" style={{height:'30px',width:'30px'}} />
                                                </Link>
                                            </li>
                                            <li className="list-group-item">
                                                <Link to={'#'} title="Youtube">
                                                    <img src={require('../../assets/images/youtube.png')} alt="Youtube" className="img-fluid" style={{height:'30px',width:'30px'}} />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <hr className="border-secondary border-opacity-50" />

                                <div className="doctor-info fs-14">
                                    <div className="heading fs-6 fw-bold text-capitalize mb-3">Basic Details -</div>
                                    <div className="row row-cols-2 g-3">
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Joining Date</div>
                                            <div className="text-body text-capitalize">07 July 2022</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Birthday</div>
                                            <div className="text-body text-capitalize">18 Feb 1990</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Gender</div>
                                            <div className="text-body text-capitalize">Male</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Company Since</div>
                                            <div className="text-body text-capitalize">2001</div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-secondary border-opacity-50" />

                                <div className="contact-info fs-14">
                                    <div className="heading fs-6 fw-bold text-capitalize mb-3">Contact Info -</div>
                                    <div className="doctor-email d-flex gap-2 text-muted mb-2">
                                        <i class="bi bi-envelope-fill fs-6"></i>
                                        <span className="text-lowercase text-truncate">{detail.user_email}</span>
                                    </div>
                                    <div className="doctor-contact d-flex gap-2 text-muted mb-2">
                                        <i class="bi bi-telephone-fill fs-6"></i>
                                        <span>+91 9375700546</span>
                                    </div>
                                    {/* <div className="doctor-address d-flex gap-2 text-muted mb-2">
                                        <i class="bi bi-geo-alt-fill fs-6"></i>
                                        <span>2239 Hog Camp Road Schaumburg</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 col-xl-8 col-xxl-9">
                            <div className="right-section bg-white rounded-3 px-3 py-4">
                                <div className="main-info">
                                    <div className="heading fs-6 fw-bold text-capitalize mb-2">All Details -</div>
                                    <div className="row row-cols-2 row-cols-xl-3 g-3">
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Full Name</div>
                                            <div className="text-body text-capitalize">{detail.user_name}</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Email ID</div>
                                            <div className="text-body text-lowercase">{detail.user_email}</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">User Role</div>
                                            <div className="text-body text-capitalize">{detail.user_role}</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Contact Number</div>
                                            <div className="text-body text-capitalize">+91 9835656542</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Highest Qualification</div>
                                            <div className="text-body text-capitalize">M.B.B.S</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Employee ID</div>
                                            <div className="text-body text-capitalize">{detail.id}</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Age</div>
                                            <div className="text-body text-capitalize">{detail.age} Years</div>
                                        </div>
                                        <div className="info-box fs-14 fw-medium">
                                            <div className="text-secondary">Successful Treatment</div>
                                            <div className="text-body text-capitalize">54</div>
                                        </div>
                                        <div className="col-12 col-xl-12 info-box fs-14 fw-medium">
                                            <div className="text-secondary">Address</div>
                                            <div className="text-body text-capitalize">D-502, Rizvi Nagar, Junction of Milan Subway & SV Road, Santa Cruz (W),  Mumbai, Maharashtra 400054, India</div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-secondary border-opacity-50" />
                                <div className="document-img-section">
                                    <div className="client-name fs-6 fw-bold mb-2">All certificates image:</div>
                                    <div className="item-wrapper d-flex flex-nowrap gap-3 overflow-auto">
                                        <div className="img-wrapper">
                                            <img src={require ('../../assets/images/document-img.jpg')} alt="Document" className="img-fluid border border-secondary object-fit-cover rounded" style={{height:'100px',width:'100px',minWidth:'100px'}} />
                                        </div>
                                        <div className="img-wrapper">
                                            <img src={require ('../../assets/images/document-img.jpg')} alt="Document" className="img-fluid border border-secondary object-fit-cover rounded" style={{height:'100px',width:'100px',minWidth:'100px'}} />
                                        </div>
                                        <div className="img-wrapper">
                                            <img src={require ('../../assets/images/document-img.jpg')} alt="Document" className="img-fluid border border-secondary object-fit-cover rounded" style={{height:'100px',width:'100px',minWidth:'100px'}} />
                                        </div>
                                        <div className="img-wrapper">
                                            <img src={require ('../../assets/images/document-img.jpg')} alt="Document" className="img-fluid border border-secondary object-fit-cover rounded" style={{height:'100px',width:'100px',minWidth:'100px'}} />
                                        </div>
                                        <div className="img-wrapper">
                                            <img src={require ('../../assets/images/document-img.jpg')} alt="Document" className="img-fluid border border-secondary object-fit-cover rounded" style={{height:'100px',width:'100px',minWidth:'100px'}} />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-secondary border-opacity-50" />

                                <div className="description mt-3">
                                    <div className="label fs-6 fw-bold text-capitalize mb-1">Description:</div>
                                    <div className="description text-muted small">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
