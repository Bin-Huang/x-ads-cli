#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
import { registerAccountCommands } from "./commands/accounts.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerLineItemCommands } from "./commands/line-items.js";
import { registerStatsCommands } from "./commands/stats.js";
import { registerCreativeCommands } from "./commands/creatives.js";
import { registerTargetingCommands } from "./commands/targeting.js";

const program = new Command();

program
  .name("x-ads-cli")
  .description("X Ads CLI for AI agents")
  .version(version)
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/x-ads-cli"
  );

program.configureOutput({
  writeErr: (str: string) => {
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

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
registerCreativeCommands(program);
registerTargetingCommands(program);

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});
if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
