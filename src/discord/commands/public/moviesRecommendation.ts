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

type GenreMapping = {
  [key: string]: number;
};

const genreMapping: GenreMapping = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const axiosInstance = axios.create({
  timeout: 10000, // Set timeout to 10 seconds
});

/**
 * Fetches data from a URL using Axios with a configurable number of retries.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {number} [retries=3] - The number of retries to attempt if the request fails.
 * @return {Promise<any>} A promise that resolves to the fetched data or rejects with an error.
 * @throws {Error} If all retries fail.
 */
async function fetchWithRetry(url: string, retries: number = 3): Promise<any> {
  // Iterate over the specified number of retries
  for (let i = 0; i < retries; i++) {
    try {
      // Attempt to fetch data from the URL
      return await axiosInstance.get(url);
    } catch (error) {
      // If this is the last retry, throw the error
      if (i === retries - 1) {
        throw error;
      }
      // Log the failure and continue to the next retry
      console.log(`Retry ${i + 1}/${retries} failed: `, error);
    }
  }
}

/**
 * Fetches the genre names from the TMDB API and returns them as a map 
 * where the key is the genre ID and the value is the genre name.
 *
 * @returns {Promise<{ [key: number]: string }>} A promise that resolves to the genre map.
 * @throws {Error} If the API request fails after the specified number of retries.
 */
async function getGenreNames(): Promise<{ [key: number]: string }> {
  // Construct the URL for the API request
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_TOKEN}`;

  // Fetch the response from the API
  const response = await fetchWithRetry(url);

  // Extract the genres from the response
  const genres = response.data.genres;

  // Create a map to store the genre names
  const genreMap: { [key: number]: string } = {};

  // Populate the genre map with the genre IDs and names
  genres.forEach((genre: { id: number; name: string }) => {
    genreMap[genre.id] = genre.name;
  });

  // Return the genre map
  return genreMap;
}

new Command({
  name: "movies-recommendations",
  description:
    "Irá recomendar filmes para você assistir baseado no genêro que for escolhido.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "genre",
      description: "Selecione o genêro que deseja",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.keys(genreMapping).map((genre) => ({
        name: genre,
        value: genre,
      })),
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const genre = interaction.options.getString("genre");

    // Check if genre is null
    if (!genre) {
      return interaction.reply("You must select a genre.");
    }

    const genreId = genreMapping[genre];
    const token = process.env.TMDB_TOKEN;

    if (!genreId) {
      return interaction.reply("Invalid genre selected.");
    }

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${token}&with_genres=${genreId}`;

    try {
      const [response, genreNames] = await Promise.all([
        fetchWithRetry(url),
        getGenreNames(),
      ]);
      const movieDataRecommendations = response.data;

      if (movieDataRecommendations.results.length === 0) {
        return interaction.reply("No movies found for the selected genre.");
      }

      const sortedMovies = movieDataRecommendations.results
        .sort((a: any, b: any) => b.vote_average - a.vote_average)
        .slice(0, 2);

      const embedMovieRecommendations = new EmbedBuilder()
        .setColor("#0A253E")
        .setTitle(`${genre} movies recommendations`)
        .setDescription("Here are some movies you might like:")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/80/80907.png")
        .setFooter({
          text: "Powered by themoviedb.org",
        })
        .setTimestamp();

      sortedMovies.forEach((movie: any) => {
        const title = movie.title || "No title available";
        const genres = movie.genre_ids
          .map((id: number) => genreNames[id])
          .join(", ");
        const rating = movie.vote_average.toString();
        const releaseDate = movie.release_date || "No release date available";
        const plot = movie.overview || "No plot available";

        // Add fields to embed
        embedMovieRecommendations.addFields(
          { name: "Title", value: title, inline: true },
          { name: "Genres", value: genres, inline: true },
          { name: "Rating", value: rating, inline: true },
          { name: "Release Date", value: releaseDate, inline: true },
          { name: "Plot", value: plot, inline: false }
        );
      });

      return interaction.reply({ embeds: [embedMovieRecommendations] });
    } catch (error) {
      console.log(error);
      return interaction.reply("Error: Something went wrong.");
    }
  },
});
