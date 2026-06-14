import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { generatePermalink, paginationParams, unwantedFields } from "../helper/functions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessAsync = promisify(fs.access);

export const list = asyncErrorHandler(async (req) => {
    const { category } = req.query;

    const { skip, limit } = paginationParams(req.query);

    const query = { status: 0 };

    const data = await model.blog.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select(unwantedFields()).lean();

    return new Response("success", { data }, 200);
});

export const create = asyncErrorHandler(async (req) => {

    let {
        title,
        image,
        description,
        writer,
        category,
    } = req.body;

    // Validation
    if (isNull(title)) {
        throw new Error("Title is required", 412);
    }

    if (isNull(image)) {
        throw new Error("Image is required", 412);
    }

    if (isNull(description)) {
        throw new Error("Description is required", 412);
    }

    if (isNull(writer)) {
        throw new Error("Writer is required", 412);
    }

    const slug = generatePermalink(title);

    // Check existing
    const exists = await model.blog.findOne({
        $or: [{ title }, { slug }],
    });

    if (exists) {
        throw new Error(`${exists.title} already exists.`);
    }

    // Create data
    const data = await new model.blog({
        title,
        slug,
        image,
        description,
        writer,
        category,

        // addedBy: req.user._id,
    }).save();

    return new Response(
        "Blog added successfully",
        { data },
        200
    );
});

export const getDetails = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    console.log(slug);
    const data = await model.blog.findOne({ slug, status: 0 }).select(unwantedFields()).lean();

    if (!data) {
        throw new Error("Data not found", 404);
    }
    return new Response("success", { data }, 200);

})

export const update = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    const {
        title,
        image,
        description,
        writer,
        category,
    } = req.body;

    const data = await model.blog.findOne({ slug, status: 0 });

    if (!data) {
        throw new Error("Data not found", 404);
    }


    if (!isNull(title)) data.title = title;
    if (!isNull(image)) data.image = image;
    if (!isNull(description)) data.description = description;
    if (!isNull(writer)) data.writer = writer;
    if (!isNull(category)) data.category = category;

    await data.save();

    return new Response("success", { data }, 200);
});

export const deleteBlog = asyncErrorHandler(async (req) => {
    const { slug } = req.params;
    const data = await model.blog.findOne({ slug, status: 0 });

    if (!data) {
        throw new Error("Data not found", 404);
    }

    data.status = 1;
    await data.save();
    return new Response("success", { data }, 200);
});