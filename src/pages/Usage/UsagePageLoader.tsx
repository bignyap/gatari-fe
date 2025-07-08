// src/pages/Usage/UsagePageLoader.tsx
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from "dayjs";
import { saveAs } from "file-saver";

import { GetApiUsageSummary } from "../../libraries/ApiUsage";
import { EnhancedTable } from "../../components/Table/Table";
import { FormatCellValue, HeadCell } from "../../components/Table/Utils";
import { CustomizedSnackbars } from "../../components/Common/Toast";
import { UsageFilterState } from "./UsageFilter";

export function UsagePageLoader({
  filters,
  groupBy = "organization_name",
}: {
  filters: UsageFilterState;
  groupBy?: "organization_name" | "endpoint_name" | "month";
}) {
  const [groupedData, setGroupedData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams: Record<string, any> = {
        group_by: true,
        page_number: 1,
        items_per_page: 100,
      };

      Object.entries(filters).forEach(([key, val]) => {
        if (val) {
          queryParams[key] =
            key === "start_date" || key === "end_date" ? dayjs(val).unix() : Number(val);
        }
      });

      const usage = await GetApiUsageSummary(queryParams);

      const grouped: Record<string, any[]> = {};
      for (const item of usage) {
        const key = item[groupBy] || "Ungrouped";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      }

      setGroupedData(grouped);
    } catch (err) {
      console.error("Error fetching usage data", err);
      setSnackbar({
        message: "Failed to fetch API usage data.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  const exportToCSV = (rows: any[], fileName: string) => {
    const csvHeaders = usageHeadCells.map(h => `"${h.label}"`).join(",");
    const csvRows = rows.map(row =>
      usageHeadCells.map(h => `"${row[h.id] ?? ""}"`).join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${fileName}.csv`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : Object.entries(groupedData).length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No usage data found.
        </Typography>
      ) : (
        Object.entries(groupedData).map(([group, rows]) => (
          <Accordion
            key={group}
            defaultExpanded
            sx={{
              width: "100%",
              marginBottom: 2,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.85)",
              boxShadow: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{group}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <Tooltip title="Export CSV">
                  <IconButton onClick={() => exportToCSV(rows, group.replace(/\s+/g, "_"))}>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <EnhancedTable
                rows={rows}
                headCells={usageHeadCells}
                renderCell={(key, value) => FormatCellValue(value)}
                defaultSort="endpoint_name"
                count={rows.length}
                page={0}
                defaultRows={rows.length}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                stickyColumnIds={["endpoint_name"]}
              />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

const usageHeadCells: HeadCell[] = [
  { id: "subscription_name", label: "Subscription" },
  { id: "endpoint_name", label: "Endpoint" },
  { id: "total_calls", label: "Total Calls" },
  { id: "total_cost", label: "Total Cost" },
];