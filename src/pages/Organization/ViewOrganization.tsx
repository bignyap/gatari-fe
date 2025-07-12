import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { ExpandMore, Edit, Cancel, Save } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  GetOrganizationById,
  UpdateOrganization
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
  const navigate = useNavigate();
  return (
    <Box>
      <ViewOrganizationLoader navigate={navigate} orgId={orgId} />
    </Box>
  );
}

function ViewOrganizationLoader({ navigate, orgId }: { navigate: (path: string) => void, orgId: number }) {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<OrganizationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedConfig, setEditedConfig] = useState<string | null>(null);
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

      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          boxSizing: 'border-box',
        }}
      >
        <Accordion sx={{ width: '100%' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Info</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
              {isEditMode && (
                <CommonButton
                  label="Save"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => {
                    if (formRef.current) {
                      const formData = new FormData(formRef.current);
                      const plain: any = Object.fromEntries(formData.entries());
                      handleSubmit(plain);
                    }
                  }}
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

            {organization && (
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
                  buttonAtTop={false}
                  includeConfig={false}
                  disabled={!isEditMode}
                />
              </form>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {organization && (
              <ConfigEditor
                config={editedConfig ?? organization.config}
                onConfigChange={(newConfig) => setEditedConfig(newConfig)}
                onSave={() => {
                  if (formRef.current) {
                    const formData = new FormData(formRef.current);
                    const plain: any = Object.fromEntries(formData.entries());
                    handleSubmit(plain);
                  }
                }}
                editorMode={isEditMode}
                alwaysEditMode={false}
                cardSx={{
                  border: 'none',
                  boxShadow: 'none'
                }}
              />
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Subscription</Typography>
          </AccordionSummary>
          <AccordionDetails
              sx={{
                width: '100%',
                overflowX: 'auto',
                px: 2,
                pt: 1,
                pb: 2,
              }}
            >
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
            </AccordionDetails>
        </Accordion>

        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Permission</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {organization && <PermissionsPage organizationId={Number(organization.id)} />}
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>Usage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" pl={1}>
              Usage data will be displayed here.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Box>
    </>
  );
}

export default ViewOrganizationLoader;