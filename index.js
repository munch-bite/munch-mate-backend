import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import usersRouter from "./routers/usersRouter.js";

await mongoose.connect(process.env.MONGO_URL);

const app = express();

app.use(express.json());

// use routes
app.use("/api/v1", usersRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});