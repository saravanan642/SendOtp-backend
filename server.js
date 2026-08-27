require("dotenv").config({ quiet: true });

const Express = require("express");
const mongoose = require("mongoose");

const Session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(Session)

const cors = require("cors");
const listen = require("./config/listen");
const Database = require("./config/databse");
const IndexRouter = require("./Routers/index");
const { collection } = require("./Models/user");
const app = Express();

app.use(cors());
app.use(Express.json());

Database(mongoose);


const store = new MongoDBSession({
    uri : process.env.MONGO_URL,
    collection : 'session'
})


app.use(Session({
    secret : process.env.Session_Key,
    resave : false,
    saveUninitialized : false,
    store : store
}))



app.use(IndexRouter);

listen(app);