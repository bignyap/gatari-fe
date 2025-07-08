import {
    GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';

function getApiUsageUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["apiUsageSummary"]);
}

export async function GetApiUsageSummary(queryParams: Record<string, any>): Promise<any> {
    
    const filteredQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value !== undefined && value !== null)
    );

    const apiUsageData = await GetData(getApiUsageUrl(), filteredQueryParams);

    if (!apiUsageData || apiUsageData.length === 0) {
        return [];
    }

    return apiUsageData;
}
