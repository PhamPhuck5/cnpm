import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_KEY;
console.log("access key for gen access token: " + ACCESS_SECRET);
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "60m" });
}
export { generateAccessToken };
