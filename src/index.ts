import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { sequelize  } from "./database/config";
//import userRouter from "./routers/userRouter";

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
  .catch(err => console.log("Error when connecting to database...: " + err));

app.get("/", (req, res) => {
  res.send("Hello World! from User API");
});

//app.get("/users", userRouter);

app.listen(port, () => {
  console.log("Starting running UserAPI app...");
  console.log(`App listening on port ${port}!`);
});
