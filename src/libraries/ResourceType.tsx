import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
 import { getApiBaseUrl, API_PATHS } from './Paths';


function getResourceTypeUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["resourceType"]);
}

export async function CreateResourceType(data: Record<string, any>): Promise<any> {
  return PostData(getResourceTypeUrl(), data);
}

export async function ListResourceTypes(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(getResourceTypeUrl(), queryParams);
    
    return endpoints.map((endpoint: any) => createResourceTypeData(endpoint));
  }

export async function DeleteResourceType(id: string): Promise<void> {
  await DeleteData(`${getResourceTypeUrl()}/${id}`);
}

export async function CreateResourceTypeInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getResourceTypeUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createResourceTypeData(org: any): ResourceTypeData {
    return {
      id: org.id,
      name: org.name,
      code: org.code,
      description: org.description,
    };
}

interface ResourceTypeData {
    id: number;
    name: string;
    code: string;
    description: string;
    [key: string]: any;
}