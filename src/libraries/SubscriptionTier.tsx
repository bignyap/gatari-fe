import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';


function getsubscriptionTierUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["subscriptionTier"]);
}

export async function CreateSubscriptionTier(data: Record<string, any>): Promise<any> {
  return PostData(getsubscriptionTierUrl(), data);
}

export async function ListSubscriptionTiers(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(getsubscriptionTierUrl(), queryParams);

    if (endpoints["total_items"] > 0) {
      endpoints["data"] = endpoints["data"].map((org: any) => createSubscriptionTierData(org));
    }
    
    return endpoints
  }

export async function ListAllSubscriptionTiers(): Promise<any> {
    let allSubTiers: any[] = [];
    let currentPage = 1;
    const itemsPerPage = 100;
    let fetchedItems: {
      "data": any[];
      "total_items": number;
    }

    do {
        const queryParams = {
            page_number: currentPage.toString(),
            items_per_page: itemsPerPage.toString()
        };
        fetchedItems = await GetData(getsubscriptionTierUrl(), queryParams);
        allSubTiers = allSubTiers.concat(fetchedItems["data"].map((org: any) => createSubscriptionTierData(org)));
        currentPage++;
    } while (fetchedItems["data"].length === itemsPerPage);

    return allSubTiers;
}

export async function DeleteSubscriptionTier(id: string): Promise<void> {
  await DeleteData(`${getsubscriptionTierUrl()}/${id}`);
}

export async function CreateSubscriptionTierInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getsubscriptionTierUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createSubscriptionTierData(org: any): SubscriptionTierData {
    return {
      id: org.id,
      name: org.name,
      description: org.description,
      created_at: org.created_at,
      updated_at: org.updated_at,
      archived: org.archived,
    };
}

interface SubscriptionTierData {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    archived: string;
    [key: string]: any;
}