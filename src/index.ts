#!/usr/bin/env node
import { Command } from "commander";
import { registerAccountCommands } from "./commands/accounts.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerLineItemCommands } from "./commands/line-items.js";
import { registerStatsCommands } from "./commands/stats.js";

const program = new Command();

program
  .name("x-ads-cli")
  .description("X Ads CLI for AI agents")
  .version("0.1.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/x-ads-cli"
  );

program.configureOutput({
  writeErr: () => {},
});

program.hook("preAction", () => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerAccountCommands(program);
registerCampaignCommands(program);
registerLineItemCommands(program);
registerStatsCommands(program);

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
