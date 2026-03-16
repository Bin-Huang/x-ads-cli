import type { XAdsCredentials } from "./auth.js";
import { buildAuthHeader } from "./oauth.js";

const BASE_URL = "https://ads-api.x.com/12";

export interface ApiOptions {
  creds: XAdsCredentials;
  params?: Record<string, string>;
}

export async function callApi(
  endpoint: string,
  opts: ApiOptions
): Promise<unknown> {
  const url = `${BASE_URL}${endpoint}`;
  const params = opts.params ?? {};

  // Build query string
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  }
  const qs = searchParams.toString();
  const fullUrl = qs ? `${url}?${qs}` : url;

  const authHeader = buildAuthHeader("GET", url, params, opts.creds);

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

  const json = (await res.json()) as {
    data?: unknown;
    errors?: Array<{ message: string }>;
    request?: unknown;
  };

  if (!res.ok || json.errors) {
    const msg =
      json.errors?.map((e) => e.message).join("; ") ??
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json.data ?? json;
}
