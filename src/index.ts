import { bootstrapApp } from "#base";

await bootstrapApp({
  workdir: import.meta.dirname,
  directories: ["./discord/commands/public", "./discord/commands/private"],
});
