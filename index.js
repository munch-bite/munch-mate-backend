import express from "express";
import session from "express-session";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import usersRoute from "./routes/usersRoute.js";
import foodRoute from "./routes/foodRoute.js";
import vendorsRoute from "./routes/vendorsRoute.js";
import ordersRoute from "./routes/ordersRoute.js";
import cartRoute from "./routes/cartRoute.js";

await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo DB connected"))
    .catch((err) => console.log(err));

const app = express();

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    mongooseModels: mongoose.modelNames()
});


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
app.use("/api/v1", vendorsRoute);
app.use("/api/v1", foodRoute);
app.use("/api/v1", ordersRoute);
app.use("/api/v1", cartRoute);

expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect("/api-docs/"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
});