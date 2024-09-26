import express from "express";
import {
  getItem,
  getItems,
  suggestItem,
  getIngredients,
} from "../../controllers/index.js";

const v1Router = express.Router();

v1Router.get("/items", getItems);
v1Router.get("/items/suggest", suggestItem);
v1Router.get("/items/:foodId", getItem);
v1Router.get("/ingredients", getIngredients);

export default v1Router;
