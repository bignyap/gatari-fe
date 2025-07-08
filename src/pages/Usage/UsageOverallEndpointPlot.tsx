import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts";
import { GetApiUsageSummary } from "../../libraries/ApiUsage";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";

export default function UsageOverallEndpointPlot({ filters }: { filters: any }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await GetApiUsageSummary({ ...filters, group_by: false });
      const merged: Record<string, number> = {};
      res.forEach((entry: any) => {
        merged[entry.endpoint_name] = (merged[entry.endpoint_name] || 0) + entry.total_calls;
      });
      const chartData = Object.entries(merged).map(([endpoint_name, total_calls]) => ({
        endpoint_name,
        total_calls,
      }));
      setData(chartData);
    };
    load();
  }, [filters]);

  return (
    <PlotCard title="Overall Usage by Endpoint">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="endpoint_name" angle={-45} textAnchor="end" interval={0} height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_calls" fill={CHART_COLORS.bar} barSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </PlotCard>
  );
}