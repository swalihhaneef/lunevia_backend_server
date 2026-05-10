import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import * as controllers from "../controllers/destination.controller.js"

router.get("/", controllers.list).post("/", controllers.create)

export default router;
