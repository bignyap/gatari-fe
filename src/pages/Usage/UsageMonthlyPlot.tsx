import { useEffect, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { GetApiUsageSummary } from "../../libraries/ApiUsage";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";

export default function UsageMonthlyPlot({ filters }: { filters: any }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const updatedFilters = { ...filters, group_by: true };
      const res = await GetApiUsageSummary(updatedFilters);
      const chartData = res.map((entry: any) => ({
        month: `${entry.usage_year}-${String(entry.usage_month).padStart(2, "0")}`,
        total_calls: entry.total_calls,
      }));
      setData(chartData);
    };
    load();
  }, [filters]);

  return (
    <PlotCard title="Monthly Usage Trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="total_calls" stroke={CHART_COLORS.area} fill={CHART_COLORS.area} />
        </AreaChart>
      </ResponsiveContainer>
    </PlotCard>
  );
}