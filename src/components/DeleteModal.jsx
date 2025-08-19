import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const DeleteModal = ({ show, handleClose, onConfirm }) => {
    return (
        <Modal show={show} centered onHide={handleClose} dialogClassName='' contentClassName='border-0 rounded-4' >
            <Modal.Body className="text-center px-md-5 py-5">
                <div className="icon-cover d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mx-auto mb-3" style={{ height: '50px', width: '50px' }}>
                    <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
                </div>
                <div className="fs-18 fw-semibold lh-sm mb-3 pb-1">Are you sure you want to delete this report?</div>
                <div className="btn-wrapper d-flex flex-wrap justify-content-center gap-2">
                    <Button variant="secondary" className="px-4 py-2" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Delete</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}