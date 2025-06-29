import {
    PostData, DeleteData,
    PutData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';

function getOrganizationTypeUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["organizationType"]);
}

export async function CreateOrganizationType(data: Record<string, any>): Promise<any> {
  return PostData(getOrganizationTypeUrl(), data);
}

export async function ListOrganizationTypes(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
    const organizations = await GetData(getOrganizationTypeUrl(), queryParams);
    
    return organizations.map((org: any) => createOrganizationTypeData(org));
  }

export async function ListAllOrganizationTypes(): Promise<any> {
    let allOrganizations: any[] = [];
    let currentPage = 1;
    const itemsPerPage = 100;
    let fetchedItems: any[];

    do {
        const queryParams = {
            page_number: currentPage.toString(),
            items_per_page: itemsPerPage.toString()
        };
        fetchedItems = await GetData(getOrganizationTypeUrl(), queryParams);
        allOrganizations = allOrganizations.concat(fetchedItems.map((org: any) => createOrganizationTypeData(org)));
        currentPage++;
    } while (fetchedItems.length === itemsPerPage);

    return allOrganizations;
}

export async function DeleteOrganizationType(id: string): Promise<void> {
  await DeleteData(`${getOrganizationTypeUrl()}/${id}`);
}

export async function CreateOrganizationTypeInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = BuildUrl(getOrganizationTypeUrl(), 'batch');
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createOrganizationTypeData(org: any): OrganizationTypeData {
    return {
      id: org.id,
      name: org.name,
    };
}

interface OrganizationTypeData {
    id: number;
    name: string;
}