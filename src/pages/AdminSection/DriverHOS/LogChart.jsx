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

const formatMinutes = (ms) => {
  // const h = Math.floor(mins / 60);
  // const m = Math.floor(mins % 60);
  // return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  if (ms == null || isNaN(ms)) return "--";
        const totalSeconds = Math.max(0, Math.floor(ms / 1000)); // never negative
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

    const eventsForDay = allEvents.filter((e) => e.start.isSame(selectedDay, "day"));

    const points = [];
    const refs = [];

    const toPixels = (m) => m.diff(selectedDay, "minutes") * PIXELS_PER_MINUTE;

    // --------------------
    // Midnight → First Event
    // --------------------
    const midnight = selectedDay.clone();
    
    const firstEvent = eventsForDay[0];
    if (firstEvent) {
      const firstX = toPixels(firstEvent.start);
      const firstDurationMin = firstEvent.start.diff(midnight, "minutes");

      // carry-over status from previous day, or OFF if none
      const lastPrevEvent = allEvents.filter((e) => e.start.isBefore(selectedDay)).pop();
      const initialStatus = lastPrevEvent ? lastPrevEvent.mappedRow : "OFF";

      points.push({
        x: 0,
        y: rowY[initialStatus],
        status: initialStatus,
        startTime: "00:00",
        endTime: firstEvent.start.format("HH:mm"),
        duration: formatMinutes(firstDurationMin),
      });

      points.push({
        x: firstX,
        y: rowY[initialStatus],
        status: initialStatus,
        startTime: "00:00",
        endTime: firstEvent.start.format("HH:mm"),
        duration: formatMinutes(firstDurationMin),
      });

      refs.push({ key: "ref-0", x: 0, label: "00:00" });
    }

    // --------------------
    // Loop through in-day events
    // --------------------
    // eventsForDay.forEach((ev, idx) => {
    //   const xVal = toPixels(ev.start);

    //   // Find next allowed event, otherwise end of day
    //   const nextAllowed = eventsForDay.slice(idx + 1).find((e) => allowedEventCodes.includes(e.eventCode));
    //   const nextTime = nextAllowed ? nextAllowed.start : endOfDay;
    //   const nextX = toPixels(nextTime);

    //   // Duration logic (same as tableData)
    //   let durationMin;
    //   if (idx === 0 && nextAllowed) {
    //     durationMin = nextAllowed.start.diff(selectedDay, "minutes");
    //   } else {
    //     durationMin = nextTime.diff(ev.start, "minutes");
    //   }

    //   points.push({
    //     x: xVal,
    //     y: rowY[ev.mappedRow],
    //     status: ev.mappedRow,
    //     startTime: ev.start.format("HH:mm"),
    //     endTime: nextTime.format("HH:mm"),
    //     duration: formatMinutes(durationMin >= 0 ? durationMin : 0),
    //   });

    //   points.push({
    //     x: nextX,
    //     y: rowY[ev.mappedRow],
    //     status: ev.mappedRow,
    //     startTime: ev.start.format("HH:mm"),
    //     endTime: nextTime.format("HH:mm"),
    //     duration: formatMinutes(durationMin >= 0 ? durationMin : 0),
    //   });

    //   refs.push({
    //     key: `ref-${idx + 1}`,
    //     x: xVal,
    //     label: ev.start.format("HH:mm"),
    //   });
    // });
    // inside your LogChart useMemo / loop where you build points
    eventsForDay.forEach((ev, idx) => {
      const eventTime = ev.start.clone();
      const nextAllowed = eventsForDay
        .slice(idx + 1)
        .find((e) => allowedEventCodes.includes(e.eventCode));
      const nextTime = nextAllowed ? nextAllowed.start.clone() : endOfDay;
    
      let durationMs = 0;
      let startLabel = eventTime.format("HH:mm"); // default
      let endLabel = nextTime.format("HH:mm");
    
      if (idx === 0 && nextAllowed) {
        // First event → duration from midnight, startLabel must be midnight
        const midnight = selectedDay.clone().startOf("day");
        durationMs = nextTime.diff(midnight);
        startLabel = midnight.format("HH:mm");   // 🔹 fix: show 00:00
        endLabel = nextTime.format("HH:mm");
      } else {
        durationMs = nextTime.diff(eventTime);
      }
    
      const xVal = toPixels(eventTime);
      const nextX = toPixels(nextTime);
    
      points.push({
        x: xVal,
        y: rowY[ev.mappedRow],
        status: ev.mappedRow,
        startTime: startLabel,
        endTime: endLabel,
        duration: formatMinutes(durationMs),
      });
    
      points.push({
        x: nextX,
        y: rowY[ev.mappedRow],
        status: ev.mappedRow,
        startTime: startLabel,
        endTime: endLabel,
        duration: formatMinutes(durationMs),
      });
    
      refs.push({
        key: `ref-${idx}`,
        x: xVal,
        label: eventTime.format("HH:mm"),
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
          <thead>
            <tr>
              <td style={{ width: "37.5px" }}></td>
              {[...Array(24)].map((_, i) => (
                <td
                  key={i}
                  style={{ width: "37.5px", padding: "2px", fontSize: "10px" }}
                >
                  {`${String(i).padStart(2, "0")}:00`}
                </td>
              ))}
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
                    className={`bg-opacity-25 striped-cell bg-${
                      status === "OFF"
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
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 900]}
            ticks={[...Array(24)].map((_, i) => i * 37.5)}
            interval={0}
            tickFormatter={(val) => `${String(val / 37.5).padStart(2, "0")}:00`}
            tick={{ fontSize: 12 }}
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