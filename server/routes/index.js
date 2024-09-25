import express from "express";
import apiController from "./apis/index.js";

const router = express.Router();

router.use("/api", apiController);

export default router;
