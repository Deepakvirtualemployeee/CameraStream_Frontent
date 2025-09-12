import React, { useMemo } from "react";
import moment from "moment-timezone";
import { LineChart, Line, Tooltip, ReferenceLine } from "recharts";
 
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
  OFF: 0,
  SB: 1,
  DR: 2,
  ON: 3,
};
 
export default function LogChart({ logs = [], selectedDate, timezone = "America/Los_Angeles" }) {
  const { chartData, referenceLines } = useMemo(() => {
    if (!selectedDate) return { chartData: [], referenceLines: [] };
 
    const selectedDay = moment.tz(selectedDate, timezone).startOf("day");
 
    // Extract and sort events
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
 
    if (events.length === 0) return { chartData: [], referenceLines: [] };
 
    const points = [];
const refs = [];

if (events.length > 0) {
  const firstEvent = events[0];
  const midnight = selectedDay.clone();
  const firstStartX = 0;
  const firstEndX = firstEvent.start.diff(selectedDay, "minutes") / 60;
  const firstY = rowY[firstEvent.mappedRow];

  // Push first horizontal line from midnight to first event
  points.push({
    x: firstStartX,
    y: firstY,
    status: firstEvent.mappedRow,
    startTime: midnight.format("HH:mm"),
    endTime: firstEvent.start.format("HH:mm"),
    duration: moment
      .utc(firstEvent.start.diff(midnight, "minutes") * 60 * 1000)
      .format("HH:mm"),
  });
  points.push({
    x: firstEndX,
    y: firstY,
    status: firstEvent.mappedRow,
    startTime: midnight.format("HH:mm"),
    endTime: firstEvent.start.format("HH:mm"),
    duration: moment
      .utc(firstEvent.start.diff(midnight, "minutes") * 60 * 1000)
      .format("HH:mm"),
  });

  refs.push({ key: "start-0", x: firstStartX, label: midnight.format("HH:mm") });
  refs.push({ key: "end-0", x: firstEndX, label: firstEvent.start.format("HH:mm") });

  // Process remaining events starting from second event
  events.slice(1).forEach((ev, idx) => {
    const nextEv = events[idx + 1 + 1]; // +1 for slice offset
    const end = nextEv
      ? moment.min(nextEv.start, selectedDay.clone().endOf("day"))
      : selectedDay.clone().endOf("day");

    const start = ev.start;
    const durationMinutes = end.diff(start, "minutes");
    const durationHHMM = moment.utc(durationMinutes * 60 * 1000).format("HH:mm");

    const startX = start.diff(selectedDay, "minutes") / 60;
    const endX = end.diff(selectedDay, "minutes") / 60;
    const startY = rowY[ev.mappedRow];
    const endY = rowY[ev.mappedRow];

    points.push({
      x: startX,
      y: startY,
      status: ev.mappedRow,
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      duration: durationHHMM,
    });
    points.push({
      x: endX,
      y: endY,
      status: ev.mappedRow,
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      duration: durationHHMM,
    });

    refs.push({ key: `start-${idx + 1}`, x: startX, label: start.format("HH:mm") });
    refs.push({ key: `end-${idx + 1}`, x: endX, label: end.format("HH:mm") });
  });
}

 
    return { chartData: points, referenceLines: refs };
  }, [logs, selectedDate, timezone]);
 
  return (
    <div className="position-relative">
      {/* Table */}
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
 
      {/* Overlayed line chart */}
      <div style={{ position: "absolute", top: "45px", left: "60px", width: "92%", height: "calc(100% - 80px)" }}>
        <LineChart width={1000} height={180} data={chartData}>
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