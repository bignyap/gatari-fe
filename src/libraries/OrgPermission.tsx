import {
    PostData, DeleteData, GetData, BuildUrl,
    PutData
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';


function getOrgPermissionUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["orgPermission"]);
}

export async function CreateOrgPermission(data: Record<string, any>): Promise<any> {
  return PostData(getOrgPermissionUrl(), data);
}

export async function UpdateOrgPermission(orgId: number, data: Record<string, any>): Promise<any> {
  return PutData(`${getOrgPermissionUrl()}/${orgId}`, data, { 'Content-Type': 'application/json' }, false);
}

export async function ListOrgPermission(orgId: number, pageNumber: number, itemsPerPage: number): Promise<any[]> {
  const queryParams = {
    page_number: pageNumber.toString(),
    items_per_page: itemsPerPage.toString(),
  };

  const response = await GetData(`${getOrgPermissionUrl()}/${orgId}`, queryParams);
  if (!Array.isArray(response)) {
    return [];
  }
  return response.map((orgPermission: any) => createOrgPermissionData(orgPermission));
}

export async function DeleteOrgPermission(id: string): Promise<void> {
  await DeleteData(`${getOrgPermissionUrl()}/${id}`);
}

function createOrgPermissionData(orgPermission: any): OrgPermissionData {
    return {
        resourceTypeId: orgPermission.resource_type_id,
        organizationId: orgPermission.organization_id,
        permissionCode: orgPermission.permission_code,
    };
}

interface OrgPermissionData {
    resourceTypeId: number;
    organizationId: number;
    permissionCode: string;
    [key: string]: any;
}