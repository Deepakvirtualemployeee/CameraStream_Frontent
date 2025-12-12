import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  createIFTAReport,
  getIFTAReportDetails,
  downloadIFTAReport,
} from "../../../store/actions/iftaReports";
import { getVehicles } from "../../../store/actions/vehicles";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const IFTAReports = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const location = useLocation();
  const { timeZoneId } = location.state || {};

  const tzId = timeZoneId || "America/Los_Angeles";

  const { loading, recordId, reportData } = useSelector((state) => state.ifta);
  const { vehicles } = useSelector((state) => state.vehicles);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [showResults, setShowResults] = useState(false);
  const [mileageData, setMileageData] = useState(null);

  // Fetch vehicles on load
  useEffect(() => {
    if (companyId) dispatch(getVehicles(companyId));
  }, [dispatch, companyId]);

  // Clear fields
  const handleClear = () => {
    setSelectedVehicle("");
    setDateRange([new Date(), new Date()]);
    setShowResults(false);
    setMileageData(null);
  };

  // Create & Fetch report
  const handleCalculate = async () => {
    if (!selectedVehicle) {
      toast.warn("Please select a vehicle first!");
      return;
    }

    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range!");
      return;
    }

    // convert to UTC for backend
    const startDateUTC = moment(startDate).utc().toDate();
    const endDateUTC = moment(endDate).utc().toDate();

    try {
      const createdReport = await dispatch(
        createIFTAReport(selectedVehicle, startDateUTC, endDateUTC)
      );
      const reportId = createdReport;

      if (reportId) {
        await dispatch(getIFTAReportDetails(reportId));
        toast.success("Report generated successfully!");
      }
    } catch (error) {
      toast.error("Error creating IFTA report!");
      console.error(error);
    }
  };

  // Reset data when vehicle changes
  useEffect(() => {
    setMileageData(null);
    setShowResults(false);
  }, [selectedVehicle]);

  // When report data updates, prepare formatted table
  useEffect(() => {
    if (reportData) {
      const formatted = {
        totalDistance: reportData.totalMiles,
        states: reportData.statesMilesData.map((s) => ({
          name: s.stateName,
          code: s.state,
          distance: s.distance,
        })),
      };
      setMileageData(formatted);
      setShowResults(true);
    }
  }, [reportData]);

  // Download report
  const handleDownload = async () => {
    if (!recordId) {
      toast.info("Please generate a report first!");
      return;
    }
    await dispatch(downloadIFTAReport(recordId));
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="ManualIFTA-page py-3">
      <div className="container-fluid">
        <div
          className="bg-white rounded-4 shadow-sm p-4"
          style={{ maxWidth: "950px" }}
        >
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
            <h5 className="fw-bold mb-2 mb-md-0 text-body">Calculate Mileage</h5>
            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-secondary" onClick={handleClear}>
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate Mileage"}
              </Button>
            </div>
          </div>

          {/* Vehicle + Date Range */}
          <div className="d-flex flex-wrap align-items-end justify-content-start gap-3 mt-3">
            <div style={{ flex: "1 1 250px" }}>
              <Form.Label className="fw-semibold">Vehicle</Form.Label>
              <Form.Select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="">Select Vehicle</option>
                {vehicles?.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleNumber || vehicle.licensePlate || "Vehicle"}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form.Label className="fw-semibold mb-2">Choose Date Range</Form.Label>
              <DatePicker
                selectsRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update) => {
                  if (!update) return;
                  const [start, end] = update;

                  // Convert based on company timezone
                  const startInTZ = start
                    ? moment
                        .tz(moment(start).format("YYYY-MM-DD"), tzId)
                        .toDate()
                    : null;
                  const endInTZ = end
                    ? moment
                        .tz(moment(end).format("YYYY-MM-DD"), tzId)
                        .toDate()
                    : null;

                  setDateRange([startInTZ, endInTZ]);
                }}
                isClearable={true}
                className="form-control"
                dateFormat="MMM dd, yyyy"
                placeholderText="Select Date Range"
              />
            </div>
          </div>

          {/* Results */}
          {loading && !reportData ? (
            <div>Loading report...</div>
          ) : (
            showResults &&
            mileageData && (
              <div className="mt-4 border-top pt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Total Distance: </strong>
                    <span className="text-primary fw-bold">
                      {mileageData.totalDistance.toFixed(3)} mi
                    </span>
                  </div>
                  <Button variant="primary" onClick={handleDownload}>
                    <i className="bi bi-download"></i> Download Report
                  </Button>
                </div>

                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>STATE</th>
                      <th>STATE CODE</th>
                      <th>DISTANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mileageData.states.map((st, idx) => (
                      <tr key={idx}>
                        <td>{st.name}</td>
                        <td>{st.code}</td>
                        <td>{st.distance.toFixed(3)} mi</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default IFTAReports;
