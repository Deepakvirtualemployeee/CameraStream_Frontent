import React, { useMemo, useState } from "react";
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

const resolveEventId = (event) =>
    event?._id ||
    event?.seqId ||
    event?.eventDateTime ||
    event?.startTime ||
    event?.eventCode ||
    null;

export default function ChartComponent({
    logs = [],
    selectedDate,
    timezone = "America/Los_Angeles",
    violations = [], // array of { type, start }
    onHoverEvent,
    onHoverEnd,
    onClickEvent,
}) {
    const { chartData, segments } = useMemo(() => {
        if (!selectedDate) return { chartData: [], segments: [] };

        const selectedDay = moment.tz(selectedDate, timezone).startOf("day");
        const now = moment.tz(timezone);

        // Flatten and prepare events
        const allEvents = logs
            .flatMap((log) =>
                (log.hosEvents || [])
                    .filter((e) => allowedEventCodes.includes(e.eventCode))
                    .map((e) => ({
                        ...e,
                        eventId: resolveEventId(e),
                        mappedRow: graphMapping[e.eventCode],
                        start: moment.tz(e.startTime || e.eventDateTime, timezone),
                        originalEvent: e,
                    }))
            )
            .sort((a, b) => a.start.valueOf() - b.start.valueOf());

        const eventsForDay = allEvents.filter((e) =>
            e.start.isSame(selectedDay, "day")
        );

        const points = [];
        const segments = [];
        let currentStatus = "OFF";

        const lastEventBefore = allEvents.filter((e) =>
            e.start.isBefore(selectedDay)
        ).pop();
        const baseEventId = lastEventBefore?.eventId || null;
        if (lastEventBefore) currentStatus = lastEventBefore.mappedRow;

        const toDecimalHours = (time) => {
            const diffMinutes = time.diff(selectedDay, "minutes");
            return diffMinutes / 60;
        };

        // Generate only start/end points per segment; keep segment metadata for selection
        const addSegmentPoints = (startTime, endTime, status, eventId, eventCode, uiIndex = -1) => {
            const startMinute = startTime.diff(selectedDay, "minutes", true);
            const endMinute = endTime.diff(selectedDay, "minutes", true);

            segments.push({
                eventId,
                status,
                eventCode,
                startMinute,
                endMinute,
                startTime: startTime.format("HH:mm:ss"),
                endTime: endTime.format("HH:mm:ss"),
                eventDateTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
                uiIndex,
            });

            points.push({
                x: toDecimalHours(startTime),
                y: statusMapping[status],
                status,
                eventId,
                eventCode,
                minute: startMinute,
                uiIndex,
            });

            points.push({
                x: toDecimalHours(endTime),
                y: statusMapping[status],
                status,
                eventId,
                eventCode,
                minute: endMinute,
                uiIndex,
            });
        };

        // Handle case: no events for the day
        if (eventsForDay.length === 0) {
            const endTime = selectedDay.isSame(now, "day")
                ? now
                : selectedDay.clone().set({ hour: 23, minute: 59 });
            addSegmentPoints(selectedDay, endTime, currentStatus, baseEventId, "BASE");
            return { chartData: points, segments };
        }

        // Add segment before the first event (if exists)
        const firstEvent = eventsForDay[0];
        if (firstEvent.start.isAfter(selectedDay)) {
            addSegmentPoints(selectedDay, firstEvent.start, currentStatus, baseEventId, "BASE");
        }

        // Add all event segments with start/end points (index-aware)
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

            addSegmentPoints(ev.start, endTime, ev.mappedRow, ev.eventId, ev.eventCode, i);
        });

        const sortedPoints = points.sort((a, b) => a.x - b.x);
        
        return { chartData: sortedPoints, segments };
    }, [logs, selectedDate, timezone]);

    const startOfDay = useMemo(
        () => (selectedDate ? moment.tz(selectedDate, timezone).startOf("day") : null),
        [selectedDate, timezone]
    );

    const violationBadges = useMemo(() => {
        if (!startOfDay) return [];

        const badges = (violations || [])
            .map((v) => {
                const startIso = v.start || v.startTime || v.eventDateTime || v.logDate;
                const start = startIso ? moment.tz(startIso, timezone) : null;
                let xHour = start ? start.diff(startOfDay, "minutes", true) / 60 : null;

                // If the violation belongs to the selected log day but the UTC time pushes it
                // outside the local 0-24 window (common for cycle resets), anchor it to 00:00.
                if ((xHour === null || xHour < 0 || xHour > 24) && v.logDate) {
                    // Compare in UTC to respect the API's logDate (date-only) even when TZ shifts it
                    const logDayUtc = moment.utc(v.logDate).startOf("day");
                    const selectedDayUtc = moment.utc(startOfDay).startOf("day");
                    if (logDayUtc.isSame(selectedDayUtc, "day")) {
                        xHour = 0;
                    }
                }
                return {
                    id: v.id || `${v.type || "violation"}-${startIso}`,
                    type: v.type || "Violation",
                    label: start ? start.format("MMM DD, YYYY hh:mm A") : "--",
                    xHour,
                };
            })
            .filter((v) => v.xHour !== null && v.xHour >= 0 && v.xHour <= 24);

        // Helpful debug log to trace why a violation does/doesn't render for the selected day
        if (typeof console !== "undefined" && process.env.NODE_ENV !== "production") {
            console.log("[HOS Chart] Violations", {
                selectedDay: startOfDay.format("YYYY-MM-DD"),
                timezone,
                rawViolations: violations,
                plottedBadges: badges,
            });
        }

        return badges;
    }, [violations, startOfDay, timezone]);

    const formatHourLabel = (decimalHours) => {
        const totalMinutes = Math.max(0, Math.round(decimalHours * 60));
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false },
            // events: {
            //     dataPointSelection: (_event, _chartContext, { seriesIndex, dataPointIndex, w }) => {
            //         const point = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex];
            //         if (point?.eventId) onClickEvent?.(point.eventId);
            //     },
            //     // markerClick: (_event, _chartContext, { seriesIndex, dataPointIndex, w }) => {
            //     //     const point = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex];
            //     //     if (point?.eventId) onClickEvent?.(point.eventId);
            //     // },
            //     // click: (_event, chartContext, config) => {
            //     //     const gl = chartContext?.globals;
            //     //     const x = gl?.caretX;
            //     //     const seriesIndex = config?.seriesIndex ?? 0;
            //     //     const data = config?.w?.config?.series?.[seriesIndex]?.data;
            //     //     if (!data || x == null) return;

            //     //     // Map caret X to nearest point index
            //     //     const seriesX = gl?.seriesX?.[seriesIndex];
            //     //     if (Array.isArray(seriesX)) {
            //     //         let nearestIdx = 0;
            //     //         let minDist = Number.POSITIVE_INFINITY;
            //     //         seriesX.forEach((px, idx) => {
            //     //             const dist = Math.abs(px - x);
            //     //             if (dist < minDist) {
            //     //                 minDist = dist;
            //     //                 nearestIdx = idx;
            //     //             }
            //     //         });
            //     //         const point = data[nearestIdx];
            //     //         if (point?.eventId) onClickEvent?.(point.eventId);
            //     //     }
            //     // },
            // },
        },
        stroke: {
            curve: "stepline",
            width: 3,
            colors: ["#00067e"],
        },
        markers: {
            size: 0, // hide per-minute dots
            hover: {
                size: 0,
            },
        },
        xaxis: {
            type: "numeric",
            min: 0,
            max: 24,
            tickAmount: 24,
            position: "top",
            labels: {
                size: 5, 
                style: { colors: "#333", fontWeight: 500 },
            },
            hover: {
                size: 7,
            },
        },
        xaxis: {
            type: "numeric",
            min: 0,
            max: 24,
            tickAmount: 24,
            position: "top",
            labels: {
                formatter: (val) => {
                    const hour = Math.floor(val);
                    if (hour === 0 || hour === 24) return "M";
                    if (hour === 12) return "N";
                    if (hour > 12 && hour < 24) return String(hour - 12);
                    return String(hour);
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
            },
            labels: {
                formatter: (val) => {
                    const labels = ["ON", "DR", "SB", "OFF"];
                    return labels[val] || "";
                },
                style: { colors: "#333", fontWeight: 500 },
                offsetY: -17,
            },
        },
        tooltip: {
            shared: false,
            intersect: false,
            custom: ({ seriesIndex, dataPointIndex, w }) => {
                const point = w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex];
                const timeLabel = formatHourLabel(point?.x ?? 0);
                const statusLabel = point?.status || "";
                
                return `<div style="padding:8px 10px;font-size:13px;background:#fff;border:1px solid #ddd;border-radius:4px;">
                    <div style="font-weight:700;color:#00067e;margin-bottom:4px;">${timeLabel}</div>
                    <div style="color:#333;">Status: <strong>${statusLabel}</strong></div>
                </div>`;
            },
        },
        grid: {
            borderColor: "#e0e0e0",
            row: {
                colors: ["#EEF4FE", "#FEF8EE", "#F2FFF0", "#FCEDED"],
                opacity: 0.7,
            },
        },
        colors: ["#00067e"],
    };

    const series = [{ name: "Status", data: chartData }];

    const [isWrapperHover, setIsWrapperHover] = useState(false);

    return (
        <div
            className="bg-white border border-theme_clr1 rounded-xl mt-6 p-2"
            onMouseEnter={() => setIsWrapperHover(true)}
            onMouseMove={() => {}}
            onMouseLeave={() => setIsWrapperHover(false)}
            style={{ cursor: isWrapperHover ? "pointer" : "default", position: "relative" }}
        >
            <Chart options={options} series={series} type="line" height={220} />

            {violationBadges.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 8,
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        alignItems: "center",
                        fontSize: 12,
                        color: "#c1121f",
                    }}
                >
                    <span style={{ fontWeight: 700, marginRight: 4 }}>Violations:</span>
                    {violationBadges.map((v) => (
                        <span
                            key={v.id}
                            title={v.label}
                            style={{
                                background: "#f8d7da",
                                color: "#c1121f",
                                border: "1px solid #c1121f",
                                borderRadius: 14,
                                padding: "4px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                                lineHeight: 1.1,
                            }}
                        >
                            {v.type} - {v.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
