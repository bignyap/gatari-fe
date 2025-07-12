import { getConfig } from '../configContext';

export function getApiBaseUrl(): string {
  return getConfig().API_BASE_URL;
}

export const API_PATHS = {
  organization: '/org',
  endpoint: '/apiEndpoint',
  organizationType: '/orgType',
  resourceType: '/resourceType',
  permissionType: '/permissionType',
  subscriptionTier: '/subTier',
  subscription: '/subscription',
  tierPricing: '/tierPricing',
  orgPermission: '/orgPermission',
  apiUsageSummary: '/apiUsageSummary',
  dashboard: '/dashboard',
};