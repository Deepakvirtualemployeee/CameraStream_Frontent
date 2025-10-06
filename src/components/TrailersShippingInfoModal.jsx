import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { trailerShippingDocs } from "../store/actions/driverHOS";
import { useNavigate, useParams } from "react-router-dom";

export const TrailersShippingInfoModal = ({ show, onClose, initialData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId, driverId } = useParams();
  console.log("initialData", initialData);
  // Redux state
  const { loading } = useSelector((state) => state.trailersShippingDocs || {});

  // Local state for form inputs
  const [trailers, setTrailers] = useState("");
  const [shippingDocs, setShippingDocs] = useState("");

  // Prefill if initialData is provided (e.g., when editing)
  // useEffect(() => {
  //   if (initialData?.trailers) setTrailers(initialData.trailers.join(" "));
  //   if (initialData?.shippingDocuments) setShippingDocs(initialData.shippingDocuments.join(" "));
  // }, [initialData]);

  useEffect(() => {
    let data = initialData;
  
    // If it's an array, take the first item
    if (Array.isArray(initialData) && initialData.length > 0) {
      data = initialData[0];
    }
  
    if (data?.trailers?.length) {
      setTrailers(data.trailers.join(" "));
    }
  
    if (data?.shippingDocuments?.length) {
      setShippingDocs(data.shippingDocuments.join(" "));
    }
  }, [initialData]);  

  // Handle submit
  const handleSubmit = async () => {
    const eventData = {
      logDate: initialData[0].logDate,
      trailers: trailers
        .split(" ")
        .map((t) => t.trim())
        .filter(Boolean),
      shippingDocs: shippingDocs
        .split(" ")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    console.log("eventData:", eventData);

    const success = await dispatch(trailerShippingDocs(companyId, driverId, eventData, navigate));
    if (success) {
      onClose();
      setTrailers("");
      setShippingDocs("");
    }
  };

  return (
    <Modal show={show} centered onHide={onClose} contentClassName="border-0 rounded-4">
      <Modal.Body className="px-md-5 py-4 py-md-5">
        <div className="main-heading mb-3">Trailers & Shipping Docs</div>

        <div className="d-flex flex-column gap-4">
          <div>
            <Form.Label className="fw-semibold">Trailers</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: TR-123 TR-457 TY-780"
              value={trailers}
              onChange={(e) => setTrailers(e.target.value)}
            />
            <div className="text-muted fs-12 mt-2">
              Separated by space; example: TR-123 TR-457 TY-780
            </div>
          </div>

          <div>
            <Form.Label className="fw-semibold">Shipping Docs</Form.Label>
            <Form.Control
              type="text"
              placeholder="Separated by space; example: DOC-789 DOC-098"
              value={shippingDocs}
              onChange={(e) => setShippingDocs(e.target.value)}
            />
            <div className="text-muted fs-12 mt-2">
              Separated by space; example: DOC-789 DOC-098
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
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
