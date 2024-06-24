const express = require("express");
const route = require("./app/routes/index");
const path = require('path');
const cors = require('cors');

// server initialize
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// db initialize
const db = require("./app/model/db");
db.sequelize.sync()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Failed to connect to db: " + err.message);
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "test api" });
});


const corsOptions = {
    origin: 'http://localhost:5173',//(https://your-client-app.com)
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api", route);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});