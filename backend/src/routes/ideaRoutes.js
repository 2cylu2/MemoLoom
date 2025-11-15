const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");

// CREATE
router.post("/", async (req, res) => {
  const idea = new Idea({
    title: req.body.title ?? "Untitled",
    content: req.body.content ?? "",
    parentId: req.body.parentId ?? null,
  });
  await idea.save();
  res.json(idea);
});

// READ ALL (top-level only)
router.get("/", async (_, res) => {
  const ideas = await Idea.find({ parentId: null });
  res.json(ideas);
});

// READ CHILDREN
router.get("/:id/children", async (req, res) => {
  const children = await Idea.find({ parentId: req.params.id });
  res.json(children);
});

// UPDATE (rename & edit content)
router.put("/:id", async (req, res) => {
  const updated = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE (and cascade delete children)
router.delete("/:id", async (req, res) => {
  const deleteAll = async (id) => {
    const children = await Idea.find({ parentId: id });
    for (const c of children) await deleteAll(c._id);
    await Idea.findByIdAndDelete(id);
  };

  await deleteAll(req.params.id);
  res.json({ success: true });
});

module.exports = router;
