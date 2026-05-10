import express from "express";
const router = express.Router();

import * as controllers from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

router.get("/me", auth, (req, res) => res.send(req.user));

router.post("/login", controllers.loginUser);

router.post("/logout", auth, controllers.logoutUser);

export default router;
