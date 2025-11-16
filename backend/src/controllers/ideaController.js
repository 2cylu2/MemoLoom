import Idea from "../models/Idea.js";

// -------------------------------------
// Get root ideas
// -------------------------------------
export const getIdeas = async (req, res) => {
  const ideas = await Idea.find({ parentId: null });
  res.json(ideas);
};

// -------------------------------------
// Get child ideas
// -------------------------------------
export const getChildren = async (req, res) => {
  const children = await Idea.find({ parentId: req.params.id });
  res.json(children);
};

// -------------------------------------
// Create new idea
// -------------------------------------
export const createIdea = async (req, res) => {
  const idea = await Idea.create(req.body);
  res.json(idea);
};

// -------------------------------------
// Update idea WITH VERSIONING
// -------------------------------------
export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    // Create new version entry
    const version = {
      id: Date.now().toString(),
      timestamp: new Date(),
      title,
      content
    };

    // Add version
    idea.versions.push(version);

    // Update main fields
    idea.title = title;
    idea.content = content;

    // Save updated idea
    await idea.save();

    res.json(idea);

  } catch (err) {
    console.error("Error updating idea:", err);
    res.status(500).json({ error: "Failed to update idea" });
  }
};

// -------------------------------------
// Delete idea + children
// -------------------------------------
export const deleteIdea = async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);
  await Idea.deleteMany({ parentId: req.params.id });
  res.json({ success: true });
};
