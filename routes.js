import express from "express";

const router = express.Router();

import indexRouter from "./routes/index.js";

import authRouter from "./routes/auth.router.js";

import destinationRouter from "./routes/destination.router.js"

import commonRouter from "./routes/common.router.js";


router.use("/", indexRouter);

router.use("/auth", authRouter);

router.use("/common", commonRouter);

router.use('/destination', destinationRouter)


export default router;
