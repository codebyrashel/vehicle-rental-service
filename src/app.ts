import express from "express";
import { initDB } from "./config/db";
import userRoutes from "./modules/users/user.routes";
const app = express();

app.use(express.json());

initDB();


app.use("/api/v1/users", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Vehicle Rental API - users feature ready");
// });


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app