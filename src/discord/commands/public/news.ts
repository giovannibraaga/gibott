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
  name: "news",
  description: "Search for news",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "search",
      type: ApplicationCommandOptionType.String,
      description: "What you want to search for",
      required: true,
    },
  ],
  /**
   * Runs the news command.
   *
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the command is executed.
   */
  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the search query from the interaction options
    const search = interaction.options.getString("search");
    // Get the news API token from the environment variables
    const token = process.env.NEWS_TOKEN;

    // Construct the news API URL
    const url = `https://newsapi.org/v2/top-headlines?q=${search}&apiKey=${token}`;

    try {
      // Fetch the news data from the news API
      const response = await axios.get(url);
      const newsData = response.data;

      // If no articles are found, reply with an error message
      if (!newsData.articles || newsData.articles.length === 0) {
        await interaction.reply("Error: No articles found.");
      }

      // Get the two most recent articles to show
      const articlesToShow = newsData.articles.slice(-2);

      // Create an embed to display the news articles
      const newsEmbed = new EmbedBuilder()
        .setTitle(`Noticias sobre "${search}"`) // Set the title of the embed
        .setColor("#0A253E") // Set the color of the embed
        .setThumbnail(articlesToShow[0].urlToImage) // Set the thumbnail of the embed
        .setFooter({
          text: `Published by ${articlesToShow[0].author}`, // Set the footer of the embed
        })
        .setTimestamp(); // Set the timestamp of the embed

      // Add fields to the embed for each article
      for (const article of articlesToShow) {
        newsEmbed.addFields({
          name: article.title, // Set the name of the field
          value: article.description, // Set the value of the field
          inline: false, // Set the field to be displayed inline
        });
      }

      // Reply with the news embed
      await interaction.reply({ embeds: [newsEmbed] });
    } catch (error) {
      // If an error occurs, reply with an error message
      await interaction.reply("Error: Failed to fetch news.");
    }
  },
});
