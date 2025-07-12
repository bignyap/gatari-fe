// components/PlotCard.tsx
import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function PlotCard({
  title,
  height = 300,
  children,
}: {
  title?: string; // <-- made optional
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,245,0.8))",
        backdropFilter: "blur(12px)",
        p: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {title && (
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="text.primary"
          mb={2}
          sx={{ textTransform: "capitalize", letterSpacing: 0.3 }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}