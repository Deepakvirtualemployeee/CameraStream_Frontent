import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";

const allowedEventCodes = [
    "DS_OFF", "DS_SB", "DS_D", "DS_ON", "DR_IND_PC", "DR_IND_YM"
];

const graphMapping = {
    DS_OFF: "OFF",
    DR_IND_PC: "OFF",
    DS_SB: "SB",
    DS_D: "DR",
    DS_ON: "ON",
    DR_IND_YM: "ON",
};

const statusMapping = { ON: 0.5, DR: 1.5, SB: 2.5, OFF: 3.5 };

export default function ChartComponent({
    logs = [],
    selectedDate,
    timezone = "America/Los_Angeles",
}) {
    const { chartData } = useMemo(() => {
        if (!selectedDate) return { chartData: [] };

        const selectedDay = moment.tz(selectedDate, timezone).startOf("day");
        const endOfDay = selectedDay.clone().endOf("day");
        const now = moment.tz(timezone);

        // Flatten and prepare events
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

        const eventsForDay = allEvents.filter((e) =>
            e.start.isSame(selectedDay, "day")
        );

        const points = [];
        let currentStatus = "OFF";

        const lastEventBefore = allEvents.filter((e) =>
            e.start.isBefore(selectedDay)
        ).pop();
        if (lastEventBefore) currentStatus = lastEventBefore.mappedRow;

        const toDecimalHours = (time) => {
            const diffMinutes = time.diff(selectedDay, "minutes");
            return diffMinutes / 60;
        };

        // Handle case: no events for the day
        if (eventsForDay.length === 0) {
            const endTime = selectedDay.isSame(now, "day")
                ? now
                : selectedDay.clone().set({ hour: 23, minute: 59 });
            points.push({ x: 0, y: statusMapping[currentStatus] });
            points.push({ x: toDecimalHours(endTime), y: statusMapping[currentStatus] });
            return { chartData: points };
        }

        // Add segment before the first event
        const firstEvent = eventsForDay[0];
        points.push({ x: 0, y: statusMapping[currentStatus] });
        points.push({
            x: toDecimalHours(firstEvent.start),
            y: statusMapping[currentStatus],
        });

        // Add all event segments
        eventsForDay.forEach((ev, i) => {
            const next = eventsForDay[i + 1];
            let endTime = next ? next.start : null;

            if (!endTime) {
                // No next event → end based on date
                if (selectedDay.isSame(now, "day")) {
                    endTime = now;
                } else {
                    endTime = selectedDay.clone().set({ hour: 23, minute: 59 });
                }
            }

            //   points.push({
            //     x: toDecimalHours(ev.start),
            //     y: statusMapping[ev.mappedRow],
            //   });
            //   points.push({
            //     x: toDecimalHours(endTime),
            //     y: statusMapping[ev.mappedRow],
            //   });
            points.push({
                x: toDecimalHours(ev.start),
                y: statusMapping[ev.mappedRow],
                status: ev.mappedRow,
                start: ev.start,
                end: endTime, // attach the segment’s end
            });
            points.push({
                x: toDecimalHours(endTime),
                y: statusMapping[ev.mappedRow],
                status: ev.mappedRow,
                start: ev.start,
                end: endTime,
            });

        });

        return { chartData: points.sort((a, b) => a.x - b.x) };
    }, [logs, selectedDate, timezone]);


    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        stroke: {
            curve: "stepline",
            width: 3,
            colors: ["#00067e"],
        },
        // xaxis: {
        //   type: "numeric",
        //   min: 0,
        //   max: 24,
        //   tickAmount: 24,
        //   position: "top", // ✅ Keep x-axis on top
        //   labels: {
        //     formatter: (val) => {
        //       const totalMinutes = val * 60;
        //       const hours = Math.floor(totalMinutes / 60);
        //       const minutes = Math.floor(totalMinutes % 60);
        //       return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        //         2,
        //         "0"
        //       )}`;
        //     },
        //     style: { colors: "#333", fontWeight: 500 },
        //   },
        //   title: {
        //     text: "Time (HH:mm)",
        //     style: { color: "#00067e", fontWeight: 600 },
        //   },
        // },

        // xaxis: {
        //     type: "numeric",
        //     min: 0,
        //     max: 24,
        //     tickAmount: 24,
        //     position: "top",
        //     labels: {
        //       formatter: (val) => Math.floor(val), // <-- simple numbers 0,1,2...
        //       style: { colors: "#333", fontWeight: 500 },
        //     },
        //     title: {
        //       text: "Time (Hours)",
        //       style: { color: "#00067e", fontWeight: 600 },
        //     },
        //   },

        xaxis: {
            type: "numeric",
            min: 0,
            max: 24,
            tickAmount: 24,
            position: "top",
            labels: {
                formatter: (val) => {
                    const hour = Math.floor(val);
                    if (hour === 0 || hour === 24) return "M"; // midnight
                    if (hour === 12) return "N"; // noon
                    if (hour > 12 && hour < 24) return String(hour - 12); // 13 -> 1, 14 -> 2...
                    return String(hour); // 1–11 stay same
                },
                style: { colors: "#333", fontWeight: 500 },
            },
            title: {
                text: "Hours",
                style: { color: "#00067e", fontWeight: 600 },
            },
        },

        yaxis: {
            min: 0,
            max: 4,
            tickAmount: 4,
            title: {
                show: false,
                text: "Status",
                style: { color: "#00067e", fontWeight: 600 },
            },

            labels: {
                formatter: (val) => {
                    const labels = ["ON", "DR", "SB", "OFF"];
                    return labels[val] || "";
                },
                style: { colors: "#333", fontWeight: 500 },
                offsetY: -32,
            },
            //   labels: {
            //     formatter: (val) => {
            //       const map = { 0.5: "ON", 1.5: "DR", 2.5: "SB", 3.5: "OFF" };
            //       const rounded = Math.round(val * 10) / 10;
            //       return map[rounded] || "";
            //     },
            //     style: { colors: "#333", fontWeight: 500 },
            //   },
        },
        tooltip: {
            x: {
                formatter: (val) => {
                    const totalMinutes = val * 60;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = Math.floor(totalMinutes % 60);
                    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                        2,
                        "0"
                    )}`;
                },
            },
            y: {
                formatter: (val) => {
                    const map = { 0.5: "ON", 1.5: "DR", 2.5: "SB", 3.5: "OFF" };
                    const rounded = Math.round(val * 10) / 10;
                    return map[rounded] || "";
                },
            },
        },
        grid: {
            borderColor: "#e0e0e0",
            row: {
                colors: ["#e6f0ff", "#e8ffe8", "#fff5e6", "#ffe6e6"],
                opacity: 0.7,
            },
        },
        colors: ["#00067e"],
    };

    const series = [{ name: "Status", data: chartData }];

    return (
        <div className="bg-white border border-theme_clr1 rounded-xl mt-6 p-2">
            <Chart options={options} series={series} type="line" height={300} />
        </div>
    );
}
