import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ConfirmModal = ({ show, handleClose, onConfirm, title, confirmText, confirmVariant, iconClass }) => {
  return (
    <Modal show={show} centered onHide={handleClose} contentClassName="border-0 rounded-4">
      <Modal.Body className="text-center px-md-5 py-5">
        <div
          className="icon-cover d-flex align-items-center justify-content-center bg-opacity-10 rounded-circle mx-auto mb-3"
          style={{ height: "50px", width: "50px" }}
        >
          <i className={`bi ${iconClass} fs-4 text-${confirmVariant}`}></i>
        </div>
        <div className="fs-18 fw-semibold lh-sm mb-3 pb-1">{title}</div>
        <div className="btn-wrapper d-flex flex-wrap justify-content-center gap-2">
          <Button variant="secondary" className="px-4 py-2" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
