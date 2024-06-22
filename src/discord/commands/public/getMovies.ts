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
  name: "get-movies",
  description: "Fetch movies information",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      description: "Title of the movie",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * Fetches movie data from OpenMovieDatabase API and replies with an embed.
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the function completes.
   */
  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get movie title and OMDB token from interaction options
    const movieTitle = interaction.options.getString("title");
    const token = process.env.OMDB_TOKEN;

    // Check if token and movie title are provided
    if (!token) {
      await interaction.reply({
        content: "Error: No token provided. Please, provide a token.",
        ephemeral: true,
      });
      return;
    }

    if (!movieTitle) {
      await interaction.reply({
        content: "Error: No title provided. Please, provide a title.",
        ephemeral: true,
      });
      return;
    }

    // Construct URL for API request
    const url = `https://www.omdbapi.com/?apikey=${token}&t=${movieTitle}`;

    try {
      // Fetch movie data from API
      const response = await axios.get(url);
      const movieData = response.data;

      // Check if movie was found
      if (movieData.Response === "False") {
        await interaction.reply({
          content: `Error: Movie not found for title "${movieTitle}".`,
          ephemeral: true,
        });
        return;
      }

      // Create embed with movie data
      const movieEmbed = new EmbedBuilder()
        .setTitle(movieData.Title) // Set title
        .setColor("#0A253E") // Set color
        .setThumbnail(movieData.Poster) // Set thumbnail
        .setFooter({
          text: "Powered by OpenMovieDatabase",
        }) // Set footer
        .setTimestamp() // Set timestamp
        .addFields(
          {
            name: "Plot", // Add plot field
            value: movieData.Plot || "No plot available",
            inline: false,
          },
          {
            name: "Release Date", // Add release date field
            value: movieData.Released || "No release date available",
            inline: true,
          },
          {
            name: "Popularity", // Add popularity field
            value: movieData.imdbRating || "N/A",
            inline: true,
          },
          {
            name: "Genre", // Add genre field
            value: movieData.Genre || "No genre available",
            inline: true,
          },
          {
            name: "Director", // Add director field
            value: movieData.Director || "No director available",
            inline: true,
          }
        );

      // Reply with embed
      await interaction.reply({ embeds: [movieEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Error: Failed to fetch movie data. Please, try again later.",
        ephemeral: true,
      });
    }
  },
});
