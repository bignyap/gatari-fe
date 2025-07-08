// src/pages/Usage/UsagePlots.tsx
import { Box, Grid } from "@mui/material";
import UsagePlotByEndpointOrg from "./UsagePlotByEndpointOrg";
import UsageOverallEndpointPlot from "./UsageOverallEndpointPlot";
import UsageMonthlyPlot from "./UsageMonthlyPlot";

export default function UsagePlots({
  filters,
}: {
  filters: any;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UsagePlotByEndpointOrg filters={filters} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UsageOverallEndpointPlot filters={filters} />
        </Grid>
        <Grid item xs={12}>
          <UsageMonthlyPlot filters={filters} />
        </Grid>
        {/* Add more <Grid item> components here for new plots */}
      </Grid>
    </Box>
  );
}