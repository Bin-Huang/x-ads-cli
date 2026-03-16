import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export interface XAdsCredentials {
  api_key: string;
  api_secret: string;
  access_token: string;
  access_token_secret: string;
}

const DEFAULT_PATH = join(
  homedir(),
  ".config",
  "x-ads-cli",
  "credentials.json"
);

export function loadCredentials(credentialsPath?: string): XAdsCredentials {
  // 1. --credentials flag
  if (credentialsPath) {
    return readJSON(credentialsPath);
  }

  // 2. Environment variables
  if (
    process.env.X_ADS_API_KEY &&
    process.env.X_ADS_API_SECRET &&
    process.env.X_ADS_ACCESS_TOKEN &&
    process.env.X_ADS_ACCESS_TOKEN_SECRET
  ) {
    return {
      api_key: process.env.X_ADS_API_KEY,
      api_secret: process.env.X_ADS_API_SECRET,
      access_token: process.env.X_ADS_ACCESS_TOKEN,
      access_token_secret: process.env.X_ADS_ACCESS_TOKEN_SECRET,
    };
  }

  // 3. Default credentials file
  if (existsSync(DEFAULT_PATH)) {
    return readJSON(DEFAULT_PATH);
  }

  throw new Error(
    `No credentials found. Provide one of:\n` +
      `  1. --credentials <path> flag\n` +
      `  2. X_ADS_API_KEY, X_ADS_API_SECRET, X_ADS_ACCESS_TOKEN, X_ADS_ACCESS_TOKEN_SECRET env vars\n` +
      `  3. ${DEFAULT_PATH}`
  );
}

function readJSON(path: string): XAdsCredentials {
  const raw = readFileSync(path, "utf-8");
  const data = JSON.parse(raw);
  for (const key of [
    "api_key",
    "api_secret",
    "access_token",
    "access_token_secret",
  ]) {
    if (!data[key]) {
      throw new Error(`credentials file missing "${key}": ${path}`);
    }
  }
  return data;
}
