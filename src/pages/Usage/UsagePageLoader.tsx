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

  // Group data by groupBy key
  const groupedData: Record<string, any[]> = {};
  for (const item of data) {
    const key = item[groupBy] || "Ungrouped";
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(item);
  }

  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

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
      ) : error ? (
        <Typography variant="body1" textAlign="center" color="error">
          {error}
        </Typography>
      ) : Object.entries(groupedData).length === 0 ? (
        <Typography variant="body1" textAlign="center">
          No usage data found.
        </Typography>
      ) : (
        Object.entries(groupedData).map(([group, rows]) => (
          <Accordion
            key={group}
            // defaultExpanded
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

        // Convert date fields to unix
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), options?.groupBy, options?.page, options?.itemsPerPage]);

  return { data, loading, error };
}