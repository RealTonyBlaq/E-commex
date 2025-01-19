/* App server */
import cors from "cors";
import express from "express";
import router from "./routes/index.js";
import connectDB from "./utils/db.js";
import { config } from "dotenv";
import process from "process";
import { StatusCodes } from "http-status-codes";

config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(router);
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Hello World\n").status(StatusCodes.OK);
});

app.listen(PORT, () => {
  console.log(`Server connected and listening on http://127.0.0.1:${PORT}`);
});
