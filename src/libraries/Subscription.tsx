import {
  PostData, DeleteData, GetData, BuildUrl, PutData
} from './Utils';
import { getApiBaseUrl, API_PATHS } from './Paths';

function getsubscriptionUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["subscription"]);
}

export async function CreateSubscription(data: Record<string, any>): Promise<any> {
  return PostData(getsubscriptionUrl(), data);
}

export async function UpdateSubscription(id: number, data: Record<string, any>): Promise<any> {
  const finalData = { ...data, id };
  return PutData(`${getsubscriptionUrl()}/${id}`, finalData);
}

export async function ListSubscriptions(pageNumber: number, itemsPerPage: number): Promise<any> {
  const queryParams = {
    page_number: pageNumber.toString(),
    items_per_page: itemsPerPage.toString()
  };

  const subscriptions = await GetData(getsubscriptionUrl(), queryParams);

  if (subscriptions["total_items"] > 0) {
    subscriptions["data"] = subscriptions["data"].map((sub: any) => createSubscriptionData(sub));
  }

  return subscriptions;
}

export async function ListSubscriptionByOrgIds(orgId: number, pageNumber: number, itemsPerPage: number): Promise<any> {
  const queryParams = {
    page_number: pageNumber.toString(),
    items_per_page: itemsPerPage.toString()
  };

  const finalUrl = BuildUrl(getsubscriptionUrl(), "orgId", orgId.toString());

  const subscriptions = await GetData(finalUrl, queryParams);

  if (subscriptions["total_items"] > 0) {
    subscriptions["data"] = subscriptions["data"].map((sub: any) => createSubscriptionData(sub));
  }

  return subscriptions;
}

export async function GetSubscriptionById(id: number): Promise<any> {
  return GetData(`${getsubscriptionUrl()}/${id}`);
}

export async function GetSubscriptionByOrgId(id: string): Promise<any> {
  return GetData(`${getsubscriptionUrl()}/orgId/${id}`);
}

export async function DeleteSubscription(id: string): Promise<void> {
  await DeleteData(`${getsubscriptionUrl()}/${id}`);
}

export async function DeleteSubscriptionByOrgId(id: string): Promise<any> {
  return DeleteData(`${getsubscriptionUrl()}${id}`);
}

export async function CreateSubscriptionInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getsubscriptionUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createSubscriptionData(sub: any): SubscriptionData {
  return {
    id: sub.id,
    name: sub.name,
    type: sub.tier_name,
    created_at: sub.created_at,
    updated_at: sub.updated_at,
    start_date: sub.start_date,
    api_limit: sub.api_limit,
    expiry_date: sub.expiry_date,
    description: sub.description,
    status: sub.status,
    organization_id: sub.organization_id,
    subscription_tier_id: sub.subscription_tier_id,
    billing_model: sub.billing_model,
    billing_interval: sub.billing_interval,
    quota_reset_interval: sub.quota_reset_interval,
  };
}

interface SubscriptionData {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  api_limit: number;
  expiry_date: string;
  description: string;
  status: boolean;
  organization_id: number;
  subscription_tier_id: number;
  type: string;

  billing_model: string;
  billing_interval: string;
  quota_reset_interval: string;

  [key: string]: any;
}