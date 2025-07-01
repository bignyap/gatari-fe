import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { ListOrgPermission, UpdateOrgPermission } from '../../libraries/OrgPermission';
import { ListResourceTypes } from '../../libraries/ResourceType';
import CommonButton from '../../components/Common/Button';
import { Save, Cancel, Edit } from '@mui/icons-material';

const CRUD_CODES = ['C', 'R', 'U', 'D'];

const diagonalHeaderCellSx = {
  position: 'relative',
  width: 100,
  height: 70,
  p: 0,
  backgroundColor: 'background.paper',
  borderBottom: '1px solid rgba(224, 224, 224, 1)',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(45deg, transparent 49.5%, rgba(224, 224, 224, 1) 50%, transparent 50.5%)',
    zIndex: 1,
  },
};

const topLabelSx = {
  position: 'absolute',
  top: 6,
  right: 6,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'text.primary',
  zIndex: 2,
  textAlign: 'right',
};

const bottomLabelSx = {
  position: 'absolute',
  bottom: 6,
  left: 6,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'text.primary',
  zIndex: 2,
};

interface OrgPermissionData {
  resourceTypeId: number;
  organizationId: number;
  permissionCode: string;
}

interface ResourceTypeData {
  id: number;
  name: string;
  code: string;
  description: string;
}

const PermissionGrid: React.FC<{ organizationId: number }> = ({ organizationId }) => {
  const [orgPermissions, setOrgPermissions] = useState<OrgPermissionData[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const allPermissions = await ListOrgPermission(organizationId, 1, 100);
      const resources = await ListResourceTypes(1, 100);
      setOrgPermissions(Array.isArray(allPermissions) ? allPermissions : [])
      setResourceTypes(resources);
      setEditedPermissions(
        new Set(allPermissions.map((p: any) => `${p.resourceTypeId}-${p.permissionCode}`))
      );
    } catch (error) {
      console.error('Error loading data:', error);
      setOrgPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (resourceId: number, code: string): boolean => {
    return editedPermissions.has(`${resourceId}-${code}`);
  };

  const togglePermission = (resourceId: number, code: string) => {
    const key = `${resourceId}-${code}`;
    const newSet = new Set(editedPermissions);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setEditedPermissions(newSet);
  };

  const handleSave = () => {
    UpdateOrgPermission(organizationId, Array.from(editedPermissions).map((key) => {
        const [resourceTypeId, permissionCode] = key.split('-');
        return { "resource_type_id": Number(resourceTypeId), "permission_code": permissionCode };
      }),
    );    
    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Reset to original
    setEditedPermissions(
      new Set(orgPermissions.map((p) => `${p.resourceTypeId}-${p.permissionCode}`))
    );
    setIsEditMode(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: 3,
        p: 3,
        mt: 4,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
          {isEditMode ? (
            <>
              <CommonButton
                label="Cancel"
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              />
              <CommonButton
                label="Save"
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              />
            </>
          ) : (
            <CommonButton
              label="Edit"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditMode(true)}
            />
          )}
        </Box>

        <TableContainer
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={diagonalHeaderCellSx}>
                  <Box sx={topLabelSx}>Code</Box>
                  <Box sx={bottomLabelSx}>Resource</Box>
                </TableCell>
                {CRUD_CODES.map((code) => (
                  <TableCell
                    key={code}
                    align="center"
                    sx={{ color: 'text.primary' }}
                  >
                    {code}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resourceTypes.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell sx={{ color: 'text.primary' }}>
                    {resource.name}
                  </TableCell>
                  {CRUD_CODES.map((code) => (
                    <TableCell key={code} align="center">
                      <Checkbox
                        checked={hasPermission(resource.id, code)}
                        disabled={!isEditMode}
                        onChange={() => togglePermission(resource.id, code)}
                        sx={{
                            color: 'rgba(0, 0, 0, 0.54)', // base icon color (like MUI default)
                            '&.Mui-checked': {
                              color: 'rgba(0, 0, 0, 0.87)', // solid black check for contrast
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)', // subtle hover
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                              filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.2))',
                            },
                          }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PermissionGrid;
