import { Command } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

new Command({
  name: "find-series",
  description: "Get information about a series",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      description: "Title of the series",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const seriesTitle = interaction.options.getString("title");
    const token = process.env.OMDB_TOKEN;

    const url = `https://www.omdbapi.com/?apikey=${token}&t=${seriesTitle}`;

    if (!token) {
      return interaction.reply({
        content: "Error: No token provided. Please, provide a token.",
        ephemeral: true,
      });
    }

    if (!seriesTitle) {
      return interaction.reply({
        content: "Error: No title provided. Please, provide a title.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get(url);
      const seriesData = response.data;

      if (seriesData.Response === "False") {
        return interaction.reply({
          content: `Error: We could not find series for title "${seriesTitle}".`,
          ephemeral: true,
        });
      }

      const seriesEmbed = new EmbedBuilder()
        .setTitle(seriesData.Title)
        .setColor("#0A253E")
        .setThumbnail(seriesData.Poster)
        .addFields(
          {
            name: "Plot",
            value: seriesData.Plot,
            inline: false,
          },
          {
            name: "Release Date",
            value: seriesData.Released,
            inline: true,
          },
          {
            name: "Popularity",
            value: seriesData.imdbRating,
            inline: true,
          },
          {
            name: "Genre",
            value: seriesData.Genre,
            inline: true,
          },
          {
            name: "Director",
            value: seriesData.Director,
            inline: true,
          }
        );

      await interaction.reply({ embeds: [seriesEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Error: Failed to fetch series data. Please, try again later."
      );
    }
  },
});
