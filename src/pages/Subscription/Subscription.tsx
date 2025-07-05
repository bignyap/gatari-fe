import { useEffect, useState } from 'react';
import SubscriptionModal from './SubscriptionModal';
import { EnhancedTable } from '../../components/Table/Table';
import { HeadCell } from '../../components/Table/Utils';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ListSubscriptionByOrgIds,
  ListSubscriptions
} from '../../libraries/Subscription';
import CommonButton from '../../components/Common/Button';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SubscriptionProps {
  orgId: number | null;
  subInitName?: string;
  tableContainerSx?: object;
}

export function SubscriptionPage({ orgId }: SubscriptionProps) {
  return (
    <div className="container">
      <SubscriptionLoader orgId={orgId} />
    </div>
  );
}

export function SubscriptionLoader({
  orgId,
  tableContainerSx,
  subInitName = ''
}: SubscriptionProps) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  async function fetchSubscriptions(newPage: number, itemsPerPage: number) {
    try {
      const subData =
        orgId == null
          ? await ListSubscriptions(newPage, itemsPerPage)
          : await ListSubscriptionByOrgIds(orgId, newPage, itemsPerPage);
      const iCount = subData['total_items'];
      setCount(iCount);
      setSubscriptions(iCount > 0 ? subData['data'] : []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions([]);
      setSnackbar({
        message: 'Failed to load subscriptions. Please try again later.',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscriptions(page + 1, itemsPerPage);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const handleCreateSubscription = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleSubscriptionCreated = (newSub: any) => {
    if (editingSub) {
      setSubscriptions(subscriptions.map(sub => (sub.id === newSub.id ? newSub : sub)));
    } else {
      setSubscriptions([...subscriptions, newSub]);
    }
  };

  const onPageChange = async (newPage: number, itemsPerPage: number) => {
    await fetchSubscriptions(newPage, itemsPerPage);
  };

  const handleRowsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchSubscriptions(1, newItemsPerPage);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    onPageChange(newPage + 1, itemsPerPage);
  };

  return (
    <div>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}
      <EnhancedTable
        rows={subscriptions}
        headCells={headCells}
        defaultSort="id"
        defaultRows={10}
        stickyColumnIds={['id', 'name']}
        page={page}
        onPageChange={handleChangePage}
        count={count}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableContainerSx={tableContainerSx}
        stickyRight={true}
        menuOptions={['Update', 'Delete']}
        onOptionSelect={(action, row) => {
          switch (action) {
            case 'Update':
              setEditingSub(row);
              setIsModalOpen(true);
              break;
            case 'Delete':
              // TODO: add delete handler
              break;
            default:
              break;
          }
        }}
        title={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
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
                )
              }}
              // Add onChange handler if needed
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <CommonButton
                label="CREATE SUBSCRIPTION"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<AddIcon />}
                onClick={handleCreateSubscription}
              />
            </div>
          </div>
        }
      />
      {isModalOpen && (
        <SubscriptionModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingSub(null);
          }}
          onSubscriptionCreated={handleSubscriptionCreated}
          orgId={orgId ?? 0}
          subInitName={subInitName}
          editMode={!!editingSub}
          initialData={editingSub}
        />
      )}
    </div>
  );
}

const headCells: HeadCell[] = [
  { id: 'name', label: 'Name', width: 20 },
  { id: 'type', label: 'Type' },
  { id: 'start_date', label: 'Start Date' },
  { id: 'api_limit', label: 'API Limit' },
  { id: 'expiry_date', label: 'Expiry Date' },
  { id: 'billing_model', label: 'Billing Model' },
  { id: 'billing_interval', label: 'Billing Interval' },
  { id: 'quota_reset_interval', label: 'Quota Reset' },
  { id: 'status', label: 'Status' },
  { id: 'description', label: 'Description' },
  { id: 'created_at', label: 'Created At' },
  { id: 'updated_at', label: 'Updated At' }
];