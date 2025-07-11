import { useEffect, useState } from 'react';
import { ListPermissionTypes } from '../../../libraries/PermissionType';
import CircularProgress from '@mui/material/CircularProgress';
import { EnhancedTable } from '../../../components/Table/Table'
import { HeadCell } from '../../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../../components/Common/Toast';
import PermissionTypeModal from './PermissionTypeModal';
import CommonButton from '../../../components/Common/Button';
import { Box } from '@mui/material';
import { TextField, InputAdornment }  from '@mui/material'; 
import SearchIcon from '@mui/icons-material/Search';

export function PermissionTypeTab() {
    return (
      <div>
        <PermissionTypeLoader />
      </div>
    );
  }

export function PermissionTypeLoader() {
    const [permissionTypes, setPermissionTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ message: string, status: string } | null>(null);
  
    async function fetchEndoints() {
      try {
        const permissionTypeData = await ListPermissionTypes(1, 10);
        setPermissionTypes(permissionTypeData);
      } catch (error) {
        console.error("Error fetching resource types:", error);
        setPermissionTypes([]);
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
  
    const handleCreatePermissionType = async () => {
      setIsModalOpen(true);
    };
  
    const handlePermissionTypeCreated = (newResType: any) => {
      setPermissionTypes([...permissionTypes, newResType]);
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
          rows={permissionTypes}
          headCells={headCells}
          defaultSort="name"
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
                label='CREATE PERMISSION'
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<AddIcon />}
                onClick={handleCreatePermissionType}
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
          <PermissionTypeModal
            onClose={() => setIsModalOpen(false)}
            onPermissionTypeCreated={handlePermissionTypeCreated}
          />
        )}
      </div>
    );
  }
  
  const headCells: HeadCell[] = [
    { id: 'name', label: 'Name' },
    { id: 'code', label: 'Code' },
    { id: 'description', label: 'Description' },
  ];