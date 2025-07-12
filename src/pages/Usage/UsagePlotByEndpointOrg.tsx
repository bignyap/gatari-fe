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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from "@mui/material";

type DataMode = "calls" | "cost";

export default function UsagePlotByEndpointOrg({ data }: { data: any[] }) {
  const [dataMode, setDataMode] = useState<DataMode>("calls");
  const [rawData, setRawData] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [visibleOrgs, setVisibleOrgs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentRes = data;

    const orgSet = new Set<string>();
    const endpointSet = new Set<string>();
    const dataMap: Record<string, Record<string, number>> = {};

    currentRes.forEach((item) => {
      const endpoint = item.endpoint_name;
      const org = item.organization_name;
      const value = dataMode === "calls" ? item.total_calls : item.total_cost;

      orgSet.add(org);
      endpointSet.add(endpoint);

      if (!dataMap[endpoint]) dataMap[endpoint] = {};
      dataMap[endpoint][org] = value;
    });

    const sortedEndpoints = Array.from(endpointSet).sort();
    const sortedOrgs = Array.from(orgSet).sort();
    const allOrgs = [...sortedOrgs, "Overall"];
    setOrgs(allOrgs);
    setVisibleOrgs(new Set(allOrgs));

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
  }, [dataMode, data]);

  const toggleOrg = (org: string) => {
    setVisibleOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(org)) next.delete(org);
      else next.add(org);
      return next;
    });
  };

  return (
    <PlotCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.primary"
            sx={{ textTransform: "capitalize", letterSpacing: 0.3 }}
          >
            {dataMode === "calls" ? "Total Calls" : "API Cost"} by Endpoint & Organization
          </Typography>
          <ToggleButtonGroup
            value={dataMode}
            exclusive
            onChange={(_, newMode) =>
              newMode && setDataMode(newMode as DataMode)
            }
            size="small"
          >
            <ToggleButton value="calls">Calls</ToggleButton>
            <ToggleButton value="cost">Cost</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      }
      height={400}
    >
      <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
        {/* Left - Chart */}
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

        {/* Right - Checkboxes */}
        <Box
          sx={{
            minWidth: 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            pr: 2,
            pt: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Organizations
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ maxHeight: 280, overflowY: "auto", pr: 1 }}>
            {orgs.map((org, index) => {
              const color =
                org === "Overall"
                  ? CHART_COLORS.line
                  : CHART_COLORS.lines[index % CHART_COLORS.lines.length];
              return (
                <Box
                  key={org}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
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
        </Box>
      </Box>
    </PlotCard>
  );
}