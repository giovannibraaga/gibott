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
  async run(interaction: ChatInputCommandInteraction) {
    const search = interaction.options.getString("search");
    const token = process.env.NEWS_TOKEN;

    const url = `https://newsapi.org/v2/top-headlines?q=${search}&apiKey=${token}`;

    try {
      const response = await axios.get(url);
      const newsData = response.data;

      if (!newsData.articles || newsData.articles.length === 0) {
        return interaction.reply("Error: No articles found.");
      }

      const articlesToShow = newsData.articles.slice(-2);

      const newsEmbed = new EmbedBuilder()
        .setTitle(`Noticias sobre "${search}"`)
        .setColor("#0A253E")
        .setThumbnail(articlesToShow[0].urlToImage);

      for (const article of articlesToShow) {
        newsEmbed.addFields({
          name: article.title,
          value: article.description,
          inline: false,
        });
      }

      await interaction.reply({ embeds: [newsEmbed] });
    } catch (error) {
      await interaction.reply("Error: Failed to fetch news.");
    }
  },
});
