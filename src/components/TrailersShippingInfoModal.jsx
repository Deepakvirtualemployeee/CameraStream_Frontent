import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

/**
 * Trailers & Shipping Docs Modal
 * - Follows app theme (rounded modal, spacing, button styles)
 * - Inputs mirror the attached design: large inputs with helper text
 */
export const TrailersShippingInfoModal = ({
  show,
  title = "Trailers & Shipping Docs",
  initialTrailers = "",
  initialShippingDocs = "",
  submitting = false,
  onSubmit,
  onClose,
}) => {
  const [trailers, setTrailers] = useState(initialTrailers);
  const [shippingDocs, setShippingDocs] = useState(initialShippingDocs);

  useEffect(() => {
    if (show) {
      setTrailers(initialTrailers || "");
      setShippingDocs(initialShippingDocs || "");
    }
  }, [show, initialTrailers, initialShippingDocs]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        trailers,
        shippingDocs,
        // Also provide parsed arrays if the consumer prefers arrays
        trailersList: trailers?.trim() ? trailers.trim().split(/\s+/) : [],
        shippingDocsList: shippingDocs?.trim() ? shippingDocs.trim().split(/\s+/) : [],
      });
    }
  };

  return (
    <Modal show={show} centered onHide={onClose} contentClassName="border-0 rounded-4">
      <Modal.Body className="px-md-5 py-4 py-md-5">
        <div className="main-heading mb-3">{title}</div>

        <div className="d-flex flex-column gap-4">
          <div>
            <Form.Label className="fw-semibold">Trailers</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: val1 val2"
              value={trailers}
              onChange={(e) => setTrailers(e.target.value)}
            />
            <div className="text-muted fs-12 mt-2">Separated by space; example: val1 val2</div>
          </div>

          <div>
            <Form.Label className="fw-semibold">Shipping Docs</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: val1 val2"
              value={shippingDocs}
              onChange={(e) => setShippingDocs(e.target.value)}
            />
            <div className="text-muted fs-12 mt-2">Separated by space; example: val1 val2</div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
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


