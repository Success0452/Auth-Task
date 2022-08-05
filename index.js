require("dotenv").config()
require("express-async-errors")


const express = require("express")
const app = express()


const authRoute = require("./routes/auth")


const connectDB = require("./db/connect")

const notFoundError = require("./middleware/not-found")
const errorHandlerError = require("./middleware/error-handler")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('pages/login')
});

app.get("/signup", (req, res) => {
    res.render('pages/signup')
});

app.get("/view_note", (req, res) => {
    res.render('pages/view_note')
});

app.get("/home", (req, res) => {
    res.render('pages/home')
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