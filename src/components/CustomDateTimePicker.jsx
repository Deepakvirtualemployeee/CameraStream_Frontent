import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import moment from "moment-timezone";

const TimeHeader = ({ date, onToggleTime, showTime }) => {
  let display = "--:--:-- --";

  if (date && typeof date.format === "function") {
    display = date.format("hh:mm:ss A");
  } else if (date) {
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      display = parsedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }
  }

  return (
    <div
      className="custom-dtp-time-header"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <button
        type="button"
        className="btn btn-link p-0 fw-semibold"
        onClick={onToggleTime}
        style={{ color: "#1a73e8" }}
      >
        {display} {showTime ? "^" : "v"}
      </button>
    </div>
  );
};

export const CustomDateTimePicker = ({
  value,
  onChange,
  placeholder = "Select date/time",
}) => {
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const draftValueRef = useRef(null);

  useEffect(() => {
    if (value) {
      setPendingValue(value);
      draftValueRef.current = value;
    } else {
      setPendingValue(null);
      draftValueRef.current = null;
    }
  }, [value]);

  const commitPendingValue = (val) => {
    if (!val) {
      onChange(null);
      return;
    }

    // Keep 12-hour input (hh + AM/PM) stable when user types manually.
    const formattedValue =
      typeof val?.format === "function"
        ? val.format("YYYY-MM-DD hh:mm:ss A")
        : null;

    if (formattedValue) {
      const parsed = moment(
        formattedValue,
        "YYYY-MM-DD hh:mm:ss A",
        true
      );
      if (parsed.isValid()) {
        onChange(parsed.toDate());
        return;
      }
    }

    const jsDate = val?.toDate?.() || new Date(val);
    onChange(jsDate);
  };

  return (
    <Form.Group className="custom-date-time-picker">
      <DatePicker
        value={pendingValue}
        onChange={(val) => {
          draftValueRef.current = val;
          if (!val) {
            setPendingValue(null);
            onChange(null);
          }
        }}
        format="DD MMM YYYY hh:mm:ss A"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          commitPendingValue(draftValueRef.current);
        }}
        closeOnSelect={true}
        calendarPosition="bottom-center"
        portal
        className="w-100"
        plugins={[
          <TimeHeader
            key="time-header"
            position="top"
            date={pendingValue}
            onToggleTime={() => setShowTimePicker((s) => !s)}
            showTime={showTimePicker}
          />,
          showTimePicker && (
            <TimePicker key="time" position="bottom" hideSeconds={false} />
          ),
        ].filter(Boolean)}
        render={(valueString, openCalendar) => (
          <div className="custom-dtp-input">
            <input
              className="form-control"
              value={valueString || ""}
              placeholder={placeholder}
              onClick={openCalendar}
              readOnly
            />
          </div>
        )}
      />
    </Form.Group>
  );
};

export default CustomDateTimePicker;
