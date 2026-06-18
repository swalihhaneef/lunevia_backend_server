import { asyncErrorHandler, Error, Response } from "express-error-catcher";

import model from "../model/index.js";
import { paginationParams, sendMail, unwantedFields } from "../helper/functions.js";

export const list = asyncErrorHandler(async (req) => {
    const { limit, skip } = paginationParams(req.query);

    const count = await model.bookings.countDocuments();

    const data = await model.bookings.find()
        .populate("destination", "title slug")
        .skip(skip).limit(limit).select(unwantedFields()).sort({ _id: -1 });

    return new Response(null, { count, data }, 200);
});

export const update = asyncErrorHandler(async (req) => {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await model.bookings.findByIdAndUpdate(id, { status }, { new: true });

    return new Response(null, booking, 200);
});