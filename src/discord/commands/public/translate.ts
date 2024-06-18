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
  name: "tradutor",
  description: "Traduz o texto que você inserir para a língua desejada.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "texto",
      type: ApplicationCommandOptionType.String,
      description: "Texto que deseja traduzir",
      required: true,
    },
    {
      name: "lingua",
      type: ApplicationCommandOptionType.String,
      description: "Para qual língua deseja traduzir?",
      required: true,
    },
  ],
  /**
   * Runs the translate command.
   *
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the command is completed.
   */
  async run(interaction: ChatInputCommandInteraction) {
    // Get the text and language from the command options
    const text = interaction.options.getString("texto");
    const language = interaction.options.getString("lingua")?.toUpperCase();

    // If text or language is missing, reply with an error message and return
    if (!text || !language) {
      await interaction.reply(
        "Erro: Por favor, forneça o texto e a língua para tradução."
      );
      return;
    }

    // Get the DeepL API key from the environment variables
    const token = process.env.DEEPL_API_KEY;
    const url = "https://api-free.deepl.com/v2/translate";

    try {
      // Make a POST request to the DeepL API to translate the text
      const response = await axios.post(url, null, {
        params: {
          auth_key: token,
          text: text,
          target_lang: language,
        },
      });

      // Get the translated text from the response
      const translatedText = response.data.translations[0].text;

      // Create an embed with the original text and the translated text
      const embed = new EmbedBuilder()
        .setTitle("Gi Tradutor")
        .setColor("#0A253E")
        .addFields(
          { name: "Texto original", value: text, inline: false },
          {
            name: `Traduzido para ${language}`,
            value: translatedText,
            inline: false,
          }
        );

      // Reply with the embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      // If there's an error, log it and reply with an error message
      console.error(error);
      await interaction.reply("Desculpe, ocorreu um erro ao traduzir o texto.");
    }
  },
});
