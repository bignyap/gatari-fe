import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";

export default function UsageCostPerCallPlot({ res }: { res: any[] }) {
  const merged: Record<string, { total_calls: number; total_cost: number }> = {};
  res.forEach(({ endpoint_name, total_calls, total_cost }: any) => {
    if (!merged[endpoint_name]) {
      merged[endpoint_name] = { total_calls: 0, total_cost: 0 };
    }
    merged[endpoint_name].total_calls += total_calls;
    merged[endpoint_name].total_cost += total_cost;
  });

  const data = Object.entries(merged).map(([endpoint_name, values]) => ({
    endpoint_name,
    cost_per_call: values.total_calls ? values.total_cost / values.total_calls : 0,
    total_calls: values.total_calls,
    total_cost: values.total_cost,
  }));

  return (
    <PlotCard title="Cost Per Call by Endpoint">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="endpoint_name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            label={{ value: "Cost/Call", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const point = payload[0].payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    padding: "10px",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                  }}
                >
                  <strong>{point.endpoint_name}</strong>
                  <br />
                  Total Calls: {point.total_calls}
                  <br />
                  Total Cost: ${point.total_cost.toFixed(2)}
                  <br />
                  Cost per Call: ${point.cost_per_call.toFixed(4)}
                </div>
              );
            }}
          />
          <Bar
            dataKey="cost_per_call"
            fill={CHART_COLORS.bar}
            name="Cost per Call"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </PlotCard>
  );
}