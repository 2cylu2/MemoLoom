import Idea from "../models/Idea.js";

export const getIdeas = async (req, res) => {
  const ideas = await Idea.find({ parentId: null });
  res.json(ideas);
};

export const getChildren = async (req, res) => {
  const children = await Idea.find({ parentId: req.params.id });
  res.json(children);
};

export const createIdea = async (req, res) => {
  const idea = await Idea.create(req.body);
  res.json(idea);
};

export const updateIdea = async (req, res) => {
  const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(idea);
};

export const deleteIdea = async (req, res) => {
  await Idea.findByIdAndDelete(req.params.id);
  await Idea.deleteMany({ parentId: req.params.id });
  res.json({ success: true });
};
