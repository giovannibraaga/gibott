import { Command } from "#base";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

new Command({
  name: "weather",
  description: "Get weather information.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "location",
      type: ApplicationCommandOptionType.String,
      description: "A localização que você deseja.",
      required: true,
    },
  ],
  /**
   * Get weather data from OpenWeatherMap API and send a Discord embed with the data.
   *
   * @param {ChatInputCommandInteraction} interaction - Discord interaction object
   */
  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const location = interaction.options.getString("location");
    const token = process.env.WEATHER_TOKEN;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${token}&units=metric`;

    try {
      const response = await axios.get(url);
      const weatherData = response.data;

      if (weatherData.cod !== 200) {
        await interaction.reply(`Error: ${weatherData.message}`);
      }

      const weatherEmbed = new EmbedBuilder()
        .setColor("#0A253E")
        .setTitle(`Weather in ${weatherData.name}`)
        .setDescription(weatherData.weather[0].description)
        .setThumbnail(
          `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        )
        .setFooter({
          text: "Powered by OpenWeatherMap",
        })
        .setTimestamp()
        .addFields(
          {
            name: "Temperature",
            value: `${weatherData.main.temp}°C`,
            inline: true,
          },
          {
            name: "Feels Like",
            value: `${weatherData.main.feels_like}°C`,
            inline: true,
          },
          {
            name: "Humidity",
            value: `${weatherData.main.humidity}%`,
            inline: true,
          },
          {
            name: "Wind",
            value: `${weatherData.wind.speed} kph`,
            inline: true,
          }
        );

      await interaction.reply({ embeds: [weatherEmbed] });
    } catch (error) {
      await interaction.reply(
        "Desculpe, não consegui buscar a localização informada."
      );
    }
  },
});
