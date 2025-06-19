import React from 'react';
import { Form, Modal, Button, Row, Col } from 'react-bootstrap';

export const NewSubscription = ({ show, onHide }) => {
    return (
        <Modal show={show} size='xl' centered onHide={onHide} dialogClassName='' contentClassName='border-0 rounded'>
            <Modal.Header closeButton closeVariant="white" className="bg-primary rounded-top">
                <Modal.Title className="text-white fs-6 fw-semibold lh-1"><i class="bi bi-journal-text"></i> Add New Company</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-md-5 py-4 mb-3">
                <Form>
                    <div className="clientDetail-wrapper mb-4">
                        <div className="client-img bg-primary bg-opacity-25 d-flex align-items-center justify-content-center border border-2 border-primary rounded-circle shadow position-relative mx-auto mb-4" style={{ height: '90px', width: '90px' }}>
                            <img src={require('../../assets/images/avatar.png')} alt="Patients" className="img-fluid w-100 h-100 rounded-circle object-fit-cover" />
                            {/* <div className='client-name text-primary fs-2 fw-bold text-capitalize'>VA</div> */}
                            <Form.Group controlId="uploadProfile" className="upload-cover position-absolute end-0 bottom-0 z-1">
                                <Form.Label className="bg-primary d-flex align-items-center justify-content-center rounded-circle pointer m-0" style={{ height: '28px', width: '28px' }}><i className="bi bi-pencil-fill text-white"></i></Form.Label>
                                <Form.Control type="file" hidden required />
                            </Form.Group>
                        </div>
                        <div className="text-black fs-18 fw-bold mb-2">Patient Details - </div>
                        <Row className="g-3">
                            <Col sm={6}>
                                <Form.Group controlId="fullName">
                                    <Form.Label>Full Name<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="patientEmail">
                                    <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="contactNumber">
                                    <Form.Label>Contact Number<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="tel" placeholder="Contact number" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="birthday">
                                    <Form.Label>Date of Birth<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="date" placeholder="Enter Birthday" autoComplete='off' required />
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
                            <Col xs={12}>
                                <Form.Group controlId="clientAddress">
                                    <Form.Label>Address<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter full address" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <div className="petDetail-wrapper mb-4">
                        <div className="text-black fs-18 fw-bold mb-2">Appointment Details - </div>
                        <Row className="g-3">
                            <Col sm={6}>
                                <Form.Group controlId="consultingDoctor">
                                    <Form.Label>Consulting Doctor<span className="text-danger">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" required >
                                        <option value="" selected disabled>Select here..</option>
                                        <option value="Basil Frost">Basil Frost</option>
                                        <option value="Vicki Walsh">Vicki Walsh</option>
                                        <option value="Jerry Wilcox">Jerry Wilcox</option>
                                        <option value="Deena Cooley">Deena Cooley</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="petTreatment">
                                    <Form.Label>Treatment<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter treatment" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="consultingDoctor">
                                    <Form.Label>Appointment Date<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="date" placeholder="Enter pet age" autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="consultingDoctor">
                                    <Form.Label>Appointment Time<span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="time" placeholder='' autoComplete='off' required />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group controlId="clientAddress">
                                    <Form.Label>Notes<span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="textarea" rows={5} placeholder="Describe your pet treatment here in brief..." autoComplete='off' required />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    <div className="btn-wrapper d-flex flex-wrap justify-content-center gap-2">
                        <Button variant="danger" className="btn-custom" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" className="btn-custom" onClick={onHide}>Submit</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
