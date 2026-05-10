import { model, Schema } from "mongoose";
import { currentDate, currentTime } from "../helper/functions.js";
const roomFeatures = [
    {
        label: { type: String, },
        answer: { type: String, }
    }
]
const galleryImage = [{ type: String }]
const schema = new Schema(
    {
        ip: String,
        status: { type: Number, default: 0 },  // 0 - active , 1 - deleted , 2 - deactivated
        title: { type: String, required: true },
        slug: { type: String, required: true },
        mainImage: { type: String, required: true },
        roomDetails: {
            image: { type: String, required: true },
            description: { type: String, required: true },
            features: roomFeatures,
            price: { type: Number, default: 0 }
        },
        availableFeatures: {
            description: { type: String, required: true },
        },
        propertyFeatures: {
            description: { type: String, required: true },
        },
        location: {
            address: { type: String },
            latitude: { type: String },
            longitude: { type: String }
        },
        galleryImages: galleryImage,
        addedBy: { type: Schema.Types.ObjectId, ref: "user" },
        updateBy: { type: Schema.Types.ObjectId, ref: "user" },
        date: { type: String, default: currentDate() },
        time: { type: String, default: currentTime() },
        upDate: String,
        upTime: String,
    },
    {
        timestamps: true,
    }
)

export default model("destination", schema);
