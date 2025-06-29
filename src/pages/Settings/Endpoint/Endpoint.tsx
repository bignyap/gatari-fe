import { useEffect, useState } from 'react';
import { ListEndpoints } from '../../../libraries/Endpoint';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import EndpointModal from './EndpointModal';
import CommonButton from '../../../components/Common/Button';
import { Box } from '@mui/material';
import { TextField, InputAdornment }  from '@mui/material'; 
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
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const endpointData = await ListEndpoints(1, 10);
        setEndpoints(endpointData);
      } catch (error) {
        console.error("Error fetching endpoints:", error);
        setEndpoints([]);
        setSnackbar({
          message: "Failed to load endpoints. Please try again later.",
          status: "error"
        });
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchEndoints();
    }, []);
  
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </div>
      );
    }
  
    const handleCreateEndpoint = async () => {
      setIsModalOpen(true);
    };
  
    const handleEndpointCreated = (newEndpoint: any) => {
      setEndpoints([...endpoints, newEndpoint]);
    };
  
    return (
      <div>
        {snackbar && (
          <CustomizedSnackbars
            message={snackbar.message}
            status={snackbar.status}
            open={true} // Ensure the snackbar opens automatically
            onClose={() => setSnackbar(null)}
          />
        )}
        <EnhancedTable
          rows={endpoints}
          headCells={headCells}
          defaultSort="id"
          defaultRows={1}
          stickyColumnIds={[]}
          tableContainerSx= {{
            maxHeight: '50vh',
            overflowX: 'auto',
            overflowY: 'auto'
          }}
          title={
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
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
                // Add onChange handler if needed
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
          page={0}
          count={-1}
          onPageChange={(newPage) => {
          }}
          onRowsPerPageChange={(event) => {
          }}
        />
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
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
  ];