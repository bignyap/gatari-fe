import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';


function getPermissionTypeUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["permissionType"]);
}

export async function CreatePermissionType(data: Record<string, any>): Promise<any> {
  return PostData(getPermissionTypeUrl(), data);
}

export async function ListPermissionTypes(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(getPermissionTypeUrl(), queryParams);
    
    return endpoints.map((endpoint: any) => createPermissionTypeData(endpoint));
}

export async function ListAllPermissionTypes(): Promise<any> {
  let allEndpoints: any[] = [];
  let currentPage = 1;
  const itemsPerPage = 100;
  let fetchedItems: any[];

  do {
      const queryParams = {
          page_number: currentPage.toString(),
          items_per_page: itemsPerPage.toString()
      };
      fetchedItems = await GetData(getPermissionTypeUrl(), queryParams);
      allEndpoints = allEndpoints.concat(fetchedItems.map((org: any) => createPermissionTypeData(org)));
      currentPage++;
  } while (fetchedItems.length === itemsPerPage);

  return allEndpoints;
}

export async function DeletePermissionType(id: string): Promise<void> {
  await DeleteData(`${getPermissionTypeUrl()}/${id}`);
}

export async function CreatePermissionTypeInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getPermissionTypeUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createPermissionTypeData(permissionType: any): PermissionTypeData {
    return {
      name: permissionType.name,
      code: permissionType.code,
      description: permissionType.description,
    };
}

interface PermissionTypeData {
    name: string;
    code: string;
    description: string;
    [key: string]: any;
}