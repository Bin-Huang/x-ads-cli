import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerStatsCommands(program: Command): void {
  program
    .command("stats <account-id>")
    .description("Get synchronous analytics for an ad account")
    .requiredOption("--entity <type>", "Entity type: CAMPAIGN, LINE_ITEM, PROMOTED_TWEET, MEDIA_CREATIVE, FUNDING_INSTRUMENT, ORGANIC_TWEET")
    .requiredOption("--entity-ids <ids>", "Entity IDs (comma-separated)")
    .requiredOption("--start-time <time>", "Start time (ISO 8601, e.g. 2026-03-01T00:00:00Z)")
    .requiredOption("--end-time <time>", "End time (ISO 8601)")
    .option("--granularity <gran>", "Granularity: HOUR, DAY, TOTAL (default DAY)", "DAY")
    .option("--metric-groups <groups>", "Metric groups (comma-separated, e.g. ENGAGEMENT,BILLING,VIDEO)", "ENGAGEMENT,BILLING")
    .option("--placement <placement>", "Placement: ALL_ON_TWITTER, PUBLISHER_NETWORK, SPOTLIGHT, TREND", "ALL_ON_TWITTER")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          entity: opts.entity,
          entity_ids: opts.entityIds,
          start_time: opts.startTime,
          end_time: opts.endTime,
          granularity: opts.granularity,
          metric_groups: opts.metricGroups,
        };
        params.placement = opts.placement;
        const data = await callApi(`/stats/accounts/${accountId}`, {
          creds,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
