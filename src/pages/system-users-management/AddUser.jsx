import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const AddUser = () => {
    return (
        <div className="addUser-page py-3">
            <div className="container-fluid">
                <div className="form-wrapper bg-white w-100 border rounded-4 px-3 px-md-4 px-xl-5 py-4">
                    <Form className="">
                        <div className="detail-wrapper mb-4">
                            <div className="doctor-img bg-primary bg-opacity-25 d-flex align-items-center justify-content-center border border-2 border-primary rounded-circle shadow position-relative mx-auto mb-4" style={{ height: '90px', width: '90px' }}>
                                <img src={require('../../assets/images/dummy-user.jpeg')} alt="doctor" className="img-fluid w-100 h-100 rounded-circle object-fit-cover" />
                                {/* <div className='doctor-name text-primary fs-2 fw-bold text-capitalize'>VA</div> */}
                                <Form.Group controlId="uploadProfile" className="upload-cover position-absolute end-0 bottom-0 z-1">
                                    <Form.Label className="bg-primary d-flex align-items-center justify-content-center rounded-circle pointer m-0" style={{ height: '28px', width: '28px' }}><i className="bi bi-pencil-fill text-white"></i></Form.Label>
                                    <Form.Control type="file" hidden required />
                                </Form.Group>
                            </div>
                            <div className="bg-primary bg-opacity-10 fs-6 fw-semibold mb-3 px-3 py-2 rounded"><i class="bi bi-mortarboard-fill me-1"></i> Add user info</div>
                            <Row className="g-3">
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="fullName">
                                        <Form.Label>Full Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Enter name" autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="doctorEmail">
                                        <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="contactNumber">
                                        <Form.Label>Contact Number<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="tel" placeholder="Contact number" autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="birthday">
                                        <Form.Label>Date of Birth<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="date" placeholder="Enter Birthday" autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="qualification">
                                        <Form.Label>Highest Qualification<span className="text-danger">*</span></Form.Label>
                                        <Form.Select aria-label="Default select example" required >
                                            <option value="" selected disabled>Select qualification..</option>
                                            <option value="0">MBBS</option>
                                            <option value="1">DPharm</option>
                                            <option value="2">BPharm</option>
                                            <option value="3">BSc Nutrition and Dietetics</option>
                                            <option value="4">Bachelor of Ayurveda, Medicine, and Surgery</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={6} md={4}>
                                    <Form.Group controlId="doctorAddress">
                                        <Form.Label>Address<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Enter full address" autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Label>Gender<span className="text-danger">*</span></Form.Label>
                                    <div className="checks-wrapper">
                                        <Form.Check inline label="Male" name="selectGender" type="radio" id="genderMale" required />
                                        <Form.Check inline label="Female" name="selectGender" type="radio" id="genderFemale" />
                                        <Form.Check inline label="Other" name="selectGender" type="radio" id="genderOther" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="uploadCertificateImage" className="upload-cover">
                                        <Form.Label>Upload Documents<span className="text-danger">*</span></Form.Label>
                                        <Form.Label className="w-100 bg-light border-secondary border-opacity-25 rounded text-center m-0 p-4 py-4 form-label" style={{ border: '1.5px dashed', minHeight: '140px' }}>
                                            <div className="icon text-muted display-4 lh-1 my-1"><i className="bi bi-images"></i></div>
                                            <div className="d-flex flex-wrap justify-content-center gap-1">
                                                <span className="text-primary"><i class="bi bi-upload me-1"></i></span>
                                                <span className="text-secondary">Drop your files here. or</span>
                                                <span className="text-primary">Browse</span>
                                            </div>
                                        </Form.Label>
                                        <Form.Control type="file" multiple hidden required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="doctorAddress">
                                        <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                                        <Form.Control as="textarea" rows={6} placeholder="Write your description here..." autoComplete='off' required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <div className="btn-wrapper text-center">
                            <Button type="submit" variant="primary" className="btn-custom">Submit</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
