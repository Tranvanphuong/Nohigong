import { getConfig } from "./template";

const API_URL = getConfig((config) => config.template.apiUrl);

const mockUrls = import.meta.glob<{ default: string }>("../mock/*.json", {
  query: "url",
  eager: true,
});

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = mockUrls[`../mock${path}.json`]?.default;

  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const response = await fetch(url, options);
  return response.json() as T;
}

export async function requestWithAPiUrl<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = API_URL
    ? `${API_URL}${path}`
    : mockUrls[`../mock${path}.json`]?.default;

  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const response = await fetch(url, options);
  return response.json() as T;
}

export async function requestWithFallbackURL<T>(
  path: string,
  fallbackValue: T,
  options?: RequestInit
): Promise<T> {
  try {
    return await requestWithAPiUrl<T>(path, options);
  } catch (error) {
    console.warn(
      "An error occurred while fetching data. Falling back to default value!"
    );
    console.warn({ path, error, fallbackValue });
    return fallbackValue;
  }
}

export async function requestWithFallback<T>(
  path: string,
  fallbackValue: T,
  options?: RequestInit
): Promise<T> {
  try {
    return await request<T>(path, options);
  } catch (error) {
    console.warn(
      "An error occurred while fetching data. Falling back to default value!"
    );
    console.warn({ path, error, fallbackValue });
    return fallbackValue;
  }
}

export async function post<T, D = any>(
  path: string,
  data: D,
  options?: {
    headers?: Record<string, string>;
    token?: string;
  }
): Promise<T> {
  const url = API_URL
    ? `${API_URL}${path}`
    : mockUrls[`../mock${path}.json`]?.default;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (typeof window !== "undefined") {
    headers["Host"] = window.location.host;
  }

  if (options?.token) {
    headers["authorization"] = `Bearer ${options.token}`;
  }

  let optionsFetch = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };
  logCurlFromFetch(url, optionsFetch);
  console.log(url);
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as T;
}

function logCurlFromFetch(url: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  const headers = options.headers || {};
  const body = options.body;

  let curl = [`curl -X ${method} "${url}"`];

  // Headers
  if (headers && typeof headers === "object") {
    Object.entries(headers).forEach(([key, value]) => {
      curl.push(`-H "${key}: ${value}"`);
    });
  }

  // Body
  if (body) {
    curl.push(`-d '${body}'`);
  }

  console.log("[CURL]", curl.join(" \\\n  "));
}

export const getProductDetail = async (id: string) => {
  console.log("getProductDetail called with id:", id);
  try {
    const response = await fetch(`https://eshopapp.misa.vn/g2/api/di/InventoryItems/edit/${id}`, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmEiOiJWxINuIFBoxrDGoW5nIiwidWlkIjoiNDdmZjUxYWItNDdlYS00OTg5LWJlOWYtYzU4NjAxNjIzNDhjIiwiZGJpZCI6IjY3OGI0MThjLWU0NjEtMTFlZi05ZTU4LTAwNTA1NmIyNzVmYSIsInNpZCI6Ijc3MGZhZDA5Zjk0YzRlMDJiY2VkNTZlZTg3NTM2NmYyIiwibWlkIjoiOTQ3N2Y5NmQtNWVhMC00NWRkLTliZjQtY2IyODc0MDY4YjVhIiwidGlkIjoiNjc4YWNiMGEtZTQ2MS0xMWVmLTllNTgtMDA1MDU2YjI3NWZhIiwidGNvIjoicWNfc3RvcmU0IiwiZW52IjoiZzIiLCJuYmYiOjE3NDQ3OTIzMTUsImV4cCI6MTc0NDg3ODcxNSwiaWF0IjoxNzQ0NzkyMzE1LCJpc3MiOiJNSVNBSlNDIn0.1WnJ0XM_BvEuQRvCM3eDIrqw6nRZsdtiIBD4larIvH8',
        'x-ms-bid': 'a38f9189-ad87-11ef-a35e-005056b28600'
      }
    });
    console.log("API response status:", response.status);
    const data = await response.json();
    console.log("API response data:", data);
    return data;
  } catch (error) {
    console.error("Error in getProductDetail:", error);
    throw error;
  }
};
