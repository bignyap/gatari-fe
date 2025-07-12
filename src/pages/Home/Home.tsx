import { Box } from "@mui/material";
import CountPage from "./Counts";
import CreditsRemaining from './CreditsRemaining';
import DailyUsage from './Usage';

export function HomePage() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        width: "100vw",
        height: "100vh",
        gap: 2,
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {/* Top Left */}
      <Box sx={{ borderRadius: 3, p: 2, overflow: "hidden", bgcolor: "background.paper", boxShadow: 1 }}>
        <CountPage />
      </Box>

      {/* Top Right */}
      <Box sx={{ borderRadius: 3, p: 2, bgcolor: "background.paper", boxShadow: 1 }}>
        <CreditsRemaining />
      </Box>

      {/* Bottom Full Width */}
      <Box
        sx={{
          gridColumn: "1 / span 2",
          borderRadius: 3,
          p: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <DailyUsage />
      </Box>
    </Box>
  );
}