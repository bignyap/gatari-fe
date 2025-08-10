import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import { getApiBaseUrl, API_PATHS } from './Paths';

function getEndpointUrl(): string {
  return BuildUrl(getApiBaseUrl(), API_PATHS["endpoint"]);
}

export async function CreateEndpoint(data: Record<string, any>): Promise<any> {
  return PostData(getEndpointUrl(), data);
}

export async function ListEndpoints(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(getEndpointUrl(), queryParams);
    
    return endpoints.map((endpoint: any) => createEndpointData(endpoint));
}

export async function ListEndpointsByResourceType(resourcetTypeId: number): Promise<any> {
  const queryParams = {
    resource_type_id: resourcetTypeId.toString()
  };

  const endpoints = await GetData(getEndpointUrl(), queryParams);
  
  return endpoints.map((endpoint: any) => createEndpointData(endpoint));
}

export async function DeleteEndpoint(id: string): Promise<void> {
  await DeleteData(`${getEndpointUrl()}/${id}`);
}

export async function CreateEndpointInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${getEndpointUrl()}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

export async function ListAllEndpoints(): Promise<any> {
  let allEndpoints: any[] = [];
  let currentPage = 1;
  const itemsPerPage = 100;
  let fetchedItems: any[];

  do {
      const queryParams = {
          page_number: currentPage.toString(),
          items_per_page: itemsPerPage.toString()
      };
      fetchedItems = await GetData(getEndpointUrl(), queryParams);
      allEndpoints = allEndpoints.concat(fetchedItems.map((org: any) => createEndpointData(org)));
      currentPage++;
  } while (fetchedItems.length === itemsPerPage);

  return allEndpoints;
}

function createEndpointData(endpoint: any): EndpointData {
    return {
      id: endpoint.id,
      name: endpoint.name,
      description: endpoint.description,
      httpMethod: endpoint.http_method,
      pathTemplate: endpoint.path_template,
      resourceTypeId: endpoint.resource_type_id,
      resourceTypeName: endpoint.resource_type_name,
      permissionCode: endpoint.permission_code,
      accessType: endpoint.access_type
    };
}

interface EndpointData {
    id: number;
    name: string;
    description: string;
    httpMethod: string;
    pathTemplate: string;
    resourceTypeId: number;
    resourceTypeName: string;
    permissionCode: string;
    accessType: string;
    [key: string]: any;
}