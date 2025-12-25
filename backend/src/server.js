import "dotenv/config"; // <--- ĐƯA DÒNG NÀY LÊN ĐẦU TIÊN
import express from "express";
import bodyParser from "body-parser";
// import dotenv from "dotenv"; <--- Bỏ dòng này đi vì đã dùng dòng 1
import initWebRouter from "./route/index.js";
import { checkConnection } from "./config/connectDB.js";
import db from "./models/index.js";
import corsPolicy from "./config/corsConfig.js";
import { limiter } from "./config/rateLimit.js";

console.log("Start server...");

let app = express();
app.use(corsPolicy);

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRouter(app);

// Kiểm tra kết nối trước
await checkConnection();

// Đồng bộ database (Tạo bảng nếu chưa có)
// alter: true giúp sửa bảng nếu model thay đổi
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Alter sync db.");
});
// Sửa thành force: false (hoặc bỏ trống cũng được vì mặc định là false)
// db.sequelize.sync({ force: false }).then(() => {
//   console.log("Re-sync db.");
// });
console.log("Finish working on connect db");

app.use(limiter);

let port = process.env.PORT || 6999;

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: " + port);
  console.log("Server started successfully!");
});