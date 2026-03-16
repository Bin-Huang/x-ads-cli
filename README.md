# x-ads-cli

An X Ads CLI designed for AI agents. Wraps the official X Ads API with simple, agent-friendly commands.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g x-ads-cli
```

## Setup

### Step 1: Apply for X Ads API access

Go to the [X Developer Portal](https://developer.x.com/) and apply for Ads API access for your app.

### Step 2: Get your API credentials

In the Developer Portal, obtain your:
- API Key (Consumer Key)
- API Secret (Consumer Secret)
- Access Token
- Access Token Secret

The authenticated user must have access to an X Ads account.

### Step 3: Place the credentials file

```bash
mkdir -p ~/.config/x-ads-cli
cat > ~/.config/x-ads-cli/credentials.json << EOF
{
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET",
  "access_token": "YOUR_ACCESS_TOKEN",
  "access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
}
EOF
```

Or set environment variables:

```bash
export X_ADS_API_KEY=your_api_key
export X_ADS_API_SECRET=your_api_secret
export X_ADS_ACCESS_TOKEN=your_access_token
export X_ADS_ACCESS_TOKEN_SECRET=your_access_token_secret
```

### Step 4: Find your Ad Account ID

```bash
x-ads-cli accounts
```

## Commands

### List ad accounts

```bash
x-ads-cli accounts
x-ads-cli accounts --with-deleted
```

### Get account details

```bash
x-ads-cli account abc123
```

### List campaigns

```bash
x-ads-cli campaigns abc123
x-ads-cli campaigns abc123 --campaign-ids id1,id2
```

### List line items (ad groups)

```bash
x-ads-cli line-items abc123
x-ads-cli line-items abc123 --campaign-ids id1,id2
```

### Get analytics

```bash
x-ads-cli stats abc123 \
  --entity CAMPAIGN \
  --entity-ids campaign_id_1,campaign_id_2 \
  --start-time 2026-03-01T00:00:00Z \
  --end-time 2026-03-15T00:00:00Z \
  --granularity DAY \
  --metric-groups ENGAGEMENT,BILLING
```

## Credentials

Credentials are resolved in this order:

1. `--credentials <path>` flag
2. `X_ADS_API_KEY`, `X_ADS_API_SECRET`, `X_ADS_ACCESS_TOKEN`, `X_ADS_ACCESS_TOKEN_SECRET` env vars
3. `~/.config/x-ads-cli/credentials.json` (auto-detected)

## Output

All output is JSON to stdout. Errors are JSON to stderr with a non-zero exit code.

Use `--format compact` for single-line JSON (useful for piping).

## API Reference

- Official docs: https://docs.x.com/x-ads-api/introduction

## Related

- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) - Google Analytics CLI for AI agents
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) - Google Search Console CLI for AI agents
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) - TikTok Ads CLI for AI agents

## License

Apache-2.0
