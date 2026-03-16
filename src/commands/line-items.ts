import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerLineItemCommands(program: Command): void {
  program
    .command("line-items <account-id>")
    .description("List line items (ad groups) for an ad account")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--line-item-ids <ids>", "Filter by line item IDs (comma-separated)")
    .option("--with-deleted", "Include deleted line items")
    .option("--count <n>", "Number of results per request (max 1000)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          count: opts.count,
        };
        if (opts.campaignIds) params.campaign_ids = opts.campaignIds;
        if (opts.lineItemIds) params.line_item_ids = opts.lineItemIds;
        if (opts.withDeleted) params.with_deleted = "true";
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi(`/accounts/${accountId}/line_items`, {
          creds,
          params,
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
