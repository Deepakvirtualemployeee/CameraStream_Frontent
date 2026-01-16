// src/pages/AdminSection/DriverHOS/CircularTimer.jsx
import React from "react";

/**
 * CircularTimer
 * Props:
 *  - label: string
 *  - limit: number (seconds)
 *  - accumulated: number (seconds)
 *  - color: string (CSS color)
 *  - size: number (px) optional
 */
export default function CircularTimer({
    label = "",
    limit = 0,
    accumulated = 0,
    color = "#4C8EF3",
    size = 64,
    strokeWidth = 6,
}) {
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    // remaining seconds (never negative)
    const remaining = Math.max(0, (limit || 0) - (accumulated || 0));

    // progress based on remaining/limit. If limit===0 show 0 progress.
    const progress = limit > 0 ? remaining / limit : 0;
    const strokeDashoffset = circumference * (1 - progress);

    const formatSecondsToHHMM = (seconds) => {
        if (seconds == null || isNaN(seconds)) return "00:00";
        const totalMinutes = Math.floor(seconds / 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    return (
        <div style={{ width: size, height: size, position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={size} height={size}>
                {/* background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e9ecef"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* progress stroke */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: "stroke-dashoffset 0.6s ease",
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                        // strokeLinecap: "round",
                    }}
                />
            </svg>

            {/* center text */}
            <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{formatSecondsToHHMM(remaining)}</div>
                {/* <div style={{ fontSize: 10, color: "#808080", textTransform: "uppercase" }}>{label}</div> */}
                <div className="fs-10 fw-bold text-muted text-uppercase">{label}</div>
            </div>
        </div>
    );
}