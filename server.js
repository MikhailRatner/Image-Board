const express = require("express");
const app = express();

app.use(express.static("public"));

let cities = [
    {
        name: "Berlin",
        country: "DE",
    },
    {
        name: "Guayaquil",
        country: "Equador",
    },
];

app.get("cities", (req, res) => {
    console.log("/cities route has ben hit!!");

    res.json(cities);
});

app.listen(8080, () => console.log("imageboard server is listening..."));
