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
  /**
   * Runs the command when the GitHub command is executed.
   * Retrieves information about a GitHub user and displays it in an embed.
   *
   * @param {ChatInputCommandInteraction} interaction - The interaction object received from Discord.
   * @returns {Promise<void>} Promise that resolves when the command is executed.
   */
  async run(interaction: ChatInputCommandInteraction) {
    const profile = interaction.options.getString("user"); // Get the GitHub username from the command options.
    const token = process.env.GITHUB_TOKEN; // Get the GitHub token from the environment variables.

    // Construct the URLs for the GitHub API endpoints.
    const repositoriesUrl = `https://api.github.com/users/${profile}/repos`;
    const commitsUrl = `https://api.github.com/users/${profile}/events`;
    const lastCommitUrl = `https://api.github.com/users/${profile}/events/public`;
    const url = `https://api.github.com/users/${profile}`;

    // Check if the token and profile are provided.
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
      // Retrieve user information from the GitHub API.
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

      // Format date strings.
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

      // Create an embed with the user information.
      const githubEmbed = new EmbedBuilder()
        .setTitle(` ${profile}'s GitHub profile`)
        .setColor("#0A253E")
        .setThumbnail(response.data.avatar_url)
        .setFooter({
          text: "Powered by GitHub",
        })
        .setTimestamp()
        .addFields(
          {
            name: "Total repositories",
            value: repositories.data.length.toString(),
            inline: true,
          },
          {
            name: `Commits in ${currentMonth}`,
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
            name: "Profile url",
            value: response.data.html_url,
            inline: true,
          }
        );

      // Send the embed in the chat.
      await interaction.reply({ embeds: [githubEmbed] });
    } catch (error) {
      await interaction.reply("Error: User not found.");
    }
  },
});
