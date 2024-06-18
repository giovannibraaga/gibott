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
  name: "translate",
  description: "Translate the text to the desired language",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "text",
      type: ApplicationCommandOptionType.String,
      description: "The text to translate",
      required: true,
    },
    {
      name: "language",
      type: ApplicationCommandOptionType.String,
      description: "The language you want to translate to",
      required: true,
    },
  ],
  /**
   * Runs the translate command.
   *
   * @param {ChatInputCommandInteraction} interaction - The interaction object.
   * @returns {Promise<void>} - A promise that resolves when the command is completed.
   */
  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the text and language from the command options
    const text = interaction.options.getString("text");
    const language = interaction.options.getString("language")?.toUpperCase();

    // If text or language is missing, reply with an error message and return
    if (!text || !language) {
      await interaction.reply(
        "Error: Please provide both the text and the language to make the translation."
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
        .setTitle("GiBot Translations")
        .setColor("#0A253E")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/281/281759.png")
        .addFields(
          { name: "Original text", value: text, inline: false },
          {
            name: `Translated to ${language}`,
            value: translatedText,
            inline: false,
          }
        );

      // Reply with the embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      // If there's an error, log it and reply with an error message
      await interaction.reply("Error: Failed to translate the text.");
    }
  },
});
