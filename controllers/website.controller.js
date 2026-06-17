import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { generatePermalink, paginationParams, unwantedFields } from "../helper/functions.js";


export const getWebsiteList = asyncErrorHandler(async (req) => {
    const { category } = req.query;

    const { skip, limit } = paginationParams(req.query);
    console.log('first', req.query)
    const query = { status: 0 };

    if (!isNull(category)) query.category = category;

    const data = await model.destination.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select(unwantedFields()).lean();
    console.log('data', data)
    return new Response("success", { data }, 200);
});

export const getDetails = asyncErrorHandler(async (req) => {
    const { slug, } = req.params;
    console.log(slug, 'slug');
    const data = await model.destination.findOne({ slug, status: 0 })
        .populate("aboutProperty.highlights", "name")
        .select(unwantedFields())
        .lean();

    if (!data) {
        throw new Error("Data not found", 404);
    }
    return new Response("success", { data }, 200);
});

export const getRoomDetails = asyncErrorHandler(async (req) => {
    const { slug, roomSlug } = req.query;
    console.log(slug, 'slug');
    const data = await model.destination.findOne({ slug, status: 0 })
        .select({ "roomDetails": { $elemMatch: { slug: roomSlug } }, _id: 0, title: 1, locationLink: 1, mainImage: 1 })
        .select(unwantedFields())
        .lean();

    if (!data) {
        throw new Error("Data not found", 404);
    }
    return new Response("success", { data }, 200);
});

export const getBlogList = asyncErrorHandler(async (req) => {

    const { exclude } = req.query;
    const { skip, limit } = paginationParams(req.query);

    const query = { status: 0 };

    if(!isNull(exclude)) query.slug = { $ne: exclude };
    const data = await model.blog.find(query).sort({ _id: -1 }).skip(skip).limit(limit).select(unwantedFields()).lean();
    console.log('data', data)
    return new Response("success", { data }, 200);
});

export const getBlogDetails = asyncErrorHandler(async (req) => {
    const { slug, } = req.params;
    console.log(slug, 'slug');
    const data = await model.blog.findOne({ slug, status: 0 })
        .select(unwantedFields())
        .lean();

    if (!data) {
        throw new Error("Data not found", 404);
    }
    return new Response("success", { data }, 200);
});