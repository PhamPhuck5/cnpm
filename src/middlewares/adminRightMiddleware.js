import authServices from "../services/baseService/authServices.js";
export const adminRightMiddleware = async (req, res, next) => {
  const userId = req.user.id;
  const isAdmin = (await authServices.findUserByID(userId)).isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      status: 403,
      message: "you don't have admin right",
      errCode: "login with a admin account",
    });
  }
  next();
};
