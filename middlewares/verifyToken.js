const jwt = require("jsonwebtoken");

// VERIFY TOKEN
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    // console.log(req.headers);
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
          res
            .status(400)
            .json({ success: false, message: "Token is not Valid" });
        } else {
            req.user = user;
            next()
        }
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "You are not Authorized" });
    }
  } catch (error) {}
};

// VERIFY TOKEN AND IF USER IS ADMIN
const verifyTokenAdmin = (req, res, next) =>  {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res
            .status(400)
            .json({ success: false, message: "You are not Authorized" });
        }
    })
}

module.exports = {verifyToken, verifyTokenAdmin};
