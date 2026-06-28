import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ResourceData {
  time: string;
  cpu: number;
  ram: number;
}

interface Props {
  data: ResourceData[];
}

interface State {
  hasError: boolean;
}

// Error Boundary specifically for the chart to prevent entire app from crashing
class ChartErrorBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full text-[#f85149] text-[10px] p-2 text-center bg-[#161b22] border border-[#f85149]/30 rounded">
          Failed to render telemetry chart.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ResourceUsageChart({ data }: Props) {
  // Safe default data if array is empty or undefined
  const safeData =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ time: "0", cpu: 0, ram: 0 }];

  return (
    <ChartErrorBoundary>
      <div className="w-[250px] h-[100px] bg-[#0d1117] p-2 rounded-md border border-[#30363d] shadow-xl">
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-[9px] font-bold text-[#8b949e] uppercase tracking-wider">
            Resource Usage (Last 60s)
          </span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData}>
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                fontSize: "10px",
                color: "#c9d1d9",
              }}
              itemStyle={{ fontSize: "10px" }}
              labelStyle={{ display: "none" }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#58a6ff"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              name="CPU %"
            />
            <Line
              type="monotone"
              dataKey="ram"
              stroke="#3fb950"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              name="RAM %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartErrorBoundary>
  );
}
