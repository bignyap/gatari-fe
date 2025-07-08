import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend
} from "recharts";
import { GetApiUsageSummary } from "../../libraries/ApiUsage";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";

export default function UsagePlotByEndpointOrg({ filters }: { filters: any }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await GetApiUsageSummary({ ...filters, group_by: false });
      const merged: Record<string, number> = {};

      res.forEach((entry: any) => {
        const key = `${entry.endpoint_name} (${entry.organization_name})`;
        merged[key] = (merged[key] || 0) + entry.total_calls;
      });

      const chartData = Object.entries(merged).map(([name, total_calls]) => ({
        name,
        total_calls,
      }));
      setData(chartData);
    };

    load();
  }, [filters]);

  return (
    <PlotCard title="API Usage by Endpoint & Organization">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_calls" stroke={CHART_COLORS.line} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </PlotCard>
  );
}