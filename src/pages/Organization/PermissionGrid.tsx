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
  Tooltip,
} from '@mui/material';
import { ListOrgPermission, UpdateOrgPermission } from '../../libraries/OrgPermission';
import { ListAllResourceTypes } from '../../libraries/ResourceType';
import { ListAllPermissionTypes } from '../../libraries/PermissionType';
import CommonButton from '../../components/Common/Button';
import { Save, Cancel, Edit } from '@mui/icons-material';

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

interface PermissionTypeData {
  name: string;
  code: string;
  description: string;
}

const PermissionGrid: React.FC<{ organizationId: number }> = ({ organizationId }) => {
  const [orgPermissions, setOrgPermissions] = useState<OrgPermissionData[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceTypeData[]>([]);
  const [permissionTypes, setPermissionTypes] = useState<PermissionTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const allPermissions = await ListOrgPermission(organizationId, 1, 100);
      const resources = await ListAllResourceTypes();
      const allPermissionTypes = await ListAllPermissionTypes();
      setOrgPermissions(Array.isArray(allPermissions) ? allPermissions : []);
      setResourceTypes(resources);
      setPermissionTypes(allPermissionTypes);
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
    newSet.has(key) ? newSet.delete(key) : newSet.add(key);
    setEditedPermissions(newSet);
  };

  const handleSave = async () => {
    try {
      await UpdateOrgPermission(
        organizationId,
        Array.from(editedPermissions).map((key) => {
          const [resourceTypeId, permissionCode] = key.split('-');
          return {
            resource_type_id: Number(resourceTypeId),
            permission_code: permissionCode,
          };
        })
      );
      setIsEditMode(false);
      fetchData();
    } catch (e) {
      console.error('Error saving permissions', e);
    }
  };

  const handleCancel = () => {
    setEditedPermissions(
      new Set(orgPermissions.map((p) => `${p.resourceTypeId}-${p.permissionCode}`))
    );
    setIsEditMode(false);
  };

  const toggleAllForResource = (resourceId: number) => {
    const newSet = new Set(editedPermissions);
    const allSet = permissionTypes.every((p) =>
      newSet.has(`${resourceId}-${p.code}`)
    );

    permissionTypes.forEach((p) => {
      const key = `${resourceId}-${p.code}`;
      allSet ? newSet.delete(key) : newSet.add(key);
    });

    setEditedPermissions(newSet);
  };

  const toggleAllForPermission = (code: string) => {
    const newSet = new Set(editedPermissions);
    const allSet = resourceTypes.every((r) =>
      newSet.has(`${r.id}-${code}`)
    );

    resourceTypes.forEach((r) => {
      const key = `${r.id}-${code}`;
      allSet ? newSet.delete(key) : newSet.add(key);
    });

    setEditedPermissions(newSet);
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
                {permissionTypes.map((perm) => (
                  <TableCell key={perm.code} align="center">
                    <Tooltip title={perm.name}>
                      <Box>
                        {perm.code}
                        <Checkbox
                          size="small"
                          disabled={!isEditMode}
                          checked={resourceTypes.every((r) =>
                            hasPermission(r.id, perm.code)
                          )}
                          onChange={() => toggleAllForPermission(perm.code)}
                        />
                      </Box>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resourceTypes.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell sx={{ color: 'text.primary' }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      {resource.name}
                      <Checkbox
                        size="small"
                        disabled={!isEditMode}
                        checked={permissionTypes.every((p) =>
                          hasPermission(resource.id, p.code)
                        )}
                        onChange={() => toggleAllForResource(resource.id)}
                      />
                    </Box>
                  </TableCell>
                  {permissionTypes.map((perm) => (
                    <TableCell
                      key={`${resource.id}-${perm.code}`}
                      align="center"
                    >
                      <Checkbox
                        checked={hasPermission(resource.id, perm.code)}
                        disabled={!isEditMode}
                        onChange={() =>
                          togglePermission(resource.id, perm.code)
                        }
                        sx={{
                          color: 'rgba(0, 0, 0, 0.54)',
                          '&.Mui-checked': {
                            color: 'rgba(0, 0, 0, 0.87)',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
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