import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

export default function CallsPlotByEndpointOrg({ res }: { res: any }) {
  const [rawData, setRawData] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [visibleOrgs, setVisibleOrgs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {

      console.log("res:", res)

      const orgSet = new Set<string>();
      const endpointSet = new Set<string>();
      const dataMap: Record<string, Record<string, number>> = {};

      res.forEach(({ endpoint_name, organization_name, total_calls }: any) => {
        orgSet.add(organization_name);
        endpointSet.add(endpoint_name);

        if (!dataMap[endpoint_name]) {
          dataMap[endpoint_name] = {};
        }
        dataMap[endpoint_name][organization_name] = total_calls;
      });

      const sortedEndpoints = Array.from(endpointSet).sort();
      const sortedOrgs = Array.from(orgSet).sort();

      // Add "Overall" pseudo-org
      const allOrgs = [...sortedOrgs, "Overall"];
      setOrgs(allOrgs);
      setVisibleOrgs(new Set(allOrgs)); // all checked by default

      const chartData = sortedEndpoints.map((endpoint) => {
        const row: Record<string, any> = { name: endpoint };
        let total = 0;
        sortedOrgs.forEach((org) => {
          const val = dataMap[endpoint]?.[org] || 0;
          row[org] = val;
          total += val;
        });
        row["Overall"] = total;
        return row;
      });

      setRawData(chartData);
    };

    load();
  }, [res]);

  const toggleOrg = (org: string) => {
    setVisibleOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(org)) next.delete(org);
      else next.add(org);
      return next;
    });
  };

  return (
    <PlotCard title="Total Calls by Endpoint & Organization" height={400}>
      <Box sx={{ display: "flex", width: "100%" }}>
        {/* Org Column with "Overall" */}
        <Box sx={{ minWidth: 220, pr: 2, borderRight: "1px solid #ccc" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Organizations
          </Typography>
          {orgs.map((org, index) => {
            const color =
              org === "Overall"
                ? CHART_COLORS.line
                : CHART_COLORS.lines[index % CHART_COLORS.lines.length];
            return (
              <Box
                key={org}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: color,
                    mr: 1,
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleOrgs.has(org)}
                      onChange={() => toggleOrg(org)}
                      size="small"
                    />
                  }
                  label={org}
                  sx={{ m: 0 }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Chart */}
        <Box sx={{ flexGrow: 1, pl: 2 }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={rawData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {orgs.map((org, index) => {
                if (!visibleOrgs.has(org)) return null;
                const color =
                  org === "Overall"
                    ? CHART_COLORS.line
                    : CHART_COLORS.lines[index % CHART_COLORS.lines.length];
                return (
                  <Line
                    key={org}
                    type="monotone"
                    dataKey={org}
                    stroke={color}
                    strokeWidth={org === "Overall" ? 3 : 2}
                    name={org}
                    dot={{ r: org === "Overall" ? 3 : 1 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </PlotCard>
  );
}