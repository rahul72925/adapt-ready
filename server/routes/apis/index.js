import express from "express";
import v1RouterController from "./v1.js";

const router = express.Router();

router.use("/v1", v1RouterController);

export default router;
