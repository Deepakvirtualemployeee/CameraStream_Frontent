import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export const AddGroup = () => {
    const [formData, setFormData] = useState({
        name: '',
        accessToAllCompanies: false,
        selectedUsers: [],
        selectedCompanies: [],
    });

    const usersOptions = [
        { value: 'John Doe', label: 'John Doe' },
        { value: 'Ray Johnson', label: 'Ray Johnson' },
        { value: 'Michael Jackson', label: 'Michael Jackson' },
    ];

    const companiesOptions = [
        { value: 'ABC Trans Inc', label: 'ABC Trans Inc' },
        { value: 'BC Trans Inc', label: 'BC Trans Inc' },
        { value: 'C Trans Inc', label: 'C Trans Inc' },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUserSelect = (selected) => {
        setFormData(prev => ({
            ...prev,
            selectedUsers: selected
        }));
    };

    const handleCompanySelect = (selected) => {
        setFormData(prev => ({
            ...prev,
            selectedCompanies: selected
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Group Data:', formData);
        alert("Group added successfully!");
    };

    const handleCancel = () => {
        if (window.confirm("Clear form?")) {
            setFormData({
                name: '',
                accessToAllCompanies: false,
                selectedUsers: [],
                selectedCompanies: [],
            });
        }
    };

    return (
        <div className="addGroup-page py-3">
            <div className="container-fluid" style={{ maxWidth: 'calc(1000px + 1.5rem)' }}>
                <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                    <div className="main-heading">Add New Group</div>
                    <div className="btn-wrapper d-flex flex-wrap gap-2">
                        <Button variant='white' className="bg-white border-gray" onClick={handleCancel}>Cancel</Button>
                        <Button variant='primary' type="submit" form="add-group-form">
                            <i className="bi bi-plus-lg fs-16"></i> Add Group
                        </Button>
                    </div>
                </div>

                <div className="form-wrapper bg-white w-100 border rounded-4 px-3 px-md-4 py-4">
                    <Form id="add-group-form" onSubmit={handleSubmit}>
                        <Row className="g-3 g-xl-4">
                            <Col xs={12}>
                                <Form.Group controlId="GroupName">
                                    <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter group name"
                                        autoComplete='off'
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="SystemUsers">
                                    <Form.Label>System Users</Form.Label>
                                    <Select
                                        className='custom-select'
                                        classNamePrefix='custom-select'
                                        components={animatedComponents}
                                        isMulti
                                        options={usersOptions}
                                        placeholder="Select Users"
                                        value={formData.selectedUsers}
                                        onChange={handleUserSelect}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="AccessToCompaniesCheck">
                                    <Form.Label>Access to Companies<span className="text-danger">*</span></Form.Label>
                                    <div className="checks-wrapper">
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            name="accessToAllCompanies"
                                            checked={formData.accessToAllCompanies}
                                            onChange={handleChange}
                                            className="fs-16 mb-1"
                                            label={<div className="fs-6 text-dark text-opacity-75">Allow Access to ALL Companies</div>}
                                        />
                                        <div className="text-gray fw-normal">
                                            Check the box to allow all users access to ALL companies. System will discard the “Select Companies” form field below.
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>

                            {!formData.accessToAllCompanies && (
                                <Col xs={12}>
                                    <Form.Group controlId="SelectCompanies">
                                        <Form.Label>Select Companies</Form.Label>
                                        <Select
                                            className='custom-select'
                                            classNamePrefix='custom-select'
                                            components={animatedComponents}
                                            isMulti
                                            options={companiesOptions}
                                            placeholder="Select Companies"
                                            value={formData.selectedCompanies}
                                            onChange={handleCompanySelect}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
};
