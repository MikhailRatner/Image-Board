const express = require("express");
const app = express();
app.use(express.static("public"));
const db = require("./sql/db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

//CREATES FILE IN UPLOADER
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/home", (req, res) => {
    // console.log("/cities route has been hit!!!");
    // res.json - how we send a response to the client!
    db.getAllImages()
        .then((images) => res.json(images.rows))
        .catch((err) => {
            console.log("home error: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("you've made it inside /upload!");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        /* res.json({ success: true }); */
        req.body.url = s3Url + req.file.filename;
        db.imageToDatabase(
            s3Url + req.file.filename,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then(() => {
                res.json(req.body);
            })
            .catch((err) => {
                console.log("upload error: ", err);
            });
    } else {
        /* res.json({ success: false }); */
    }
});

app.get("/popup/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    db.getImageById(id)
        .then(({ rows }) => {
            console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("popup error: ", err);
        });
    //then((image) => res.json(image.rows))
});

/* app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("inside /upload!!!");
}); */

app.listen(8080, () => console.log("IB server is listening..."));

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
