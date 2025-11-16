import express from "express";
import {
  getIdeas,
  getChildren,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  revertVersion
} from "../controllers/ideaController.js";

const router = express.Router();

router.get("/ideas", getIdeas);
router.get("/ideas/:id", getIdeaById);
router.get("/ideas/:id/children", getChildren);

router.post("/ideas", createIdea);
router.put("/ideas/:id", updateIdea);
router.delete("/ideas/:id", deleteIdea);

router.post("/ideas/:id/revert/:index", revertVersion);

export default router;
