import db from "../../models/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken } from "../authServices/jwtServices.js";
import { changePasswordEmail } from "../../config/nodeMailer.js";
const saltRounds = 10;

async function checkEmail(email) {
  const user = await db.User.findOne({ where: { email } });
  return !!user;
}
async function checkLogin(email, password) {
  let user = await db.User.findOne({ where: { email } });
  if (!user) {
    return null;
  }
  let check = await bcrypt.compare(password, user.password);
  if (check) {
    //if dosth more
    return user.id;
  } else {
    return null;
  }
}

async function createNewUser(newUserData) {
  const newUser = await db.User.create({
    name: newUserData.name,
    apartment_id: newUserData.apartmentId,
    phonenumber: newUserData.phonenumber,
    email: newUserData.email,
    password: await bcrypt.hash(newUserData.password, saltRounds),
    isAdmin: false,
  });
  return newUser;
}

async function findUserByID(id) {
  return await db.User.findOne({
    where: { id: id },
  });
}

async function findUserByEmail(email) {
  const user = await db.User.findOne({ where: { email } });
  return user;
}

let requestIsLegit = (email, password) => {
  return email.length >= 8 && email[0] != " " && password.length >= 8;
};

async function handleLogin(email, password) {
  let returnData = {};

  let userID = await checkLogin(email, password);
  if (userID) {
    returnData = await findUserByID(userID);
    returnData.accessToken = generateAccessToken({ id: userID });
    returnData.code = 200;
    returnData.message = "login success";
  } else {
    returnData.code = 401;
    returnData.message = "wrong email or password!";
  }
  return returnData;
}

async function handleRegister(newUserData) {
  console.log("1");
  let existEmail = await checkEmail(newUserData.email);
  let returnData = {};
  console.log("2");

  if (existEmail) {
    returnData.code = 401;
    returnData.message = "user already exist";
    return returnData;
  }
  console.log("3");

  await createNewUser(newUserData);
  returnData.code = 200;
  returnData.message = "user created";
  return returnData;
}

async function changePassword(email, newPassword) {
  const user = await findUserByEmail(email);
  const length = 10;
  if (!newPassword) {
    let Password = crypto.randomBytes(length).toString("base64").replace(/[+/=]/g, "").substr(0, length);

    user.password = await bcrypt.hash(Password, saltRounds);
    await user.save();
    changePasswordEmail(email, Password);
  } else {
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
  }
}

const authServices = {
  handleLogin: handleLogin,
  handleRegister: handleRegister,
  findUserByID: findUserByID,
  findUserByEmail: findUserByEmail,
  createNewUser: createNewUser,
  changePassword: changePassword,
  requestIsLegit: requestIsLegit,
};
export default authServices;
