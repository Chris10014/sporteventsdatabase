module.exports = {
  validateRegistrationData: (req, res, next) => {
    //Check if data exist
    if(!Object.keys(req.body).length) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Empty oject", error: "Data is missing." });
        return;
    }
    // first name min length 3, max length 30
    if (!req.body.first_name || req.body.first_name.length < 3 || req.body.first_name.length > 30) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "First_name length failure", error: "First name doesn't have 3 to 30 letters." });
      return;
    }
    // last name min length 3, max length 30
    if (!req.body.last_name || req.body.last_name.length < 3 || req.body.last_name.length > 30) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Last_name length failure", error: "Last name doesn't have 3 to 30 letters." });
      return;
    }
    // nickname min length 3, max length 30
    if ((req.body.nickname && req.body.nickname.length < 3) || (req.body.nickname && req.body.nickname.length > 30)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Nickname length failure", error: "Nickname doesn't have 3 to 30 letters." });
      return;
    }
    // password min 6 chars, max 64 chars
    if (!req.body.password || req.body.password.length < 6 || req.body.password.length > 64) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Password length failure", error: "Password doesn't consist of 6 to 64 characters." });
      return;
    }
    // password (confirmation) does not match
    if (!req.body.password_confirmation || req.body.password != req.body.password_confirmation) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Password failure", error: "Passwords don't match." });
      return;
    }
    next();
  },
};
