import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      multipleStatements: true,
    },
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "cnpm_test_db",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      multipleStatements: true,
    },
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "test_db",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      multipleStatements: true,
    },
  },
};
export const CONFIG_VALUE = {
  MAX_TASK_LENGTH_MINUTES: 23 * 60,
  SEEDER_APARTMENT_ID: 1,
};
