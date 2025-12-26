import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;
export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      status: 401,
      message: "missing access token",
      errCode: "login",
    });
  jwt.verify(token, process.env.ACCESS_KEY, (err, userInfo) => {
    if (err || !userInfo) {
      //token expired
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({
          status: 401,
          message: "Token expired",
          errCode: "login", //todo to do if rotation token remove this errCode
        });
      }
      console.log("token error:" + err);
      //invalid token
      return res.status(403).json({
        status: 403,
        message: "Invalid token",
        errCode: "login",
      });
    }
    req.user = userInfo;
    next();
  });
}
