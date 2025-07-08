// src/pages/Usage/UsagePlots.tsx
import { Box, Grid } from "@mui/material";
import UsagePlotByEndpointOrg from "./UsagePlotByEndpointOrg";
import UsageMonthlyPlot from "./UsageMonthlyPlot";
import UsageCostPerCallPlot from "./UsageCostPercall";
import CallsPlotByEndpointOrg from "./CallsByEndpointOrg"

export default function UsagePlots({ res, filters }: { filters:any, res: any }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UsagePlotByEndpointOrg res={res} />
        </Grid>
        <Grid item xs={12}>
          <CallsPlotByEndpointOrg res={res} />
        </Grid>
        <Grid item xs={12}>
          <UsageCostPerCallPlot res={res} />
        </Grid>
        <Grid item xs={12}>
          <UsageMonthlyPlot filters={filters} />
        </Grid>
        {/* Add more <Grid item xs={12}> for additional full-width plots */}
      </Grid>
    </Box>
  );
}