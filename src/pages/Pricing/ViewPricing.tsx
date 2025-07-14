import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { EnhancedTable } from "../../components/Table/Table";
import { HeadCell, FormatCellValue } from "../../components/Table/Utils";
import { CustomizedSnackbars } from "../../components/Common/Toast";
import { DeleteTierPricing, GetTierPricingBySubTierId } from "../../libraries/TierPricing";
import TierPricingModal from "./PricingModal";
import CommonButton from "../../components/Common/Button";
import AddIcon from "@mui/icons-material/Add";

export default function TierPricingView({ tierId }: { tierId: number }) {
  const [tierPricing, setTierPricing] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState("");

  async function fetchTierPricing(newPage: number, perPage: number) {
    try {
      const res = await GetTierPricingBySubTierId(tierId, newPage, perPage);
      setCount(res.total_items);
      setTierPricing(res.total_items > 0 ? res.data : []);
    } catch (error) {
      setSnackbar({
        message: "Failed to load tier pricings.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTierPricing(page + 1, itemsPerPage);
  }, [tierId, page, itemsPerPage]);

  const handleCreate = () => setIsModalOpen(true);

  const handleDelete = async (row: any) => {
    try {
      await DeleteTierPricing(row.id);
      fetchTierPricing(page + 1, itemsPerPage);
    } catch {
      setSnackbar({ message: "Delete failed", status: "error" });
    }
  };

  const headCells: HeadCell[] = [
    { id: "endpoint_name", label: "Endpoint", width: 20 },
    { id: "base_cost_per_call", label: "Base Cost / Call" },
    { id: "base_rate_limit", label: "Rate Limit / Sec" },
  ];

  const filteredRows = tierPricing.filter((row) =>
    row.endpoint_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open
          onClose={() => setSnackbar(null)}
        />
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 320 }}
        />
        <CommonButton
          label="Create Tier Pricing"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        />
      </Box>

      {filteredRows.length > 0 ? (
        <EnhancedTable
          rows={filteredRows}
          renderCell={(key, value) => FormatCellValue(value)}
          headCells={headCells}
          defaultSort="id"
          defaultRows={10}
          page={page}
          count={count}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(n) => {
            setItemsPerPage(n);
            fetchTierPricing(1, n);
          }}
          menuOptions={["Delete"]}
          onOptionSelect={(action, row) => {
            if (action === "Delete") handleDelete(row);
          }}
          stickyColumnIds={["endpoint_name"]}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          No tier pricing records found.
        </Typography>
      )}

      {isModalOpen && (
        <TierPricingModal
          onClose={() => setIsModalOpen(false)}
          onTierPricingCreated={() => fetchTierPricing(1, itemsPerPage)}
          tierId={tierId}
        />
      )}
    </Box>
  );
}