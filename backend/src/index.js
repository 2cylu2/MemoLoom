import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------
// Test route
// ------------------
app.get("/", (req, res) => {
  res.send("MemoLoom backend is running!");
});

// ------------------
// TEMP IN-MEMORY DATABASE
// Later you can swap this for Snowflake
// ------------------
let ideas = [];
let idCounter = 1;

// ------------------
// GET ALL IDEAS
// ------------------
app.get("/ideas", (req, res) => {
  res.json(ideas);
});

// ------------------
// CREATE IDEA
// ------------------
app.post("/ideas", (req, res) => {
  const newIdea = {
    id: idCounter++,
    title: req.body.title || "Untitled",
    content: req.body.content || "",
  };
  ideas.unshift(newIdea);
  res.json(newIdea);
});

// ------------------
// UPDATE IDEA
// ------------------
app.put("/ideas/:id", (req, res) => {
  const { id } = req.params;
  const index = ideas.findIndex((i) => i.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  ideas[index] = { ...ideas[index], ...req.body };
  res.json(ideas[index]);
});

// ------------------
// DELETE IDEA
// ------------------
app.delete("/ideas/:id", (req, res) => {
  const { id } = req.params;
  ideas = ideas.filter((i) => i.id != id);
  res.json({ success: true });
});

// ------------------
// START SERVER
// ------------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
