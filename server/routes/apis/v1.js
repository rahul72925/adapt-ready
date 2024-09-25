import express from "express";
import { getItems } from "../../controllers/index.js";

const v1Router = express.Router();

v1Router.get("/items", getItems);

export default v1Router;
