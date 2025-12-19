import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import configFile from "../config.js";
dotenv.config();

const env = process.env.NODE_ENV || "development";
const config = configFile[env];
console.log(config.database, config.username, config.password);

const sequelize = new Sequelize(config.database, config.username, config.password, config);
export const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("connect to myssql success!");
  } catch (error) {
    console.error("can't connect to myssql:", error);
    process.exit(1);
  }
};

export default sequelize;
