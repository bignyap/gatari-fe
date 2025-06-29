import { getConfig } from '../configContext';

export function getApiBaseUrl(): string {
  return getConfig().API_BASE_URL;
}

export const API_PATHS = {
  organization: '/org',
  endpoint: '/apiEndpoint',
  organizationType: '/orgType',
  resourceType: '/resourceType',
  subscriptionTier: '/subTier',
  subscription: '/subscription',
  tierPricing: '/tierPricing',
};