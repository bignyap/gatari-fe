import {
    GetData, BuildUrl
 } from './Utils';
import { getApiBaseUrl, API_PATHS } from './Paths';

function getDashboardUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["dashboard"]);
}

export async function GetDashboardCount(): Promise<any> {
  
  const finalUrl = BuildUrl(getDashboardUrl(), "counts")
  return GetData(finalUrl);

}

export async function GetDashboardUsage(queryParams: Record<string, any>): Promise<any> {
    
    const filteredQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value !== undefined && value !== null)
    );

    const finalUrl = BuildUrl(getDashboardUrl(), "usage")

    const output = await GetData(finalUrl, filteredQueryParams);

    if (!output || output.length === 0) {
        return [];
    }

    return output;
}