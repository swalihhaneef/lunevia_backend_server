import express from "express";

import auth from "../middleware/auth.js";

import * as controller from "../controllers/bookings.controller.js";

const router = express.Router();

router.get("/", controller.list)

router.put("/:id", controller.update)

export default router;
