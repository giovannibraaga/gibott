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
  description: "Busca informações do perfil no GitHub",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Usuário do GitHub",
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
        content: "Erro: Nenhum token de autenticação foi encontrado.",
        ephemeral: true,
      });
    }

    if (!profile) {
      return interaction.reply({
        content: "Erro: Você deve inserir um nome de usúario do github.",
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
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      const currentMonth = monthNames[currentDate.getMonth()];

      const accountCreationDate = new Date(
        response.data.created_at
      ).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const lastCommitDate =
        lastCommitData.length > 0
          ? new Date(lastCommitData[0].created_at).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Nenhum commit";

      const githubEmbed = new EmbedBuilder()
        .setTitle(`Informações do perfil de ${profile}`)
        .setColor("#0A253E")
        .setThumbnail(response.data.avatar_url)
        .addFields(
          {
            name: "Repositórios",
            value: repositories.data.length.toString(),
            inline: true,
          },
          {
            name: `Commits no mês de ${currentMonth}`,
            value: commits.data.length.toString(),
            inline: true,
          },
          {
            name: "Data do último commit",
            value: lastCommitDate,
            inline: true,
          },
          {
            name: "Data de criação da conta",
            value: accountCreationDate,
            inline: true,
          },
          {
            name: "Link para o perfil do GitHub",
            value: response.data.html_url,
            inline: true,
          }
        );

      await interaction.reply({ embeds: [githubEmbed] });
    } catch (error) {
      await interaction.reply("Erro: Usuário não encontrado");
    }
  },
});
