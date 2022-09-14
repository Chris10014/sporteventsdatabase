const jwt = require("jsonwebtoken")
const variables = require("../config/variables");

module.exports = {
    isLoggedIn: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1] //Equal to if(authHeader) { ... }
        if(accessToken == null) return res.json(401, {success: false, status: "No accessToken", error: "Access Token isn't present."});

        jwt.verify(accessToken, variables.authentication.access_token_secret, (err, user) => {
            if(err) return res.json(403, {success: false, status: "Invalid access token", error: err});
            req.user = user
            next();
        })
}
}