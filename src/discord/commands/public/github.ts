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
  name: "github",
  description: "Search for GitHub profile",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Github username",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const profile = interaction.options.getString("user");
    const token = process.env.GITHUB_TOKEN;
    const repositoriesUrl = `https://api.github.com/users/${profile}/repos`;
    const commitsUrl = `https://api.github.com/users/${profile}/events`;
    const lastCommitUrl = `https://api.github.com/users/${profile}/events/public`;
    const url = `https://api.github.com/users/${profile}`;

    if (!token) {
      return interaction.reply({
        content: "Error: No token provided. Please, provide a token.",
        ephemeral: true,
      });
    }

    if (!profile) {
      return interaction.reply({
        content: "Error: No username provided. Please, provide an username.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const repositories = await axios.get(repositoriesUrl, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const commits = await axios.get(commitsUrl, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const lastCommit = await axios.get(lastCommitUrl, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      const lastCommitData = lastCommit.data;

      const currentDate = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentMonth = monthNames[currentDate.getMonth()];

      const accountCreationDate = new Date(
        response.data.created_at
      ).toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const lastCommitDate =
        lastCommitData.length > 0
          ? new Date(lastCommitData[0].created_at).toLocaleDateString("en", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "No commits yet";

      const githubEmbed = new EmbedBuilder()
        .setTitle(`Informações do perfil de ${profile}`)
        .setColor("#0A253E")
        .setThumbnail(response.data.avatar_url)
        .addFields(
          {
            name: "Total repositories",
            value: repositories.data.length.toString(),
            inline: true,
          },
          {
            name: `Commits number in ${currentMonth}`,
            value: commits.data.length.toString(),
            inline: true,
          },
          {
            name: "Last commit date",
            value: lastCommitDate,
            inline: true,
          },
          {
            name: "Account creation date",
            value: accountCreationDate,
            inline: true,
          },
          {
            name: "GitHub profile url",
            value: response.data.html_url,
            inline: true,
          }
        );

      await interaction.reply({ embeds: [githubEmbed] });
    } catch (error) {
      await interaction.reply("Error: User not found.");
    }
  },
});
