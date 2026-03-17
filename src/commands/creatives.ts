import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCreativeCommands(program: Command): void {
  program
    .command("promoted-tweets [options] <account-id>")
    .description("List promoted tweets for an ad account")
    .option("--line-item-ids <ids>", "Filter by line item IDs (comma-separated)")
    .option("--count <n>", "Results per page (default 200)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        if (opts.lineItemIds) params.line_item_ids = opts.lineItemIds;
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi(`/accounts/${accountId}/promoted_tweets`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("media-creatives <account-id>")
    .description("List media creatives for an ad account")
    .option("--count <n>", "Results per page (default 200)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        if (opts.cursor) params.cursor = opts.cursor;
        const data = await callApi(`/accounts/${accountId}/media_creatives`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("cards <account-id>")
    .description("List cards (website, app install, etc.) for an ad account")
    .option("--card-types <types>", "Filter by types: WEBSITE, VIDEO_WEBSITE, IMAGE_APP_DOWNLOAD, etc. (comma-separated)")
    .option("--count <n>", "Results per page (default 200)", "200")
    .option("--cursor <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = { count: opts.count };
        if (opts.cursor) params.cursor = opts.cursor;
        if (opts.cardTypes) params.card_types = opts.cardTypes;
        const data = await callApi(`/accounts/${accountId}/cards`, { creds, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
