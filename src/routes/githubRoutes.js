import express from "express";

import {
  analyzeProfile,
  getAllProfiles,
  getProfileById,
} from "../controllers/githubController.js";

const router = express.Router();

router.get("/github/:username", analyzeProfile);
router.get("/profiles", getAllProfiles);
router.get("/profiles/:id", getProfileById);

export default router;