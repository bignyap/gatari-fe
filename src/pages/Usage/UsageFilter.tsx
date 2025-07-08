// src/pages/Usage/UsageFilter.tsx
import React from "react";
import { Box, TextField } from "@mui/material";
import CommonButton from "../../components/Common/Button";

export type UsageFilterState = {
  organization_id: string;
  subscription_id: string;
  endpoint_id: string;
  start_date: string;
  end_date: string;
};

type UsageFilterProps = {
  filters: UsageFilterState;
  setFilters: React.Dispatch<React.SetStateAction<UsageFilterState>>;
  onSearch: () => void;
};

export default function UsageFilter({ filters, setFilters, onSearch }: UsageFilterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Organization ID"
        name="organization_id"
        value={filters.organization_id}
        onChange={handleInputChange}
        size="small"
        type="number"
        fullWidth
      />
      <TextField
        label="Subscription ID"
        name="subscription_id"
        value={filters.subscription_id}
        onChange={handleInputChange}
        size="small"
        type="number"
        fullWidth
      />
      <TextField
        label="Endpoint ID"
        name="endpoint_id"
        value={filters.endpoint_id}
        onChange={handleInputChange}
        size="small"
        type="number"
        fullWidth
      />
      <TextField
        label="Start Date"
        name="start_date"
        value={filters.start_date}
        onChange={handleInputChange}
        size="small"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        name="end_date"
        value={filters.end_date}
        onChange={handleInputChange}
        size="small"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <CommonButton label="Search" onClick={onSearch} fullWidth />
    </Box>
  );
}