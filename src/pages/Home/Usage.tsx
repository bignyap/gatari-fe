import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GetDashboardUsage } from "../../libraries/Dashboard";
import PlotCard from "../../components/PlotCard/PlotCard";
import { CHART_COLORS } from "../../constants/colors";
import {
  Box,
  TextField,
  Paper,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import CommonButton from "../../components/Common/Button";

// Format UNIX timestamp to "YYYY-MM-DD HH:mm"
function formatLabelFromUnix(timestamp: number) {
  return dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm");
}

export default function DailyUsage({ filters }: { filters: any }) {
  const [data, setData] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(() =>
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(() =>
    dayjs().format("YYYY-MM-DD")
  );
  const [bucketSize, setBucketSize] = useState("600");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    let start = new Date(`${startDate}T00:00:00Z`);
    let end = new Date(`${endDate}T23:59:59Z`);

    if (end < start) {
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // force end = start + 1 day
    }

    const updatedFilters = {
      ...filters,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      bucket_size: parseInt(bucketSize, 10),
      group_by: false,
    };

    const res = await GetDashboardUsage(updatedFilters);

    // Step 1: Sort by bucket_start
    res.sort((a: any, b: any) => a.bucket_start - b.bucket_start);

    const grouped: Record<string, any> = {};
    const orgSet = new Set<string>();

    res.forEach((entry: any) => {
      const timeLabel = formatLabelFromUnix(entry.bucket_start);
      if (!grouped[timeLabel]) grouped[timeLabel] = { time: timeLabel, overall: 0 };

      grouped[timeLabel][entry.organization_name] = entry.total_calls;
      grouped[timeLabel]["overall"] += entry.total_calls;

      orgSet.add(entry.organization_name);
    });

    const allOrgs = Array.from(orgSet).sort();
    setData(Object.values(grouped));
    setOrgs(allOrgs);
    setSelectedOrgs(allOrgs); // default to all selected
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, bucketSize]);

  return (
    <>
      {/* Filters Bar */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          px: 3,
          py: 2,
          borderRadius: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Left-aligned inputs */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Bucket Size"
            type="number"
            value={bucketSize}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 300) setBucketSize(val.toString());
            }}
            inputProps={{ step: 300, min: 300 }}
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">sec</InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right-aligned output filter */}
        <FormControl sx={{ minWidth: 240, ml: "auto" }} size="small">
          <InputLabel>Organizations</InputLabel>
          <Select
            multiple
            value={selectedOrgs}
            onChange={(e) => setSelectedOrgs(e.target.value as string[])}
            input={<OutlinedInput label="Organizations" />}
            renderValue={(selected) =>
              selected.length === orgs.length ? "All" : selected.join(", ")
            }
          >
            {orgs.map((org) => (
              <MenuItem key={org} value={org}>
                <Checkbox checked={selectedOrgs.indexOf(org) > -1} />
                <ListItemText primary={org} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>


      {/* Plot Card */}
      <PlotCard>
        {loading ? (
          <Box
            height={300}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Overall line (always visible) */}
              <Area
                type="monotone"
                dataKey="overall"
                stroke={CHART_COLORS.area}
                fill={CHART_COLORS.area}
                name="Overall"
              />

              {/* Selected orgs */}
              {selectedOrgs.map((org, index) => (
                <Area
                  key={org}
                  type="monotone"
                  dataKey={org}
                  stroke={
                    CHART_COLORS.lines[index % CHART_COLORS.lines.length]
                  }
                  fill={CHART_COLORS.lines[index % CHART_COLORS.lines.length]}
                  name={org}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </PlotCard>
    </>
  );
}