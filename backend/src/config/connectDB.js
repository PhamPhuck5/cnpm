import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// 1. Chạy config ngay lập tức
dotenv.config();

// 2. Tự cấu hình trực tiếp thay vì đọc từ config.js để đảm bảo nhận biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    dialect: "mysql",
    logging: false,
    query: {
      raw: true
    },
    timezone: "+07:00"
  }
);

export const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connect to MySQL success!");
  } catch (error) {
    console.error("Can't connect to MySQL:", error);
    process.exit(1);
  }
};

export default sequelize;