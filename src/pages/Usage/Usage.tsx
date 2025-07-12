import { useState } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Container,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import InsertChartIcon from "@mui/icons-material/InsertChart";

import Sidebar from "../../components/Sidebar/Sidebar";
import UsageFilter, { UsageFilterState } from "./UsageFilter";
import UsagePlots from "./UsagePlots";
import { 
  UseApiUsageData, GetNonEmptyFilters, UsagePageLoader 
} from "./UsagePageLoader";

export function UsagePage() {
  const [filters, setFilters] = useState<UsageFilterState>({
    organization_id: "",
    subscription_id: "",
    endpoint_id: "",
    start_date: "",
    end_date: "",
  });
  const [showTable, setShowTable] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();

  const sidebarWidth = sidebarOpen ? 300 : 60;

  // Fetch ungrouped data for plots
  const { data: usageData, loading } = UseApiUsageData(filters);

  const viewToggle = (
    <Tooltip title={showTable ? "View Graphs" : "View Table"}>
      <IconButton
        onClick={() => setShowTable((prev) => !prev)}
        sx={{
          bgcolor: theme.palette.grey[100],
          borderRadius: 2,
          "&:hover": {
            bgcolor: theme.palette.grey[300],
          },
        }}
      >
        {showTable ? <InsertChartIcon fontSize="small" /> : <TableViewIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Fixed Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          zIndex: 10,
          transition: "width 0.3s",
          backgroundColor: "#fff",
          boxShadow: 2,
        }}
      >
        <Sidebar
          title="Filters"
          headerRight={viewToggle}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        >
          <UsageFilter
            filters={filters}
            setFilters={setFilters}
            onSearch={() => {}}
          />
        </Sidebar>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          marginLeft: `${sidebarWidth}px`,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "start", // Ensure top alignment
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Container maxWidth="xl" sx={{ width: "100%" }}>
          {showTable ? (
            <UsagePageLoader filters={filters} groupBy="organization_name" />
          ) : (
            <UsagePlots res={usageData} filters={GetNonEmptyFilters(filters)} />
          )}
        </Container>
      </Box>
    </>
  );
}