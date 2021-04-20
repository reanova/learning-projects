/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./utils/db");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./utils/bc");
const csurf = require("csurf");
// const {
//     requireLoggedInUser,
//     requireLoggedOutUser,
//     requireSignature,
//     requireNoSignature,
// } = require("./middleware");

//handlebars
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//middleware
app.use(express.urlencoded({ extended: false }));
//removed app.use(cookieParser());
app.use(
    cookieSession({
        secret: `I am hAngry`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// requests coming from just our signature (should be after cookie session AND IMPORTANT TO SET WHEN GOING LIVE IN ALL PARTS AFFECTED)

app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader("X-FRAME-OPTION", "DENY");
    next();
});

app.use(express.static("./public"));

app.use((req, res, next) => {
    if (req.session.userId) {
        if (req.session.signatureId) {
            if (
                req.url == "/petition" ||
                req.url == "/register" ||
                req.url == "/login"
            ) {
                res.redirect("/thanks");
            } else {
                return next();
            }
        } else {
            if (
                req.url != "/petition" &&
                req.url != "/profile" &&
                req.url != "/logout"
            ) {
                res.redirect("/petition");
            } else {
                return next();
            }
        }
    } else {
        if (
            req.url == "/register" ||
            req.url == "/login" ||
            req.url == "/profile"
        ) {
            return next();
        } else {
            res.redirect("/register");
        }
    }
});

// routes
app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main",
    });
});

app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((password_hash) => {
            db.addUser(first, last, email, password_hash)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.redirect("/profile");
                })
                .catch((error) => {
                    console.log("Error:", error);
                    if (error.message.includes("violates check constraint")) {
                        error.message =
                            "No can do, comrade. Please fill in all the input fields";
                    } else {
                        error.message = "That email already exists";
                    }
                    res.render("register", {
                        layout: "main",
                        error: true,
                        errorText: error.message,
                    });
                });
        })
        .catch((error) => {
            console.log("Error:", error);
        });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});

app.post("/profile", (req, res) => {
    let { age, city, url } = req.body;
    // console.log("city properties:", Object.getOwnPropertyNames(city));
    // console.log("url:", url);
    // console.log("age: ", age, "city: ", city, "url: ", url);
    if (
        !url.startsWith("https://") &&
        !url.startsWith("http://") &&
        url != ""
    ) {
        url = "https://" + url;
    }
    if (age == "") {
        age = null;
    }
    if (city) {
        city = JSON.stringify(city);
        city = city.toUpperCase();
        city = city.substring(1, city.length - 1);
    }
    const user_id = req.session.userId;
    db.addProfile(age, city, url, user_id)
        .then(() => res.redirect("/petition"))
        .catch((error) => console.log("Error:", error));
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    // console.log("email & password:");
    if (email == "" || password == "") {
        return res.render("login", {
            layout: "main",
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
                    if (!rows[0].signature) {
                        res.redirect("/petition");
                        console.log("not signed");
                    } else {
                        req.session.signatureId = rows[0].signature_id;
                        res.redirect("/thanks");
                    }
                } else {
                    console.log("issue with input not matched");
                    res.render("login", {
                        layout: "main",
                        error: true,
                    });
                }
            });
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.render("login", {
                layout: "main",
                error: true,
            });
        });
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main",
    });
});

app.post("/petition", (req, res) => {
    const { signature } = req.body;

    const user_id = req.session.userId;
    db.addSignature(user_id, signature)
        .then(({ rows }) => {
            req.session.signatureId = rows[0].id;
            res.redirect("/thanks");
        })
        .catch((error) => {
            console.log("Error:", error);
            res.render("petition", {
                layout: "main",
                error: true,
            });
        });
});

app.get("/thanks", (req, res) => {
    db.getNumSigners()
        .then(({ rows }) => {
            let totalRows = rows;
            db.getSignature(req.session.signatureId)
                .then(({ rows }) => {
                    let signRows = rows;
                    res.render("thanks", {
                        layout: "main",
                        signRows,
                        totalRows,
                    });
                })
                .catch((error) => console.log("Error:", error));
        })
        .catch((error) => console.log("Error:", error));
});

app.post("/thanks", (req, res) => {
    db.deleteSignature(req.session.signatureId)
        .then(() => {
            req.session.signatureId = null;
            res.redirect("/petition");
        })
        .catch((error) => console.log("Error:", error));
});

app.get("/signers", (req, res) => {
    const url = req.params.url;
    db.getSigners()
        .then(({ rows }) => {
            // console.log(rows);
            res.render("signers", {
                layout: "main",
                url: url,
                rows,
            });
        })
        .catch((error) => console.log("Error:", error));
});

app.get("/signers/:city", (req, res) => {
    let city = req.params.city;
    const url = req.params.url;
    db.allSignersByCity(city)
        .then(({ rows }) => {
            res.render("signers", {
                layout: "main",
                rows,
                writtenCity: true,
                city: city,
                url: url,
            });
        })
        .catch((error) => console.log("Error:", error));
});

////progress edit and delete PART 5

app.get("/edit", (req, res) => {
    db.getProfile(req.session.userId).then((result) => {
        const user = result.rows[0];
        console.log("User: ", user);
        res.render("edit", {
            layout: "main",
            user,
        });
    });
});

app.post("/edit", (req, res) => {
    let { first, last, email, password, age, city, url } = req.body;
    if (
        !url.startsWith("https://") &&
        !url.startsWith("http://") &&
        url != ""
    ) {
        url = "https://" + url;
    }
    if (age == "") {
        age = null;
    }
    if (city) {
        city = JSON.stringify(city);
        city = city.toUpperCase();
        city = city.substring(1, city.length - 1);
    }
    if (password) {
        hash(password).then((password_hash) => {
            db.updateUserAndPassword(
                first,
                last,
                email,
                password_hash,
                req.session.userId
            )
                .then(() => {
                    db.upsertUserProfile(
                        age,
                        city,
                        url,
                        req.session.userId
                    ).then(() => {
                        res.redirect("/thanks");
                    });
                })
                .catch((error) => {
                    console.log("Error with upsert", error);
                });
        });
    } else {
        db.updateUser(first, last, email, req.session.userId)
            .then(() => {
                db.upsertUserProfile(age, city, url, req.session.userId).then(
                    () => {
                        res.redirect("/thanks");
                    }
                );
            })
            .catch((error) => {
                console.log("Error updating user profile: ", error);
                res.render("edit", {
                    layout: "main",
                    error: true,
                });
            });
    }
});

app.get("/deletion", (req, res) => {
    db.deleteSignature(req.session.userId).then(
        db
            .deleteProfile(req.session.userId)
            .then(db.deleteUser(req.session.userId))
            .catch((error) => console.log(error))
    );
    res.redirect("/logout");
});

//logout

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Petition up and running....");
});
