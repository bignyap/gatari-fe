import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';


function getOrgPermissionUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["orgPermission"]);
}

export async function CreateOrgPermission(data: Record<string, any>): Promise<any> {
  return PostData(getOrgPermissionUrl(), data);
}

export async function ListOrgPermission(orgId:number, pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(`${getOrgPermissionUrl()}/${orgId}`, queryParams);
    
    return endpoints.map((endpoint: any) => createOrgPermissionData(endpoint));
  }

export async function DeleteOrgPermission(id: string): Promise<void> {
  await DeleteData(`${getOrgPermissionUrl()}/${id}`);
}

function createOrgPermissionData(orgPermission: any): OrgPermissionData {
    return {
        resourceTypeId: orgPermission.resourceTypeId,
        organizationId: orgPermission.organizationId,
        permissionCode: orgPermission.permissionCode,
    };
}

interface OrgPermissionData {
    resourceTypeId: number;
    organizationId: number;
    permissionCode: string;
    [key: string]: any;
}