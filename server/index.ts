import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { postsRouter } from "./routes/posts.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import connectDB from "./common/database";

dotenv.config();

//App Variables
if (!process.env.PORT) {
  console.log("PORT variable is null or undefined");
  process.exit(1);
}

connectDB();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

// Middleware - App Configuration

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/member/posts", postsRouter);

//Error Handlers

app.use(errorHandler);
app.use(notFoundHandler);

//Server Activation

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
