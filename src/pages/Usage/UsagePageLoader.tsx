import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { saveAs } from "file-saver";
import { EnhancedTable } from "../../components/Table/Table";
import { FormatCellValue, HeadCell } from "../../components/Table/Utils";
import { CustomizedSnackbars } from "../../components/Common/Toast";
import { UsageFilterState } from "./UsageFilter";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { GetApiUsageSummary } from "../../libraries/ApiUsage";

export function UsagePageLoader({
  filters,
  groupBy = "organization_name",
}: {
  filters: UsageFilterState;
  groupBy?: "organization_name" | "endpoint_name" | "month";
}) {
  const { data, loading, error } = UseApiUsageData(filters, {
    groupBy,
    page: 1,
    itemsPerPage: 100,
  });

  const groupedData: Record<string, any[]> = {};
  for (const item of data) {
    const key = item[groupBy] || "Ungrouped";
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(item);
  }

  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const theme = useTheme();

  const exportToCSV = (rows: any[], fileName: string) => {
    const csvHeaders = usageHeadCells.map(h => `"${h.label}"`).join(",");
    const csvRows = rows.map(row =>
      usageHeadCells.map(h => `"${row[h.id] ?? ""}"`).join(",")
    );
    const csvContent = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${fileName}.csv`);
  };

  const calculateGroupTotals = (rows: any[]) => {
    const totalCalls = rows.reduce((sum, r) => sum + (r.total_calls || 0), 0);
    const totalCost = rows.reduce((sum, r) => sum + (r.total_cost || 0), 0);
    return { totalCalls, totalCost };
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
      ) : error ? (
        <Typography variant="body1" textAlign="center" color="error">
          {error}
        </Typography>
      ) : Object.entries(groupedData).length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No usage data found.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {Object.entries(groupedData).map(([group, rows]) => {
            const { totalCalls, totalCost } = calculateGroupTotals(rows);

            return (
              <Grid key={group} item xs={12} sm={12} md={6} lg={6}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header section with title and export */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {group}
                    </Typography>
                    <Tooltip title="Export CSV">
                      <IconButton
                        size="small"
                        onClick={() => exportToCSV(rows, group.replace(/\s+/g, "_"))}
                      >
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Totals section */}
                  <Box
                    mt={0.5}
                    display="flex"
                    gap={4}
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Calls:</strong> {totalCalls}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Scrollable table section */}
                  <Box sx={{ overflowY: "auto", maxHeight: 300 }}>
                    <EnhancedTable
                      rows={rows}
                      headCells={usageHeadCells}
                      renderCell={(key, value) => FormatCellValue(value)}
                      defaultSort=""
                      count={rows.length}
                      page={0}
                      defaultRows={5}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                      stickyColumnIds={[]}
                      showPaginationControls={false}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}


const usageHeadCells: HeadCell[] = [
  { id: "endpoint_name", label: "Endpoint" },
  { id: "total_calls", label: "Total Calls" },
  { id: "total_cost", label: "Total Cost" },
];

export function GetNonEmptyFilters(filters: UsageFilterState): Partial<UsageFilterState> {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "")
  );
}

export function UseApiUsageData(
  filters: UsageFilterState,
  options?: { groupBy?: "organization_name" | "endpoint_name" | "month"; page?: number; itemsPerPage?: number }
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams: Record<string, any> = {
          ...GetNonEmptyFilters(filters),
        };
        if (options?.groupBy) queryParams.group_by = true;
        if (options?.page) queryParams.page_number = options.page;
        if (options?.itemsPerPage) queryParams.items_per_page = options.itemsPerPage;

        Object.entries(queryParams).forEach(([key, val]) => {
          if (key === "start_date" || key === "end_date") {
            queryParams[key] = dayjs(val).unix();
          }
        });

        const res = await GetApiUsageSummary(queryParams);
        setData(res);
      } catch (err) {
        setError("Failed to fetch API usage data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [JSON.stringify(filters), options?.groupBy, options?.page, options?.itemsPerPage]);

  return { data, loading, error };
}