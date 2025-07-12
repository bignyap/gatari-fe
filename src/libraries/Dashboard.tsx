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