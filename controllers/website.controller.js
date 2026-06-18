import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { generatePermalink, paginationParams, sendMail, unwantedFields } from "../helper/functions.js";


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

export const addBookings = asyncErrorHandler(async (req) => {
    let {
        fullName,
        email,
        mobile,
        guestNo, adults, childrens,
        checkIn, checkInTime, checkOut, checkOutTime,
        destination, room
    } = req.body;

    const destinationData = await model.destination.findOne({ _id: destination, status: 0 })

    if (!destinationData) {
        throw new Error("Destination not found", 404);
    }

    let roomData = destinationData.roomDetails.find((item) => item.slug == room)

    if (!roomData) {
        throw new Error("Room not found", 404);
    }


    await model.bookings({
        fullName,
        email,
        mobile,
        guestNo,
        adults,
        childrens,
        checkIn,
        checkInTime,
        checkOut,
        checkOutTime,
        destination,
        room
    }).save();

    await sendMail({
        from: "luneviaBookings@gmail.com",
        subject: `New Booking From ${fullName} for ${destinationData.title}`,

        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

                    <h2 style="color: #000;">
                        New booking Received
                    </h2>

                    <p>
                        You have received a new booking through the website booking form for the ${destinationData.title} ${roomData.title}
                    </p>

                    <table 
                        cellpadding="10" 
                        cellspacing="0" 
                        border="1" 
                        style="border-collapse: collapse; width: 100%; max-width: 600px;"
                    >

                        <tr>
                            <td><strong>Full Name</strong></td>
                            <td>${fullName}</td>
                        </tr>

                        <tr>
                            <td><strong>Email Address</strong></td>
                            <td>${email}</td>
                        </tr>

                        <tr>
                            <td><strong>Mobile Number</strong></td>
                            <td>${mobile}</td>
                        </tr>

                        <tr>
                            <td><strong>No. of guests</strong></td>
                            <td>${guestNo}</td>
                        </tr>

                        <tr>
                            <td><strong>No. of Adults</strong></td>
                            <td>${adults}</td>
                        </tr>
                        <tr>
                            <td><strong>No. of Childrens</strong></td>
                            <td>${childrens == "" ? 0 : childrens}</td>
                        </tr>
                        <tr>
                            <td><strong>Check In </strong></td>
                            <td>${checkIn} - ${checkInTime}</td>
                        </tr>
                        <tr>
                            <td><strong>Check out </strong></td>
                            <td>${checkOut} - ${checkOutTime}</td>
                        </tr>
                        <tr>
                            <td><strong>Destination</strong></td>
                            <td>${destinationData.title}</td>
                        </tr>
                        <tr>
                            <td><strong>Room</strong></td>
                            <td>${roomData.title}</td>
                        </tr>

                    </table>

                    <br />

                    <p>
                        Please respond to this booking at the earliest convenience.
                    </p>

                    <p>
                        Regards,<br />
                        Website Booking System
                    </p>

                </div>
            `,
    })

    return new Response("Booking added successfully", {}, 201);
});

export const getBlogList = asyncErrorHandler(async (req) => {

    const { exclude } = req.query;
    const { skip, limit } = paginationParams(req.query);

    const query = { status: 0 };

    if (!isNull(exclude)) query.slug = { $ne: exclude };
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