export function BuildUrl(base: string, ...paths: string[]): string {
  const sanitizedBase = base.replace(/\/+$/, '');
  const sanitizedPaths = paths.map(path => path.replace(/^\/+/, ''));
  return [sanitizedBase, ...sanitizedPaths].join('/');
}

const defaultHeaders: Record<string, string> = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded'
}

async function headerWithToken(
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<Record<string, string>> {
  return includeDefaultHeader
    ? { ...defaultHeaders, ...headers }
    : { ...headers };
}


export async function PostData(
  url: string, 
  data: Record<string, any> = {}, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: reqHeaders,
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    body: new URLSearchParams(data) // Always use URLSearchParams for form data
  };
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}

export async function PutData(
  url: string,
  data: Record<string, any> = {},
  headers: Record<string, string> = {},
  includeDefaultHeader: boolean = true
): Promise<any> {
  const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
  const contentType = reqHeaders['Content-Type'] || 'application/json';

  let body: BodyInit;

  if (
    contentType === 'application/json' &&
    (Array.isArray(data) || (typeof data === 'object' && !(data instanceof FormData)))
  ) {
    body = JSON.stringify(data);
  } else if (contentType === 'application/x-www-form-urlencoded' && typeof data === 'object') {
    body = new URLSearchParams(data as Record<string, string>);
  } else if (
    data instanceof FormData ||
    typeof data === 'string' ||
    data instanceof Blob ||
    data instanceof URLSearchParams
  ) {
    body = data;
  } else {
    throw new Error('Invalid data type for BodyInit');
  }

  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: reqHeaders,
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    body,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function GetData(
  url: string, 
  queryParams: Record<string, string> = {},
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  try {
    // Create a URL object and append query parameters
    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });

    const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
    const response = await fetch(urlObj.toString(), {
      method: 'GET',
      headers: reqHeaders
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}

export async function DeleteData(
  url: string, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  try {
    const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: reqHeaders
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} ${errorText}`);
    }
  
    if (response.status !== 204) {
      await response.json();
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}