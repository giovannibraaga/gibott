import { Command } from "#base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
} from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const genre = interaction.options.getString("genre");
    const token = process.env.MOVIES_TOKEN;

    
  },
});
