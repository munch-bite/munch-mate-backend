import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import usersRoute from "./routes/usersRoute.js";
import foodItemsRouter from "./routes/foodItemsRoute.js";
import vendorsRouter from "./routes/vendorsRoute.js";
import ordersRouter from "./routes/ordersRoute.js";

await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo DB connected"))
    .catch((err) => console.log(err));

const app = express();


// use middlewares
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "*"
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

// use routes
app.use("/api/v1", usersRoute);
app.use("/api/v1", vendorsRouter);
app.use("/api/v1", foodItemsRouter);
app.use("/api/v1", ordersRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});