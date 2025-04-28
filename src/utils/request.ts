import { getConfig } from "./template";
import { getToken } from "./auth";
import { getAccessToken } from "zmp-sdk/apis";

const API_URL = getConfig((config) => config.template.apiUrl);

// @ts-ignore
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
  }
): Promise<T> {
  console.log("post", path, data);
  const url = API_URL ? `${API_URL}${path}` : "";
  const accessToken = await getAccessToken({});
  console.log("accessToken", accessToken);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `${accessToken}`,
    "X-AppId": "123456",
    ...options?.headers,
  };

  if (typeof window !== "undefined") {
    headers["Host"] = window.location.host;
  }

  // headers["authorization"] = `Bearer ${getToken()}`;
  console.log("Commit", JSON.stringify(data));
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
}

export const getProductDetail = async (id: string) => {
  try {
    const response = await getAsync(`/InventoryItemZMAs/edit/${id}`);
    // const response = await fetch(
    //   `https://eshopapp.misa.vn/g2/api/dimob/InventoryItems/edit/${id}`,
    //   {
    //     headers: {
    //       accept: "application/json, text/plain, */*",
    //       authorization: `Bearer ${getToken()}`,
    //       "x-ms-bid": "a38f9189-ad87-11ef-a35e-005056b28600",
    //     },
    //   }
    // );
    // const data = await response.json();
    return response;
  } catch (error) {
    console.error("Error in getProductDetail:", error);
    throw error;
  }
};

export const getUserNumber = async ({
  access_token,
  code,
}: {
  access_token: string;
  code: string;
}) => {
  const secret_key = "USgLueM6o1xn8VioWvIR";
  try {
    const response = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
      headers: {
        access_token: access_token,
        code: code,
        secret_key: secret_key,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getProductDetail:", error);
    throw error;
  }
};

export async function getAsync<T>(
  path: string,

  options?: {
    headers?: Record<string, string>;
  }
): Promise<T> {
  const url = API_URL ? `${API_URL}${path}` : "";
  const accessToken = await getAccessToken({});
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `${accessToken}`,
    "X-AppId": "123456",
    ...options?.headers,
  };

  if (typeof window !== "undefined") {
    headers["Host"] = window.location.host;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as T;
}
