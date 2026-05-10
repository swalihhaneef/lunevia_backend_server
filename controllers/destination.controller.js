import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { generatePermalink, paginationParams, unwantedFields } from "../helper/functions.js";

export const list = asyncErrorHandler(async (req) => {
    const { category } = req.query;

    const { skip, limit } = paginationParams(req.query);

    const query = { status: 0 };

    if (!isNull(category)) query.category = category;

    const data = await model.destination.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select(unwantedFields()).lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {
    console.log(req.body)
    const { title, mainImage, roomDetails, availableFeatures, propertyFeatures, location, gallery } = req.body;
    if (isNull(title)) throw new Error("title are required", 412);

    const slug = generatePermalink(title);

    const exists = await model.destination.findOne({ $or: [{ title }, { slug }] });

    if (exists) throw new Error(`${exists.title} already exists.`);

    const data = await new model.destination({
        title,
        slug,
        mainImage,
        roomDetails,
        availableFeatures,
        propertyFeatures,
        location,
        gallery
        // addedBy: req.user._id,
    }).save();

    return new Response("Property added successfully", { data }, 200);
});