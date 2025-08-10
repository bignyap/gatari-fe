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
  return <EndpointLoader resourceTypeId={resourceId} />;
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
  const [search, setSearch] = useState('');

  const fetchEndpoints = async () => {
    setLoading(true);
    try {
      const data = await ListEndpointsByResourceType(resourceTypeId);
      setEndpoints(data || []);
    } catch (error) {
      setSnackbar({
        message: 'Failed to load endpoints.',
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
        permissionCode: newEndpoint.permission_code,
        accessType: newEndpoint.access_type,
      },
    ]);
  };

  const filteredEndpoints = endpoints.filter((ep) =>
    ep.name.toLowerCase().includes(search.toLowerCase()) ||
    ep.pathTemplate.toLowerCase().includes(search.toLowerCase())
  );

  const headCells: HeadCell[] = [
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'httpMethod', label: 'HTTP Method' },
    { id: 'pathTemplate', label: 'Path Template' },
    { id: 'permissionCode', label: 'Permission' },
    { id: 'accessType', label: 'Access Type' },
  ];

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
          placeholder="Search endpoints..."
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
          label="Create Endpoint"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEndpoint}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : filteredEndpoints.length > 0 ? (
        <EnhancedTable
          stickyColumnIds={[]}
          rows={filteredEndpoints.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          headCells={headCells}
          defaultSort="id"
          defaultRows={rowsPerPage}
          page={page}
          count={filteredEndpoints.length}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          No endpoints found.
        </Typography>
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
