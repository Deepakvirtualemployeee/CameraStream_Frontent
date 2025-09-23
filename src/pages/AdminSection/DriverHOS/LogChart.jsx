import React, { useMemo } from "react";
import moment from "moment-timezone";
import {
  LineChart,
  Line,
  Tooltip,
  ReferenceLine,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";

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
  OFF: 3.9,
  SB: 2.9,
  DR: 1.9,
  ON: 0.9,
};

const PIXELS_PER_HOUR = 37.5;
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

const formatMinutes = (mins) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const formatDuration = (ms) => {
  if (ms == null || isNaN(ms)) return "--";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}h:${minutes}m:${seconds}s`;
};

export default function LogChart({ logs = [], selectedDate, timezone = "America/Los_Angeles" }) {
  const { chartData, referenceLines } = useMemo(() => {
    if (!selectedDate) return { chartData: [], referenceLines: [] };

    const selectedDay = moment.tz(selectedDate, timezone).startOf("day");
    const endOfDay = selectedDay.clone().endOf("day");

    // flatten + filter
    const allEvents = logs
      .flatMap((log) =>
        (log.hosEvents || [])
          .filter((e) => allowedEventCodes.includes(e.eventCode))
          .map((e) => ({
            ...e,
            mappedRow: graphMapping[e.eventCode],
            start: moment.tz(e.startTime || e.eventDateTime, timezone),
          }))
      )
      .sort((a, b) => a.start.valueOf() - b.start.valueOf());

    console.log("allEventsbefore:", allEvents);
    const eventsForDay = allEvents.filter((e) => e.start.isSame(selectedDay, "day"));
    console.log("allEventsafter:", eventsForDay);
    console.log("selectedday:", selectedDay);


    const points = [];
    const refs = [];

    const toPixels = (m) => m.diff(selectedDay, "minutes") * PIXELS_PER_MINUTE;

    // --------------------
    // Midnight → First Event
    // --------------------

    // find the very first event in the entire timeline
    const firstEvent = allEvents[0]; // assuming allEvents is sorted

    if (firstEvent) {
      // midnight should be the actual midnight of the first event's date
      const midnight = firstEvent.start.clone().startOf("day");

      // find next allowed event after this one
      const nextAllowed = allEvents.find((e) => e.start.isAfter(firstEvent.start));
      const nextTime = nextAllowed ? nextAllowed.start : endOfDay;

      const firstDurationMs = nextTime.diff(midnight);

      // carry-over status from before firstEvent (or OFF if none)
      // const lastPrevEvent = allEvents.filter((e) => e.start.isBefore(firstEvent.start)).pop();
      const lastPrevEvent = allEvents.filter((e) => e.start.isBefore(selectedDay)).pop();

      const initialStatus = lastPrevEvent ? lastPrevEvent.mappedRow : "OFF";

      const firstX = toPixels(nextTime);

      points.push({
        x: 0,
        y: rowY[initialStatus],
        status: initialStatus,
        startTime: midnight.format("HH:mm"),
        endTime: nextTime.format("HH:mm"),
        duration: formatDuration(firstDurationMs >= 0 ? firstDurationMs : 0),
      });

      points.push({
        x: firstX,
        y: rowY[initialStatus],
        status: initialStatus,
        startTime: midnight.format("HH:mm"),
        endTime: nextTime.format("HH:mm"),
        duration: formatDuration(firstDurationMs >= 0 ? firstDurationMs : 0),
      });

      refs.push({ key: "ref-0", x: 0, label: midnight.format("HH:mm") });

      console.log("First event duration:", formatDuration(firstDurationMs));
    }

    // --------------------
    // Loop through in-day events
    // --------------------
    eventsForDay.forEach((ev, idx) => {
      const xVal = toPixels(ev.start);

      // Find next allowed event, otherwise end of day
      const nextAllowed = eventsForDay.slice(idx + 1).find((e) => allowedEventCodes.includes(e.eventCode));
      const nextTime = nextAllowed ? nextAllowed.start : endOfDay;
      const nextX = toPixels(nextTime);

      // Duration logic (same as tableData)
      let durationMin;
      if (idx === 0 && nextAllowed) {
        durationMin = nextAllowed.start.diff(selectedDay, "minutes");
      } else {
        durationMin = nextTime.diff(ev.start, "minutes");
      }

      points.push({
        x: xVal,
        y: rowY[ev.mappedRow],
        status: ev.mappedRow,
        startTime: ev.start.format("HH:mm"),
        endTime: nextTime.format("HH:mm"),
        duration: formatMinutes(durationMin >= 0 ? durationMin : 0),
      });

      points.push({
        x: nextX,
        y: rowY[ev.mappedRow],
        status: ev.mappedRow,
        startTime: ev.start.format("HH:mm"),
        endTime: nextTime.format("HH:mm"),
        duration: formatMinutes(durationMin >= 0 ? durationMin : 0),
      });

      refs.push({
        key: `ref-${idx + 1}`,
        x: xVal,
        label: ev.start.format("HH:mm"),
      });
    });

    return {
      chartData: points.sort((a, b) => a.x - b.x),
      referenceLines: refs,
    };
  }, [logs, selectedDate, timezone]);

  return (
    <div className="position-relative">
      <div className="custom-chart-table table-responsive">
        <table className="table table-bordered align-middle fs-12 fw-bold text-body text-center">
          {/* <thead>
            <tr>
              <td style={{ width: "37.5px" }}></td>
              {[...Array(24)].map((_, i) => (
                <td
                  key={i}
                  style={{ width: "37.5px", padding: "2px", fontSize: "10px" }}
                >
                  {`${String(i).padStart(2, "0")}:30`}
                </td>
              ))}
            </tr>
          </thead> */}
          <thead>
            <tr>
              <td style={{ width: "37.5px" }}></td>
              {[...Array(24)].map((_, i) => {
                const label = i === 0 ? "0" : i === 23 ? "23" : `${String(i).padStart(2, "0")}`;

                return (
                  <td
                    key={i}
                    style={{
                      width: "37.5px",
                      padding: "2px",
                      fontSize: "10px",
                      textAlign: "left", // align all labels left
                      position: "relative",
                    }}
                  >
                    {/* Tickline */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0, // tickline at left for all
                        width: "1px",
                        height: "6px",
                        background: "#000",
                      }}
                    />
                    {label}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {["OFF", "SB", "DR", "ON"].map((status) => (
              <tr key={status}>
                <td className="text-uppercase">{status}</td>
                {[...Array(24)].map((_, idx) => (
                  <td
                    key={idx}
                    style={{ width: "37.5px" }}
                    className={`bg-opacity-25 striped-cell bg-${status === "OFF"
                      ? "success"
                      : status === "SB"
                        ? "theme6"
                        : status === "DR"
                          ? "theme3"
                          : "warning"
                      }`}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          position: "absolute",
          top: "45px",
          left: "50px",
          width: "900px",
          height: "calc(100% - 80px)",
        }}
      >
        <LineChart width={1200} height={140} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={true} />
          <YAxis hide type="number" domain={[0, 4]} />
          {/* <XAxis
            type="number"
            dataKey="x"
            domain={[0, 900]}
            ticks={[...Array(24)].map((_, i) => i * 37.5)}
            interval={0}
            tickFormatter={(val) => `${String(val / 37.5).padStart(2, "0")}:00`}
            tick={{ fontSize: 12 }}
          /> */}
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 900]}
            ticks={[...Array(24)].map((_, i) => i * 37.5)}
            interval={0}
            tick={false}  // 👈 hides labels, keeps axis scale
            axisLine={false} // 👈 hides bottom axis line
            tickLine={false} // 👈 hides small tick marks
          />

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
                  <div
                    style={{
                      background: "white",
                      border: "1px solid #ccc",
                      padding: "5px",
                    }}
                  >
                    <div>
                      <b>Status:</b> {d.status}
                    </div>
                    <div>
                      <b>Start:</b> {d.startTime}
                    </div>
                    <div>
                      <b>End:</b> {d.endTime}
                    </div>
                    <div>
                      <b>Duration:</b> {d.duration}
                    </div>
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