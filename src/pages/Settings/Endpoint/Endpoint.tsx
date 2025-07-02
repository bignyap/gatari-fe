import { useEffect, useState } from 'react';
import { ListEndpoints } from '../../../libraries/Endpoint';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table';
import { HeadCell } from '../../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import EndpointModal from './EndpointModal';
import CommonButton from '../../../components/Common/Button';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function EndpointTab() {
  return (
    <div>
      <EndpointLoader />
    </div>
  );
}

export function EndpointLoader() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchEndpoints = async (pageNumber: number, limit: number) => {
    setLoading(true);
    try {
      const endpointData = await ListEndpoints(pageNumber + 1, limit); // +1 if backend is 1-indexed
      setEndpoints(endpointData);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      setSnackbar({
        message: 'Failed to load endpoints. Please try again later.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleCreateEndpoint = () => {
    setIsModalOpen(true);
  };

  const handleEndpointCreated = (newEndpoint: any) => {
    setEndpoints((prev) => [...prev, {
      id: newEndpoint.id,
      name: newEndpoint.name,
      description: newEndpoint.description,
      httpMethod: newEndpoint.http_method,
      pathTemplate: newEndpoint.path_template,
      resourceTypeId: newEndpoint.resource_type_id,
      resourceTypeName: newEndpoint.resource_type_name,
    }]);
  };

  return (
    <div>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open
          onClose={() => setSnackbar(null)}
        />
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedTable
          rows={endpoints}
          headCells={headCells}
          defaultSort="id"
          defaultRows={rowsPerPage}
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
                style={{ width: '400px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <CommonButton
                label="CREATE ENDPOINT"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<AddIcon />}
                onClick={handleCreateEndpoint}
              />
            </Box>
          }
          page={page}
          count={-1} // Set actual count if available
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage: number) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />
      )}
      {isModalOpen && (
        <EndpointModal
          onClose={() => setIsModalOpen(false)}
          onEndpointCreated={handleEndpointCreated}
        />
      )}
    </div>
  );
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'httpMethod', label: 'HTTP Method' },
  { id: 'pathTemplate', label: 'Path Template' },
  { id: 'resourceTypeName', label: 'Resource Type' },
];