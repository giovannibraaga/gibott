import { Command } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
	name: "ping",
	description: "Replies with pong 🏓",
	type: ApplicationCommandType.ChatInput,
	/**
	 * Run function for the ping command.
	 * It sends a "pong" message with a button to the interaction.
	 * The button triggers a remind command.
	 *
	 * @param {Interaction} interaction - The interaction object.
	 * @return {Promise<void>} - Returns a promise that resolves when the reply is sent.
	 */
	run(interaction){
		// Create a row with a button
		// The button triggers the remind command and has a dynamic customId
		const row = createRow(
			// ../../components/buttons/remind.ts
			new ButtonBuilder({ 
				// Set the customId to the current date in ISO format
				customId: `remind/${new Date().toISOString()}`,
				// Set the label to "Ping"
				label: "Ping",
				// Set the style to Success
				style: ButtonStyle.Success
			})
		);

		// Send a reply to the interaction
		// The reply includes a "pong" message and the row with the button
		interaction.reply({ 
			fetchReply, 
			ephemeral, 
			content: "pong", 
			components: [row] 
		});
	}
});