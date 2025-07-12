import { useEffect, useState } from 'react';
import { ListPermissionTypes } from '../../libraries/PermissionType';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../components/Table/Table';
import { HeadCell } from '../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import PermissionTypeModal from './PermissionModal';
import CommonButton from '../../components/Common/Button';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function PermissionTypeTab() {
  return (
    <Box pt={2}>
      <PermissionTypeLoader />
    </Box>
  );
}

export function PermissionTypeLoader() {
  const [permissionTypes, setPermissionTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  async function fetchEndpoints() {
    try {
      const data = await ListPermissionTypes(1, 10);
      setPermissionTypes(data);
    } catch (error) {
      console.error('Error fetching permission types:', error);
      setSnackbar({
        message: 'Failed to load permission types. Please try again later.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleCreatePermissionType = () => {
    setIsModalOpen(true);
  };

  const handlePermissionTypeCreated = (newType: any) => {
    setPermissionTypes((prev) => [...prev, newType]);
  };

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

      <EnhancedTable
        rows={permissionTypes}
        headCells={headCells}
        defaultSort="name"
        defaultRows={10}
        stickyColumnIds={[]}
        tableContainerSx={{
          maxHeight: '50vh',
          overflowX: 'auto',
          overflowY: 'auto',
        }}
        title={
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              sx={{ width: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <CommonButton
              label="CREATE PERMISSION"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePermissionType}
            />
          </Box>
        }
        page={0}
        count={-1}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />

      {isModalOpen && (
        <PermissionTypeModal
          onClose={() => setIsModalOpen(false)}
          onPermissionTypeCreated={handlePermissionTypeCreated}
        />
      )}
    </Box>
  );
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'description', label: 'Description' },
];