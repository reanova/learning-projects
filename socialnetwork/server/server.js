/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./utils/db.js");
const { hash, compare } = require("./utils/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("../ses");
const s3 = require("../s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { s3Url } = require("../config.json");
const cryptoRandomString = require("crypto-random-string");
//socket intro//
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
//

//amazon server
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
//

//cookiesocketized
const cookieSessionMiddleware = cookieSession({
    secret: `I am hAngry`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//

//middleware
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

// app.use(express.urlencoded({ extended: false }));

//routes

app.get("/welcome", (req, res) => {
    // is going to run if the user puts /welcome in the url bar
    if (req.session.userId) {
        console.log("userID is", req.session.userId);
        // if the user is logged in, they are NOT allowed to see the welcome page
        // so we redirect them away from /welcome and towards /, a page they're allowed to see
        res.redirect("/");
    } else {
        // send back HTML, which will then trigger start.js to render Welcome in DOM
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/register", (req, res) => {
    // console.log("req.body", req.body);
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        const { first, last, email, password } = req.body;
        hash(password)
            .then((password_hash) => {
                db.addUser(first, last, email, password_hash)
                    .then(({ rows }) => {
                        console.log("rows", rows);
                        req.session.userId = rows[0].id;
                        res.json({ data: rows[0], success: true });
                    })
                    .catch((error) => {
                        console.log("Error:", error);
                        res.json({ success: false, error: true });
                    });
            })
            .catch((error) => {
                console.log("Error with password_hash:", error);
            });
    } else {
        res.json({ success: false, error: true });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email == "" || password == "") {
        return res.json({
            success: false,
            error: true,
        });
    }

    db.getUser(email)
        .then(({ rows }) => {
            const password_hash = rows[0].password_hash;
            const id = rows[0].id;
            return compare(password, password_hash).then((match) => {
                console.log("match:", match);
                if (match) {
                    req.session.userId = id;
                    res.json({ success: true, error: false });
                } else {
                    res.json({ success: false, error: true });
                }
            });
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.json({ success: false, error: true });
        });
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    db.getUser(email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                const code = cryptoRandomString({
                    length: 6,
                });
                return db.addCode(email, code);
            } else {
                res.json({
                    success: false,
                    error: true,
                });
            }
        })
        .then(({ rows }) => {
            console.log("Code added to table", rows[0]);
            return ses.sendEmail(
                rows[0].email,
                `You recently requested a password reset. Please enter the following code to reset your password before it expires: ${rows[0].code}`,
                "Pithagora - Reset your password"
            );
        })
        .then(() => {
            res.json({
                success: true,
                error: false,
            });
        })
        .catch((error) => {
            console.log("Error in password reset: ", error);
            res.json({
                success: false,
                error: true,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { email, code, newPassword } = req.body;
    db.getCode(email)
        .then(({ rows }) => {
            if (rows[rows.length - 1].code == code) {
                hash(newPassword)
                    .then((new_password_hash) => {
                        db.updatePassword(email, new_password_hash)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((error) => {
                                console.log("Error", error);
                            });
                    })
                    .catch((error) => {
                        console.log("Error", error);
                    });
            } else {
                console.log("No match!");
                res.json({ success: false });
            }
        })
        .catch((error) => {
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    const userId = req.session.userId;
    db.getUserById(userId)
        .then(({ rows }) => {
            console.log("user data: ", rows[0]);
            res.json({ rows });
        })
        .catch(() => {
            console.log("error in getUserById");
        });
});

//workflow like imageboard (same bucket because lazy)

app.post(
    "/user/uploadimage",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("post working");
        if (req.file) {
            const { filename } = req.file;
            db.addImage(s3Url + filename, req.session.userId)
                .then(({ rows }) => {
                    console.log(
                        "Successfully added image to db: ",
                        s3Url + filename
                    );
                    res.json({
                        success: true,
                        imageUrl: s3Url + filename,
                    });
                })
                .catch((error) => {
                    console.log("Error adding image to db ", error);
                    res.json({
                        success: false,
                    });
                });
        } else {
            res.json({
                success: false,
            });
        }
    }
);

app.post("/bio", (req, res) => {
    const { bio } = req.body;
    db.addBio(bio, req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0].bio);
        })
        .catch((error) => {
            console.log("error in db", error);
            res.json({ error: true });
        });
});

app.get("/user/:id.json", (req, res) => {
    db.getUserById(req.params.id)
        .then(({ rows }) => {
            console.log("successfully fetched other profile: ", rows[0]);
            const { id, first, last, image_url, bio } = rows[0];
            res.json({
                success: true,
                id: id,
                first: first,
                last: last,
                image_url: image_url,
                bio: bio,
                loggedUserId: req.session.userId,
            });
        })
        .catch((error) => {
            console.log("Error fetching other user profile: ", error);
            res.json({ success: false });
        });
});

app.get("/getusers/most-recent", (req, res) => {
    db.findnewUsers()
        .then(({ rows }) => {
            res.json({ success: true, mostRecent: rows });
        })
        .catch((error) => {
            console.log("err in get most recent users", error);
            res.json({ success: false });
        });
});

app.get("/getusers/:val", (req, res) => {
    db.findreqUsers(req.params.val)
        .then(({ rows }) => {
            res.json({ resultUsers: rows });
        })
        .catch((error) => {
            console.log("error in getting requested users", error);
            res.json({ success: false });
        });
});

app.get("/friendship-status/:otherUserId", (req, res) => {
    db.getFriendshipStatus(req.session.userId, req.params.otherUserId)
        .then(({ rows }) => {
            console.log("Friendship status: ", rows);
            if (!rows[0]) {
                res.json({ success: false });
            } else if (rows[0].accepted) {
                res.json({ success: true, accepted: true });
            } else if (
                !rows[0].accepted &&
                rows[0].sender_id == req.params.otherUserId
            ) {
                res.json({ success: true, awaitingUserAction: true });
            } else if (
                !rows[0].accepted &&
                rows[0].sender_id == req.session.userId
            ) {
                res.json({ success: true, awaitingOtherAction: true });
            } else {
                res.json({ success: false });
            }
        })
        .catch((error) => {
            console.log("Error fetching friendship status: ", error);
        });
});

app.post("/make-friend-request/:otherUserId", (req, res) => {
    db.startFriendship(req.session.userId, req.params.otherUserId)
        .then(() => {
            res.json({
                success: true,
            });
        })
        .catch((error) => {
            console.log("Error initializing friendship: ", error);
            res.json({ success: false });
        });
});

app.post("/add-friendship/:otherUserId", (req, res) => {
    db.acceptFriendship(req.session.userId, req.params.otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("Error accepting friend request", error);
            res.json({ success: false });
        });
});

app.post("/end-friendship/:otherUserId", (req, res) => {
    db.endFriendship(req.session.userId, req.params.otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error ending friendship", err);
            res.json({ success: false });
        });
});

app.get("/connections-wannabes", (req, res) => {
    db.getConnectionsWannabes(req.session.userId)
        .then(({ rows }) => {
            console.log("Connections and wannabes: ", rows);
            res.json({ success: true, connectionsWannabes: rows });
        })
        .catch((error) => {
            console.log(
                "unable to get connections and wannabes from db: ",
                error
            );
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

//server listens now instead of app
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};
io.on("connection", function (socket) {
    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect(true);
    }
    onlineUsers[socket.id] = userId;
    const onlineUserIds = Object.values(onlineUsers);
    console.log("userIds connected:", onlineUserIds);
    let filteredUsers = onlineUserIds.filter(
        (id, index) => onlineUserIds.indexOf(id) === index
    );
    console.log("filtered userIds connected:", filteredUsers);

    db.getOnlineUsers(filteredUsers).then(({ rows }) => {
        // console.log(`rows`, rows);
        io.emit("online users", rows);
    });

    db.getUserById(userId)
        .then(({ rows }) => {
            // emit details of new user just joined to everyone else already connected
            socket.broadcast.emit("userJoined", rows);
        })
        .catch((error) => {
            console.log("Error getting details of new user joined:", error);
        });

    db.getMessages()
        .then(({ rows }) => {
            socket.emit("chatMessages", rows.reverse());
            // console.log("chatMessages to see", rows);
        })
        .catch((error) => {
            console.log("Error in emitting chat messages:", error);
        });

    socket.on("chatMessage", (data) => {
        console.log(`New chat msg by userId:${userId} with msg:${data}`);
        db.addMessage(userId, data)
            .then(({ rows }) => {
                const id = rows[0].id;
                const sent_at = rows[0].sent_at;
                console.log("Chat msg added to db!");
                db.getUserById(userId)
                    .then(({ rows }) => {
                        io.emit("chatMessage", {
                            first: rows[0].first,
                            last: rows[0].last,
                            image_url: rows[0].image_url,
                            id: id,
                            message: data,
                            sent_at: sent_at,
                        });
                    })
                    .catch((error) => {
                        console.log("Error fetching chat msg sender:", error);
                    });
            })
            .catch((error) => {
                console.log("Error adding chat msg to db:", error);
            });
    });

    socket.on("disconnect", () => {
        // if (onlineUsers[socket.id]) {
        //     onlineUsers[socket.id].delete(socket);
        //     if (onlineUsers[socket.id].size === 0) {
        //         delete onlineUsers[socket.id];
        //         io.emit("userLeft", onlineUsers[socket.id]);
        //     }
        // }
        var userIdDisconnected = onlineUsers[socket.id];
        var userStillOnline = false;
        delete onlineUsers[socket.id];

        for (var socketId in onlineUsers) {
            if (onlineUsers[socketId] == userIdDisconnected) {
                userStillOnline = true;
            }
        }
        console.log("userStillOnline:", userStillOnline);
        if (!userStillOnline) {
            console.log(`userId: ${userIdDisconnected} disconnected!`);
            io.emit("userLeft", userIdDisconnected);
        }
    });
});
