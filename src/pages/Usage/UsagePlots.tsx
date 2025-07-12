// src/pages/Usage/UsagePlots.tsx
import { Box, Grid } from "@mui/material";
import UsageMonthlyPlot from "./UsageMonthlyPlot";
import UsageCostPerCallPlot from "./UsageCostPercall";
import UsagePlotByEndpointOrg from "./UsagePlotByEndpointOrg"

export default function UsagePlots({ res, filters }: { filters:any, res: any }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UsagePlotByEndpointOrg data={res} />
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