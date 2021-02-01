const express = require("express");
const app = express();

app.use(express.static("public"));

const db = require("./public/js/db.js");

/* // this info would be coming from the database!!
let cities = [
    {
        name: "Berlin",
        country: "DE",
    },
    {
        name: "Guayaquil",
        country: "Ecuador",
    },
    {
        name: "Venice",
        country: "Italy",
    },
]; */

app.get("/home", (req, res) => {
    // console.log("/cities route has been hit!!!");
    // res.json - how we send a response to the client!
    db.getAllImages().then((images) => res.json(images));
});

app.listen(8080, () => console.log("IB server is listening..."));
