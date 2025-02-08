/* App server */
import cookieParser from "cookie-parser";
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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.is("json"))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Not a JSON" });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid JSON format" });
  }
  next(err);
});

app.get("/", (req, res) => {
  return res.send("Hello World\n").status(StatusCodes.CREATED);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server connected and listening on http://127.0.0.1:${PORT}`);
});
