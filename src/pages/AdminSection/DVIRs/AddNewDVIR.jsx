import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export const AddNewDVIR = () => {
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const unitDefects = [
    { value: 'Air Compressor', label: 'Air Compressor' },
    { value: 'Air Lines', label: 'Air Lines' },
    { value: 'Clutch', label: 'Clutch' },
    { value: 'Drive Line', label: 'Drive Line' },
    { value: 'Engine', label: 'Engine' },
    { value: 'Exhaust', label: 'Exhaust' },
    { value: 'Muffler', label: 'Muffler' },
    { value: 'Oil Level', label: 'Oil Level' },
    { value: 'Radiator Level', label: 'Radiator Level' },
    { value: 'Others', label: 'Others' },
  ];

    const trailerDefects = [
    { value: 'Brake Connections', label: 'Brake Connections' },
    { value: 'Coupling Devices', label: 'Coupling Devices' },
    { value: 'Coupling Pin', label: 'Coupling Pin' },
    { value: 'Hitch', label: 'Hitch' },
    { value: 'Doors', label: 'Doors' },
    { value: 'Landing Gear', label: 'Landing Gear' },
    { value: 'Condition of Floor', label: 'Condition of Floor' },
    { value: 'Wheelchair Lift', label: 'Wheelchair Lift' },
    { value: 'Entrance Steps', label: 'Entrance Steps' },
    { value: 'Others', label: 'Others' },
  ];

  return (
    <div className="AddVehicles-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex justify-content-between align-items-center mb-4">
          <div className="main-heading">Add DVIR</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button variant="white" className="bg-white border-gray" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="primary" type="submit" form="add-vehicle-form">Save</Button>
          </div>
        </div>

        <div className="form-wrapper">
          <Form id="add-vehicle-form">
            <section className="bg-white w-100 border rounded-4 shadow-sm mb-4 px-3 px-md-4 py-4">
              <Row className="g-3 g-xl-4">
                <Col sm={6}>
                  <Form.Group controlId="vehicle_number">
                    <Form.Label>Vehicle<span className="text-danger">*</span></Form.Label>
                    <Form.Select name="" required >
                      <option value="" hidden>Select vehicle</option>
                      <option value="023">023</option>
                      <option value="024">024</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="driver_name">
                    <Form.Label>Driver<span className="text-danger">*</span></Form.Label>
                    <Form.Select name="" required >
                      <option value="" hidden>Select driver</option>
                      <option value="Sukhvinder Singh">Sukhvinder Singh</option>
                      <option value="Amit Kumar">Amit Kumar</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="trailers">
                    <Form.Label>Trailers</Form.Label>
                    <Form.Control type="text" name="" placeholder="Enter trailers" />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="vehicleModel">
                    <Form.Label>Date & Time (Select driver first)<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="datetime-local" name="" required />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Location<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="" placeholder="Enter location" required />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Odometer (mi)</Form.Label>
                    <Form.Control type="number" name="" min={0} placeholder="0" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Unit Defects</Form.Label>
                    <Select
                      className='custom-select'
                      classNamePrefix='custom-select'
                      components={animatedComponents}
                      isMulti
                      options={unitDefects}
                      placeholder="Select unit defects"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Trailer Defects</Form.Label>
                    <Select
                      className='custom-select'
                      classNamePrefix='custom-select'
                      components={animatedComponents}
                      isMulti
                      options={trailerDefects}
                      placeholder="Select unit defects"
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Status<span className="text-danger">*</span></Form.Label>
                    <Form.Select name="" required >
                      <option value="" hidden>Select defects</option>
                      <option value="No Defects">No Defects</option>
                      <option value="Has Defects">Has Defects</option>
                      <option value="Defects Fixed">Defects Fixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Choose Safety Status<span className="text-danger">*</span></Form.Label>
                    <Form.Select name="" required >
                      <option value="" hidden>Select safety status</option>
                      <option value="Safe to Driver">Safe to Driver</option>
                      <option value="Unsafe">Unsafe</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
