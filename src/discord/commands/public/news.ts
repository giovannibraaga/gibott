import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "news",
    description: "this command will show you all the recent news",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        
    }
});