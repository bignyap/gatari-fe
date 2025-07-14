import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CreateOrganization } from "../../libraries/Organization";
import OrganizationForm from "./OrganizationForm";

interface OrganizationModalProps {
  onClose: () => void;
  onOrganizationCreated: (org: any) => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  onClose,
  onOrganizationCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const initialData = {
    name: "",
    realm: "",
    country: "",
    support_email: "",
    active: true,
    report_q: false,
    config: "",
    type_id: 0,
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      const newOrg = await CreateOrganization(data);
      onOrganizationCreated(newOrg);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          margin: { xs: 1, sm: 2 },
          width: "100%",
          maxWidth: "800px",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          position: "relative",
        }}
      >
        Create Organization
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
          px: { xs: 2, sm: 3 },
          py: 2,
          maxHeight: "calc(100vh - 160px)",
          flex: 1,
        }}
      >
        <Paper elevation={0} sx={{ p: 0 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <OrganizationForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={onClose}
              columns={3}
              includeConfig
              buttonAtTop={false}
            />
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationModal;