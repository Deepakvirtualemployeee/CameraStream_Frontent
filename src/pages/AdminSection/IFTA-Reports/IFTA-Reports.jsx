import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, Table } from "react-bootstrap";

export const IFTAReports = () => {
  const [selectedTab, setSelectedTab] = useState("driverLog");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [eventType, setEventType] = useState("Active");
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [showResults, setShowResults] = useState(false);
  const [mileageData, setMileageData] = useState(null);

 
  const handleClear = () => {
    setSelectedDriver("");
    setEventType("Active");
    setDateRange([new Date(), new Date()]);
    setShowResults(false);  
    setMileageData(null);
  };

 
  const handleCalculate = () => {
 
    const dummyData = {
      totalDistance: 235.171,
      states: [
        { name: "Florida", code: "FL", distance: 235.171 },
      ],
    };

    setMileageData(dummyData);
    setShowResults(true);
  };

 
  const handleDownload = () => {
    alert("Report Downloaded Successfully!");
  };

  return (
    <div className="ManualIFTA-page py-3">
      <div className="container-fluid">
        <div
          className="bg-white rounded-4 shadow-sm p-4"
          style={{ maxWidth: "950px" }}
        >
      
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
            <h5 className="fw-bold mb-2 mb-md-0 text-body">Calculate Mileage</h5>

            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-secondary" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleCalculate}>
                Calculate Mileage
              </Button>
            </div>
          </div>

      
          <div className="d-flex align-items-center gap-3 mb-4">
            <Button
              variant={
                selectedTab === "driverLog" ? "primary" : "outline-primary"
              }
              className={`fw-semibold px-5 py-2 ${
                selectedTab === "driverLog" ? "" : "bg-white border-1"
              }`}
              style={{
                borderRadius: "8px",
                minWidth: "400px",
              }}
              onClick={() => setSelectedTab("driverLog")}
            >
              Driver Log
            </Button>

          
          </div>
 
          <div className="d-flex flex-wrap align-items-end justify-content-start gap-3 mt-3">
      
            <div style={{ flex: "1 1 250px" }}>
              <Form.Label className="fw-semibold">Driver</Form.Label>
              <Form.Select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Select Driver</option>
                <option value="Charles Wilford Zenglen">
                  Charles Wilford Zenglen
                </option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </Form.Select>
            </div>

        
            <div
              style={{
                flex: "1 1 200px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Form.Label className="fw-semibold mb-2">Choose Date</Form.Label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                className="form-control"
                dateFormat="MMM dd, yyyy"
              />
            </div>

          
          </div>

        
          {showResults && mileageData && (
            <div className="mt-4 border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Total Distance: </strong>
                  <span className="text-primary fw-bold">
                    {mileageData.totalDistance.toFixed(3)} mi
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-1"
                  onClick={handleDownload}
                >
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
          )}
        </div>
      </div>
    </div>
  );
};

export default IFTAReports;
