import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';

function getOrganizationUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["organization"]);
}

export async function CreateOrganization(data: Record<string, any>): Promise<any> {
  return PostData(getOrganizationUrl(), data);
}

export async function ListOrganizations(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    let organizations = await GetData(getOrganizationUrl(), queryParams);

    if (organizations["total_items"] > 0) {
      organizations["data"] = organizations["data"].map((org: any) => createOrganizationData(org));
    }
    
    return organizations
  }

export async function GetOrganizationById(id: number): Promise<any> {
  const val = await GetData(`${getOrganizationUrl()}/${id}`)
  return createOrganizationData(val);
}

export async function DeleteOrganization(id: number): Promise<void> {
  await DeleteData(`${getOrganizationUrl()}/${id}`);
}

export async function CreateOrganizationInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getOrganizationUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createOrganizationData(org: any): OrganizationData {
    return {
      id: org.id,
      name: org.name,
      type: org.type,
      created_at: org.created_at,
      updated_at: org.updated_at,
      realm: org.realm,
      country: org.country,
      support_email: org.support_email,
      active: org.active,
      report_q: org.report_q,
      config: org.config,
      type_id: org.type_id,
    };
}

interface OrganizationData {
    id: number;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
    realm: string;
    country: string | null;
    support_email: string;
    active: boolean;
    report_q: boolean;
    config: any | null;
    type_id: number;
    [key: string]: any;
}