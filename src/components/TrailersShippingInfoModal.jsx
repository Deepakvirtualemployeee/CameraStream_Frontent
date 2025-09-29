import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

// Minimal, theme-aligned modal for Trailers & Shipping Docs per uploaded design
// Controlled by parent via show/onClose/onSubmit and string values for both fields
export const TrailersShippingInfoModal = ({
  show,
  onClose,
  onSubmit,
  trailers = "",
  shippingDocs = "",
  submitting = false,
}) => {
  return (
    <Modal show={show} centered onHide={onClose} contentClassName="border-0 rounded-4">
      <Modal.Body className="px-md-5 py-4 py-md-5">
        <div className="main-heading mb-3">Trailers & Shipping Docs</div>

        <div className="d-flex flex-column gap-4">
          <div>
            <Form.Label className="fw-semibold">Trailers</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: val1 val2"
              value={trailers}
            />
            <div className="text-muted fs-12 mt-2">Separated by space; example: val1 val2</div>
          </div>

          <div>
            <Form.Label className="fw-semibold">Shipping Docs</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: val1 val2"
              value={shippingDocs}
            />
            <div className="text-muted fs-12 mt-2">Separated by space; example: val1 val2</div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Close</Button>
          <Button variant="primary" onClick={onSubmit} disabled={submitting}>
            {submitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : null}
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TrailersShippingInfoModal;


