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
  /**
   * Asynchronous function that runs when the "help" command is triggered.
   * It creates an embed with a list of all available commands and sends it as a reply.
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the function completes.
   */
  async run(interaction: ChatInputCommandInteraction) {
    try {
      // Check if there are available commands
      if (!commands || commands.length === 0) {
        await interaction.reply({
          content: "There are no commands available",
          ephemeral: true,
        });
        return;
      }

      // Create embed with list of commands
      const embedHelper = new EmbedBuilder()
        .setTitle("Help - List of commands")
        .setColor("#0A253E")
        .setTimestamp();

      // Add fields with command name and description to embed
      commands.forEach((command) => {
        embedHelper.addFields({
          name: `/${command.name}`,
          value: `${command.description}`,
        });
      });

      // Send embed as reply
      await interaction.reply({ embeds: [embedHelper] });
    } catch (error) {
      // Log error and send error message as reply
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
});
