import { Schema } from "mongoose";
import { t } from "../utils.js";

export const memberSchema = new Schema(
    {
        id: t.string,
        guildId: t.string,
        username: t.string,
        discriminator: t.string,
        joined_at: { type: Date, default: Date.now },
        roles: [t.string],
        wallet: {
            coins: { type: Number, default: 0 },
        },
        reminders: [
            {
                message: t.string,
                timestamp: Date,
            }
        ],
        command_logs: [
            {
                command_name: t.string,
                arguments: t.string,
                timestamp: { type: Date, default: Date.now },
            }
        ],
        moderation_actions: [
            {
                action_type: t.string,
                reason: t.string,
                moderator_id: t.string,
                timestamp: { type: Date, default: Date.now },
                duration: Number,
            }
        ],
    },
    {
        statics: {
            async get(member: { id: string, guild: { id: string } }) {
                const query = { id: member.id, guildId: member.guild.id };
                return await this.findOne(query) ?? this.create(query);
            }
        }
    },
);
