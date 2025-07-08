// src/components/Layout/Sidebar.tsx
import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

type SidebarProps = {
  title?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode; // Optional view toggle
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  title,
  children,
  headerRight,
  isOpen,
  onToggle,
}) => {
  const theme = useTheme();
  const sidebarWidth = isOpen ? 300 : 60;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        transition: "width 0.3s",
        borderRight: `1px solid ${theme.palette.divider}`,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: "100%",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Header buttons (toggle + optional view toggle) */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: isOpen ? sidebarWidth - 100 : 12,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 10,
        }}
      >
        {isOpen && headerRight}

        <Tooltip title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              backgroundColor: "white",
              boxShadow: 1,
            }}
          >
            {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          p: isOpen ? 2 : 0,
          pt: 6,
          overflowY: "auto",
          flex: 1,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: isOpen ? "auto" : "none",
          whiteSpace: "nowrap",
        }}
      >
        {isOpen && (
          <>
            {title && (
              <>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
            {children}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;