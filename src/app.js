import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import githubRoutes from "./routes/githubRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", githubRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GitHub Profile Analyzer API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;