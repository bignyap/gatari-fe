import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import CountPage from "./Counts";
import CreditsRemaining from "./CreditsRemaining";
import DailyUsage from "./Usage";

export function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        boxSizing: "border-box",
        p: 2,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 3,
              p: 2,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: isMobile ? "auto" : 300,
            }}
          >
            <CountPage />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              borderRadius: 3,
              p: 2,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: isMobile ? "auto" : 300,
            }}
          >
            <CreditsRemaining />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              borderRadius: 3,
              p: 2,
              bgcolor: "background.paper",
              boxShadow: 3,
              minHeight: 350,
            }}
          >
            <DailyUsage />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}