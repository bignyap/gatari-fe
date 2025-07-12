import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { ListEndpointsByResourceType } from '../../libraries/Endpoint';
import { EnhancedTable } from '../../components/Table/Table';
import { HeadCell } from '../../components/Table/Utils';
import CommonButton from '../../components/Common/Button';
import EndpointModal from './EndpointModal';
import { CustomizedSnackbars } from '../../components/Common/Toast';

interface ViewEndpointsProps {
  resourceId: number;
}

export default function ViewEndpoints({ resourceId }: ViewEndpointsProps) {
  return (
    <Box>
      <EndpointLoader resourceTypeId={resourceId} />
    </Box>
  );
}

interface EndpointLoaderProps {
  resourceTypeId: number;
}

function EndpointLoader({ resourceTypeId }: EndpointLoaderProps) {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>('');

  const fetchEndpoints = async () => {
    setLoading(true);
    try {
      const data = await ListEndpointsByResourceType(resourceTypeId);
      setEndpoints(data || []);
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
    fetchEndpoints();
  }, [resourceTypeId]);

  const handleCreateEndpoint = () => setIsModalOpen(true);

  const handleEndpointCreated = (newEndpoint: any) => {
    setEndpoints((prev) => [
      ...prev,
      {
        id: newEndpoint.id,
        name: newEndpoint.name,
        description: newEndpoint.description,
        httpMethod: newEndpoint.http_method,
        pathTemplate: newEndpoint.path_template,
        resourceTypeId: newEndpoint.resource_type_id,
        resourceTypeName: newEndpoint.resource_type_name,
      },
    ]);
  };

  const filteredEndpoints = endpoints.filter((ep) =>
    ep.name.toLowerCase().includes(searchText.toLowerCase()) ||
    ep.pathTemplate.toLowerCase().includes(searchText.toLowerCase())
  );

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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedTable
          rows={filteredEndpoints.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          headCells={headCells}
          defaultSort="id"
          defaultRows={rowsPerPage}
          stickyColumnIds={[]}
          tableContainerSx={{
            maxHeight: '55vh',
            overflowX: 'auto',
            overflowY: 'auto',
          }}
          title={
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search endpoints..."
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ width: '400px' }}
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
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateEndpoint}
              />
            </Box>
          }
          page={page}
          count={filteredEndpoints.length}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />
      )}

      {isModalOpen && (
        <EndpointModal
          resourceTypeId={resourceTypeId}
          onClose={() => setIsModalOpen(false)}
          onEndpointCreated={handleEndpointCreated}
        />
      )}
    </Box>
  );
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'httpMethod', label: 'HTTP Method' },
  { id: 'pathTemplate', label: 'Path Template' },
  // { id: 'resourceTypeName', label: 'Resource Type' },
];