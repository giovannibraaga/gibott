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
  description: "Get information about a movie",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "title",
      description: "Title of the movie",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const movieTitle = interaction.options.getString("title");
    const token = process.env.OMDB_TOKEN;

    const url = `https://www.omdbapi.com/?apikey=${token}&t=${movieTitle}`;

    if (!token) {
      return interaction.reply({
        content: "Error: No token provided. Please, provide a token.",
        ephemeral: true,
      });
    }

    if (!movieTitle) {
      return interaction.reply({
        content: "Error: No title provided. Please, provide a title.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get(url);
      const movieData = response.data;

      if (movieData.Response === "False") {
        return interaction.reply({
          content: `Error: Movie not found for title "${movieTitle}".`,
          ephemeral: true,
        });
      }

      const movieEmbed = new EmbedBuilder()
        .setTitle(movieData.Title)
        .setColor("#0A253E")
        .setThumbnail(movieData.Poster)
        .addFields(
          {
            name: "plot",
            value: movieData.Plot,
            inline: false,
          },
          {
            name: "Release Date",
            value: movieData.Released,
            inline: true,
          },
          {
            name: "Popularity",
            value: movieData.imdbRating,
            inline: true,
          },
          {
            name: "Genre",
            value: movieData.Genre,
            inline: true,
          },
          {
            name: "Director",
            value: movieData.Director,
            inline: true,
          }
        );

      await interaction.reply({ embeds: [movieEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Error: Failed to fetch movie data. Please, try again later."
      );
    }
  },
});
