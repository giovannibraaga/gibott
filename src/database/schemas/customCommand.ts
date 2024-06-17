import { Schema, model, Document } from "mongoose";

interface CustomCommand extends Document {
    guild_id: string;
    trigger: string;
    response: string;
}

const customCommandSchema = new Schema<CustomCommand>({
    guild_id: { type: String, required: true },
    trigger: { type: String, required: true },
    response: { type: String, required: true },
});

const CustomCommandModel = model<CustomCommand>('CustomCommand', customCommandSchema);
export default CustomCommandModel;
