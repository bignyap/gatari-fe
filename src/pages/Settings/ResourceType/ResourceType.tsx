import { useEffect, useState } from 'react';
import { ListResourceTypes } from '../../../libraries/ResourceType';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import ResourceTypeModal from './ResourceTypeModal';
import CommonButton from '../../../components/Common/Button';
import { Box } from '@mui/material';
import { TextField, InputAdornment }  from '@mui/material'; 
import SearchIcon from '@mui/icons-material/Search';

export function ResourceTypeTab() {
    return (
      <div>
        <ResourceTypeLoader />
      </div>
    );
  }

export function ResourceTypeLoader() {
    const [resourceTypes, setResourceTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const resourceTypeData = await ListResourceTypes(1, 10);
        setResourceTypes(resourceTypeData);
      } catch (error) {
        console.error("Error fetching resource types:", error);
        setResourceTypes([]);
        setSnackbar({
          message: "Failed to load resource types. Please try again later.",
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
  
    const handleCreateResourceType = async () => {
      setIsModalOpen(true);
    };
  
    const handleResourceTypeCreated = (newResType: any) => {
      setResourceTypes([...resourceTypes, newResType]);
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
          rows={resourceTypes}
          headCells={headCells}
          defaultSort="id"
          defaultRows={10}
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
                label='CREATE RESOURCE'
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<AddIcon />}
                onClick={handleCreateResourceType}
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
          <ResourceTypeModal
            onClose={() => setIsModalOpen(false)}
            onResourceTypeCreated={handleResourceTypeCreated}
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