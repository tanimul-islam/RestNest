import express from "express";
import cookieParser from "cookie-parser";
import { authRoute } from "./modules/auth/auth.route";
import globalErrorHandler from "./utils/globalErrorHandler";
import { PropertyRoute } from "./modules/property/property.route";

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
app.use("/api/landlord/properties", PropertyRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    errorDetails: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});
app.use(globalErrorHandler);
export default app;
