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
  description: "Fetch series information",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      description: "Title of the series",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * Fetches series data from OpenMovieDatabase API and replies with an embed.
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the function completes.
   */
  async run(interaction: ChatInputCommandInteraction) {
    // Get series title and OMDB token from interaction options
    const seriesTitle = interaction.options.getString("title");
    const token = process.env.OMDB_TOKEN;

    // Construct URL for API request
    const url = `https://www.omdbapi.com/?apikey=${token}&t=${seriesTitle}`;

    // Check if token and series title are provided
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
      // Fetch series data from API
      const response = await axios.get(url);
      const seriesData = response.data;

      // Check if series was found
      if (seriesData.Response === "False") {
        return interaction.reply({
          content: `Error: Series not found for title "${seriesTitle}".`,
          ephemeral: true,
        });
      }

      // Create embed with series data
      const seriesEmbed = new EmbedBuilder()
        .setTitle(seriesData.Title) // Set title
        .setColor("#0A253E") // Set color
        .setThumbnail(seriesData.Poster) // Set thumbnail
        .setFooter({
          text: "Powered by OpenMovieDatabase",
        }) // Set footer
        .setTimestamp() // Set timestamp
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

      // Reply with the embed
      await interaction.reply({ embeds: [seriesEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Error: Failed to fetch series data. Please, try again later."
      );
    }
  },
});
