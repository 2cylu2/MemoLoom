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
// Adding Gemini AI Route
// ------------------
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Suggest / expand writing
app.post("/ai/suggest", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Improve the following idea, keeping the author's intent but making it clearer, more structured, and more compelling:

${text}
    `;

    const result = await model.generateContent(prompt);
    res.json({ suggestion: result.response.text() });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Compare two ideas
app.post("/ai/compare", async (req, res) => {
  try {
    const { ideaA, ideaB } = req.body;

    const prompt = `
Compare the following two ideas. Return:

- Key similarities
- Key differences
- Opportunities for merging
- Potential directions

Idea A:
${ideaA}

Idea B:
${ideaB}
    `;

    const result = await model.generateContent(prompt);
    res.json({ analysis: result.response.text() });

  } catch (err) {
    res.json({ error: err.toString() });
  }
});

// Merge two ideas
app.post("/ai/merge", async (req, res) => {
  try {
    const { ideaA, ideaB } = req.body;

    const prompt = `
Combine the following two ideas into a single, coherent, refined draft. 
Do not lose nuance. Output only the merged draft:

Idea A:
${ideaA}

Idea B:
${ideaB}
    `;

    const result = await model.generateContent(prompt);
    res.json({ merged: result.response.text() });

  } catch (err) {
    res.json({ error: err.toString() });
  }
});


// ------------------
// START SERVER
// ------------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));