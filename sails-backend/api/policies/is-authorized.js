module.exports = function (req, res, next) {
  let token, tokenClone;

  if (req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(" ");
    if (parts.length == 2) {
      let scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
        tokenClone = token;
      }
    } else {
      return res.status(responseCodes.unauthorized).json({
        message: "Format is Authorization: Bearer [token]",
      });
    }
  } else if (req.param("token")) {
    token = req.param("token");
    tokenClone = token;
    delete req.query.token;
  } else if (
    req.socket &&
    req.socket.handshake &&
    req.socket.handshake.query &&
    req.socket.handshake.query.token
  ) {
    token = req.socket.handshake.query.token;
    tokenClone = token;
  } else {
    console.log("No Authorization header was found");

    return res.status(responseCodes.unauthorized).json({
      message: "No Authorization header was found",
    });
  }

  jwToken.verify(token, function (err, token) {
    if (err) {
      if (err.name == "TokenExpiredError") return res.expired();
      return res.unauthorized();
    } else {
      req.token = tokenClone;

      User.findOne({
        id: token.id,
      }).exec(function (err, result) {
        if (err) {
          return res.status(responseCodes.unauthorized).json({
            message: "db error",
          });
        }

        if (!result)
          return res.status(responseCodes.unauthorized).json({
            message: "Token Missmatch",
          });

        req.loginUser = result;
        next();
      });
    }
  });
};
