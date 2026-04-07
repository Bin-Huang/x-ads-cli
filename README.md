# x-ads-cli

X Ads CLI & Skills for AI agents (and humans). Pull engagement, billing, and conversion analytics for campaigns and promoted tweets, estimate reach, track media creatives, and more.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

Tell your AI agent (e.g. OpenClaw):

> Install this CLI and skills from https://github.com/Bin-Huang/x-ads-cli

Or install manually:

```bash
npm install -g x-ads-cli

# Add skills for AI agents (Claude Code, Cursor, Codex, etc.)
npx skills add Bin-Huang/x-ads-cli
```

Or run directly: `npx x-ads-cli --help`

## How it works

Built on the official [X Ads API](https://docs.x.com/x-ads-api/introduction) (v12). Handles OAuth 1.0a signing natively with Node.js `crypto` (no external dependencies). Every command outputs structured JSON to stdout, ready for agents to parse without extra processing.

Core endpoints covered:

- **[Accounts](https://docs.x.com/x-ads-api/campaign-management#accounts)** -- list and inspect ad accounts
- **[Campaigns](https://docs.x.com/x-ads-api/campaign-management#campaigns)** -- list campaigns under an account
- **[Line Items](https://docs.x.com/x-ads-api/campaign-management#line-items)** -- list line items (ad groups) under an account
- **[Analytics](https://docs.x.com/x-ads-api/analytics)** -- synchronous performance metrics

## Setup

### Step 1: Get X Ads API access

1. Go to the [X Developer Portal](https://developer.x.com/) and sign in.
2. Create a project and app if you don't have one.
3. Apply for Ads API access -- your app must be approved for the Ads API tier (separate from the standard X API).

Ads API access requires approval. See [Getting Started](https://docs.x.com/x-ads-api/getting-started) for details.

### Step 2: Get your API credentials

In the Developer Portal, under your app's "Keys and Tokens" page, obtain:

- **API Key** (also called Consumer Key)
- **API Secret** (also called Consumer Secret)
- **Access Token**
- **Access Token Secret**

The Access Token must belong to a user who has access to at least one X Ads account.

### Step 3: Place the credentials file

Choose one of these options:

```bash
# Option A: Default path (recommended)
mkdir -p ~/.config/x-ads-cli
cat > ~/.config/x-ads-cli/credentials.json << EOF
{
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET",
  "access_token": "YOUR_ACCESS_TOKEN",
  "access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
}
EOF

# Option B: Environment variables
export X_ADS_API_KEY=your_api_key
export X_ADS_API_SECRET=your_api_secret
export X_ADS_ACCESS_TOKEN=your_access_token
export X_ADS_ACCESS_TOKEN_SECRET=your_access_token_secret

# Option C: Pass per command
x-ads-cli --credentials /path/to/credentials.json accounts
```

Credentials are resolved in this order:
1. `--credentials <path>` flag
2. `X_ADS_API_KEY`, `X_ADS_API_SECRET`, `X_ADS_ACCESS_TOKEN`, `X_ADS_ACCESS_TOKEN_SECRET` env vars
3. `~/.config/x-ads-cli/credentials.json` (auto-detected)

### Step 4: Find your Ad Account ID

```bash
x-ads-cli accounts
```

This returns all ad accounts accessible by the authenticated user. Use the account ID from the response in subsequent commands.

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for compact single-line JSON.

### accounts

List all ad accounts accessible by the authenticated user.

```bash
x-ads-cli accounts
x-ads-cli accounts --with-deleted
```

### account

Get details of a specific ad account.

```bash
x-ads-cli account abc1x2
```

### campaigns

List campaigns for an ad account.

```bash
x-ads-cli campaigns abc1x2
x-ads-cli campaigns abc1x2 --campaign-ids id1,id2
x-ads-cli campaigns abc1x2 --with-deleted --count 500
```

Options:
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)
- `--with-deleted` -- include deleted campaigns
- `--count <n>` -- results per page (default 200, max 1000)
- `--cursor <cursor>` -- pagination cursor from previous response

### line-items

List line items (ad groups) for an ad account. In the X Ads hierarchy, line items sit under campaigns and contain targeting, budget, and bid settings.

```bash
x-ads-cli line-items abc1x2
x-ads-cli line-items abc1x2 --campaign-ids campaign_id_1
x-ads-cli line-items abc1x2 --line-item-ids li1,li2
```

Options:
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)
- `--line-item-ids <ids>` -- filter by line item IDs (comma-separated)
- `--with-deleted` -- include deleted line items
- `--count <n>` -- results per page (default 200, max 1000)
- `--cursor <cursor>` -- pagination cursor

### stats

Get synchronous analytics for an ad account. Supports up to 7 days of data per request.

```bash
# Campaign-level daily metrics
x-ads-cli stats abc1x2 \
  --entity CAMPAIGN \
  --entity-ids campaign_id_1,campaign_id_2 \
  --start-time 2026-03-01T00:00:00Z \
  --end-time 2026-03-07T00:00:00Z \
  --granularity DAY \
  --metric-groups ENGAGEMENT,BILLING

# Line item hourly metrics
x-ads-cli stats abc1x2 \
  --entity LINE_ITEM \
  --entity-ids line_item_id_1 \
  --start-time 2026-03-15T00:00:00Z \
  --end-time 2026-03-16T00:00:00Z \
  --granularity HOUR \
  --metric-groups ENGAGEMENT,BILLING,VIDEO
```

Options:
- `--entity <type>` -- entity type: `CAMPAIGN`, `LINE_ITEM`, `PROMOTED_TWEET`, `MEDIA_CREATIVE`, `FUNDING_INSTRUMENT`, `ORGANIC_TWEET` (required)
- `--entity-ids <ids>` -- entity IDs, comma-separated (required)
- `--start-time <time>` -- ISO 8601 start time (required)
- `--end-time <time>` -- ISO 8601 end time (required)
- `--granularity <gran>` -- `HOUR`, `DAY`, or `TOTAL` (default `DAY`)
- `--metric-groups <groups>` -- comma-separated metric groups (default `ENGAGEMENT,BILLING`). Available: `ENGAGEMENT`, `BILLING`, `VIDEO`, `MEDIA`, `WEB_CONVERSION`, `MOBILE_CONVERSION`, `LIFE_TIME_VALUE_MOBILE_CONVERSION`
- `--placement <placement>` -- `ALL_ON_TWITTER`, `PUBLISHER_NETWORK`, `SPOTLIGHT`, `TREND` (default `ALL_ON_TWITTER`)

### promoted-tweets

List promoted tweets for an ad account.

```bash
x-ads-cli promoted-tweets abc1x2
x-ads-cli promoted-tweets abc1x2 --line-item-ids li1,li2
```

Options:
- `--line-item-ids <ids>` -- filter by line item IDs (comma-separated)
- `--count <n>` -- results per page (default 200)
- `--cursor <cursor>` -- pagination cursor

### media-creatives

List media creatives for an ad account.

```bash
x-ads-cli media-creatives abc1x2
```

Options:
- `--count <n>` -- results per page (default 200)
- `--cursor <cursor>` -- pagination cursor

### cards

List cards (website, app install, etc.) for an ad account.

```bash
x-ads-cli cards abc1x2
x-ads-cli cards abc1x2 --card-types WEBSITE,VIDEO_WEBSITE
```

Options:
- `--card-types <types>` -- filter by types: WEBSITE, VIDEO_WEBSITE, IMAGE_APP_DOWNLOAD, etc. (comma-separated)
- `--count <n>` -- results per page (default 200)
- `--cursor <cursor>` -- pagination cursor

### targeting-criteria

List targeting criteria for an ad account.

```bash
x-ads-cli targeting-criteria abc1x2
x-ads-cli targeting-criteria abc1x2 --line-item-ids li1,li2
```

Options:
- `--line-item-ids <ids>` -- filter by line item IDs (comma-separated)
- `--count <n>` -- results per page (default 200)
- `--cursor <cursor>` -- pagination cursor

### custom-audiences

List custom audiences for an ad account.

```bash
x-ads-cli custom-audiences abc1x2
```

Options:
- `--count <n>` -- results per page (default 200)
- `--cursor <cursor>` -- pagination cursor

### funding-instruments

List funding instruments (payment methods) for an ad account.

```bash
x-ads-cli funding-instruments abc1x2
```

Options:
- `--count <n>` -- results per page (default 200)

### conversion-events

List web conversion events for an ad account.

```bash
x-ads-cli conversion-events abc1x2
```

Options:
- `--count <n>` -- results per page (default 200)

### reach-estimate

Get reach estimate for a line item.

```bash
x-ads-cli reach-estimate abc1x2 --line-item-id li1
```

Options:
- `--line-item-id <id>` -- line item ID (required)

## Error output

Errors are written to stderr as JSON with an `error` field and a non-zero exit code:

```json
{"error": "Unauthorized - Invalid or expired token"}
```

## API Reference

- Official docs: https://docs.x.com/x-ads-api/introduction
- Campaign management: https://docs.x.com/x-ads-api/campaign-management
- Analytics: https://docs.x.com/x-ads-api/analytics

## Related

- [google-ads-open-cli](https://github.com/Bin-Huang/google-ads-open-cli) -- Google Ads CLI & Skills for AI agents (and humans)
- [meta-ads-open-cli](https://github.com/Bin-Huang/meta-ads-open-cli) -- Meta Ads CLI & Skills for AI agents (and humans)
- [microsoft-ads-cli](https://github.com/Bin-Huang/microsoft-ads-cli) -- Microsoft Ads CLI & Skills for AI agents (and humans)
- [amazon-ads-open-cli](https://github.com/Bin-Huang/amazon-ads-open-cli) -- Amazon Ads CLI & Skills for AI agents (and humans)
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI & Skills for AI agents (and humans)
- [linkedin-ads-cli](https://github.com/Bin-Huang/linkedin-ads-cli) -- LinkedIn Ads CLI & Skills for AI agents (and humans)
- [snapchat-ads-cli](https://github.com/Bin-Huang/snapchat-ads-cli) -- Snapchat Ads CLI & Skills for AI agents (and humans)
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI & Skills for AI agents (and humans)
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI & Skills for AI agents (and humans)
- [spotify-ads-cli](https://github.com/Bin-Huang/spotify-ads-cli) -- Spotify Ads CLI & Skills for AI agents (and humans)
- [apple-ads-cli](https://github.com/Bin-Huang/apple-ads-cli) -- Apple Ads CLI & Skills for AI agents (and humans)
- [google-analytics-cli](https://github.com/Bin-Huang/google-analytics-cli) -- Google Analytics CLI & Skills for AI agents (and humans)
- [google-search-console-cli](https://github.com/Bin-Huang/google-search-console-cli) -- Google Search Console CLI & Skills for AI agents (and humans)
- [youtube-analytics-cli](https://github.com/Bin-Huang/youtube-analytics-cli) -- YouTube Analytics CLI & Skills for AI agents (and humans)
- [x-analytics-cli](https://github.com/Bin-Huang/x-analytics-cli) -- X Analytics CLI & Skills for AI agents (and humans)
- [camoufox-cli](https://github.com/Bin-Huang/camoufox-cli) -- Anti-detect browser CLI & Skills for AI agents
## License

Apache-2.0
