import React, { useMemo } from "react";
import moment from "moment-timezone";
import { LineChart, Line, Tooltip, ReferenceLine, YAxis, XAxis } from "recharts";

const allowedEventCodes = ["DS_OFF", "DS_SB", "DS_D", "DS_ON", "DR_IND_PC", "DR_IND_YM"];

const graphMapping = {
  DS_OFF: "OFF",
  DR_IND_PC: "OFF",
  DS_SB: "SB",
  DS_D: "DR",
  DS_ON: "ON",
  DR_IND_YM: "ON",
};

const rowY = {
  OFF: 3.5,
  SB: 2.5,
  DR: 1.5,
  ON: 0.5,
};

export default function LogChart({ logs = [], selectedDate, timezone = "America/Los_Angeles" }) {
  const { chartData, referenceLines } = useMemo(() => {
    if (!selectedDate) return { chartData: [], referenceLines: [] };

    const selectedDay = moment.tz(selectedDate, timezone).startOf("day");
    const endOfDay = selectedDay.clone().endOf("day");

    const events = logs
      .flatMap((log) =>
        (log.hosEvents || [])
          .filter((e) => allowedEventCodes.includes(e.eventCode))
          .map((e) => ({
            ...e,
            mappedRow: graphMapping[e.eventCode],
            start: moment.tz(e.startTime || e.eventDateTime, timezone),
          }))
      )
      .filter((e) => e.start.isSame(selectedDay, "day"))
      .sort((a, b) => a.start.valueOf() - b.start.valueOf());

    const points = [];
    const refs = [];

    // Determine the initial status based on the first event, if it exists.
    const initialStatus = events.length > 0 ? events[0].mappedRow : "OFF";
    let lastTime = selectedDay.clone();

    // The first segment starts at midnight.
    points.push({
      x: 0,
      y: rowY[initialStatus],
      status: initialStatus,
      startTime: selectedDay.format("HH:mm"),
      endTime: events.length > 0 ? events[0].start.format("HH:mm") : endOfDay.format("HH:mm"),
      duration: moment.utc((events.length > 0 ? events[0].start : endOfDay).diff(selectedDay, "minutes") * 60 * 1000).format("HH:mm"),
    });

    refs.push({ key: "ref-0", x: 0, label: "00:00" });

    // Iterate through events to create segments
    events.forEach((ev, idx) => {
      const prevEvent = events[idx - 1];
      const prevStatus = prevEvent ? prevEvent.mappedRow : initialStatus;

      // Add a transition point for the vertical line
      points.push({
        x: ev.start.diff(selectedDay, "minutes") / 60,
        y: rowY[prevStatus],
        status: prevStatus, // Status of the segment ending here
        startTime: prevEvent ? prevEvent.start.format("HH:mm") : selectedDay.format("HH:mm"),
        endTime: ev.start.format("HH:mm"),
        duration: moment.utc(ev.start.diff(prevEvent ? prevEvent.start : selectedDay, "minutes") * 60 * 1000).format("HH:mm"),
      });

      // Add the point for the start of the new status
      points.push({
        x: ev.start.diff(selectedDay, "minutes") / 60,
        y: rowY[ev.mappedRow],
        status: ev.mappedRow, // Status of the new segment
        startTime: ev.start.format("HH:mm"),
        endTime: (events[idx + 1] ? events[idx + 1].start : endOfDay).format("HH:mm"),
        duration: moment.utc((events[idx + 1] ? events[idx + 1].start : endOfDay).diff(ev.start, "minutes") * 60 * 1000).format("HH:mm"),
      });
      refs.push({ key: `ref-${idx + 1}`, x: ev.start.diff(selectedDay, "minutes") / 60, label: ev.start.format("HH:mm") });
    });

    // Add a final point to extend the line to the end of the day, if needed.
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      points.push({
        x: 24,
        y: rowY[lastEvent.mappedRow],
        status: lastEvent.mappedRow,
        startTime: lastEvent.start.format("HH:mm"),
        endTime: endOfDay.format("HH:mm"),
        duration: moment.utc(endOfDay.diff(lastEvent.start, "minutes") * 60 * 1000).format("HH:mm"),
      });
    }

    const sortedPoints = points.sort((a, b) => a.x - b.x);

    return { chartData: sortedPoints, referenceLines: refs };
  }, [logs, selectedDate, timezone]);

  return (
    <div className="position-relative">
      <div className="custom-chart-table table-responsive">
        <table className="table table-bordered align-middle fs-12 fw-bold text-body text-center">
          <thead>
            <tr>
              <td>M</td>
              {[...Array(11)].map((_, i) => <td key={i}>{i + 1}</td>)}
              <td>N</td>
              {[...Array(11)].map((_, i) => <td key={i}>{i + 1}</td>)}
              <td>M</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-uppercase">OFF</td>
              {[...Array(23)].map((_, idx) => (
                <td key={idx} className="bg-success bg-opacity-25 striped-cell"></td>
              ))}
              <td>05:04</td>
            </tr>
            <tr>
              <td className="text-uppercase">SB</td>
              {[...Array(23)].map((_, idx) => (
                <td key={idx} className="bg-theme6 bg-opacity-25 striped-cell"></td>
              ))}
              <td>00:00</td>
            </tr>
            <tr>
              <td className="text-uppercase">DR</td>
              {[...Array(23)].map((_, idx) => (
                <td key={idx} className="bg-theme3 bg-opacity-25 striped-cell"></td>
              ))}
              <td>00:00</td>
            </tr>
            <tr>
              <td className="text-uppercase">ON</td>
              {[...Array(23)].map((_, idx) => (
                <td key={idx} className="bg-warning bg-opacity-25 striped-cell"></td>
              ))}
              <td>00:00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ position: "absolute", top: "45px", left: "70px", width: "92%", height: "calc(100% - 80px)" }}>
        <LineChart width={900} height={140} data={chartData}>
          <YAxis hide type="number" domain={[0, 4]} />
          <XAxis hide dataKey="x" type="number" domain={[0, 24]} />
          <Line
            type="stepAfter"
            dataKey="y"
            stroke="#000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            cursor={{ stroke: "blue", strokeWidth: 1 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const d = payload[0].payload;
                return (
                  <div style={{ background: "white", border: "1px solid #ccc", padding: "5px" }}>
                    <div><b>Status:</b> {d.status}</div>
                    <div><b>Start:</b> {d.startTime}</div>
                    <div><b>End:</b> {d.endTime}</div>
                    <div><b>Duration:</b> {d.duration}</div>
                  </div>
                );
              }
              return null;
            }}
          />
          {referenceLines.map((ref) => (
            <ReferenceLine
              key={ref.key}
              x={ref.x}
              stroke="red"
              strokeDasharray="3 3"
              label={{ value: ref.label, position: "top" }}
            />
          ))}
        </LineChart>
      </div>
    </div>
  );
}