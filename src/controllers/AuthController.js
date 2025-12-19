import authServices from "../services/baseService/authServices.js";

let handleLoggin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!authServices.requestIsLegit(email, password)) {
      return res.status(400).json({
        status: 400,
        message: "bad request",
      });
    }
    let userData = await authServices.handleLogin(email, password);
    return res.status(userData.code).json({
      status: userData.code,
      message: userData.message,
      data: userData.code === 200 ? userData : null,
      accessToken: userData.accessToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

let handleRegister = async (req, res) => {
  try {
    console.log(">>> Check Body:", req.body);
    let newUserData = {
      name: req.body.name,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      password: req.body.password,
      apartmentId: req.body.apartmentId,
    };

    if (
      // missing properties (avoid FE check)
      !newUserData.name ||
      !newUserData.phonenumber ||
      !newUserData.email ||
      !newUserData.password ||
      // wrong type (avoid FE check)
      !authServices.requestIsLegit(newUserData.email, newUserData.password)
    ) {
      //todo: await note Danger IP
      return res.status(400).json({
        status: 400,
        message: "bad request",
      });
    }
    let result = await authServices.handleRegister(newUserData);
    return res.status(result.code).json({
      status: result.code,
      message: result.message,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

let changePassword = async (req, res) => {
  try {
    let user = await authServices.findUserByEmail(req.body.email);
    if (user) {
      authServices.changePassword(req.body.email, req.body.newPassword);
      return res.status(200).json({
        status: 200,
        message: "ok",
        data: {
          ok: true,
        },
      });
    } else {
      return res.status(200).json({
        status: 200, //wrong return config in fe
        message: "can't find this account",
        data: {
          ok: false,
          message: "can't find this account",
        },
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

const authControler = {
  handleLoggin: handleLoggin,
  handleRegister: handleRegister,
  changePassword: changePassword,
};
export default authControler;
//todo: thêm quên mật khẩu, đổi mật khẩu
