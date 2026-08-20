require("dotenv").config({ quiet: true });

const Express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const listen = require("./config/listen");
const Database = require("./config/databse");
const IndexRouter = require("./Routers/index");
const app = Express();

app.use(cors());
app.use(Express.json());

Database(mongoose);
app.use(IndexRouter);



listen(app);