import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCameraDevice } from "../../../store/actions/cameraDevices";
import { getVehicles } from "../../../store/actions/vehicles";

export const AddCameraDevice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();

  const { loadings } = useSelector((state) => state.cameraDevices || {});
  const { vehicles, loading } = useSelector((state) => state.vehicles || {});

  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    deviceType: "ME41-05",
    audioVideoChannelQty: "4",
    channelNames: [
      { key: "CH1", enabled: true, name: "Front Road" },
      { key: "CH2", enabled: true, name: "Cabin" },
      { key: "CH3", enabled: true, name: "Left Side" },
      { key: "CH4", enabled: true, name: "Right Side" },
    ],
    companyId,
    vehicleId: "",
    nodeGuid: "0",
    ioName: "",
  });

  useEffect(() => {
    if (companyId) {
      dispatch(getVehicles(companyId));
    }
  }, [companyId, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "audioVideoChannelQty") {
      const qty = Number(value);
      setFormData((prev) => {
        const nextChannels = Array.from({ length: qty }, (_, index) => ({
          key: `CH${index + 1}`,
          enabled: prev.channelNames[index]?.enabled ?? true,
          name: prev.channelNames[index]?.name ?? "",
        }));

        return {
          ...prev,
          [name]: value,
          channelNames: nextChannels,
        };
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChannelToggle = (index) => {
    setFormData((prev) => ({
      ...prev,
      channelNames: prev.channelNames.map((channel, channelIndex) =>
        channelIndex === index
          ? { ...channel, enabled: !channel.enabled }
          : channel
      ),
    }));
  };

  const handleChannelNameChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      channelNames: prev.channelNames.map((channel, channelIndex) =>
        channelIndex === index ? { ...channel, name: value } : channel
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const finalData = {
      deviceId: formData.deviceId,
      deviceName: formData.deviceName,
      deviceType: formData.deviceType,
      audioVideoChannelQty: Number(formData.audioVideoChannelQty),
      channelNames: formData.channelNames,
      companyId: formData.companyId,
      vehicleId: formData.vehicleId,
      nodeGuid: formData.nodeGuid,
      ioName: formData.ioName,
    };

    dispatch(addCameraDevice(companyId, finalData, navigate));
  };

  return (
    <div className="AddCameraDevice-page py-3">
      <div className="container-fluid" style={{ maxWidth: "calc(1000px + 1.5rem)" }}>
        <div className="heading-wrapper d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <div className="main-heading">Add Device</div>
          <div className="btn-wrapper d-flex flex-wrap gap-2">
            <Button
              variant="white"
              className="bg-white border-gray"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="add-camera-device-form" disabled={loadings}>
              {loadings ? <Spinner size="sm" animation="border" /> : <><i className="bi bi-plus-lg fs-16"></i> Add Device</>}
            </Button>
          </div>
        </div>

        <div className="form-wrapper bg-white w-100 border rounded-4 shadow-sm px-3 px-md-4 py-4">
          <Form id="add-camera-device-form" onSubmit={handleSubmit}>
            <Row className="g-3 g-xl-4">
              <Col xs={12}>
                <Form.Group controlId="deviceId">
                  <Form.Label>Device ID<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleChange}
                    placeholder="Enter device ID"
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="deviceName">
                  <Form.Label>Device Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="deviceName"
                    value={formData.deviceName}
                    onChange={handleChange}
                    placeholder="Enter device name"
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="deviceType">
                  <Form.Label>Device Type<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="ME41-05">ME41-05</option>
                    <option value="ME41-04">ME41-04</option>
                    <option value="ME41-08">ME41-08</option>
                    <option value="ME41-16">ME41-16</option>
                    <option value="MC30-01">MC30-01</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="audioVideoChannelQty">
                  <Form.Label>Audio-Video Channel Qty.<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="audioVideoChannelQty"
                    value={formData.audioVideoChannelQty}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="nodeGuid">
                  <Form.Label>Node GUID<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="nodeGuid"
                    value={formData.nodeGuid}
                    onChange={handleChange}
                    placeholder="Enter node GUID"
                    autoComplete="off"
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="ioName">
                  <Form.Label>IO Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ioName"
                    value={formData.ioName}
                    onChange={handleChange}
                    placeholder="Enter IO names, for example io1;io2"
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="channelNames">
                  <Form.Label>Channel Name<span className="text-danger">*</span></Form.Label>
                  <Row className="g-3">
                    {formData.channelNames.map((channel, index) => (
                      <Col md={6} xl={3} key={`channel-${index}`}>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Check
                            type="checkbox"
                            id={`channel-enabled-${index}`}
                            checked={channel.enabled}
                            onChange={() => handleChannelToggle(index)}
                            label={`CH${index + 1}`}
                          />
                          <Form.Control
                            type="text"
                            value={channel.name}
                            onChange={(e) => handleChannelNameChange(index, e.target.value)}
                            placeholder={`Channel ${index + 1} name`}
                            disabled={!channel.enabled}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="main-heading mb-3">Vehicle Assignment</div>
            <Row className="g-3 g-xl-4">
              <Col xs={12}>
                <Form.Group controlId="vehicleId">
                  <Form.Label>Vehicle ID<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={(event) => {
                      setFormData((prev) => ({
                        ...prev,
                        vehicleId: event.target.value,
                      }));
                    }}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {loading && <option>Loading...</option>}
                    {vehicles?.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleNumber}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};
