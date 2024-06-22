// src/discord/commands/public/help.ts
import { Command } from "#base";
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

// Lista manual de comandos
const commands = [
  { name: "help", description: "Show all the commands" },
  { name: "ping", description: "Check the bot's latency" },
  { name: "get-movies", description: "Fetch movies information" },
  { name: "get-series", description: "Fetch series information" },
  { name: "github", description: "Search for GitHub profile" },
  { name: "movies-recommendation", description: "Get movie recommendations based on genre" },
  { name: "news", description: "Fetch the latest news" },
  { name: "translate", description: "Translate text" },
  { name: "weather", description: "Get weather information" },
];

new Command({
  name: "help",
  description: "Show all the commands",
  type: ApplicationCommandType.ChatInput,
  async run(interaction: ChatInputCommandInteraction) {
    try {
      if (!commands || commands.length === 0) {
        await interaction.reply({
          content: "There are no commands available",
          ephemeral: true,
        });
        return;
      }

      const embedHelper = new EmbedBuilder()
        .setTitle("Help - List of commands")
        .setColor("#0A253E")
        .setTimestamp();

      commands.forEach((command) => {
        embedHelper.addFields({
          name: `/${command.name}`,
          value: `${command.description}`,
        });
      });

      await interaction.reply({ embeds: [embedHelper] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
});
