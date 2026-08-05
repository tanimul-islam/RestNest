import express from "express";
import cookieParser from "cookie-parser";
import { authRoute } from "./modules/auth/auth.route";
import globalErrorHandler from "./utils/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is running",
  });
});
app.use("/api/auth", authRoute);
app.use(globalErrorHandler);
export default app;
