import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerTargetingCommands(program: Command): void {
  program
    .command("targeting-criteria <account-id>")
    .description("List targeting criteria for an ad account")
    .option("--line-item-ids <ids>", "Filter by line item IDs (comma-separated)")
    .option("--count <n>", "Results per page (default 200)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        if (opts.lineItemIds) params.line_item_ids = opts.lineItemIds;
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi(`/accounts/${accountId}/targeting_criteria`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("tailored-audiences <account-id>")
    .description("List tailored audiences (custom audiences) for an ad account")
    .option("--count <n>", "Results per page (default 200)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi(`/accounts/${accountId}/tailored_audiences`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("funding-instruments <account-id>")
    .description("List funding instruments (payment methods) for an ad account")
    .option("--count <n>", "Results per page (default 200)", "200")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        const data = await callApi(`/accounts/${accountId}/funding_instruments`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("conversion-events <account-id>")
    .description("List web conversion events for an ad account")
    .option("--count <n>", "Results per page (default 200)", "200")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        const data = await callApi(`/accounts/${accountId}/web_event_tags`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("reach-estimate <account-id>")
    .description("Get reach estimate for a line item")
    .requiredOption("--line-item-id <id>", "Line item ID")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { line_item_id: opts.lineItemId };
        const data = await callApi(`/accounts/${accountId}/reach_estimate`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
