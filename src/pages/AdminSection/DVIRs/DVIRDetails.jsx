import React, { useEffect , useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/images/icons/edit.svg";
import { getDvirById, updateDvir } from "../../../store/actions";

export const DVIRDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: dvirId, companyId } = useParams();
  const { current: dvir, loading } = useSelector((state) => state.dvir || {});
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    if (dvirId) {
      dispatch(getDvirById(dvirId));
    }
  }, [dvirId, dispatch]);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  const renderDefects = (list, variant) => {
    if (!list || list.length === 0) return <span className="text-muted">None</span>;
    return (
      <div className="d-flex flex-wrap gap-2">
        {list.map((d, idx) => {
          const label =
            typeof d === "string" ? d : d?.name || d?.label || d?.id || "";
          if (!label) return null;
          return (
            <Badge
              key={`${label}-${idx}`}
              bg={variant}
              className="fs-12 fw-semibold bg-opacity-10 text-capitalize"
              pill
            >
              {label}
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dvir-details-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="main-heading">DVIRs Information</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => navigate(-1)} disabled={loading}>
              <i className="bi bi-trash3-fill"></i> Delete
            </Button>
            <Button variant="warning" onClick={() => window.print()} disabled={loading}>
              <i className="bi bi-printer"></i> Print
            </Button>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={() => navigate(`/dvirs-list/edit-dvir/${companyId || ""}/${dvirId || ""}`)}
              disabled={loading}
            >
              <img
                src={EditIcon}
                alt="Edit Icon"
                className="img-fluid"
                style={{ width: "1rem", height: "1rem", filter: "brightness(10)" }}
              />
              Edit DVIR
            </Button>
          </div>
        </div>

        {loading && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <Spinner size="sm" animation="border" /> <span>Loading...</span>
          </div>
        )}

        {dvir && (
          <div className="content-wrapper">
            <div className="d-flex flex-wrap align-items-center gap-2 lh-sm mb-3">
              <span className="dvir-date fs-4 fw-bold text-dark">
                {formatDate(dvir.dateTime)}
              </span>
              {/* <span className="bg-primary bg-opacity-25 fs-12 fw-semibold rounded-2 text-primary text-uppercase p-2">
                {dvir.timeZone || "Local"}
              </span> */}
            </div>
            <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3">
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">DRIVER</div>
                    <div className="value text-capitalize text-dark">
                      {dvir.driverId
                        ? `${dvir.driverId.firstName || ""} ${dvir.driverId.lastName || ""}`.trim()
                        : ""}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">LOCATION</div>
                    <div className="value text-capitalize text-dark">{dvir.location || ""}</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">VEHICLE</div>
                    <div className="value text-capitalize text-dark">
                      {dvir.vehicleId?.vehicleNumber || ""}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">DEFECTS STATUS</div>
                    <div className="value text-capitalize text-dark">{dvir.status || ""}</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">TRAILERS</div>
                    <div className="value text-capitalize text-dark">{dvir.trailers || ""}</div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">ODOMETER</div>
                    <div className="value text-capitalize text-dark">
                      {dvir.odometer != null ? dvir.odometer : ""}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">TRAILER DEFECTS</div>
                    <div className="value text-capitalize text-dark">
                      {renderDefects(dvir.trailerDefects, "warning text-warning")}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">UNIT DEFECTS</div>
                    <div className="value text-capitalize text-dark">
                      {renderDefects(dvir.unitDefects, "theme6 text-theme6")}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-card">
                    <div className="label text-muted mb-1">SAFETY STATUS</div>
                    <div className="value text-capitalize text-dark">
                      {dvir.safetyStatus || ""}
                    </div>
                  </div>
                </Col>
                {dvir.notes ? (
                  <Col sm={12}>
                    <div className="info-card">
                      <div className="label text-muted mb-1">NOTES</div>
                      <div className="value text-capitalize text-dark">{dvir.notes}</div>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </section>
            <div className="btn-wrapper d-flex flex-wrap gap-2">
              <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              {dvir.status === "Has Defects" && (
                <Button
                  variant="success"
                  className="d-flex align-items-center gap-2"
                  disabled={loading || fixing}
                  onClick={async () => {
                    try {
                      setFixing(true);
                      await dispatch(updateDvir(dvirId, { status: "Defects Fixed" }));
                      dispatch(getDvirById(dvirId));
                    } catch (err) {
                      console.warn("Mark defects fixed failed", err?.response?.data?.message || err.message);
                    } finally {
                      setFixing(false);
                    }
                  }}
                >
                  {fixing ? <Spinner animation="border" size="sm" /> : "Defects Fixed"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
