import { Schema } from "mongoose";
import { t } from "../utils.js";

export const guildSchema = new Schema(
    {
        id: t.string,
        name: t.string,
        prefix: { type: String, default: '!' },
        admin_roles: [t.string],
        channels: {
            logs: t.channelInfo,
            general: t.channelInfo,
            welcome: t.channelInfo,
        },
        welcome_message: t.string,
        custom_commands: [
            {
                trigger: t.string,
                response: t.string,
            }
        ],
        polls: [
            {
                question: t.string,
                options: [t.string],
                created_at: { type: Date, default: Date.now },
                ends_at: Date,
            }
        ],
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);
