import { model, Schema } from "mongoose";

const schema = new Schema({
    status: { type: Number, default: 0 },  // 0 - active , 1 - deleted , 2 - deactivated
    name: { type: String }
})

export default model("propertyHighlights", schema);