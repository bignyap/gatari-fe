import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';

function gettierPricingUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["tierPricing"]);
}

export async function CreateTierPricing(data: Record<string, any>): Promise<any> {
  return PostData(gettierPricingUrl(), data);
}

export async function GetTierPricingBySubTierId(tierId: number, pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString(),
    };

    const finalUrl = BuildUrl(gettierPricingUrl(), tierId.toString())
  
    let tierPricing = await GetData(finalUrl, queryParams);

    if (tierPricing["total_items"] > 0) {
        tierPricing["data"] = tierPricing["data"].map((org: any) => createTierPricingData(org));
    }
    
    return tierPricing
  }

export async function DeleteTierPricing(id: number): Promise<void> {
  await DeleteData(`${gettierPricingUrl()}/id/${id}`);
}

export async function DeleteTierPricingBySubId(id: number): Promise<void> {
    await DeleteData(`${gettierPricingUrl()}/tierId/${id}`);
  }

export async function CreateTierPricingInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${gettierPricingUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createTierPricingData(tierPricing: any): TierPricingData {
    return {
      id: tierPricing.id,
      base_cost_per_call: tierPricing.base_cost_per_call,
      base_rate_limit: tierPricing.base_rate_limit,
      endpoint_name: tierPricing.endpoint_name,
      api_endpoint_id: tierPricing.api_endpoint_id,
      subscription_tier_id: tierPricing.subscription_tier_id,
      cost_mode: tierPricing.cost_mode,
    };
}

interface TierPricingData {
    id: number;
    base_cost_per_call: number;
    base_rate_limit: number | null;
    endpoint_name: string;
    api_endpoint_id: number
    subscription_tier_id: number;
    cost_mode: string;
    [key: string]: any;
}