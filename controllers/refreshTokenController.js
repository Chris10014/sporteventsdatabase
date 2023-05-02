const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log("refreshToken cookie: ", refreshToken)

  const foundUser = Users.findOne( { where: { refresh_token: refreshToken }})
  .then((foundUser) => {
    console.log("foundUser: ", foundUser);
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(refreshToken, variables.authentication.refresh_token_secret, (err, decodedUser) => {
      if (err || foundUser.email !== decodedUser.email) return res.sendStatus(403);
      console.log("refreshToken: ", refreshToken);
      console.log("decoded: ", decodedUser);
      const accessToken = jwt.sign(
        { 
        firstname: decodedUser.firstName, 
        lastName: decodedUser.lastName,
        nickname: decodedUser.nickname,
        role: decodedUser.role,
        email: decodedUser.email,
        id: decodedUser.id
      }, 
      variables.authentication.access_token_secret, { expiresIn: "30s" });
      console.log("new accessToken: ", accessToken);
      res.status(200).json({ success: true, status: "Token refreshed", accessToken: accessToken, error: null });
      // res.json({ accessToken });
    });

  })
  
};

module.exports = { handleRefreshToken };