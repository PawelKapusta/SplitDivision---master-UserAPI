import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { sequelize } from "./database/config";
import userRouter from "./routers/userRouter";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const port = 5001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch(error => {
    console.log("Error when connecting to database...: " + error);
    logger.error(error.stack);
  });

app.get("/", (req, res) => {
  res.send("Hello World! from User API");
});

//users
app.get("/api/v1/users", userRouter);
app.get("/api/v1/users/:id", userRouter);
app.post("/api/v1/users/register", userRouter);
app.post("/api/v1/users/login", userRouter);
app.put("/api/v1/users/profile/:id", userRouter);
app.delete("/api/v1/users/:id", userRouter);

app.listen(port, () => {
  console.log("Starting running UserAPI app...");
  console.log(`App listening on port ${port}!`);
});
