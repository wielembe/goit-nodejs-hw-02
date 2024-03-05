const express = require("express");
require("dotenv").config();
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const DB_URL = process.env.DB_HOST;

const db = mongoose.connect(DB_URL);
const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.urlencoded());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        code: 404,
        message: "Use api on routes: /api/contacts",
        data: "Not found",
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        status: "fail",
        code: 500,
        message: err.message,
        data: "Internal Server Error",
    });
});

module.exports = { app, db };
