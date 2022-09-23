const jwt = require("jsonwebtoken")
const variables = require("../config/variables");

module.exports = {
    isLoggedIn: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1] //Equal to if(authHeader) { ... }
        if(accessToken == null) return res.status(401).json({success: false, status: "No accessToken", error: "accessToken not present."});

        jwt.verify(accessToken, variables.authentication.access_token_secret, (err, user) => {
            if(err) return res.status(403).json({success: false, status: "Invalid accessToken", error: err});
            req.user = user
            next();
        })
}
}