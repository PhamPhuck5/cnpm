import cors from "cors";

export default cors({
  origin: process.env.URL_FE,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
});
