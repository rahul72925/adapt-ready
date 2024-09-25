import express from "express";
import { getItem, getItems } from "../../controllers/index.js";

const v1Router = express.Router();

v1Router.get("/items", getItems);
v1Router.get("/items/:foodId", getItem);

export default v1Router;
