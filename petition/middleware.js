module.exports.requireLoggedInUser = (req, res, next) => {
    if (!req.session.userId && req.url != "/register" && req.url != "/login") {
        res.redirect("/register");
    } else {
        next();
    }
};

module.exports.requireLoggedOutUser = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/petition");
    } else {
        next();
    }
};

module.exports.requireNoSignature = (req, res, next) => {
    if (req.session.signatureId) {
        res.redirect("/thanks");
    }
    next();
};

module.exports.requireSignature = (req, res, next) => {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
};
