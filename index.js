import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "dotenv/config";
import usersRouter from "./routes/usersRouter.js";

await mongoose.connect(process.env.MONGO_URI);

const app = express();


// use middleswares
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

// use routes
app.use("/api/v1", usersRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});