import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Edit, Cancel, Save } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

import {
  GetOrganizationById,
  UpdateOrganization,
} from '../../libraries/Organization';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { SubscriptionLoader } from '../Subscription/Subscription';
import OrganizationForm from './OrganizationForm';
import ConfigEditor from './ConfigEditor';
import CommonButton from '../../components/Common/Button';
import PermissionsPage from './Permission';

interface OrganizationRow {
  id: string;
  name: string;
  type: string;
  realm: string;
  country: string;
  support_email: string;
  active: boolean;
  report_q: boolean;
  created_at: string;
  updated_at: string;
  config: string;
  type_id: number;
}

export function ViewOrganizationPage({ orgId }: { orgId: number }) {
  return (
    <Box>
      <ViewOrganizationLoader orgId={orgId} />
    </Box>
  );
}

function SectionWrapper({ children }: { title: string; children: React.ReactNode }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        borderColor: 'rgba(33,48,66,0.2)',
        backgroundColor: '#fff',
        mb: 3,
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ViewOrganizationLoader({ orgId }: { orgId: number }) {
  const [organization, setOrganization] = useState<OrganizationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedConfig, setEditedConfig] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (orgId) fetchOrganization(orgId);
  }, [orgId]);

  async function fetchOrganization(id: number) {
    try {
      const orgData = await GetOrganizationById(id);
      setOrganization(orgData);
    } catch {
      setSnackbar({ message: 'Failed to load organization', status: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (formData: any) => {
    if (!organization) return;

    const updatedOrg = {
      ...organization,
      ...formData,
      config: editedConfig ?? organization.config,
    };

    const { created_at, updated_at, id, ...rest } = updatedOrg;
    const payload = {
      ...rest,
      organization_id: id,
    };

    try {
      await UpdateOrganization(payload);
      setOrganization(updatedOrg);
      setSnackbar({ message: 'Organization updated successfully.', status: 'success' });
      setIsEditMode(false);
      setEditedConfig(null);
    } catch (err) {
      console.error('Update failed:', err);
      setSnackbar({ message: 'Failed to update organization.', status: 'error' });
    }
  };

  const handleSave = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const plain: any = Object.fromEntries(formData.entries());
      handleSubmit(plain);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}

      <Box>

        <Tabs
          value={tabIndex}
          onChange={( e, newVal) => setTabIndex(newVal)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Configuration" />
          <Tab label="Subscription" />
          <Tab label="Permission" />
          <Tab label="Usage" />
        </Tabs>

        {tabIndex === 0 && (
          <SectionWrapper title="Organization Info & Config">
            <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
              {isEditMode && (
                <CommonButton
                  label="Save"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                />
              )}
              <CommonButton
                label={isEditMode ? 'Cancel' : 'Edit'}
                variant="contained"
                startIcon={isEditMode ? <Cancel /> : <Edit />}
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (!isEditMode && organization) {
                    setEditedConfig(organization.config);
                  }
                }}
              />
            </Box>

            <form
              id="org-form"
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const plain: any = Object.fromEntries(formData.entries());
                handleSubmit(plain);
              }}
            >
              <OrganizationForm
                initialData={organization}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditMode(false)}
                columns={3}
                buttonAtTop={true}
                includeConfig={false}
                disabled={!isEditMode}
              />
            </form>

            {organization && (
              <ConfigEditor
                config={editedConfig ?? organization.config}
                onConfigChange={(newConfig) => setEditedConfig(newConfig)}
                editorMode={isEditMode}
                alwaysEditMode={false}
                disabled={!isEditMode}
                cardSx={{ border: 'none', boxShadow: 'none' }}
              />
            )}
          </SectionWrapper>
        )}

        {tabIndex === 1 && (
          <SectionWrapper title="Subscriptions">
            {organization && (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <SubscriptionLoader
                  orgId={orgId}
                  subInitName={organization.name}
                  tableContainerSx={{
                    width: '100%',
                    maxHeight: '50vh',
                    overflowX: 'auto',
                    overflowY: 'auto',
                  }}
                />
              </Box>
            )}
          </SectionWrapper>
        )}

        {tabIndex === 2 && (
          <SectionWrapper title="Permissions">
            {organization && (
              <PermissionsPage organizationId={Number(organization.id)} />
            )}
          </SectionWrapper>
        )}

        {tabIndex === 3 && (
          <SectionWrapper title="Usage">
            <Typography variant="body1" pl={1}>
              Usage data will be displayed here.
            </Typography>
          </SectionWrapper>
        )}

      </Box>
    </>
  );
}

export default ViewOrganizationLoader;