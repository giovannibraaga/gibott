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
  name: "weather",
  description:
    "This command will show you the weather of the location you mention",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "location",
      type: ApplicationCommandOptionType.String,
      description: "The location you want the weather for",
      required: true,
    },
  ],
  async run(interaction: ChatInputCommandInteraction) {
    const location = interaction.options.getString("location");
    const token = process.env.WEATHER_TOKEN;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${token}&units=metric`;

    try {
      await axios.get(url);
      const weather = response.data;

      const embed = newEmbedBuilder()
        .setColor(0x1e90ff)
        .setTitle(`Weather in ${weather.name}`)
        .addFields(
          {
            name: "Temperature",
            value: `${weather.main.temp}°C`,
            inline: true,
          },
          {
            name: "Feels Like",
            value: `${weather.main.feels_like}°C`,
            inline: true,
          },
          {
            name: "Weather",
            value: weather.weather[0].description,
            inline: true,
          },
          {
            name: "Humidity",
            value: `${weather.main.humidity}%`,
            inline: true,
          },
          {
            name: "Wind Speed",
            value: `${weather.wind.speed} m/s`,
            inline: true,
          }
        )
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp(new Date());

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log("Error fetching weather data: ", error);
      await interaction.reply(
        "Sorry, I couldn't fetch the weather for that location."
      );
    }
  },
});

