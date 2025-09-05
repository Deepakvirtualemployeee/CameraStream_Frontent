import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyInfo } from "../../../store/actions/companies";
import EditIcon from "../../../assets/images/icons/edit.svg";

export const CompanyInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // company id from URL

  const { company, loading, error } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(getCompanyInfo(id));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  if (!company) {
    return <div className="text-center py-5">No company info available</div>;
  }

  const carrierSettings = [
    { label: "Compliance Mode", value: company.complianceMode || "-" },
    { label: "Vehicle Motion Threshold", value: company.vehicleMotionThreshold || 0 },
    { label: "Cycle Rule", value: company.hosRules || "-" },
    { label: "Cargo Type", value: company.cargoType || "-" },
    { label: "Restart", value: company.restartHours || "-" },
    { label: "Rest Break", value: company.restBreak || "-" },
    { label: "Short-Haul Exception", value: company.allowShortHaul === true ? "Allowed" : "Forbidden" },
    { label: "Split-Sleeper Birth", value: company.allowSplitSleeper === true ? "Allowed" : "Forbidden" },
    { label: "Personal Conveyance", value: company.allowPersonalConveyance === true ? "Allowed" : "Forbidden" },
    { label: "Yard Move", value: company.allowYardMove === true ? "Allowed" : "Forbidden" },
    { label: "Manual Drive", value: company.allowManualDriver === true ? "Allowed" : "Forbidden" },
  ];

  return (
    <div className="CompanyInfo-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        {/* Header */}
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">{company.companyName || "-"}</div>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => navigate(`/settings/company-info/edit-company-info/${company._id}`, {
                state: { companyId: id },
            })}
          >
            <img
              src={EditIcon}
              alt="Edit Icon"
              className="img-fluid"
              style={{ width: "1rem", height: "1rem", filter: "brightness(10)" }}
            />{" "}
            Edit
          </Button>
        </div>

        {/* General Info */}
        <div className="info-wrapper fs-16 border-bottom mb-4">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="title-name text-dark fw-medium">General Information</div>
            </div>
            <div className="col-md-8">
              <div className="d-flex flex-column" style={{ gap: "12px" }}>
                {[
                  { label: "Company ID", value: company._id },
                  { label: "Company Name", value: company.companyName },
                  { label: "DOT Number", value: company.dotNumber },
                  { label: "Company Time Zone", value: company.timeZoneId },
                  { label: "Company Address", value: company.address },
                ].map((item, i) => (
                  <div className="row gx-3 gy-1" key={i}>
                    <div className="col-sm-5 col-xl-4">
                      <div className="label fw-light text-gray">{item.label}:</div>
                    </div>
                    <div className="col-sm-7 col-xl-6">
                      <div className="value fw-semibold text-black text-opacity-75">
                        {item.value || "-"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Settings */}
        <div className="info-wrapper fs-16 border-bottom mb-4">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="title-name text-dark fw-medium">Carrier Settings</div>
            </div>
            <div className="col-md-8">
              <div className="d-flex flex-column" style={{ gap: "12px" }}>
                {carrierSettings.map((item, i) => (
                  <div className="row gx-3 gy-1" key={i}>
                    <div className="col-sm-5 col-xl-4">
                      <div className="label fw-light text-gray">{item.label}:</div>
                    </div>
                    <div className="col-sm-7 col-xl-6">
                      <div className="value fw-semibold text-black text-opacity-75">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terminals */}
        {company.terminals?.length > 0 &&
          company.terminals.map((terminal, index) => (
            <div className="info-wrapper fs-16 border-bottom mb-4" key={index}>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <div className="title-name text-dark fw-medium">Terminal {index + 1}</div>
                </div>
                <div className="col-md-8">
                  <div className="d-flex flex-column" style={{ gap: "12px" }}>
                    <div className="row gx-3 gy-1">
                      <div className="col-sm-5 col-xl-4">
                        <div className="label fw-light text-gray">Terminal Address:</div>
                      </div>
                      <div className="col-sm-7 col-xl-6">
                        <div className="value fw-semibold text-black text-opacity-75">
                          {terminal.address || "-"}
                        </div>
                      </div>
                    </div>
                    <div className="row gx-3 gy-1">
                      <div className="col-sm-5 col-xl-4">
                        <div className="label fw-light text-gray">Time Zone:</div>
                      </div>
                      <div className="col-sm-7 col-xl-6">
                        <div className="value fw-semibold text-black text-opacity-75">
                          {terminal.timeZone || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
