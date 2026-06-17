import express from "express";

import auth from "../middleware/auth.js";

import * as controller from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", controller.web);

router.use(auth);

router.get("/", controller.list);

export default router;
