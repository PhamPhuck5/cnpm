import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import initWebRouter from "./route/index.js";
import { checkConnection } from "./config/connectDB.js";
import db from "./models/index.js";
import corsPolicy from "./config/corsConfig.js";
import { limiter } from "./config/rateLimit.js";

dotenv.config();
console.log("start server");

let app = express();
app.use(corsPolicy);

//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRouter(app);

checkConnection();
// db.sequelize.authenticate();
// await db.sequelize.sync({ alter: true });

// await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
// await db.sequelize.sync({ force: true });
// await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

await db.sequelize.sync();
console.log("finish working on connect db");

app.use(limiter);

let port = process.env.PORT || 6999;

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port:" + port);
});

// const app = express();

// async function startApp() {
//   try {
//     console.log("start server init...");
//     await checkConnection(db.sequelize);

//     await db.sequelize.sync({ alter: true });
//     console.log("Database synchronized");

//     app.use(corsPolicy);
//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: true }));

//     initWebRouter(app);
//     app.use(limiter);

//     const port = process.env.PORT || 6999;
//     app.listen(port, "0.0.0.0", () => {
//       console.log("Server running on port:" + port);
//     });
//   } catch (error) {
//     console.error("Error starting the server:", error);
//     process.exit(1);
//   }
// }

// startApp();
