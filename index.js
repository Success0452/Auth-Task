require("dotenv").config()
require("express-async-errors")
const session = require("express-session")

const express = require("express")
const app = express()


const authRoute = require("./routes/auth")


const connectDB = require("./db/connect")

const notFoundError = require("./middleware/not-found")
const errorHandlerError = require("./middleware/error-handler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoDBSession = require("connect-mongodb-session")(session)

const store = new mongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
})

app.use(session({
    secret: "my secret pin",
    saveUninitialized: false,
    resave: false,
    store: store
}))

app.get("/", (req, res) => {
    res.status(200).send("<h1>Welcome to Auth Api</h1>")
});

app.use("/api/v1", authRoute);

app.use(notFoundError);
app.use(errorHandlerError);

const port = process.env.PORT || 3000

const start = async() => {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is listening at ${port}...`))
}

start();