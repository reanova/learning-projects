//require

const express = require("express");
const app = express();
const db = require("./utils/db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

// middleware

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

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.json());

//static route

app.use(express.static("public"));

// routes

app.get("/images", (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((error) => {
            console.log("error in query:", error);
        });
});

app.get("/image/:id", (req, res) => {
    const { id } = req.params;
    db.getImageById(id)
        .then(({ rows }) => {
            console.log("Image from db: ", rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log("Error fetching image: ", error);
            res.sendStatus(500);
        });
});

app.get("/images/:id", (req, res) => {
    console.log("Lowest ID: ", req.params.id);
    db.getMoreImages(req.params.id)
        .then(({ rows }) => {
            console.log("More images from database: ", rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log("Error getting more images from database: ", error);
            res.sendStatus(500);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("post working");
    if (req.file) {
        const { title, username, description } = req.body;
        const { filename } = req.file;
        db.addImage(s3Url + filename, username, title, description).then(
            ({ rows }) => {
                res.json({
                    success: true,
                    newImage: rows[0],
                });
            }
        );
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/comment", (req, res) => {
    console.log("Post comment req.body: ", req.body);
    db.addComment(req.body.comment, req.body.username, req.body.imageId)
        .then(({ rows }) => {
            console.log("Comment added to database: ", rows[0]);
            res.json(rows[0]);
        })
        .catch((error) => {
            console.log("Error adding comment to database: ", error);
            res.sendStatus(500);
        });
});

app.get("/comments/:imageId", (req, res) => {
    db.getCommentsByImageId(req.params.imageId)
        .then(({ rows }) => {
            console.log("comments from db: ", rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log("Error fetching comments: ", error);
            res.sendStatus(500);
        });
});

// Server start

app.listen(8080, () => console.log("IB up and running..."));
