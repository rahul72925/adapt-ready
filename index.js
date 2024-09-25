import express from "express";
import apiRouter from "./server/routes/index.js";
import cors from "cors";
const app = express();

const PORT = 4002;

app.use(
  cors({
    origin: "*",
  })
);

app.use("/server", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
